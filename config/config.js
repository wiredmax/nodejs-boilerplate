
/*
 * Module dependencies.
 */

var path     = require('path'),
    rootPath = path.resolve(__dirname + '../..');

var baseURL;

/*
 * Expose config
 */

module.exports = {
  development: {
    baseURL: baseURL = "localhost:8080",
    assetsURL: "",
    root: rootPath,
    languages: { en: "English", fr: "Français" }
  },
  production: {
    baseURL: baseURL = "copart.novivia.com",
    assetsURL: "",
    root: rootPath,
    languages: { en: "English", fr: "Français" }
  }
}