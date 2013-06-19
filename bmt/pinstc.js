/**
 *  Image Loader - Jquery Plugin
 * * * OPTION * * *
 * Author: phungnc@gmail.com
 */

( function($) {
		$.fn.stcimgmgr = function(customOptions) {
			/*** private member ***/
			var constants = {
				addBtnTitle : 'Select',
				delBtnTitle : 'Delete'
			};
			var $this = this;
			var options = {
				imgWidth : 150,
				imgHeight : 150
			};
			var images = new Array();
			if(!this.data('imgId')){
				this.data('imgId',0);	
			}
			switch(arguments.length) {
				case 1:
					$.extend(options, customOptions);
					$this.data('options', options);
					break;
				case 2:
					break;
				case 3:
					if (arguments[0] != 'options') {
						$.error('Argument: ' + arguments[0] + 'not right');
						return;
					}

					options = this.data('options');
					set(arguments[1], arguments[2]);
					break;
			}

			/*** private function ***/

			function setup(selector) {
				var $imgCtn = selector ? selector : $this.children('.stc-imgctn');
				
				// Setup for image
				$imgCtn.each(function() {
					// On hover
					$(this).hover(function(){
						if(!$(this).hasClass('stc-imgctn-choosed')){
							$('.stc-imgtb',this).css('display','inline-block');
						}
					},function(){
						$('.stc-imgtb',this).hide();
					});
					
					// On image choosed
					$('.stc-icon-ok-green', this).click(function() {
						$parent = $(this).parent();
						$parent.addClass("stc-imgctn-choosed");

						if (options.onImageChoosed && typeof (options.onImageChoosed) == 'function') {
							options.onImageChoosed.call(window, $parent.children('img'));
						}
					});

					// On image unchoosed
					$('.stc-icon-ko-red', this).click(function() {
						$parent = $(this).parent();
						$parent.removeClass("stc-imgctn-choosed");

						if (options.onImageUnchoosed && typeof (options.onImageUnchoosed) == 'function') {
							options.onImageUnchoosed.call(window, $parent.children('img'));
						}
					});

					// Delete image
					$('.stc-icon-delete', this).click(function() {
						$(this).parent().remove();
					});

				});
			}

			function set(member, value) {
				switch(member) {
					case 'addImages':
						addImages(value);
						break;
					case 'setImagesAdded':
						setImagesAdded();
						break;
					case 'removeChoosedImages':
						removeChoosedImages();
						break;
				}
			}

			function addImages(imgInf) {
				var img  = imgInf.img;
				var orgSize = imgInf.orgSize;
				if ($this.children('img').length > 0) {
					$template = $this.children('stc-imgctn:first-child').clone(true);
					$template.children('img').replaceWith(img);
					$this.append($template);
				} else {
					newImg = createImageContainer(img,orgSize);
					$this.append(newImg);
					setup($(newImg));
				}
			}
			
			function setImagesAdded(){
				$this.children('.stc-imgctn-choosed').addClass('stc-imgctn-added');
			}

			// after product added,
			function removeChoosedImages(){
				$this.children('.stc-imgctn-choosed').each(function(){
					$('.stc-icon-ko-red', this).click();
				});
			}

			/*** private ui helper function ***/

			/**
			 * Create Image Infor
			 */
			function createImageInfor(img) {
				var html = '';
				html += '<p class="stc-imginf"><span>' + img.width + ' x '  + img.height + '<span></p>';
				return html;
			}

			/**
			* Create Image Overlay
			**/
			function createImageOverlay(){
				var html = '';
				html += '<div class="img-overlay"></div>';
				return html;
			}
			
			/**
			 * Create Image Toolbar
			 */
			function createImageToolbar(img) {
				var html = '';
				html += '';
				return html;
			}

			/**
			 * Create Image Container
			 */
			function createImageContainer(img,orgSize) {
				var imgCtn = document.createElement('div');
				$(imgCtn).append(createImageInfor(orgSize));
				var imgId = $this.data('imgId') + 1;
				$this.data('imgId',imgId);
				$(img).attr('data-id','img' + imgId);
				$(imgCtn).addClass('stc-imgctn img-polaroid');
				$(imgCtn).append(img);
				
				var html = '';
				html += '<i title="Delete" class="stc-icon-delete"></i>';
				html += '<i title="Select" class="stc-icon-ok-green"></i>';
				html += '<i title="Cancel" class="stc-icon-ko-red"></i>';
				html += '<div class="stc-img-overlay"></div>';
				$(imgCtn).append(html);
				return imgCtn;
			}

		}
	}(jQuery));


