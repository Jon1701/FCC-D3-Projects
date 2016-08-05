// Use d3 library.
var d3 = require('d3');

// Define canvas dimensions.
var canvasWidth = 500;
var canvasHeight = 300;

// Access the SVG Canvas and set attributes.
var svg = d3.select('#canvas')
            .attr('width', canvasWidth)
            .attr('height', canvasHeight);
