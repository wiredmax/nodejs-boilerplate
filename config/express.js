/*
 * Module dependencies.
 */
var express      = require('express'),
    bodyParser   = require('body-parser'),
    favicon      = require('serve-favicon'),
    session      = require('express-session'),
    cookieParser = require('cookie-parser'),
    morgan       = require('morgan'),
    csrf         = require('csurf')
    pkg          = require('../package'),
    _            = require('lodash'),
    flash        = require('connect-flash'),
    swig         = require('swig'),
    i18n         = require('i18next'),
    env          = process.env.NODE_ENV || 'development',
    htmlMinifier = require('connect-html-minifier');


/*
 * Expose
 */
module.exports = function (app, config) {

  app.set('showStackError', true)

  // use favicon
  //app.use(favicon(config.root + '/public/ico/favicon.ico'));

  app.use(express.static(config.root + '/public'))

  if(env !== 'development') {
    app.use(htmlMinifier({
      collapseWhitespace: true,
      removeComments: true
    }));
  }

  app.use(morgan('dev'))

  // views config
  app.set('view engine', 'swig');
  app.set('views', config.root + '/app/views')
  if(env == 'development') {
    app.set('view cache', false);
    swig.setDefaults({ cache: false });
  }

  app.engine('.swig', swig.renderFile);

  //i18next
  var i18nNamespaces = require('../locales/namespaces.json5').namespaces;
  var i18nextOptions = {
    supportedLngs: _.keys(config.languages),
    fallbackLng: 'en',
    cookieName: 'lang',
    detectLngQS: 'lang',
    resGetPath: 'locales/__lng__/__ns__.json5',
    ns: {
      namespaces: i18nNamespaces,
      defaultNs: 'routes'
    },
    nsseparator: '::'
  }
  i18n.init(i18nextOptions);

  // bodyParser
  app.use(bodyParser.urlencoded({
    extended: true
  }))
  app.use(bodyParser.json());

  app.use(i18n.handle);

  // cookieParser should be above session
  app.use(cookieParser('xRbnMZ9dcjkjBLAxchu7gtNg'))
  app.use(session({secret: 'SBozZpGgF21pox66Amn4'}))

  // Flash messages
  app.use(flash())

  // expose pkg and node env to views
  app.use(function (req, res, next) {
    res.locals.__ = i18n.t;
    req.locals = {
      '__': i18n.t
    };
    res.locals.pkg = pkg;
    res.locals.env = env;
    res.locals.sl = _.keys(config.languages);
    res.locals.ln = config.languages;
    if(!req.session.lang) req.session.lang  = req.locale
    if(req.query.lang) req.session.lang = req.query.lang
    if(!_.contains(res.locals.sl, req.session.lang)) {
      req.session.lang = res.locals.sl[0];
    }
    next()
  })

  // adds CSRF support
  app.use(csrf())

  // View helpers
  app.use(function(req, res, next) {
    if (typeof req.flash !== 'undefined') {
      res.locals.info = req.flash('info')
      res.locals.errors = req.flash('error');
      res.locals.success = req.flash('success')
      res.locals.warning = req.flash('warning')
    }

    res.locals.csrf_token = req.csrfToken();
    res.locals.assets_url = config.assetsURL;

    next()
  })

  app.use(function (req, res, next){
    var now = new Date()
    res.locals.env = process.env.NODE_ENV,
    res.locals.now = now;
    next();
  })

  // Bootstrap routes
  require('./routes')(app, env, config)

  // custom error handler
  app.use(function (err, req, res, next) {
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next()
    }

    console.log(err.toString());

    res.status(500).render('errors/500');
  })

  app.use(function (req, res, next) {
    res.status(404).render('errors/404', { url: req.originalUrl })
  })
}