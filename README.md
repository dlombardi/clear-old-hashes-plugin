# clear-old-hashes-plugin


Documentation
-------------

**Installation**
```
npm install clear-old-hashes-plugin --save-dev
```


**Example Webpack Config**
```
var ClearOldHashesPlugin = require('clear-old-hashes-plugin');

module.exports = {
  entry: {
    bundle: './entry.js',
    vendor: './vendor.js'
  },
  output: {
    path: path.join(process.cwd(), './dist'),
    filename: '[id].bundle.[chunkhash].js'
  },
  plugins: [
    new CleanOldHashesPlugin({delimiter: '.'})
  ]
}

```

**Usage**

```
new ClearOldHashesPlugin({options})
```

**Options Config**
```
{
  "delimiter": symbol to separate filename sections ('.' || '-' || anything else...), // [name]-[hash].js or [name].[hash].js etc...
}
```

**License**
[MIT License](http://www.opensource.org/licenses/mit-license.php)
