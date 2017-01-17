var test = require('ava');
var webpack = require('webpack');
var fs = require('fs');

var options = require('./webpack.test.config.js');
var dirFiles = fs.readdirSync(options.output.path);

test.cb('Number of prior assets the same as output assets', t => {
  webpack(options, function(err, stats) {
    var outputAssets = stats.toJson().assets;
    t.true(outputAssets.length === dirFiles.length);
    t.end();
  });
});
//
// test.cb('Only one bundle updates', t => {
//   webpack(options, function(err, stats) {
//     var outputAssets = stats.toJson().assets;
//     dirFiles.length === 1
//     dirFiles.forEach(function(dirFile){
//
//     })
//     t.true(outputAssets.length === dirFiles.length);
//     t.end();
//   });
// });
//
// test.cb('Both bundles update', t => {
//   webpack(options, function(err, stats) {
//     var outputAssets = stats.toJson().assets;
//     t.true(outputAssets.length === dirFiles.length);
//     t.end();
//   });
// });
