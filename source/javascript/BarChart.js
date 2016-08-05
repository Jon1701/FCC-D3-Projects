// Use d3 library.
var d3 = require('d3');

// Define canvas dimensions.
var canvasWidth = 1000;
var canvasHeight = 500;

// Access the SVG Canvas and set attributes.
var svg = d3.select('#canvas')
            .attr('width', canvasWidth)
            .attr('height', canvasHeight);


// Error callback function for d3.json.
var jsonError = function(error) {
  console.log(error);
}

// Success callback function for d3.json.
var jsonSuccess = function(data) {

  // Access datapoints only.
  var dataset = data['data'];

  // Create bars.
  var bars = svg.selectAll('rect')
                .data(dataset)
                .enter()
                .append('rect');

  // Individual bar width.
  var barWidth = canvasWidth / dataset.length;

  // Scales the independent variable's values to the canvas width.
  var xScale = d3.scaleLinear()
                  .domain([0, dataset.length])
                  .range([0, canvasWidth]);

  // Scales the dependent variable's values to the canvas height.
  var yScale = d3.scaleLinear()
                  .domain([0, d3.max(dataset, function(d) {return d[1]})])
                  .range([0, canvasHeight]);

  // Set individual bar dimensions.
  bars.attr('x', function(d, i) {return xScale(i)})
      .attr('y', function(d, i) {return canvasHeight - yScale(d[1])})
      .attr('width', function(d, i) {return barWidth - 0.5})
      .attr('height', function(d, i) {return yScale(d[1])})
}

// Get GDP data.
d3.json('./datasets/GDP-data.json', function(error, result) {

  // Error checking.
  if (error) {

    // If an error was caught, delegate to jsonError callback function.
    jsonError(error);

  } else {

    // If no error was caught, delegate to jsonSuccess callback function.
    jsonSuccess(result);

  }

});
