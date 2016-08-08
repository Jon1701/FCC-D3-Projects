// Use d3 library.
var d3 = require('d3');

canvas = {
  dimensions: {
    width: 1920,
    height: 500
  },
  padding: {
    horizontal: 50,
    vertical: 50
  }
}

graph = {
  dimensions: {
    width: canvas.dimensions.width - 2*canvas.padding.horizontal,
    height: canvas.dimensions.height - 2*canvas.padding.vertical
  }
}


// Callback to handle data retrieved from AJAX request.
var jsonSuccess = function(dataset) {

  // Monthly variance
  var monthlyVariance = dataset['monthlyVariance'];

  // Create canvas.
  var svg = d3.select('#canvas')
              .attr('width', canvas.dimensions.width)
              .attr('height', canvas.dimensions.height)

  var cells = svg.selectAll('rect')
                  .data(monthlyVariance)
                  .enter()
                  .append('rect');

  // Horizontal scale. Years to canvas width.
  var xScale = d3.scaleTime()
                  .domain([
                    d3.min(monthlyVariance, function(d) { return d['year']; }),
                    d3.max(monthlyVariance, function(d) { return d['year']; })
                  ])
                  .range([0, graph.dimensions.width]);

  // Vertical scale. Months to canvas height.
  var yScale = d3.scaleTime()
                  .domain([
                    d3.min(monthlyVariance, function(d) { return d['month']; }),
                    d3.max(monthlyVariance, function(d) { return d['month']; })
                  ])
                  .range([0, graph.dimensions.height]);

  cells.attr('x', function(d, i) { return xScale(d['year']) })
        .attr('y', function(d, i) { return yScale(d['month']) })
        .attr('width', graph.dimensions.width/(monthlyVariance.length/12))
        .attr('height', graph.dimensions.height/12)
        .attr('fill', function() {

          // Randomly generate colours.
          var r = Math.floor(Math.random()*255);
          var g = Math.floor(Math.random()*255);
          var b = Math.floor(Math.random()*255);
          var a = Math.random();
          return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';

        });


}


// Callback to handle AJAX request errors.
var jsonError = function(error) {
  console.log(error);
}


// Load data.
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
