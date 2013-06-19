/**
* Product Manager Class
* @author Linh Phan
* 25/09/2012
**/
function STCProductManager(cfg){
	/****** Declare members ******/
	var doms = {
		overlay : "#stcoverlay",
		prdMng : "#stc_prd_mng",
		imgMgr : "#stc_img_mng",
		modal : "#stc_prd_modal",
		modalHeader : "#stc_prd_modal .stc-modal-header",
		addNav : "#stc_add_nav",
		addCtr : "#stc_add_ctr",
		searchForm : "#stc_add_ctr .form-search",
		uploadForm : "#stc_add_ctr .stc-form-upload",
		prdInf : "#stc_prd_inf",
		addFavForm : "#add_fav_form",
		prdCoverImg : "#stc_prd_cover_img",
		prdSubImgs : "#stc_prd_sub_imgs",
		prdName : "#stc_prd_name",
		prdPrice : "#stc_prd_price",
		prdDesc : "#stc_prd_desc",
		prdFav : "#prd_fav",
		addBtn : "#stc_add_btn",
		favName : "#fav_name",
		favDesc : "#fav_desc",
		favItemId : "#fav_item",
		addFavBtn : "#add_fav_btn"
	}

	var titles = {
		addNav : "Thêm mới",
		searchForm : "Thêm sản phẩm từ website",
		uploadForm : "Thêm sản phẩm từ máy tính"
	}

	var __this = this;
	var addMethod = "URL";
	var curFav = null;

	/****** Declare Methods ******/
	this.setup = setup;
	this.resetUI = resetUI;
	this.show = function(){
		$(doms.overlay).show();
		$(doms.prdMng).fadeIn(function(){
			$(doms.imgMgr).height($(window).height());
		});
	};
	this.addImage = addImage;


	/****** Helper Functions ******/
	function show(sel,callback){
		$(sel).css("display","table");
		if(callback && typeof callback == "function")
			callback.call();
	}
	function hide(sel,callback){
		$(sel).css("display","none");
		if(callback && typeof callback == "function")
			callback.call();
	}


	/****** Define Methods ******/
	// Setup
	function setup(){
		// Show All
		$("#add_btn").click(function(){
			__this.show();
		});
		// Close All
		$(doms.modalHeader).children("button").click(function(){
			$(doms.prdMng).fadeOut(function(){
				if(STCRoot.data.refreshPage){
					if(curFav == null){
						location.reload();
						return;
					}
					window.location = STCRoot.data.hostname + STCRoot.data.username + "/" + curFav.id + "/" + curFav.textId;
					return;
				}

				$(doms.overlay).hide();
				resetUI();
			});
		});

		// Nav
		$(doms.addNav).find("a").each(function(){
			$(this).click(function(){
				var action = $(this).attr("data-action");
				if(action == "FAV"){
					$(doms.addCtr).hide();
					$(doms.addNav).fadeOut(function(){
						$(doms.addFavForm).fadeIn();
					});
					return;
				}
				else if(action == "URL"){
					addMethod = "URL";
					$(doms.searchForm).show();
					$(doms.uploadForm).hide();
					$(doms.addFavForm).hide();
				}
				else{
					addMethod = "LOCAL";
					$(doms.searchForm).hide();
					$(doms.uploadForm).show();
					$(doms.addFavForm).hide();
				}
				$(doms.addNav).fadeOut(function(){
					$(doms.addCtr).fadeIn();
				});
			});
		});
		// Image Manager
		$("#stc_img_mng").stcimgmgr({
			onImageChoosed : function(img) {
				addImage(img);
			},
			onImageUnchoosed: function(img){
				removeImage(img);
			}
		});
		// Search url
		$(doms.searchForm).children("button").click(function() {
			var $this = $(this), url = $(doms.searchForm).children("input").val();
			if(strIsEmpty(url)){
				$(this).prev('input').focus();
				return;
			}
			$this.button('loading');
			$(doms.prdInf).children(".stc-right").children("input, textarea").val('');
			$("#stc_img_mng").stcimgmgr('options','removeChoosedImages','');
			$(doms.imgMgr).empty();
			imgSearch = new ImageSearch(url);
			imgSearch.search(function(){
				$this.button('reset');
			},function() {
				$("#stc_img_mng").stcimgmgr('options', 'addImages', this);
			});
		});

		// Upload image
		$("#stc_fileupload").stcuploading({
			isMultiple : true,
			label: 'Upload hình từ máy tính',
			progressBar: false,
			dropZone: $(doms.imgMgr),
			sent: function(e,data)
			{	
				var img = new Image();
				img.src = '/images/tmp/' + data.result[0].name;
				$("#stc_img_mng").stcimgmgr('options', 'addImages', img);
			}
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
				prdFavId: $("#prd_fav option:selected").val(),
				prdFavName: $("#prd_fav option:selected").text(),
				prdItemId: $("#prd_item option:selected").val(),
				imgSite: $(doms.searchForm).children('input[type="text"]').val(),
				method: addMethod
			};
			// Product images
			data.prdImgs = $(doms.prdCoverImg).children("img").attr("src");
			$(doms.prdSubImgs).children("img").each(function(){
				data.prdImgs += "," + $(this).attr("src");
			});

			data.prdName = $(doms.prdName).val();
			data.prdPrice = strIsEmpty($(doms.prdPrice).val()) ? '' : $(doms.prdPrice).val();
			data.prdDesc = $(doms.prdDesc).val();

			$.post(url,data,function(response){
				if(parseInt(response) > 0){
					$(doms.prdInf).children(".stc-right").children("input, textarea").val('');
					$("#stc_img_mng").stcimgmgr('options','removeChoosedImages','');
					STCRoot.data.refreshPage = true;
					curFav = {
						id : data.prdFavId,
						name : data.prdFavName,
						textId : $("#prd_fav option:selected").attr("data-text-id"),
					}
				}
				
				$this.button('reset');
			});
		});

		// Add favourite button
		$(doms.addFavBtn).click(function(e){
			if(strIsEmpty($(doms.favName).val())){
				$(doms.favName).focus();
				return false;
			}
			var $this = $(this);
			$this.button('loading');
			var url, data;
			url = "/favourite/add_favourite";
			data = {
				name : $(doms.favName).val(),
				desc : $(doms.favDesc).val()
			};

			$.post(url,data,function(response){
				res = jQuery.parseJSON(response);

				if(res.error == null){
					$(doms.favName).val("");
					$(doms.favDesc).val("");
					$(doms.favName).focus();
					STCRoot.data.refreshPage = true;
				}
				else{
					var alert = new STCAlert(e,{
						heading : "Lỗi!",
						content : res.error,
						style : "error",
						onAlertClosed : function(){
							$(doms.favName).focus();
						}
					});
				}
			
				$this.button('reset');
			});
		});
	}

	// Reset UI
	function resetUI(){
		$(doms.prdInf).children(".stc-right").children("input, textarea").val('');
		$("#stc_img_mng").stcimgmgr('options','removeChoosedImages','');
		$(doms.addNav).show();
		hide(doms.addCtr);
		hide(doms.prdInf)
		hide(doms.addFavForm)
		$(doms.imgMgr).empty();
	}

	// Add image
	function addImage($img){
		// Cover is not set
		if($(doms.prdCoverImg).children("img").length <= 0){
			setCoverImage($img);
		}
		else{
			var $thumbImg = $img.clone();
			$thumbImg.appendTo(doms.prdSubImgs);
			$thumbImg.click(function(){
				toggleCoverImages($(this));
			});
		}

		show(doms.prdInf);
	}

	// Remove image
	function removeImage($img){
		if($(doms.prdCoverImg).children("img").attr("data-id") == $img.attr("data-id")){
			$(doms.prdCoverImg).children("img").remove();
		}
		else{
			$(doms.prdSubImgs).children("img").each(function(){
				if($(this).attr("data-id") == $img.attr("data-id")){
					$(this).remove();
					return;
				}
			});
		}
	}

	// Set cover image
	function setCoverImage($img){
		$(doms.prdCoverImg).children("img").remove();
		$img.clone().appendTo(doms.prdCoverImg);

		$(doms.prdName).val($img.attr("title"));

		if(!strIsEmpty($img.attr("alt"))){
			$(doms.prdDesc).val($img.attr("alt"));
		}

	}

	// Toggle image
	function toggleCoverImages($thumbImg){
		var $coverImg = $(doms.prdCoverImg).children("img");
		if($coverImg.length <= 0){
			setCoverImage($thumbImg);
			$thumbImg.remove();
		}
		else{
			var $tmp = $coverImg.clone();
			setCoverImage($thumbImg);
			$thumbImg.attr("src",$tmp.attr("src"));
			$thumbImg.attr("title",$tmp.attr("title"));
			$thumbImg.attr("alt",$tmp.attr("alt"));
		}
	}
}




