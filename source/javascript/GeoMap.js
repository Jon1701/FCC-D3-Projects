// Use d3 library.
var d3 = require('d3');

// Canvas and graph settings.
var canvas = {
  dim: {
    w: 2000,
    h: 1000
  },

  graph: {
    colours: {
      map: '#333333',
      impact: {
        default: '#DC143C'
      }
    }
  }
}

// Function to get the impact mass minimum and maximum values.
var getImapactMinMax = function(d) {

  // Impact mass array.
  var impactMass = [];

  // Store the impact mass.
  for (var i=0; i<d.length; i++) {

    // Impact mass.
    var value = d[i].properties.mass;

    // Store the impact mass if non-null.
    if (value) {
      impactMass.push(value)
    }

  }

  // Sort the data.
  impactMass.sort(function(a,b) {
    return a - b;
  })

  // Return impact mass.
  return {
    'min': impactMass[0],
    'max': impactMass.slice(-1)[0]
  }

}

////////////////////////////////////////////////////////////////////////////////
// Callback to handle data retrieved from AJAX request
////////////////////////////////////////////////////////////////////////////////
var jsonSuccess = function(dataset) {

  // Get meteorite impact mass minimum and maximum values.
  var impactMinMax = getImapactMinMax(dataset.features);

  // Create a linear scale to map meteorite impact mass to canvas dimensions.
  var meteoriteScale = d3.scaleLinear()
                          .domain([impactMinMax['min'], impactMinMax['max']])
                          .range([4, 50]);

  // SVG canvas.
  var svg = d3.select('#canvas')
              .attr('width', canvas.dim.w)  // Canvas width
              .attr('height', canvas.dim.h);// Canvas height

  // Mercator projection.
  var projMercator = d3.geoMercator()
                    .translate([canvas.dim.w/2, canvas.dim.h/2])
                    .scale([315]);

  // Geopath generator.
  var path = d3.geoPath()
                .projection(projMercator)
                .pointRadius(function(d) {

                  // Recorded impact mass.
                  var impactMass = d.properties.mass;

                  // If the impact mass is null, return 2.
                  if (!impactMass) {
                    return 2;
                  }

                  return meteoriteScale(impactMass)
                });

  // Tooltip.
  var tooltip = d3.select('body')
                  .append('div')
                  .attr('class', 'tooltip')

  // Map Group
  var map = svg.append('g');

  // Meteorite Group.
  var meteorite = svg.append('g');

  // Paint meteorite impacts on map
  meteorite.selectAll('path')
            .data(dataset.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', canvas.graph.colours.impact.default)
            .attr('opacity', 0.75)
            .on('mouseover', function(d) {

              // Fields.
              var mass = d.properties.mass;
              var name = d.properties.name;
              var year = new Date(d.properties.year).getFullYear();
              var classification = function() {
                if (d.properties.recclass) {
                  return d.properties.recclass;
                } else {
                  return 'Unknown';
                }
              }();


              // Tooltip html
              var htmlStr = '';
                  htmlStr += '<div>' + 'Place of Impact: ' + '<strong>' + name + '</strong>' + '</div>';
                  htmlStr += '<div>' + 'Year: ' + '<strong>' + year + '</strong>' + '</div>';
                  htmlStr += '<div>' + 'Classification: ' + '<strong>' + classification + '</strong>' + '</div>';
                  htmlStr += '<div>' + 'Impact Mass: ' + '<strong>' + mass + '</strong>' + '</div>';


              // Set tooltip HTML.
              tooltip.html(htmlStr);

              // Set tooltip style.
              tooltip.style('visibility', 'visible')
                      .style('top', (d3.event.pageY) - 75 + 'px')
                      .style('left', (d3.event.pageX) + 'px')


            })
            .on('mouseout', function(d) {

              // Hide tooltip.
              tooltip.style('visibility', 'hidden');

            });

  // Load world map.
  d3.json('./datasets/countries.geo.json', function(error, result) {

    // Add map to the svg canvas.
    map.selectAll('path')
        .data(result.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', canvas.graph.colours.map);

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
