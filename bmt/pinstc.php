<html>
	<head>
		<meta content="text/html; charset=UTF-8" http-equiv="Content-Type">
		<!-- CSS -->
		<link href="assets/css/bootstrap.css" rel="stylesheet">
		<link href="assets/css/product_manager.css" type="text/css" rel="stylesheet" >
		<!-- End! CSS -->
		<!-- JS -->
		<script src="assets/libs/jquery-1.8.0.min.js"></script>
		<script src="assets/js/bootstrap.min.js"></script>
		<script src="assets/js/stcprdmng.js"></script>
		<!-- End! JS -->
		<!-- Libs -->
		<script src="assets/libs/stcimgmgr/stcimgmgr.js"></script>
		<link href="assets/libs/stcimgmgr/stcimgmgr.css" type="text/css" rel="stylesheet" >
		<script src="assets/libs/stcddl/stcddl.js"></script>
        <link href="assets/libs/stcddl/stcddl.css" rel="stylesheet">
		<!-- End! Libs -->
		<style type="text/css">
			#stc_prd_inf{
				display: table;
			}
			#stc_prd_inf input[type="text"],textarea{
				min-height: 30px;
			}
		</style>

	</head>
	<body>
		<div id="stc_prd_modal" class="stc-modal">
			<!-- Header -->
			<?php if(!isset($user_infor) || $user_infor->account_type != PROVIDER_ACCOUNT_TYPE): ?>
				<div class="stc-modal-header">
					<h3>Chức năng này chỉ dành cho nhà cung cấp</h3>
				</div>
			<?php else: ?>
				<div class="stc-modal-header">
					<h3>Thêm mới</h3>
				</div>
			<?php endif?>
			<!-- End! Header -->

			<!-- Body -->
			<?php if(!isset($user_infor) || $user_infor->account_type != PROVIDER_ACCOUNT_TYPE): ?>
				<div class="stc-modal-body">
					Nếu bạn là nhà cung cấp, hãy
					<a class="btn btn-small " href="/dang-nhap" target="_blank">Đăng nhập</a>
					hoặc
					<a class="btn btn-small " href="/dang-ky-nha-cung-cap" target="_blank">Đăng ký</a> 
					để sử dụng chức năng này!
				</div>
			<?php else: ?>
				<div class="stc-modal-body">
					<!-- Product Info -->
					<div id="stc_prd_inf">
						<div class="stc-left">
							<div id="stc_prd_cover_img">
								<strong>Hình đại diện</strong>
								<?php if(!empty($cover_img)): ?>
								<img src="<?php echo $cover_img ?>"/>
								<?php endif ?>
							</div>
							<div id="stc_prd_sub_imgs">
								<strong>Hình mô tả thêm</strong>
								<?php if(count($thumb_imgs) > 0) foreach ($thumb_imgs as $img): ?>
									<?php if(!empty($img)): ?>
									<img src="<?php echo $img ?>"/>
									<?php endif ?>
								<?php endforeach ?>
							</div>
						</div>
						<div class="stc-right">
							<!-- Name -->
							<label>Tên sản phẩm <i class="stc-star">*</i></label>
							<input id="stc_prd_name" value="<?php echo $name?>" type="text"/>
							<!-- Price -->
							<label>Giá</label>
							<input id="stc_prd_price" type="text"/>
							<!-- Desc -->
							<label>Mô tả</label>
							<textarea id="stc_prd_desc" row="3"><?php echo $desc ?></textarea>
							<!-- Favourite -->
							<label>Chọn bộ sưu tập</label>
							<div id="stc_prd_fav"></div><br>
							<!--- Add Botton -->
							<button id="stc_add_btn" class="btn btn-success btn-large pull-right" data-loading-text="Đang xử lý...">Thêm +</button>
						</div>
					</div>
					<!-- End! Product Info -->
				</div>
			<?php endif?>
			<!-- End! Body -->
		</div>
		<script type="text/javascript">
			function strIsEmpty(str) {
				return jQuery.trim(str) == "" ? true : false;
			};
			var STCListFavouritesByOwner = <?php echo json_encode($my_list_favourites) ?>;
			var pinFromUrl = '<?php echo $from_site?>';
			var _this = $(this);
		
			$(document).ready(function(){
				var doms = {
					addBtn: "#stc_add_btn",
					prdName: "#stc_prd_name",
					prdPrice: "#stc_prd_price",
					prdDesc: "#stc_prd_desc",
					prdFav: "#stc_prd_fav",
					prdCoverImg: "#stc_prd_cover_img",
					prdSubImgs: "#stc_prd_sub_imgs"
				};

				$(doms.prdFav).stcddl(STCListFavouritesByOwner,{
					dropPos: 'top-left'
				});
				
				// Add Product Button
				$(doms.addBtn).click(function(){
					if(strIsEmpty($(doms.prdName).val())){
						$(doms.prdName).focus();
						return false;
					}
					
					$this = $(this);
					$this.button('loading');
					var url = '/add', data = {
						prdImgs : '',
						prdName : '',
						prdPrice: '',
						prdDesc: '',
						prdFavId: '',
						prdFavName: '',
						imgSite: pinFromUrl,
						method: "PIN"
					};
					// Product images
					data.prdImgs = encodeURI($(doms.prdCoverImg).children("img").attr("src"));
					$(doms.prdSubImgs).children("img").each(function(){
						data.prdImgs += "," + encodeURI($(this).attr("src"));
					});

					data.prdName = $(doms.prdName).val();
					data.prdPrice = strIsEmpty($(doms.prdPrice).val()) ? '' : $(doms.prdPrice).val();
					data.prdDesc = $(doms.prdDesc).val();
					var seledFav = $(doms.prdFav).stcddl('option','selectedItem');
					data.prdFavId = seledFav.id;
					data.prdFavName = seledFav.name;

					$.post(url,data,function(response){
						if(parseInt(response) > 0){
							$(doms.prdInf).children(".stc-right").children("input, textarea").val('');
							$this.button('reset');
							window.location = "<?php echo base_url() ?>pinstc?fromSite=" + pinFromUrl + "?added=1";

						}
					});
				});
			});
		</script>
	</body>
</html>

