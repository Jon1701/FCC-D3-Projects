// Use d3 library.
var d3 = require('d3');

// Define canvas dimensions.
var canvasWidth = 1280;
var canvasHeight = 700;

// Set canvas padding.
var padding = 60;
var leftShift = 1.5;
var graphWidth = canvasWidth - 2*padding;
var graphHeight = canvasHeight - 2*padding;

// Access the SVG Canvas and set attributes.
var svg = d3.select('#canvas')
            .attr('width', canvasWidth)
            .attr('height', canvasHeight);

// Translation function.
var translation = function(x,y) {
  return 'translate(' + x + ',' + y + ')';
}

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

  // Creates a Time Scale for the x-axis.
  //
  // Input domain is from the first date in the dataset to the last date.
  // Output range is from 0 to graphWidth.
  var startDate = dataset[0][0]; // Start date.
  var endDate = dataset[dataset.length-1][0]; // End date.
  var xScale = d3.scaleTime()
                  .domain([new Date(startDate), new Date(endDate)])
                  .range([0, graphWidth]);

  // Creates a Linear Scale for the y-axis.
  //
  // Input domain is from the smallest GDP in the dataset to the largest GDP.
  // Output range is from graphHeight to 0.
  var yScale = d3.scaleLinear()
                  .domain([0, d3.max(dataset, function(d) {return d[1]})])
                  .range([graphHeight, 0]);

  // Horizontal axis.
  var xAxis = d3.axisBottom(xScale)
  svg.append('g')
      .attr('transform', translation(padding*leftShift, graphHeight + padding))
      .call(xAxis);

  // Vertical axis.
  var yAxis = d3.axisLeft(yScale);
  svg.append('g')
      .attr('transform', translation(padding*leftShift, padding))
      .call(yAxis);

  // Horizontal axis title.
  var xAxisLabel = svg.append('text')
                      .attr('class', 'axis-title')
                      .attr('text-anchor', 'middle')
                      .attr('transform', function() {
                        var x = padding/2;
                        var y = canvasHeight/2;
                        var r = -90;
                        return 'translate(' + x + ',' + y + ')rotate(' + r + ')';
                      })
                      .text('US Gross Domestic Product');

  // Vertical axis title.
  var yAxisLabel = svg.append('text')
                      .attr('class', 'axis-title')
                      .attr('text-anchor', 'middle')
                      .attr('x', canvasWidth/2)
                      .attr('y', canvasHeight - padding/2 + 15)
                      .text('Year');

  // Graph title.
  var graphTitle = svg.append('text')
                      .attr('class', 'graph-title')
                      .attr('text-anchor', 'middle')
                      .attr('x', canvasWidth/2)
                      .attr('y', padding/2)
                      .text('Gross Domestic Product');

  // Set individual bar dimensions.
  bars.attr('x', function(d, i) {return xScale(new Date(d[0])) + padding*leftShift})
      .attr('y', function(d, i) {return yScale(d[1]) + padding})
      .attr('class', 'graph-bar')
      .attr('width', function(d, i) {return barWidth - 0.5})
      .attr('height', function(d, i) {return graphHeight - yScale(d[1])})
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
