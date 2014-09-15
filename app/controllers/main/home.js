
/*!
 * Module dependencies.
 */

var _ = require('lodash')

function home(req, res) {
  var keys = {};

  res.render('home', keys);
}

module.exports = home;
