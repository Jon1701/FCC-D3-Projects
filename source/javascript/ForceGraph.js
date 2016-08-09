// Use d3 library. Version 3.5.1.
var d3 = require('./d3/v3.5.1/d3.js');

// Canvas and graph settings.
var canvas = {
  dim: {
    w: 500,
    h: 500
  },

  graph: {
    nodes: {
      r: 5,
      colour: 'orange'
    },
    links: {
      strokewidth: 1,
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
                .linkDistance([10])    // Distance of edges between nodes.
                .charge([-100])
                .start();

  // Create node links.
  var edges = svg.selectAll('line')      // Select all svg lines
                  .data(dataset.links)    // Bind svg lines to data
                  .enter()                // Iterate through link data
                  .append('line')         // Add svg lines
                  .attr('stroke-width', canvas.graph.links.strokewidth) // Stroke size
                  .attr('stroke', canvas.graph.links.colour);


  // Create nodes.
  var nodes = svg.selectAll('circle')    // Select all svg circles
                  .data(dataset.nodes)    // Bind svg circles to data
                  .enter()                // Iterate through node data
                  .append('circle')       // Add svg circle.
                  .attr('r', canvas.graph.nodes.r) // Circle radius
                  .attr('fill', canvas.graph.nodes.colour) // Circle bg colour.
                  .call(force.drag);

  force.on('tick', function() {

    edges.attr('x1', function(d) { return d.source.x; })
          .attr('y1', function(d) { return d.source.y; })
          .attr('x2', function(d) { return d.target.x; })
          .attr('y2', function(d) { return d.target.y; });

    nodes.attr('cx', function(d) { return d.x; })
          .attr('cy', function(d) { return d.y; });
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
