//
function listenOn(obj, type, ctx) {
  if(obj.addEventListener) {
    obj.addEventListener(type, ctx, false);
  } else {
    obj.attachEvent("on"+type, ctx);
  }
}
//
function stopListen(obj, type, ctx) {
  if(obj.removeEventListener) {
    obj.removeEventListener(type, ctx, false);
  } else {
    obj.detachEvent("on"+type, ctx);
  }  
}
//
var isAndroidBrowser = /Android/.test(window.navigator.appVersion) && /Version\/\d/.test(window.navigator.appVersion);
//
var Scroll = function (el, options) {

  this.options = {
    swipe: false,
    stepSize: 5,
    resistance: 1,
    resistanceK: 1.5,
    innerScroller: {
      el: '',
      direction: 'v',
      stepSize: 20,
    }
  }
  this.oldBodyClass = document.body.className;

  for ( var i in options ) {
    this.options[i] = options[i];
  }
  this.parentEl = document.querySelector(this.options.parentEl);
  this.translateZ = ' translateZ(0)';
  this.wrapper = typeof el == 'string' ? document.querySelector(el) : el; 
  this.update();
  this.initialize();
}

Scroll.prototype = {
  initialize: function() {
    // init event
    listenOn(this.scroller, 'touchstart', this);
  },
  //destroy: function() {},
  getPos: function () {
    var transform = window.getComputedStyle(this.scroller, null);
    if (!!transform && transform !== 'none') {
        var matrix = new WebKitCSSMatrix(transform.webkitTransform);
        return { x: matrix.e, y: matrix.f };
    }  
  },
  //
  update: function() {
    var wrapperHeight, scrollerHeight;
    // get wrapper height, width
    wrapperHeight = this.wrapper.offsetHeight;
    wrapperWidth = this.wrapper.offsetWidth;
    // swipe ?
    if( this.options.swipe) {
      this.scroller = this.wrapper;
      this.maxHeight = -(wrapperHeight);
      this.maxWidth = -(wrapperWidth);
      this.options.stepSize = wrapperWidth;
    } else {
      this.scroller = this.wrapper.children[0];
      scrollerHeight  = this.scroller.offsetHeight;
      scrollerWidth  = this.scroller.offsetWidth;
      this.maxHeight  =  wrapperHeight - scrollerHeight;
      this.maxWidth   =  wrapperWidth - scrollerWidth;       
    }
    this.lastStepNumberY = (this.maxHeight / this.options.stepSize);
  },
  //
  setStep: function () {

    var offsetX, offsetY, round, stepX, stepY, stepNumberX, stepNumberY;

    if(this.options.scrollX) {
      offsetX = (+new Date) - this.startTime < 1000 && Math.abs(this.deltaX) > 15 ? (this.deltaX < 0 ? -1 : 1) : 0;
      round = offsetX ? (this.deltaX < 0 ? 'ceil' : 'floor') : 'round';
      stepNumberX = this.scroller.offsetWidth / this.options.stepSize;
      stepX  = Math[round](this.getPos().x / this.options.stepSize );
      stepX += offsetX;
      stepX = Math.min(stepX,0);
      if(stepNumberX == 1) {
        stepX = Math.max(-1, stepX);
      } else {
        stepX = Math.max(-(stepNumberX - 1), stepX);      
      }
      offsetX = stepX * this.options.stepSize;      
    } else {
      offsetX = 0;
    }
    if(this.options.scrollY) {
      offsetY = (+new Date) - this.startTime < 1000 && Math.abs(this.deltaY) > 15 ? (this.deltaY < 0 ? -1 : 1) : 0;
      round = offsetY ? (this.deltaY < 0 ? 'ceil' : 'floor') : 'round';
      stepNumberY = this.scroller.offsetHeight / this.options.stepSize;
      stepY  = Math[round](this.getPos().y / this.options.stepSize );
      stepY += offsetY;
      stepY = Math.min(stepY,0);
      stepY = Math.max(-(stepNumberY - 1), stepY);
      stepY = stepY < this.lastStepNumberY ? this.lastStepNumberY : stepY;
      offsetY = stepY * this.options.stepSize;
    } else {
      offsetY = 0;
    }
    this.translateTo(offsetX,offsetY);
  },
  //
  onStart: function(e) {
    console.log("scroll onStart");
    if( !isAndroidBrowser ) {
      e.preventDefault();
    }
    var point = e.touches ? e.touches[0] : e;
    this.pageX = point.pageX;
    this.pageY = point.pageY;
    //
    this.startTime = +new Date;
    // 
    this.scroller.style['-webkit-transition-duration'] = 0;



    listenOn(this.scroller, 'tapclose', this);
    listenOn(this.scroller, 'tapopen', this);

    if(point.target.className === 'close') {
      var ev = document.createEvent('Event');
      ev.initEvent('tapclose', true, true);
      this.wrapper.dispatchEvent(ev);      
    }
    if(point.target.className === 'open') {
      var ev = document.createEvent('Event');
      ev.initEvent('tapopen', true, true);
      this.wrapper.dispatchEvent(ev);      
    }
    // start listent to touchmove and touchend event
    listenOn(this.scroller, 'touchmove', this);
    listenOn(this.scroller, 'touchend', this);
    this.options.resistanceX = 1;    
    this.options.resistanceY = 1;
  },
  //
  onMove: function(e) {
    console.log("scroll onMove");
    //console.log(e);
    e.preventDefault();
    e.stopPropagation();

    var point = e.touches ? e.touches[0] : e;

    this.deltaX = point.pageX - this.pageX;
    this.deltaY = point.pageY - this.pageY;
    if(this.options.scrollX) {
      if(this.deltaX === 0) return;
      if(Math.abs(this.deltaY) > Math.abs(this.deltaX)) return;
    }
    if(this.options.scrollY) {
      if(this.deltaY === 0) return;
      if(Math.abs(this.deltaX) > Math.abs(this.deltaY)) {
        if(this.deltaX > 0) return;
        // stop listen event on this scroller 
        stopListen(this.scroller, "touchmove", this);
      } 
    } else {
      if(Math.abs(this.deltaY) > Math.abs(this.deltaX)) return; 
    }
    // modal open or close in x-swipe case only
    this.setModalStatus();

    var pos = this.getPos(), 
        offsetX = this.deltaX/this.options.resistanceX + parseInt(pos.x), 
        offsetY = this.deltaY/this.options.resistanceY + parseInt(pos.y);
    this.pageX  = point.pageX;
    this.pageY  = point.pageY;
    //
    this.translateTo(offsetX, offsetY);
    //
    this.options.resistanceX = pos.x > 0 ? (this.pageX / this.options.stepSize) + this.options.resistanceK :
                  pos.x < this.maxWidth ? (Math.abs(this.pageX) / this.options.stepSize) + this.options.resistanceK : 1;

    this.options.resistanceY = pos.y > 0 ? (this.pageY / this.options.stepSize) + this.options.resistanceK :
                 pos.y < this.maxHeight ? (Math.abs(this.pageY) / this.options.stepSize) + this.options.resistanceK : 1;
  },
  //
  onEnd: function(e) {
    if(this.options.scrollX) {
      if(this.deltaX === 0) return;
      if(Math.abs(this.deltaY) > Math.abs(this.deltaX)) return;      
    } else {
      if(Math.abs(this.deltaX) > Math.abs(this.deltaY)) return;
    }
    if(this.options.scrollY) {
      if(this.deltaY === 0) return;
      if(Math.abs(this.deltaX) / Math.abs(this.deltaY) > 2) return;
    } else {
      if(Math.abs(this.deltaY) > Math.abs(this.deltaX)) return; 
    }
    this.scroller.style['-webkit-transition-duration'] = '.5s';
    this.setStep();
    this.setModalStatus();
  },
  //
  setModalStatus: function () {
    if(this.options.swipe) {
      if( this.deltaX > 0 ) {
        if(!this.modalOpen) {
          document.body.className += 'modal-open'; 
          this.modalOpen = true;
          this.update();
        }
      } else {
        if(this.modalOpen) {
          document.body.className = this.oldBodyClass;
          this.modalOpen = false;
          this.update();        
        }
      }      
    }
  },
  //
  translateTo: function (offsetX, offsetY) {    
    if(this.options.scrollX) {
      this.scroller.style.webkitTransform = 'translate(' + offsetX + 'px,0px)' + this.translateZ;    
    }
    if(this.options.scrollY) {
      this.scroller.style.webkitTransform = 'translate(0px,' + offsetY + 'px)' + this.translateZ;      
    }  
  },
  //
  tapOpen: function(e) {
    this.deltaX = 1;
    this.setModalStatus();
    this.translateTo(0,0);
  },
  //
  tapClose: function(e) {
    if(this.deltaX >= 0) this.deltaX = -1;
    this.setModalStatus();
    this.translateTo(-(this.wrapper.offsetWidth),0);
  },
  //
  handleEvent: function (e) {
    switch (e.type) {
      case 'touchstart':
        this.onStart(e);
        break;
      case 'touchmove':
        this.onMove(e);
        break;
      case 'touchend':
      case 'touchcancel':
        this.onEnd(e);
        break;              
      case 'tapopen':
        this.tapOpen(e);
        break;  
      case 'tapclose':
        this.tapClose(e);
        break;      
      }
  }
}
//