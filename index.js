'use strict';

var path = require('path');
var del = require('del');
var fs = require('fs');

function ClearOldHashesPlugin(options) {
  //backwards compatibility
    if(!options.delimiter){
      console.warn("\x1b[31m", "CleanWebpackPlugin error: bundle name delimiter required in config. Filenames must be delimited by a symbol including but not limited to : '.' or '-'");
      console.warn("\x1b[0m");
    }

    options = options || {};

    if (options.verbose === undefined) {
      if (process.env.NODE_ENV === 'test') {
        options.verbose = false;
      } else {
        options.verbose = true;
      }
    }

    if (options.dry === undefined) {
      options.dry = false;
    }
    // store paths and options
    this.options = options;
};


ClearOldHashesPlugin.prototype.apply = function(compiler){
    var _this = this;
    var filenameDelimited = compiler.options.output.filename.split(_this.options.delimiter);
    var entryNames = Object.keys(compiler.options.entry);
    var outputPath = compiler.options.output.path;
    var hashPresent = filenameDelimited.indexOf('[hash]') > -1;
    var chunkhashPresent = filenameDelimited.indexOf('[chunkhash]') > -1;
    var idPresent = filenameDelimited.indexOf('[id]') > -1;
    var namePresent = filenameDelimited.indexOf('[name]') > -1;

    if(hashPresent || chunkhashPresent && idPresent || namePresent){
      var hashType = hashPresent ? "[hash]" : "[chunkhash]";
      var nameType = namePresent ? "[name]" : "[id]";

      compiler.plugin('emit', (compilation, callback) => {
        var deletePromiseArray = [];

        // Explore each chunk (build output):
        compilation.chunks.forEach(function(chunk){
          var hashIndex = filenameDelimited.indexOf(hashType);
          var nameIndex = filenameDelimited.indexOf(nameType);

          var deleteGlobString = chunk.files[0].split(_this.options.delimiter).map(function(part, i){
            return i !== nameIndex ? '*' : part
          }).join('.');

          var excludeGlobString = chunk.files[0].split(_this.options.delimiter).map(function(part, i){
            if(i === hashIndex || i === nameIndex){
              return part;
            } else {
              return "*"
            }
          }).join('.');

          var deletePromise = new Promise(function(resolve, reject){
            del([
              `${outputPath}/${deleteGlobString}`,
              `!${outputPath}`,
              `!${outputPath}/${excludeGlobString}`,
            ]).then(function(paths) {
              resolve();
            }).catch(function(err) {
              reject(err);
            })
          });
          deletePromiseArray.push(deletePromise);
        });

        Promise.all(deletePromiseArray).then(function(){
          console.log('\x1b[36m%s\x1b[0m', 'CleanWebpackPlugin: old hashes cleared');
        }).catch(function(err) {
          console.warn(err.message);
        })

        callback();
      });
    } else {
      console.error('Delimited output filename not provided.');
      throw new Error('Delimited output filename not provided.');
    }
};

module.exports = ClearOldHashesPlugin;
