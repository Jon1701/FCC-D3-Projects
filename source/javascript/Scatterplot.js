////////////////////////////////////////////////////////////////////////////////
// Required libraries.
////////////////////////////////////////////////////////////////////////////////
var d3 = require('d3');


// Canvas properties.
var canvas = {
  width: 500,
  height: 500,
  padding: {
    leftShift: 5,
    vertical: 50,
    horizontal: 50
  }
}

// Graph properties.
var graph = {
  width: canvas.width - 2*canvas.padding.horizontal,
  height: canvas.height - 2*canvas.padding.vertical,
  point: {
    colour: {
      dopingYes: '#DC143C',
      dopingNo: '#333333'
    }
  }
}


// Translation function.
var translation = function(x, y, r) {
  return 'translate(' + x + ',' + y + ')' + 'rotate(' + r + ')';
}

////////////////////////////////////////////////////////////////////////////////
// Get the largest time in the dataset in seconds.
////////////////////////////////////////////////////////////////////////////////
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

////////////////////////////////////////////////////////////////////////////////
// Converts a string of the form mm:ss into seconds.
////////////////////////////////////////////////////////////////////////////////
function mmssToSeconds(timeStr) {

  // Split the mm:ss string into mm and ss
  var mmss = timeStr.split(':');

  // Convert mm and ss components to integers.
  mmss = mmss.map(function(val) {return parseInt(val)});

  // Return the total number of seconds.
  return mmss[0] * 60 + mmss[1];
}

////////////////////////////////////////////////////////////////////////////////
// Converts the number of seconds (in integers) into a string of the form mm:ss.
////////////////////////////////////////////////////////////////////////////////
function secondsToMmss(seconds) {

  // Calculate number of minutes.
  var minutesString = String(Math.floor(seconds/60));

  // Calculate number of seconds.
  var secondsString = String(seconds % 60);

  // Format number of seconds to be double digits if number of seconds is less
  // than 10.
  if (seconds % 60 < 10) {
    secondsString = '0' + String(seconds % 60);
  }

  // Return formatted string.
  return [minutesString, secondsString].join(':');
}

////////////////////////////////////////////////////////////////////////////////
// Modifies a copy of the dataset.
//
// Takes the Seconds and Time properties/values which are relative to 00:00 and
// augment the data with the same properties, but the values are to be relative
// to the fastest runner (smallest Seconds value).
////////////////////////////////////////////////////////////////////////////////
function augmentData(data) {

  // Get fastest time.
  var fastestTime = getFastestTime(data)

  // Go through the dataset.
  for (var i=0; i<data.length; i++) {

    // Augmented data will be stored in the 'diff' property.
    data[i]['diff'] = {}

    // Calculate seconds relative to fastest runner.
    data[i]['diff']['Seconds'] = data[i]['Seconds'] - fastestTime;

    // Convert seconds to MM:SS format.
    data[i]['diff']['Time'] = secondsToMmss(data[i]['diff']['Seconds']);
  }

  // Return the augmented data.
  return data;
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

  // Update data to include modified Time and Seconds values to be relative to
  // the fastest runner.
  data = augmentData(data);

  // Horizontal scale.
  var xScale = d3.scaleLinear()
                  .domain([
                    d3.max(data, function(d) { return d.diff.Seconds }),
                    d3.min(data, function(d) { return d.diff.Seconds })
                  ])
                  .range([0, graph.width]);

  // Vertical scale.
  var yScale = d3.scaleLinear()
                  .domain([
                    d3.min(data, function(d) { return d.Place }),
                    d3.max(data, function(d) { return d.Place })
                  ])
                  .range([0, graph.height]);

  // Horizontal axis.
  var xAxis = d3.axisBottom(xScale);
  svg.append('g')
      .attr('transform', translation(canvas.padding.horizontal + canvas.padding.leftShift, canvas.padding.vertical + graph.height, 0))
      .call(xAxis)

  // Vertical axis.
  var yAxis = d3.axisLeft(yScale);
  svg.append('g')
      .attr('transform', translation(canvas.padding.horizontal + canvas.padding.leftShift, canvas.padding.vertical, 0))
      .call(yAxis)

  // Paint data.
  var circles = svg.selectAll('circle')
                    .data(data)
                    .enter()
                    .append('circle')
                    .attr('cx', function(d) { return xScale(d.diff.Seconds) + canvas.padding.leftShift + canvas.padding.horizontal })
                    .attr('cy', function(d) { return yScale(d.Place) + canvas.padding.vertical })
                    .attr('r', 5)
                    .style('fill', function(d) {

                      // Set circle colour based on whether or not the athlete
                      // has a doping accusation.
                      if (d.Doping == '') {

                        // Doping accusation.
                        return graph.point.colour.dopingNo;

                      } else {

                        // No doping accusation.
                        return graph.point.colour.dopingYes;

                      }

                    });
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
