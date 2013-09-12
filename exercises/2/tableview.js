function TableView(element, childHeight) {
  this.offset_ = 0;
  this.visualOffset_ = 0;
  this.cache_ = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.isAnimating_ = false;
  this.ignoreEndEvents_ = false;

  this.children = [];
  this.momentumRaf_ = new RAF(this.handleMomentum, this);
  this.movementRaf_ = new RAF(this.handleMovement, this);
  this.paintNotifyDelay_ = new Delay(this.paintNotify, 200, this);

  this.element = element;
  this.childHeight_ = childHeight;
  this.elementHeight_ = 0;

  this.enterDocument();
};


/**
 * Provides named accessors for the cached values. The access will be rewritten
 * by the compiler to be interpreted as regular array access by index, so there
 * is no performance penalty from using the named accessors.
 *
 * @enum {number}
 */
TableView.Cache = {
  TOUCH_START_Y: 0,
  TOUCH_CURRENT_Y: 1,
  TOUCH_START_TIME: 2,
  TOUCH_END_TIME: 4,
  TOUCH_DURATION: 5,
  ANIMATION_DESTINATION_Y: 6,
  ANIMATION_DURATION: 7,
  ANIMATION_DESIRED_END_TIME: 8,
  ANIMATION_START_TIME: 9,
  HANDLER_LAST_Y: 10,
  HANDLER_CURRENT_Y: 11,
  MODEL_LENGTH: 12,
  NEEDS_MOMENTUM: 13
};


/**
 * @define {number} The deceleration for the table view momentum.
 */
TableView.DECELERATION = 0.001;


var _ = TableView.prototype;
var CP = TableView.Cache; // CacheProperties



_.setModel = function(model) {
  this.model = model;
  // if we are in the document reset everything with the new data.
  this.offset_ = 0;
  this.visualOffset_ = 0;
  this.momentumRaf_.stop();
  this.movementRaf_.stop();
  this.isAnimating_ = false;
  this.cache_[CP.NEEDS_MOMENTUM] = 0;
  this.cache_[CP.HANDLER_LAST_Y] = 0;
  this.cache_[CP.HANDLER_CURRENT_Y] = 0;
  this.ignoreEndEvents_ = true;
  var modellength = this.model.length;
  for (var i = 0, len = this.children.length; i < len; i++) {
    this.children[i].style.display = (i < modellength) ? 'block' : 'none';
  }
  this.updateContentForCount(this.children.length);
  this.applyStyles();
};

_.createRowCell = function() {
  var node = document.createElement('div');
  var span = document.createElement('span');
  node.appendChild(span);
  node.classList.add('nsviewcell');
  return node;
};

_.generateRows = function() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  var height = (w > h) ? w : h;
  var elscount = Math.ceil(height / this.childHeight_);
  for (var i = 0; i < elscount; i++) {
    var cell = this.createRowCell();
    this.children.push(cell);
    this.element.appendChild(cell);
  }
};


/** @inheritDoc */
_.enterDocument = function() {

  this.generateRows();

  this.element.addEventListener('touchstart', this.handleTouchStart.bind(this));
  this.element.addEventListener('touchmove', this.handleTouchMove.bind(this));
  this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));

  this.recalculateSizes();

  if (this.model != null) {
    this.updateContentForCount(this.children.length);
  }
  this.applyStyles();
};

_.recalculateSizes = function() {
  var clientRect = this.element.getBoundingClientRect();
  this.elementHeight_ = clientRect.bottom - clientRect.top;

  if (this.model == null) {
    return;
  }

  if (this.isBeyoundEdge()) {
    this.cache_[CP.TOUCH_DURATION] = 160;
    this.cache_[CP.NEEDS_MOMENTUM] = 1;
    this.movementRaf_.start();
  }
};

_.setChildHeight = function(height) {
  this.childHeight_ = height;
};



_.handleTouchStart = function(e) {
  console.log('aaas')
  if (e.target != this.element) {
    this.isAnimating_ = false;
    this.cache_[CP.NEEDS_MOMENTUM] = 0;
    this.momentumRaf_.stop();
    this.movementRaf_.stop();
    if (e.touches.length == 1) {
      e.stopPropagation();
      e.preventDefault();
      this.ignoreEndEvents_ = false;
      // we do not need to record the child element, assuming it will
      // fire the 'ACTION' event when really pressed (so it is a
      // good idea to subscribe it to touchable agent)
      this.cache_[CP.HANDLER_LAST_Y] = e.touches[0].clientY;
      this.cache_[CP.HANDLER_CURRENT_Y] = this.cache_[CP.HANDLER_LAST_Y];
      this.cache_[CP.TOUCH_START_TIME] = e.timeStamp;
      this.cache_[CP.TOUCH_START_Y] = this.cache_[CP.HANDLER_LAST_Y];
      this.movementRaf_.start();
    }
  }
};

