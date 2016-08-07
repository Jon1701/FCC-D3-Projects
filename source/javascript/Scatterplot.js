// Required libraries.
var d3 = require('d3');

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
