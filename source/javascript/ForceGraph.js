// Use d3 library.
var d3 = require('d3');

// Canvas and graph settings.
var canvas = {
  dim: {
    w: 500,
    h: 500
  },
  colours: {
    bg: 'rgba(0,0,0,0.25)'
  },
  graph: {
    nodes: {
      r: 5
    },
    links: {
      strokewidth: 1
    }
  }
}

var ticked = function() {

  links.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });

  nodes.attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; });

}

////////////////////////////////////////////////////////////////////////////////
// Callback to handle data retrieved from AJAX request
////////////////////////////////////////////////////////////////////////////////
var jsonSuccess = function(dataset) {

  /*
  .force('x', d3.forceX(canvas.dim.w/2))
  .force('y', d3.forceY(canvas.dim.h/2))
  .on('tick', ticked);
  */

  // Access the canvas and modify dimensions.
  var svg = d3.select('#canvas')
              .attr('width', canvas.dim.w)  // Canvas width
              .attr('height', canvas.dim.h);// Canvas height

  // Initialize the force layout.
  var simulation = d3.forceSimulation()
                      .force('link', d3.forceLink().id(function(d) { return d.code; })) // Link to node id: code.
                      .force("charge", d3.forceManyBody())
                      .force("center", d3.forceCenter(canvas.dim.w / 2, canvas.dim.h / 2));

  // Create node links.
  var links = svg.append('g')             // Container
                  .attr('class', 'links') // Add class
                  .selectAll('line')      // Select all svg lines
                  .data(dataset.links)    // Bind svg lines to data
                  .enter()                // Iterate through link data
                  .append('line')         // Add svg lines
                  .attr('stroke-width', canvas.graph.links.strokewidth) // Stroke size

  // Create nodes.
  var nodes = svg.append('g')             // Container
                  .attr('class', 'nodes') // Add class
                  .selectAll('circle')    // Select all svg circles
                  .data(dataset.nodes)    // Bind svg circles to data
                  .enter()                // Iterate through node data
                  .append('circle')       // Add svg circle.
                  .attr('r', canvas.graph.nodes.r) // Circle radius
                  .attr('fill', 'orange') // Circle bg colour.

  // Add nodes.
  simulation.nodes(dataset.nodes)
            .on('tick', ticked);

  // Add links.
  simulation.force('link')
            .links(dataset.links);

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
d3.json('./datasets/countries.json', function(error, result) {

  // Error checking.
  if (error) {

    // Error function.
    jsonError(error);

  } else {

    // If no error occurrs, run the jsonSuccess function.
    jsonSuccess(result);

  }

});
