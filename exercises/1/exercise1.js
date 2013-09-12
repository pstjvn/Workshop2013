(function() {
  var opt = options;
  console.log(options, opt);
  var ranges = document.querySelectorAll('input[type=range]');
  var timeline = new Timeline(
    document.getElementById('timeline'),
    ranges.item(0),
    ranges.item(1),
    //86400,
    60*60,
    opt);
})()
