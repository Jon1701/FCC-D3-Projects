// Use d3 library.
var d3 = require('d3');

// Canvas and graph settings.
var canvas = {
  dim: {
    w: 700,
    h: 700
  },

  graph: {
  }
}

////////////////////////////////////////////////////////////////////////////////
// Callback to handle data retrieved from AJAX request
////////////////////////////////////////////////////////////////////////////////
var jsonSuccess = function(dataset) {

  // SVG canvas.
  var svg = d3.select('#canvas')
              .attr('width', canvas.dim.w)  // Canvas width
              .attr('height', canvas.dim.h);// Canvas height

  // Mercator projection.
  var projMercator = d3.geoMercator()
                    .translate([canvas.dim.w/2, canvas.dim.h/2])
                    .scale([110])

  // Geopath generator.
  var path = d3.geoPath()
                .projection(projMercator)

  // Map Group
  var map = svg.append('g')

  // Meteorite Group.
  var meteorite = svg.append('g')


  // Paint meteorite impacts on map
  meteorite.selectAll('path')
            .data(dataset.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', 'orange')

  // Load world map.
  d3.json('./datasets/countries.geo.json', function(error, result) {

    // Add map to the svg canvas.
    map.selectAll('path')
        .data(result.features)
        .enter()
        .append('path')
        .attr('d', path);

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
