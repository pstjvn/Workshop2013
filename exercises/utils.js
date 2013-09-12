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
    this.callback.call(this.handler, ms);
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

/**
 * Remove the function from the call stack if it is still there.
 */
RAF.prototype.stop = function() {
  if (!this.started_) return;
  RAF.craf.call(window, this.id);
  this.started_ = false;
};