_.hasAnimationPending = function() {
  return (!this.movementRaf_.isActive() && !this.momentumRaf_.isActive());
};

_.paintNotify = function() {
  //this.dispatchEvent(TableView.EventType.RASTERIZE_READY);
};

_.handleTouchMove = function(e) {
  console.log('sasa')
  if (this.ignoreEndEvents_) return;
  if (e.target != this.element) {
    e.stopPropagation();
    e.preventDefault();
    this.cache_[CP.HANDLER_CURRENT_Y] = e.touches[0].clientY;
    this.movementRaf_.start();
  }
};

_.getChildHeight = function() {
  return this.childHeight_;
};

_.getVisualOffset = function() {
  return this.visualOffset_;
};

_.handleTouchEnd = function(e) {
  if (this.ignoreEndEvents_) return;
  if (e.target != this.element) {
    var be = e;
    // Only if we are the last touch (i.e. released)
    if (be.touches.length == 0) {
      e.stopPropagation();
      this.cache_[CP.TOUCH_END_TIME] = be.timeStamp;
      this.cache_[CP.TOUCH_DURATION] = this.cache_[CP.TOUCH_END_TIME] -
          this.cache_[CP.TOUCH_START_TIME];

      this.cache_[CP.TOUCH_CURRENT_Y] = this.cache_[CP.HANDLER_CURRENT_Y];
      // If touch lasted for less than 300 ms and there was movement
      if (this.cache_[CP.TOUCH_DURATION] < 300 && Math.abs(
          this.getTouchDistance_()) > 10) {

        this.cache_[CP.NEEDS_MOMENTUM] = 1;
        this.movementRaf_.start();
      } else if (this.isBeyoundEdge()) {
        this.cache_[CP.TOUCH_DURATION] = 160;
        this.cache_[CP.NEEDS_MOMENTUM] = 1;
        this.movementRaf_.start();
      }
    }
  }
};

_.setMomentum = function() {
  // distance traveled from beginning of touch event
  var distance = this.getTouchDistance_();
  // The speed that the touch traveled that distance.
  var speed = Math.abs(distance) / this.cache_[CP.TOUCH_DURATION];

  this.cache_[CP.ANIMATION_DESTINATION_Y] =
      Math.round(this.cache_[CP.TOUCH_CURRENT_Y] + ((speed * speed) / (
      2 * TableView.DECELERATION) * (distance < 0 ? -1 : 1)));

  this.cache_[CP.ANIMATION_DURATION] =
      Math.abs(speed / TableView.DECELERATION);

  this.cache_[CP.ANIMATION_DESIRED_END_TIME] =
      this.cache_[CP.TOUCH_END_TIME] + this.cache_[CP.ANIMATION_DURATION];

  this.cache_[CP.ANIMATION_START_TIME] = this.cache_[CP.TOUCH_END_TIME];

  var isSmaller = this.model.length *
      this.childHeight_ < this.elementHeight_;

  // if we have scrolled down.
  if (distance > 0 || isSmaller) {

    // if the distance to travel is larger than allowed or the visible
    // items are less than the height of the view scroll to top.
    if (this.cache_[CP.ANIMATION_DESTINATION_Y] -
        this.cache_[CP.TOUCH_CURRENT_Y] > this.pixelsToTop() || isSmaller) {

      this.cache_[CP.ANIMATION_DESTINATION_Y] =
          this.cache_[CP.TOUCH_CURRENT_Y] + this.pixelsToTop();

      this.cache_[CP.ANIMATION_DURATION] =
          (Math.abs(this.pixelsToTop()) / speed) << 0;

      this.cache_[CP.ANIMATION_DESIRED_END_TIME] =
          this.cache_[CP.ANIMATION_START_TIME] +
          this.cache_[CP.ANIMATION_DURATION];
    }
  } else {
    if (this.cache_[CP.TOUCH_CURRENT_Y] -
        this.cache_[CP.ANIMATION_DESTINATION_Y] > this.pixelsToBottom()) {

      this.cache_[CP.ANIMATION_DESTINATION_Y] =
          this.cache_[CP.TOUCH_CURRENT_Y] - this.pixelsToBottom();

      this.cache_[CP.ANIMATION_DURATION] =
          (Math.abs(this.pixelsToBottom()) / speed) << 0;

      this.cache_[CP.ANIMATION_DESIRED_END_TIME] =
          this.cache_[CP.ANIMATION_START_TIME] +
          this.cache_[CP.ANIMATION_DURATION];
    }
  }
  this.isAnimating = true;
};

