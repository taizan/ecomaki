/**
 *  jStageAligner.js
 *  require jQuery 1.2
 *  (c) Hideaki Tanabe <http://blog.kaihatsubu.com>
 *  Licensed under the MIT License.
 *
 *  usage:
 *    .jStageAligner(position, [options]);
 *
 *  options:
 *    - time
 *    - marginTop
 *    - marginRight
 *    - marginBottom
 *    - marginLeft
 *    - easing
 *    - callback
 *
 *  returns:
 *    jQuery object
 *
 *  sample:
 *    $("#box").jStageAligner("RIGHT_BOTTOM", {time: 500, easing: "swing", marginBottom: 50});
 */
(function($) {
  $.fn.jStageAligner = function(position, options) {
    var self = this;
    var isIE6 = !jQuery.support.opacity && !jQuery.support.style && (typeof document.documentElement.style.maxHeight === "undefined");
    this.css("position", "absolute");

    if (!options) {
      var options = {};
    }
    options.marginTop    = options.marginTop    || 0;
    options.marginRight  = options.marginRight  || 0;
    options.marginBottom = options.marginBottom || 0;
    options.marginLeft   = options.marginLeft   || 0;
    options.time         = options.time         || 0;
    options.easing       = options.easing       || "linear";
    options.callback     = options.callback     || null;

    var calculatePosition = function() {
      var targetPosition = {left: 0, top: 0};
      //animate
      if (options.time > 0 || isIE6) {
        targetPosition = {left: $(window).scrollLeft(), top: $(window).scrollTop()};
      }
      var stageWidth = $(window).width();
      var stageHeight = $(window).height();
      var marginX = options.marginLeft - options.marginRight;
      var marginY = options.marginTop - options.marginBottom;

      switch (position) {
        case "LEFT_TOP":
          targetPosition.left += marginX;
          targetPosition.top  += marginY;
          console.log(targetPosition.left);
          console.log(targetPosition.top);
          break;

        case "LEFT_MIDDLE":
          targetPosition.left += marginX;
          targetPosition.top  += Math.floor(stageHeight / 2 - self.height() / 2 + marginY);
          break;

        case "LEFT_BOTTOM":
          targetPosition.left += marginX;
          targetPosition.top  += stageHeight - self.height() + marginY;
          break;

        case "RIGHT_TOP":
          targetPosition.left += stageWidth - self.width() + marginX;
          targetPosition.top  += marginY;
          break;

        case "RIGHT_MIDDLE":
          targetPosition.left += stageWidth - self.width() + marginX;
          targetPosition.top  += Math.floor(stageHeight / 2 - self.height() / 2 + marginY);
          break;

        case "RIGHT_BOTTOM":
          targetPosition.left += stageWidth - self.width() + marginX;
          targetPosition.top  += stageHeight - self.height() + marginY;
          break;

        case "CENTER_TOP":
          targetPosition.left += Math.floor(stageWidth / 2 - self.width() / 2 + marginX);
          targetPosition.top  += marginY;
          break;

        case "CENTER_MIDDLE":
          targetPosition.left += Math.floor(stageWidth / 2 - self.width() / 2 + marginX);
          targetPosition.top  += Math.floor(stageHeight / 2 - self.height() / 2 + marginY);
          break;

        case "CENTER_BOTTOM":
          targetPosition.left += Math.floor(stageWidth / 2 - self.width() / 2 + marginX);
          targetPosition.top  += stageHeight - self.height() + marginY;
          break;
      }
        return targetPosition;
    };
    
    //do alignment
    var align = function() {
      var targetPosition = calculatePosition();
      self.clearQueue();
      //animate
      if (options.time > 0) {
        self.animate({ 
          left: targetPosition.left,
          top : targetPosition.top
        }, options.time, options.easing, options.callback);
      //not animate
      } else {
        //is IE 6
        //IE 6 is not support position: fixed
        //this cause have little bit blink bug
        if (isIE6) {
          self.css("position", "absolute");
          self.css("left", targetPosition.left);
          self.css("top", targetPosition.top);
          $("body").css({
              "background-image": "url(null)",
              "background-attachment": "fixed"
          });
        } else {
          self.css("position", "fixed");
          self.css("left", targetPosition.left);
          self.css("top", targetPosition.top);
        }
        if (options.callback) {
          options.callback.call();
        }
    }
    };

    //resize handler
    $(window).resize(function() {
      align();
    });

    $(window).scroll(function() {
      align();
    });

    //initialize
    var targetPosition = calculatePosition();
    this.css("left", targetPosition.left);
    this.css("top", targetPosition.top);

    return this;
  };
})(jQuery);
