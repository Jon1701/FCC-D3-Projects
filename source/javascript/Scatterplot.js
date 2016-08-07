// Required libraries.
var d3 = require('d3');

// Get the largest time in the dataset in seconds.
function getFastestTime(data) {

  // All seconds in the dataset.
  var allSeconds = [];

  // Go through the entire dataset.
  for (var i=0; i<data.length; i++) {

    // Get the time and convert to seconds.
    var seconds = data[i]['Seconds'];

    // Store the seconds.
    allSeconds.push(seconds);
  }

  // Sort allSeconds from smallest to largest.
  allSeconds.sort(function(a,b) {return a-b});

  // Return smallest time.
  return allSeconds[0];
}

// Converts a string of the form mm:ss into seconds.
function mmssToSeconds(timeStr) {

  // Split the mm:ss string into mm and ss
  var mmss = timeStr.split(':');

  // Convert mm and ss components to integers.
  mmss = mmss.map(function(val) {return parseInt(val)});

  // Return the total number of seconds.
  return mmss[0] * 60 + mmss[1];
}

function secondsToMmss(seconds) {

  var minutesString = String(Math.floor(seconds/60));
  var secondsString = '';

  if (seconds % 60 < 10) {
    secondsString = '0' + String(seconds % 60);
  } else {
    secondsString = String(seconds % 60);
  }

  return [minutesString, secondsString].join(':');

}

function augmentData(data) {

  // Get fastest time.
  var fastestTime = getFastestTime(data)

  // Go through the dataset.
  for (var i=0; i<data.length; i++) {

    data[i]['diff'] = {}
    data[i]['diff']['Seconds'] = data[i]['Seconds'] - fastestTime;
    data[i]['diff']['Time'] = secondsToMmss(data[i]['diff']['Seconds']);

  }

  return data;
}
/*
function secondsDifference(maxSeconds, timeStr) {
  return maxSeconds - mmssToSeconds(timeStr);
}

function secondsToMmss(time) {

  var minutes = Math.floor(time/60);
  var seconds = time - minutes * 60;

  var strMinutes = String(minutes);
  var strSeconds = 0

    if (seconds < 10) {
      strSeconds = '0' + String(seconds);
    } else {
      strSeconds = String(seconds)
    }

  return [strMinutes, strSeconds].join(':')
}
*/
// Canvas properties.
var canvas = {
  width: 2000,
  height: 500,
  padding: {
    vertical: 20,
    horizontal: 20
  }
}

// Graph properties.
var graph = {
  width: canvas.width - 2*canvas.padding.horizontal,
  height: canvas.height - 2*canvas.padding.vertical
}

// Canvas.
var svg = d3.select('#canvas')
            .attr('width', canvas.width)
            .attr('height', canvas.height);

// Callback to handle AJAX request errors.
var jsonError = function(error) {
  console.log(error);
}

// Callback to handle data retrieved from AJAX request.
var jsonSuccess = function(data) {

  data = augmentData(data)
  console.log(data);

  // Horizontal scale.
  var xScale = d3.scaleTime();

  // Paint data.
  var circles = svg.selectAll('circle')
                    .data(data)
                    .enter()
                    .append('circle')
                    .attr('cx', function(d) {


                      return 1;
                    })
                    .attr('cy', function(d) {return d.place})
                    .attr('r', 50);




  // Go through the data.
  /*
  for(var i=0; i<data.length; i++) {
    var time = data[i]['Time'];

    console.log(time)
  }*/

}

// Load Cyclist Data.
d3.json('./datasets/cyclist-data.json', function(error, result) {

  // Error checking.
  if (error) {

    // Error function.
    jsonError(error);

  } else {

    // If no error occurrs, run the jsonSuccess function.
    jsonSuccess(result);

  }

});
