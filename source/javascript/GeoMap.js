// Use d3 library.
var d3 = require('d3');

// Canvas and graph settings.
var canvas = {
  dim: {
    w: 500,
    h: 500
  },

  graph: {
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
d3.json('./datasets/meteorite-strike-data.json', function(error, result) {

  // Error checking.
  if (error) {

    // Error function.
    jsonError(error);

  } else {

    // If no error occurrs, run the jsonSuccess function.
    jsonSuccess(result);

  }

});
