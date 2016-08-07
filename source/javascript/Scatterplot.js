// Required libraries.
var d3 = require('d3');

// Canvas properties.
var canvas = {
  width: 500,
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

console.log(svg)

// Callback to handle AJAX request errors.
var jsonError = function(error) {
  console.log(error);
}

// Callback to handle data retrieved from AJAX request.
var jsonSuccess = function(data) {
  console.log(data);
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
