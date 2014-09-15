var _ = require('lodash');

/*
* Routes
*/
module.exports = function (app, env, config) {
  var ctrl = require('./controllers');

  _.forEach(config.languages, function(value, key) {
    var r = require('../locales/' + key + '/routes.json5')

    // ####### i18n routes here #######

  });


  // ####### Root route #######
  app.get('/', ctrl.main.home);

};