# FCC-D3-Projects

This project utilizes [D3.js](https://d3js.org/) to display a:
- Bar Chart
- Force Graph
- Geomap
- Heatmap
- Scatterplot

to fulfill the requirements of the `Data Visualization Projects` on [FreeCodeCamp](https://freecodecamp.org).

## Project Status

- Unmaintained
  - Codebase outdated, cannot build

## Prerequisites

1. Node.js v10.15.0 LTS

## Structure

```
|
├── build/                    # Compiled application
|
├── node_modules/             # Node dependencies
|
├── source/                   # Source files
|   |
|   ├── datasets/             # React dependency
|   ├── javascript/           # JavaScript files
|   ├── media/                # Image assets
|   ├── stylesheets/          # Stylesheets
|   |
|   ├── barchart.html         # Page containing the Bar Chart
|   ├── forcegraph.html       # Page containing the Force Graph
|   ├── geomap.html           # Page containing the Geomap graph
|   ├── heatmap.html          # Page containing the Heatmap graph
|   ├── index.html            # Homepage
|   └── scatterplot.html      # Page containing the Scatter Plot
|
├── .gitignore                # Ignores files and folders from git
├── gulpfile.js               # Tasks to build JavaScript, stylesheets, and start the webserver
├── package-lock.json         # Locks Node.js peer dependency versions
├── package.json              # Project metadata
└── README.md                 # Project documentation

```

## Commands

1. Install all Node dependencies using:
```
npm install
```

Available `gulp` targets:
- `gulp webserver` to start the web server
- `gulp watch` to watch files for changes
- `gulp data` to copy datasets to the build folder
- `gulp media` to copy images to the build folder
- `gulp stylesheets` to process stylesheets and copy to build folder
- `gulp html` to copy HTML files to the build folder
- `gulp webpack` to compile JavaScript and copy to build folder.

`gulp` is not installed globally. You must use `./node_modules/.bin/gulp`.