_.isBeyoundEdge = function() {
  var next_visual_offset =
      this.visualOffset_ + this.cache_[CP.HANDLER_CURRENT_Y] -
      this.cache_[CP.HANDLER_LAST_Y];

  if (this.offset_ == 0 && next_visual_offset > 0) {
    return true;
  }
  if ((((this.model.length - this.offset_) *
      this.childHeight_) - this.elementHeight_) * -1 > next_visual_offset) {

    return true;
  }
  return false;
};

_.handleMomentum = function(ts) {
  if (this.isAnimating_) {
    this.momentumRaf_.start();
    console.log(this.cache_[CP.ANIMATION_DESIRED_END_TIME], ts);
    if (ts >= this.cache_[CP.ANIMATION_DESIRED_END_TIME]) {
      this.isAnimating_ = false;
      this.cache_[CP.HANDLER_CURRENT_Y] =
          this.cache_[CP.ANIMATION_DESTINATION_Y];
      this.paintNotifyDelay_.start();

    } else {
      var nn = (ts - this.cache_[CP.ANIMATION_START_TIME]) /
          this.cache_[CP.ANIMATION_DURATION];

      var easing = (nn * (2 - nn));
      this.cache_[CP.HANDLER_CURRENT_Y] =
          ((this.cache_[CP.ANIMATION_DESTINATION_Y] -
          this.cache_[CP.TOUCH_CURRENT_Y]) * easing) +
          this.cache_[CP.TOUCH_CURRENT_Y];

    }
    this.handleMovement(ts);
  }
};

_.pixelsToTop = function() {
  return (this.offset_ * this.childHeight_) - this.visualOffset_;
};


_.pixelsToBottom = function() {
  return (((this.model.length - this.offset_) * this.childHeight_) +
      this.visualOffset_ - this.elementHeight_);
};

_.updateContentForCount = function(count) {
  if (count < 0) {
    // TOP to BOTTOM
    for (var i = (
        this.children.length + count); i < this.children.length; i++) {
      this.getChildByOffsetIndex(i).children[0].textContent = i + this.offset_;
    }
  } else if (count > 0) {
    // BOTTOM to TOP
    for (var i = 0; i < count; i++) {
      this.getChildByOffsetIndex(i).children[0].textContent = i + this.offset_
    }
  }
};


_.handleMovement = function(ts) {
  this.visualOffset_ =
      this.visualOffset_ + this.cache_[CP.HANDLER_CURRENT_Y] -
      this.cache_[CP.HANDLER_LAST_Y];

  this.cache_[CP.HANDLER_LAST_Y] = this.cache_[CP.HANDLER_CURRENT_Y];
  this.shiftItems();
  this.applyStyles();
  if (this.cache_[CP.NEEDS_MOMENTUM] == 1) {
    this.cache_[CP.NEEDS_MOMENTUM] = 0;
    this.isAnimating_ = true;
    this.setMomentum();
    this.momentumRaf_.start();
  } else {
    this.paintNotifyDelay_.start();
  }
};


_.shiftItems = function() {
  // at this point we assume that the visual offset is larger than items,
  // so we need to shift
  var to_trans = 0;
  if (this.visualOffset_ > 0) {
    // we need item(s) to go to from BOTTOM to TOP;
    // Make check if the element is 0 index!!!!
    if (this.offset_ > 0) {
      to_trans = ((this.visualOffset_ + this.childHeight_) /
          this.childHeight_) << 0;

      this.visualOffset_ = (this.visualOffset_ - (this.childHeight_ *
          to_trans)) % this.childHeight_;

      this.offset_ = this.offset_ + (to_trans * -1);
      this.updateContentForCount(to_trans);
    }
  } else if (this.visualOffset_ < (this.childHeight_ * -1)) {
    if (this.model.length > (this.offset_ + this.children.length)) {
      // we are way up, can transfer item(s) to the bottom
      // we need item(s) to go from TOP to BOTTOM
      // calculate how many items to transfer
      to_trans = (this.visualOffset_ / this.childHeight_) << 0; // < 0
      this.visualOffset_ = this.visualOffset_ % this.childHeight_;
      // now we have migrated els_to_transfer count to the bottom, update
      // them on the next tick.
      this.offset_ = this.offset_ + (to_trans * -1);
      this.updateContentForCount(to_trans);
    }
  }
};

_.getTouchDistance_ = function() {
  return this.cache_[CP.TOUCH_CURRENT_Y] - this.cache_[CP.TOUCH_START_Y];
};


_.getChildByOffsetIndex = function(index) {
  var idx = index + (this.offset_ % this.children.length);
  if (idx >= this.children.length) {
    idx = idx - this.children.length;
  }
  return this.children[idx];
};

_.applyStyles = function() {
  console.log('setting trans')
  for (var i = 0, len = this.children.length; i < len; i++) {
    css.setTranslation(this.getChildByOffsetIndex(i), 0,
        ((i * this.childHeight_) + this.visualOffset_));
  }
};

