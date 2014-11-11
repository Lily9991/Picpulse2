/**
 * This module loads dynamically all routes modules located in the routes/
 * directory.
 */
'use strict';
var fs = require('fs');
var path = require('path');

module.exports = function (app) {
  fs.readdirSync('./routes').forEach(function (file) {
    if (path.extname(file) === '.js') {
    	// Avoid to read this current file.
        if (file === path.basename(__filename)) { return; }
        // Load the route file.
        require('./' + file)(app);
    }
    else return;
  });
};