function strIsEmpty(str) {
	return jQuery.trim(str) == "" ? true : false;
};

function getURLParameter(url,sParam){
    var sURLVariables = url.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}

function pinstc(d,inf){
	$("#stcoverlay").remove();
	$("#stc_prd_mng").remove();
	inf.requestUrl += "fromSite=" + encodeURIComponent(window.location.toString());
	var coverImg = "";
	var thumbImgs = "";
	var pName = "";
	var pDesc = "";

	var doms = {
		overlay : d.createElement("div"),
		topControl : d.createElement("div"),
		close : d.createElement("button"),
		imgMgr : d.createElement("div"),
		iframe : d.createElement("iframe")
	};

	// Overlay
	$(doms.overlay).attr("id","stcoverlay");
	$(doms.overlay).addClass("stc-fixed");
	// Img
	$(doms.imgMgr).addClass("stc-fixed");

	// Top control
	$(doms.topControl).attr("id","stc_top_control");
	var linkLogo = d.createElement("a");
	//$(linkLogo).addClass("sotaycuoi");
	$(linkLogo).attr("href","http://a-fis.com/");
	$(linkLogo).attr("target","_blank");
	$(linkLogo).append('<img src="https://crowdworks.jp/attachments/217098.png?height=160&width=160">');
	$(doms.topControl).append(linkLogo);

	$(doms.close).attr("id","close");
	$(doms.close).text("Close");
	$(doms.close).addClass("stc-button-blue");
	$(doms.close).click(function(){
		$(doms.topControl).remove();
		$(doms.overlay).remove();
		$(doms.imgMgr).remove();
	});
	$(doms.topControl).append(doms.close);

	$(doms.imgMgr).attr("id","stc_img_mng");
	$(doms.imgMgr).height($(window).height() - 40 );
	// Body
	$(d.body).append(doms.overlay);
	$(d.body).append(doms.topControl);
	$(d.body).append(doms.imgMgr);

	// Image Manager
	$("#stc_img_mng").stcimgmgr({
		onImageChoosed : function(img) {
			if(strIsEmpty(coverImg)){
				coverImg = encodeURI($(img).attr("src"));
				if(!strIsEmpty($(img).attr("title"))){
					pName = $(img).attr("title");
				}

				if(!strIsEmpty($(img).attr("alt"))){
					pDesc = $(img).attr("alt");
				}
			}
			else{
				if(strIsEmpty(thumbImgs)){
					thumbImgs = encodeURI($(img).attr("src"));
				}
				else{
					thumbImgs += "," + encodeURI($(img).attr("src"));
				}

				if(!strIsEmpty($(img).attr("title"))){
					pName = $(img).attr("title");
				}

				if(!strIsEmpty($(img).attr("alt"))){
					pDesc = $(img).attr("alt");
				}
			} 

			// connect to stc
			src = inf.requestUrl + "&name=" + pName;
			src += "&desc="  + pDesc;
			src += "&coverImg=" + coverImg;
			src += "&thumbImgs=" + thumbImgs;
			$(doms.iframe).attr("src",src);
		},
		onImageUnchoosed: function(img){
			if(strIsEmpty(thumbImgs)){
				coverImg = "";
			}
			else{
				var imgSrc = encodeURI($(img).attr("src"));
				thumbImgs = thumbImgs.replace("," + imgSrc,"");
				thumbImgs = thumbImgs.replace(imgSrc + ",","");
				thumbImgs = thumbImgs.replace(imgSrc,"");
			}

			// connect to stc
			src = inf.requestUrl + "&name=" + pName;
			src += "&desc="  + pDesc;
			src += "&coverImg=" + coverImg;
			src += "&thumbImgs=" + thumbImgs;
			$(doms.iframe).attr("src",src);
		}
	});

	/****** Collect images ******/
	$(d.body).find("img").each(function(){
		var $this = $(this);
		var orgSize = {
			width : $this.width(),
			height : $this.height()
		}
		if(orgSize.width >= inf.minWidth && orgSize.height >= inf.minHeight){
			var $img =  $this.clone();
			$("#stc_img_mng").stcimgmgr('options', 'addImages', {
				img : $img[0],
				orgSize : orgSize
			});
		} 
	});
}

pinstc(document,{
	//requestUrl : "http://localhost/bmt/pinstc.php?",
	minWidth : 200,
	minHeight : 200
});
