/**
 * STC Image Manager - Jquery Plugin
 * * * OPTION * * *
 */

( function($) {
		$.fn.stcimgmgr = function(customOptions) {
			/*** private member ***/
			var constants = {
				addBtnTitle : 'Chọn làm hình đại diện',
				delBtnTitle : 'Xoá'
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
						$.error('Tham số ' + arguments[0] + 'không đúng');
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

			function addImages(img) {
				if ($this.children('img').length > 0) {
					$template = $this.children('stc-imgctn:first-child').clone(true);
					$template.children('img').replaceWith(img);
					$this.append($template);
				} else {
					newImg = createImageContainer(img);
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
					$(this).remove();
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
			function createImageContainer(img) {
				var imgCtn = document.createElement('div');
				$(imgCtn).append(createImageInfor(img));
				var imgId = $this.data('imgId') + 1;
				$this.data('imgId',imgId);
				$(img).attr('data-id','img' + imgId);
				$(imgCtn).addClass('stc-imgctn img-polaroid');
				$(imgCtn).width(options.imgWidth);
				$(imgCtn).height(options.imgHeight);
				$(imgCtn).append(img);
				var html = '';
				html += '<i title="Xoá" class="stc-icon-delete"></i>';
				html += '<i title="Chọn" class="stc-icon-ok-green"></i>';
				html += '<i title="Bỏ chọn" class="stc-icon-ko-red"></i>';
				html += '<div class="stc-img-overlay"></div>';
				$(imgCtn).append(html);
				return imgCtn;
			}

		}
	}(jQuery));