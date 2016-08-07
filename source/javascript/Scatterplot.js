////////////////////////////////////////////////////////////////////////////////
// Required libraries.
////////////////////////////////////////////////////////////////////////////////
var d3 = require('d3');

// Translation function.
var translation = function(x, y, r) {
  return 'translate(' + x + ',' + y + ')' + 'rotate(' + r + ')';
}

// Canvas properties.
var canvas = {
  width: 750,
  height: 500,
  padding: {
    leftShift: 5,
    vertical: 80,
    horizontal: 80
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
  },
  titles: {
    graph: 'Doping in Professional Bicycle Racing',
    axis: {
      x: 'Minutes Behind Fastest Time (MM:SS)',
      y: 'Athlete Rank'
    }
  },
  legend: {
    dimensions: {
      width: 25,
      height: 25
    },
    position: {
      x: canvas.width - canvas.padding.horizontal,
      y: canvas.height - canvas.padding.vertical
    }

  }
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

  // Horizontal axis label.
  var xAxisLabel = svg.append('text')
                      .attr('class', 'axis-title')
                      .attr('text-anchor', 'middle')
                      .attr('transform', translation(canvas.width/2 + canvas.padding.leftShift, canvas.height - canvas.padding.vertical/2 + 15 , 0))
                      .text(graph.titles.axis.x);

  // Vertical axis label.
  var yAxisLabel = svg.append('text')
                      .attr('class', 'axis-title')
                      .attr('text-anchor', 'middle')
                      .attr('transform', translation(canvas.padding.horizontal/2, canvas.height/2, -90))
                      .text(graph.titles.axis.y);

  // Graph title.
  var title = svg.append('text')
                  .attr('class', 'graph-title')
                  .attr('text-anchor', 'middle')
                  .attr('transform', translation(canvas.width/2 + canvas.padding.leftShift, canvas.padding.vertical/2, 0))
                  .text(graph.titles.graph);

  // Legend container.
  var legend = svg.selectAll('.legend')
                  .data(['dopingYes','dopingNo'])
                  .enter()
                  .append('g')
                  .attr('class', 'legend')
                  .attr('transform', function(d, i) {
                    var padding = 5;
                    var height = graph.legend.dimensions.height + padding;
                    var width = graph.legend.dimensions.width + padding;

                    var x = graph.legend.position.x - width*6 - 3;
                    var y = graph.legend.position.y + (height * i) - (height*2);
                    return translation(x, y, 0);
                  })

  // Add legend keys.
  legend.append('rect')
        .attr('width', graph.legend.dimensions.width)
        .attr('height', graph.legend.dimensions.height)
        .style('fill', function(d) {
          if (d == 'dopingYes') {
            return graph.point.colour.dopingYes;
          } else {
            return graph.point.colour.dopingNo;
          }
        });

  // Add legend text.
  legend.append('text')
        .attr('x', graph.legend.dimensions.width + 5)
        .attr('y', graph.legend.dimensions.height - 7)
        .text(function(d) {
          if (d == 'dopingYes') {
            return 'Accused of doping'
          } else {
            return 'Not accused of doping'
          }
        });

  // Paint data.
  var circles = svg.selectAll('circle')
                    .data(data)
                    .enter()
                    .append('circle')
                    .attr('class', 'graph-circle')
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
