var options = {
  width: 600,
  height: 50,
  maxScaleFactor: 100,
  scaleBackgroundColor: '#000000',
  scaleColor: '#ccc',
  scaleHeight: 50,
  textColor: '#ffffff'
};

function Timeline(timeline, scale, scroll, duration, options) {
  this.scale = scale;
  this.scroll = scroll;
  this.timeline = timeline;
  this.duration = duration;
  this.time = 0;
  this.initialRatio = 0;
  this.options = options;
  this.initGUI();
  this.addEventListeners();

}

Timeline.prototype = {

  initGUI: function() {
    this.timeline.style.width = this.options.width + 'px';
    this.timeline.style.height = this.options.height + 'px';
    this.canvas = document.createElement('canvas');
    this.c = this.canvas.getContext('2d');
    this.timeline.appendChild(this.canvas);
    this.canvas.width = this.options.width;
    this.canvas.height = this.options.height;
    this.scale.setAttribute('max', this.options.maxScaleFactor);
    this.initialRatio = this.options.width / this.duration;
    this.updateGUI();
  },

  updateGUI: function () {

    var lastTimeLabelX = 0;

    // timeline
    this.drawRect(0, 0, this.options.width, this.options.scaleHeight, this.options.scaleBackgroundColor)
    var x = this.timeToX(0);
    this.c.fillStyle = this.options.textColor;
    var sec = 0;
    while (x < this.canvas.width && sec < this.duration) {
      x = this.timeToX(sec);
      var anchor_height = 5
      var anchor_end = this.options.scaleHeight
      if (sec % 10 == 0) anchor_height = 10;
      if (sec % 30 == 0) {
        anchor_height = 15;
        anchor_end = this.options.height
      };
      if (sec % 60 == 0) {
        anchor_height = 20;
        anchor_end = this.options.height
      };
      this.drawLine(x, this.options.scaleHeight - anchor_height, x, anchor_end, this.options.scaleColor);
      var hours = parseInt(sec / 3600) % 24;
      var minutes = parseInt(sec / 60) % 60;
      var seconds = sec % 60;
      time = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
      if (x - lastTimeLabelX > 50) {
        this.c.fillText(time, x - 20, 10);
        lastTimeLabelX = x;
      }
      sec += 1;
    }
  },

  addEventListeners: function() {
    this.scale.addEventListener('change', this.onScaleUpdate.bind(this));
    this.scroll.addEventListener('change', this.onScrollUpdate.bind(this));
  },

  onScaleUpdate: function(e){
    this.scroll.setAttribute('max', Math.max(
        0, this.duration - this.getWindowVisibleTime()));
    this.updateGUI();
  },

  onScrollUpdate: function(e) {
    this.updateGUI();
  },

  timeToX: function (time) {
    var visibleTime = this.getWindowVisibleTime();
    if (visibleTime < this.duration) {
      time = time - this.scroll.value;
    }
    return time * this.scale.value * this.initialRatio;
  },

  xToTime: function (x) {
    var visibleTime = this.getWindowVisibleTime()
    var timeShift = Math.max(0, this.scroll.value);
    return x / (this.scale.value * this.initialRatio) + timeShift;
  },

  getWindowVisibleTime: function() {
    return this.duration / this.scale.value;
  },

  drawLine: function(x1, y1, x2, y2, color) {
    this.c.strokeStyle = color;
    this.c.lineWidth = 1
    this.c.beginPath();
    this.c.moveTo(x1, y1);
    this.c.lineTo(x2, y2);
    this.c.stroke();
  },

  drawRect: function(x, y, w, h, color, label, highlight) {
    this.c.fillStyle = color;
    this.c.strokeStyle = '#FF0';
    this.c.lineWidth = 3
    this.c.fillRect(x, y, w, h);
  }

};
