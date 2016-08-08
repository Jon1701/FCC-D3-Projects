// Use d3 library.
var d3 = require('d3');

////////////////////////////////////////////////////////////////////////////////
// Canvas and graph settings.
////////////////////////////////////////////////////////////////////////////////
canvas = {
  dimensions: {
    width: 1280,
    height: 600
  },
  padding: {
    horizontal: 100,
    vertical: 100
  }
}

graph = {
  dimensions: {
    width: canvas.dimensions.width - 2*canvas.padding.horizontal,
    height: canvas.dimensions.height - 2*canvas.padding.vertical
  },
  titles: {
    graph: 'Monthly Global Land-Surface Temperatures from 1753 to 2015',
    axis: {
      x: 'Years',
      y: 'Months'
    }
  },
  legend: {
    width: 35,
    height: 15
  }
}

// Translation function.
var translation = function(x, y, r) {
  return 'translate(' + x + ',' + y + ')' + 'rotate(' + r + ')';
}

var numToMonthMapping = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December'
}
////////////////////////////////////////////////////////////////////////////////
// Function used to build an array of integers which will map into an
// array of colours to be used for the legend
//
// domain: Two-dimensional array.
// scale: Scaling function which maps domain-values to colours.
//
// Returns an array of size 2.
// First array is an array of integers between domain[0] and domain[1].
// Second array is an array of colours from applying scale() to domain[i].
////////////////////////////////////////////////////////////////////////////////
var buildLegendDomainRange = function(domain, scale) {

  // Start and end points.
  var start = Math.floor(domain[0]);
  var end = Math.ceil(domain.slice(-1)[0]);

  // For each integers from start to end,
  // store the integer, and store its mapping from scale().
  var domainArray = [];
  var rangeArray = [];
  for (var i=start; i<=end; i++) {
    domainArray.push(i);
    rangeArray.push(scale(i));
  }

  return [domainArray, rangeArray];
}

////////////////////////////////////////////////////////////////////////////////
// Augments the given dataset to include the temperature.
//
// For each data point, create a temperature property under each monthly
// variance with value of base temperature + variance.
////////////////////////////////////////////////////////////////////////////////
function augmentData(dataset) {

  // Short hand variables.
  var baseTemperature = dataset['baseTemperature'];
  var monthlyVariance = dataset['monthlyVariance'];

  // Go through the monthly variance, add the variance to the base temperature.
  for (var i=0; i<monthlyVariance.length; i++) {

    // Calculate temperature to be base temperature + monthly variance.
    var temperature = baseTemperature + monthlyVariance[i]['variance'];

    // Store the temperature rounded to 2 decimal places.
    monthlyVariance[i]['temperature'] = Math.round(temperature * 100) / 100;
  }

  // Store updated monthly variance into dataset.
  dataset['monthlyVariance'] = monthlyVariance;

  // Return modified dataset.
  return dataset;
}

