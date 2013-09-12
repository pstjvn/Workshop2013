/**
 * Provides abstraction for RAF.
 * @constructor
 * @param {function(number): void} callback
 * @param {?} handler
 */
function RAF(callback, handler) {
  this.callback = callback;
  this.handler = handler;
  this.started_ = false;
  this.id = 0;
  this.bound = function(ms) {
    this.started_ = false;
    // Override the default behaviour of using time offset.
    this.callback.call(this.handler, Date.now());
  }.bind(this);
}

/** Handle different browser versions */
RAF.raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
RAF.craf = window.cancelRequestAnimationFrame ||
    window.webkitCancelRequestAnimationFrame;

/**
 * Add call to our raf in the queue, will be executer right before the next
 * paint.
 */
RAF.prototype.start = function() {
  if (this.started_) return;
  this.id = RAF.raf.call(window, this.bound);
  this.started_ = true;
};

RAF.prototype.isActive = function() {
  return this.started_;
};

/**
 * Remove the function from the call stack if it is still there.
 */
RAF.prototype.stop = function() {
  if (!this.started_) return;
  RAF.craf.call(window, this.id);
  this.started_ = false;
};

function Delay(callback, timeout, handler) {
  this.callback = callback;
  this.handler = handler;
  this.timeout = timeout;
  this.id = 0;
  this.bound = this.doAction.bind(this);
}

Delay.prototype.doAction = function() {
  this.callback.call(this.handler);
  this.id = 0;
};

Delay.prototype.start = function() {
  if (this.id != 0) {
    this.stop();
  }
  this.id = setTimeout(this.bound, this.timeout);
};

Delay.prototype.stop = function() {
  if (this.id != 0) {
    clearTimeout(this.id);
    this.id = 0;
  }
};

var css = {
  setTranslation: function(el, x, y, unit, append) {
    if (!unit) unit = 'px';
    if (!append) append = '';
    el.style.WebkitTransform = 'translate3d(' + x + unit + ',' +
        y + unit + ',0)' + append;
  }
};
