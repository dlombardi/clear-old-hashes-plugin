var test = require('ava');
var webpack = require('webpack');
var fs = require('fs');

var ClearOldHashesPlugin = require('../index.js');
var options = require('./webpack.test.config.js');
var dirFiles = fs.readdirSync(options.output.path);

test.cb('Number of prior assets the same as output assets', t => {
  webpack(options, function(err, stats) {
    var outputAssets = stats.toJson().assets;
    if (dirFiles.length) {
      t.true(outputAssets.length === dirFiles.length);
    };
    t.end();
  });
});

test.cb('Only entry bundle updates', t => {
    var files = fs.readdirSync('./tmp', 'utf-8');
    var changeCount = 0;
    fs.writeFile('./test/dummy/entry.js', new Date().getTime(), 'utf-8', function (err) {
      if (err) throw err;
      webpack(options, function(err, stats) {
        var outputAssets = stats.toJson().assets;
        outputAssets.forEach(function(output){
          if(files.indexOf(output.name) > -1){
            changeCount++;
          };
        });
        if (dirFiles.length >= 1) {
          t.true(changeCount === (files.length - 1));
        };
        t.end();
      });
    });
});
