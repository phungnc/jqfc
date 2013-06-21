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
        imgWidth : 200,
        imgHeight : 200
      };
      if(!this.data('imgId')){
        this.data('imgId',0); 
      }
      $.extend(options, customOptions);
      $this.data('options', options);
      addImages();   
      /*** private function ***/

      function setup(selector) {

        var $imgCtn = selector ? selector : $this.children('.stc-imgctn').children('img');
        
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
          //$('img', this).click(function() {
            
            var url,imgurl,features;
            url       = options.tick;
            features  = options.pop;
            //imgurl    = this.getAttribute('src');
            imgurl    = $(this.parentElement).find('img').prop('src');      
            url      += "&imgurl=" + encodeURIComponent(imgurl);
            window.open(url, '_blank',features);

          });
        });
      }
      // add images 
      function addImages() {
        var img  = options.img;
        var orgSize = options.orgSize;
        newThumb = thumb(img,orgSize);
        $this.append(newThumb);
        setup($(newThumb));
      }
      /*** private ui helper function ***/

      /**
       * Create Image Infor
       */
      function imageInfo(img) {
        var html = '';
        html += '<p class="stc-imginf"><span>' + img.width + ' x '  + img.height + '<span></p>';
        return html;
      }
      /**
       * Create Image Container
       */
      function thumb(img,orgSize) {

        var imgCtn = document.createElement('div');
        $(imgCtn).append(imageInfo(orgSize));
        var imgId = $this.data('imgId') + 1;
        $this.data('imgId',imgId);
        $(img).attr('data-id','img' + imgId);
        $(imgCtn).addClass('stc-imgctn img-polaroid');
        $(imgCtn).width(options.imgWidth);
        $(imgCtn).height(options.imgHeight);
        $(imgCtn).append(img);
        
        var html = '';
        html += '<i title="Select" class="stc-icon-ok-green"></i>';
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

function init(d,options){
  $("#stcoverlay").remove();
  $("#stc_prd_mng").remove();
  options.tick += "url=" + encodeURIComponent(window.location.toString());
  var coverImg = "";
  var thumbImgs = "";
  var pName = "";
  var pDesc = "";

  var doms = {
    overlay : d.createElement("div"),
    topControl : d.createElement("div"),
    close : d.createElement("button"),
    imgMgr : d.createElement("div"),
    //iframe : d.createElement("iframe")
  };
  // Overlay
  $(doms.overlay).attr("id","stcoverlay");
  $(doms.overlay).addClass("stc-fixed");
  // Img
  $(doms.imgMgr).addClass("stc-fixed");

  // Top console
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

  /****** Collect images ******/
  $(d.body).find("img").each(function(){
    var $this = $(this);
    var orgSize = {
      width : $this.width(),
      height : $this.height()
    }
    if(orgSize.width >= options.minWidth && orgSize.height >= options.minHeight){
      var $img =  $this.clone();
      $("#stc_img_mng").stcimgmgr({
        tick: options.tick,
        pop: options.pop,
        img : $img[0],
        orgSize : orgSize
      });
    } 
  });
}

init(document,{
  // request URL
  tick : "http://bouticks.com/addx?",
  // set filter 
  minWidth : 150,
  minHeight : 150,
  // popup feature
  pop:"menubar=no,toolbar=no,status=no,resizable=yes,scrollbars=yes,directories=no,location=no,width=550,height=450,left=0,top=0"
});