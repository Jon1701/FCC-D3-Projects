// Use d3 library. Version 3.5.1.
var d3 = require('./d3/v3.5.1/d3.js');

// Canvas and graph settings.
var canvas = {
  dim: {
    w: 800,
    h: 800
  },

  graph: {
    nodes: {
      width: 20,
      height: 15
    },
    links: {
      strokewidth: 0.75,
      colour: 'black'
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
// Callback to handle data retrieved from AJAX request
////////////////////////////////////////////////////////////////////////////////
var jsonSuccess = function(dataset) {

  // Access the canvas and modify dimensions.
  var svg = d3.select('#canvas')
              .attr('width', canvas.dim.w)  // Canvas width
              .attr('height', canvas.dim.h);// Canvas height

  // Initialize the force layout.
  var force = d3.layout.force()
                .nodes(dataset.nodes) // Nodes
                .links(dataset.links) // Edges
                .size([canvas.dim.w, canvas.dim.h]) // Maximum size
                .linkDistance([20])   // Distance of edges between nodes.
                .charge([-100])       // Force initial chart
                .start();

  // Create node links.
  var edges = svg.selectAll('line')      // Select all svg lines
                  .data(dataset.links)    // Bind svg lines to data
                  .enter()                // Iterate through link data
                  .append('line')         // Add svg lines
                  .attr('stroke', canvas.graph.links.colour)  // Stroke colour
                  .attr('stroke-width', canvas.graph.links.strokewidth); // Stroke size

  // Create nodes.
  var nodes = svg.selectAll('image')   // Select all svg images
                  .data(dataset.nodes) // Bind to data
                  .enter()             // Iterate through node data
                  .append('svg:image') // Add svg image.
                  .attr('width', canvas.graph.nodes.width)   // Image width
                  .attr('height', canvas.graph.nodes.height) // Image height
                  .attr('xlink:href', function(d) { return './media/images/flags/' + d.code + '.png'; })  // Image source
                  .call(force.drag);

  // Node tooltips.
  nodes.append('svg:title').text(function(d) { return d.country});

  force.on('tick', function() {

    // Set edge position.
    edges.attr('x1', function(d) { return d.source.x; })
          .attr('y1', function(d) { return d.source.y; })
          .attr('x2', function(d) { return d.target.x; })
          .attr('y2', function(d) { return d.target.y; });

    // Set node position.
    nodes.attr('x', function(d) { return d.x-(canvas.graph.nodes.width/2); })
          .attr('y', function(d) { return d.y-(canvas.graph.nodes.height/2); });

  });

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
