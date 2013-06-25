var options = {
  // request URL
  tick : "http://bouticks.com/addx?",
  // 
  attrPrefix: "data-tick-",
  // set image size filter factors
  imgWidthMin   : 150,
  imgHeightMin  : 150,
  // size of each tick or image container
  thumbHeight   : 200,
  thumbWidth    : 200,
  // popup feature
  pop:"menubar=no,toolbar=no,status=no,resizable=yes,scrollbars=yes,directories=no,location=no,width=550,height=450,left=0,top=0" 
};
(function(x,y,z){
  var bouticks = {
    win    : x,
    doc    : y,
    opts   : z,
    images : [],
    grid   : {
      images : [],
      // Add a image to grid view and bind image to click event
      addOne: function(image) {
        var imageView = bouticks.ticks.render(image);                
        var tickRef   = imageView.getElementsByTagName('a')[0];                   
        // bind click events to refence image data
        bouticks.utils.listenOn(tickRef,"click",bouticks.ticks.tick);        
        // add to grid layout.
        bouticks.views.grid.appendChild(imageView);          
      },
      // Add all image to grid view
      addAll: function() {
        var i,len, imgView;
        for (i = 0, len = this.images.length; i < len; i++) {
          this.addOne(this.images[i]);
        }
      },
      // Fetch all images on pages
      fetch: function() {
        var imgTag = "img", i,len,image = {},allImages;
        allImages = bouticks.doc.getElementsByTagName(imgTag);
        for (i = 0, len = allImages.length; i < len; i++) {
          if(!this.hiddenImage(allImages[i]))
            this.parse(allImages[i]);
        }
      },
      // parse image html tag to image object
      parse: function(image) {
        var image = {
          src   : image.src,
          height: image.height,
          width : image.width
        },
        img = new Image;
        img.onload = function () {
          image.height = this.height;
          image.width = this.width
        };
        this.images.push(image);   
      },
      // Filter images with imgWidthMin, imgHeightMin whose set in options
      filter: function() {
        var image;
        for (i = this.images.length - 1; i > -1; i -= 1) {
          image = this.images[i];
          if(image.width < bouticks.opts.imgWidthMin || image.height < bouticks.opts.imgHeightMin) {
            this.images.splice(i,1);
          }                 
        }        
      },
      // check if hidden image
      hiddenImage: function(el) {
        if( el.style.display === "none" || bouticks.win.getComputedStyle(el).visibility === "hidden")
          return true;
        else
          return false;
      }           
    },
    // ticks object
    ticks : {
      // Render a tick view
      render: function (image) {
        var imageContainer = bouticks.utils.makeDom({
          DIV : {
            className: "bouticks-image-container image-polaroid",
            innerHTML: '<span class="bouticks-image-info">' + image.width + ' x '  + image.height + '</span>'
          }
        }),
        img = bouticks.utils.makeDom({
          IMG : {
            src: "" + image.src,
            alt: "" + image.alt,
            height : "" + image.height,
            width : "" + image.width
          }
        }),
        a = bouticks.utils.makeDom({
          A : {
            className: "bouticks-image-choice bouticks-popup-opener",
            "data-tick-src" : "" + image.src              
          }
        });
        //
        imageContainer.appendChild(img);
        imageContainer.appendChild(a);
        imageContainer.style.width = bouticks.opts.thumbHeight + 'px';
        imageContainer.style.height = bouticks.opts.thumbHeight + 'px'; 
        return imageContainer;           
      },
       // tick a image!
      tick: function (e) {
        var url,imgurl,features, el;
        url       = bouticks.opts.tick;
        features  = bouticks.opts.pop;
        el        = e.target ? e.target.nodeType === 3 ? e.target.parentNode : e.target : e.srcElement;
        imgurl    = typeof el["data-tick-src"] === "string" ? el["data-tick-src"] :  el.getAttribute("data-tick-src");
        url      += "&imgurl=" + encodeURIComponent(imgurl);
        bouticks.win.open(url, '_blank',features);  
        bouticks.views.close();       
      }           
    },
    // set of views: header, overlay, grid
    views  : {
      // make header
      createHeader: function () {
        var h = bouticks.utils.makeDom({
          DIV : {
            id: "bouticks_header"
          }
        }),
        x = bouticks.utils.makeDom({
          BUTTON : {
            id: "close",
            className: "bouticks-button-blue",
            innerHTML: "Close"
          }
        }),
        logo = bouticks.utils.makeDom({
          SPAN : {
            className: "bouticks-logo"
          }
        });
        h.appendChild(logo);  
        h.appendChild(x);
        //bouticks.utils.listenOn(x,"click",this.close.bind(this));
        var self = this;
        bouticks.utils.listenOn(x,"click",function(event){
          self.close(event);
        });
        return h;
      },
      // make grid overlay background
      createOverlay: function () {
        var o = bouticks.utils.makeDom({
          DIV : {
            id: "bouticks_overlay",
            className: "bouticks-container"
          }
        });
        return o; 
      },
      // make grid layout
      createGrid: function () {
        var g = bouticks.utils.makeDom({
          DIV : {
            id: "bouticks_grid",
            className: "bouticks-container",
            height : "" + (bouticks.win.innerHeight - 40)
          }
        });
        return g; 
      },
      // render set of views
      render: function () {
        this.header = this.createHeader();
        this.overlay = this.createOverlay();
        this.grid = this.createGrid();
        //
        bouticks.doc.body.appendChild(this.header);
        bouticks.doc.body.appendChild(this.overlay);
        bouticks.doc.body.appendChild(this.grid);
      },
      // Remove a view from the set 
      remove: function (view) {
        if(typeof view === "string") {
          view = bouticks.doc.getElementId(view);
        }
        view.parentNode.removeChild(view);
      },
      // Close all view
      close: function () {

        this.remove(bouticks.views.header);
        this.remove(bouticks.views.overlay);
        this.remove(bouticks.views.grid);
        // scroll to Top
        bouticks.win.scroll(0, bouticks.saveScrollTop);
      }   
    },
    initialize: function () {
      // fetch image from page
      bouticks.grid.fetch();
      bouticks.grid.filter();
      if (bouticks.grid.images.length > 0) {
        bouticks.views.render();
        //
        bouticks.grid.addAll();
        // scroll to Top
        bouticks.win.scroll(0, 0);
        bouticks.saveScrollTop = bouticks.win.pageYOffset;
        bouticks.opts.tick += "url=" + encodeURIComponent(bouticks.win.location.toString());        
      } else {
        alert("Sorry! Couldn't find any tickable things on this page!");
      }
    },
    // set of utilities method for bouticks object
    utils : function () {
      return {
        // set attribute for the dom
        set : function (obj, attr, val) {
          if (typeof obj[attr] === "string")
            obj[attr] = val;
          else
            obj.setAttribute(attr, val);
        }, 
        // make dom       
        makeDom: function (obj) {
          var result = false,prop,attr;
          for (prop in obj)
            if (obj[prop].hasOwnProperty) {
              result = bouticks.doc.createElement(prop);
              for (attr in obj[prop])
                obj[prop][attr].hasOwnProperty && typeof obj[prop][attr] === "string" && bouticks.utils.set(result, attr, obj[prop][attr]);
              break
            }
          return result;          
        },
        // create a cross-browser event-attaching
        listenOn: function(obj, type, callback) {
          if(obj.addEventListener) {
            obj.addEventListener(type, callback, false);
          } else {
            obj.attachEvent("on"+type, callback);
          }
        }

      }
    }()
  };
  bouticks.initialize();
})(window,document,options);