////////////////////////////////////////////////////////////////////////////////
// Callback to handle data retrieved from AJAX request
////////////////////////////////////////////////////////////////////////////////
var jsonSuccess = function(dataset) {

  // Augment dataset with temperatures.
  dataset = augmentData(dataset);

  // Shorthand variable for monthly variance.
  var monthlyVariance = dataset['monthlyVariance'];

  // Calculate temperature range (in integers).
  var temperatureRange = [
    d3.min(monthlyVariance, function(d) { return d['temperature']; }),
    d3.max(monthlyVariance, function(d) { return d['temperature']; })
  ];

  // Create canvas.
  var svg = d3.select('#canvas')
              .attr('width', canvas.dimensions.width)
              .attr('height', canvas.dimensions.height)

  var cells = svg.selectAll('rect')
                  .data(monthlyVariance)
                  .enter()
                  .append('rect');

  // Colour scale which maps temperatures to a colour ranging from orange to
  // dark red.
  var colourScale = d3.scaleLinear()
                      .domain(temperatureRange)
                      .range(['#FFA500', '#8B0000']);

  // Horizontal scale. Years to canvas width.
  var xScale = d3.scaleLinear()
                  .domain([
                    d3.min(monthlyVariance, function(d) { return d['year']; }),
                    d3.max(monthlyVariance, function(d) { return d['year']; })
                  ])
                  .range([0, graph.dimensions.width]);

  // Vertical scale. Months to canvas height.
  var yScale = d3.scaleLinear()
                  .domain([
                    d3.min(monthlyVariance, function(d) { return d['month']; }),
                    d3.max(monthlyVariance, function(d) { return d['month']; })
                  ])
                  .range([0, graph.dimensions.height]);

  // Horizontal axis.
  var xAxis = d3.axisTop(xScale)
                .tickFormat(d3.format('d'))
  svg.append('g')
      .attr('transform', translation(canvas.padding.horizontal, canvas.padding.vertical, 0))
      .call(xAxis);

  // Vertical axis.
  var yAxis = d3.axisLeft(yScale)
                .tickFormat(function(d) {

                  // Rename month numbers to name.
                  return numToMonthMapping[d];

                });
  svg.append('g')
      .attr('transform', translation(canvas.padding.horizontal, canvas.padding.vertical + 18, 0))
      .call(yAxis);

  // Horizontal axis label.
  var xAxisLabel = svg.append('text')
                      .attr('class', 'axis-title')
                      .attr('text-anchor', 'middle')
                      .attr('transform', translation(canvas.dimensions.width/2, canvas.padding.vertical/2 + 25 , 0))
                      .text(graph.titles.axis.x);

  // Vertical axis label.
  var yAxisLabel = svg.append('text')
                      .attr('class', 'axis-title')
                      .attr('text-anchor', 'middle')
                      .attr('transform', translation(canvas.padding.horizontal/2, canvas.dimensions.height/2 , -90))
                      .text(graph.titles.axis.y);

  // Graph title.
  var title = svg.append('text')
                  .attr('class', 'graph-title')
                  .attr('text-anchor', 'middle')
                  .attr('transform', translation(canvas.dimensions.width/2 , canvas.padding.vertical/2-15, 0))
                  .text(graph.titles.graph);


  // Create Heatmap cells.
  cells.attr('x', function(d, i) { return xScale(d['year']) + canvas.padding.horizontal })
        .attr('y', function(d, i) { return yScale(d['month']) + canvas.padding.vertical })
        .attr('width', graph.dimensions.width/(monthlyVariance.length/12))
        .attr('height', graph.dimensions.height/12 + 3 )
        .attr('fill', function(d) {

          return colourScale(d['temperature']);

        });

  // Legend container.
  // Get the temperatures and colours for use with the legend.
  var legendInfo = buildLegendDomainRange(temperatureRange, colourScale);

  // Temperatures and colours.
  var legendTemperatures = legendInfo[0];
  var legendColours = legendInfo[1];

  var legend = svg.selectAll('.legend')
                  .data(legendTemperatures)
                  .enter()
                  .append('g')
                  .attr('class', 'legend')
                  .attr('transform', function(d, i) {

                    var height = graph.legend.height;
                    var width = graph.legend.width;

                    var x = i*width + (canvas.dimensions.width) / 2 - 2.5*canvas.padding.horizontal;
                    var y = canvas.dimensions.height - canvas.padding.vertical + 55;

                    return translation(x,y,0)
                  });

  // Add colour rectangles to the legend.
  legend.append('rect')
        .attr('width', graph.legend.width)
        .attr('height', graph.legend.height)
        .style('fill', function(d) {
          return colourScale(d);
        });

  // Add text rectangles to the legend.
  legend.append('text')
        .attr('x', function(d,i) {

          var height = graph.legend.height;
          var width = graph.legend.width;

          return i-7
        })
        .attr('y', function(d,i) {
          return 30
        })
        .text(function(d, i) {
          if (i == 0 || i == 13) {
            return d + '°C';
          } else {
            return ''
          }

        });

//console.log()
}

////////////////////////////////////////////////////////////////////////////////
// Callback to handle AJAX request errors
////////////////////////////////////////////////////////////////////////////////
var jsonError = function(error) {
  console.log(error);
}

////////////////////////////////////////////////////////////////////////////////
// Load data
////////////////////////////////////////////////////////////////////////////////
d3.json('./datasets/global-temperature.json', function(error, result) {

  // Error checking.
  if (error) {

    // Error function.
    jsonError(error);

  } else {

    // If no error occurrs, run the jsonSuccess function.
    jsonSuccess(result);

  }

});
