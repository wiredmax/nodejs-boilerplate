var env = process.env.NODE_ENV;
var path = require("path");
var webpack = require("webpack");

var ExtractTextPlugin = require("extract-text-webpack-plugin");

var isDev = env === "development";
var isProd = env === "production";

var pluginList = [
  new webpack.DefinePlugin({
    //FIXME: Need to fix a bug in webpack for this to work.
    //"window.jQuery": "jQuery"

    __DEV__: isDev,
    __PROD__: isProd,
    __FRONTEND__: true
  }),

  new webpack.ProvidePlugin({
    // Automatically map any instance of $ or jQuery to the jquery module.
    $: "jquery",
    jQuery: "jquery"
  }),

  new webpack.ResolverPlugin([
    new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
  ], ["normal", "loader"]),

  // Generate a file that all pages load and that provides common code chunks.
  new webpack.optimize.CommonsChunkPlugin("common.js"),

  // Create the stylesheet file based on the style requires.
  new ExtractTextPlugin("main.css", {
    allChunks: true
  })
];

if (isProd) {
  // Minify and optimize assets. (JS, CSS)
  // This can take a couple of seconds, only use for
  // the production bundles.
  pluginList.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      drop_console: true
    }
  }));
}

var loaderList = [
  // Styles.
  { test: /\.less$/,
    loader: ExtractTextPlugin.extract("style",
      "css" +
      "!autoprefixer?" + {
        "browsers": [
          "last 2 versions",
          "ie 8",
          "ie 9",
          "android 2.3",
          "android 4",
          "opera 12"
        ]
      } +
      "!less"
    )
  },

  // Fonts.
  { test: /\.woff$/, loader: "url?prefix=fonts/&limit=5000&mimetype=application/font-woff" },
  { test: /\.ttf$/,  loader: "file?prefix=fonts/" },
  { test: /\.eot$/,  loader: "file?prefix=fonts/" },
  { test: /\.svg$/,  loader: "file?prefix=fonts/" },

  // Images.
  { test: /\.(png|jpg)$/, loader: "url-loader?limit=8192"},

  // JSON files (Mostly used for languages).
  { test: /\.json$/,   loader: "json" },
  { test: /\.json5$/,  loader: "json5" },

  // JSX (for React)
  { test: /\.js$/,   loader: "jsx" },
  { test: /\.jsx$/,  loader: "jsx?insertPragma=React.DOM" },
];

if (isDev) {
  // Expose React in the global space so we can use the React chrome Dev Tools.
  loaderList.push({
    test: require.resolve("react"), loader: "expose?React"
  });
}

module.exports = {
  // Where to look for the entry points.
  context: path.join(__dirname, "js/entry"),
  entry: {
   "common.js": "./all",
    home: "./home.js"
  },
  output: {
    path: path.join(__dirname, "public/"),
    filename: "[name].bundle.js",
    chunkFilename: "[id].chunk.js",
    publicPath: "/"
  },
  module: {
    loaders: loaderList
  },
  resolve: {
    root: [
      path.join(__dirname, "js"),
      path.join(__dirname, "less"),
      path.join(__dirname, "locales"),
    ],
    modulesDirectories: [
      "node_modules",
      "bower_components"
    ],

    // Map the modules to the files we really need, for hassle-free inclusion
    // in our files.
    alias: {
      "bootstrap$": "bootstrap/dist/js/bootstrap",
      "bootstrap-styles": "bootstrap/less",
      "font-awesome-styles": "font-awesome/less",
      "i18next": "i18next-clientscript/i18next"
    }
  },
  plugins: pluginList
};