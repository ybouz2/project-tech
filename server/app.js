require('dotenv').config()

const express = require('express'),
      { engine } = require('express-handlebars'),
      logger = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      session = require('express-session'),
      passport = require('passport'),
      LocalStrategy = require('passport-local');
const { Db } = require('mongodb');
      flash = require('express-flash')

const config = require('./config'),
      funct = require('./functions');
 
const app = express();

// PASSPORT

// Passport session setup.
passport.serializeUser( (user, done) => {
  console.log("serializing " + user.username);
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  console.log("deserializing " + obj);
  done(null, obj);
});


// Use the LocalStrategy within Passport to login/"signin" users.
passport.use('local-signin', new LocalStrategy(
  {passReqToCallback : true}, //allows us to pass back the request to the callback
  (req, username, password, done) => {
    funct.localAuth(username, password)
    .then( (user) => {
      if (user) {
        console.log("LOGGED IN AS: " + user.username);
        req.session.success = 'You are successfully logged in ' + user.username + '!';
        done(null, user);
      }
      if (!user) {
        console.log("COULD NOT LOG IN");
        req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
        done(null, user);
      }
    })
    .fail((err) => {
      console.log(err.body);
    });
  }
));
// Use the LocalStrategy within Passport to register/"signup" users.
passport.use('local-signup', new LocalStrategy(
  {passReqToCallback : true}, //allows us to pass back the request to the callback
  (req, username, password, done) => {
    funct.localReg(username, password)
    .then( (user) => {
      if (user) {
        console.log("REGISTERED: " + user.username);
        req.session.success = 'You are successfully registered and logged in ' + user.username + '!';
        done(null, user);
      }
      if (!user) {
        console.log("COULD NOT REGISTER");
        req.session.error = 'That username is already in use, please try a different one.'; //inform user could not log them in
        done(null, user);
      }
    })
    .fail( (err) => {
      console.log(err.body);
    });
  }
));

// EXPRESS
// Express Configureren
app.use(express.urlencoded({ extended: false}));
app.use(express.static(__dirname + '/public'));
app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash())
app.use(methodOverride('_method'));
app.use(session({secret: 'process.env.SESSION_SECRET', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());

// // Session-persisted message middleware
app.use( (req, res, next) => {
  const err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

      delete req.session.error;
      delete req.session.success;
      delete req.session.notice;
    
      if (err) res.locals.error = err;
      if (msg) res.locals.notice = msg;
      if (success) res.locals.success = success;

      next();
});

app.use((req, res, next) => {
  app.locals.success = req.flash('success')
  next();
});

// Handlebars instellen
app.engine('hbs', engine({
  layoutsDir: `${__dirname}/views/layouts/`,
  extname: 'hbs',
  defaultLayout: 'index',
  partialsDir: `${__dirname}/views/partials`
  
  }));

app.set('view engine', 'hbs');

//===============ROUTES===============

//Homepagina laten zien
app.get('/', (req, res) => {
  if ( !req.isAuthenticated() ) {
    res.redirect('/login')
    return
  }
  res.render('main', {user: req.user});
});

//Log-in pagina laten zien
app.get('/login', (req, res) => {
  res.render('login');
});

//Registreer pagina laten zien
app.get('/register', (req, res) => {
  res.render('register');
});

// Verzendt het verzoek via de lokale aanmeldingsstrategie, en als dit lukt, wordt de gebruiker naar de startpagina geleid, anders keert hij terug naar de aanmeldingspagina
app.post('/register', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/register',
  failureFlash: true
  })
);

// Verzendt het verzoek via de lokale aanmeldingsstrategie, en als dit lukt, wordt de gebruiker naar de startpagina geleid, anders keert hij terug naar de aanmeldingspagina
app.post('/login', passport.authenticate('local-signin', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
  })
);

app.post('/', (req, res) => {
funct.db.collections.deleteOne({id : req.body._id})
res.redirect('/login')
});

//Logt de gebruiker uit van de site.
app.get('/logout', (req, res) => {
  const name = req.user.username;
  console.log("Uitloggen " + req.user.username)
  req.logout();
  res.redirect('/');
  req.session.notice = "Succesvol uitgelogd " + name + "!";
});



//===============POORT=================
const port = process.env.PORT || 3000; //select your port or let it pull from your .env file
app.listen(port);
console.log("listening on " + port + "!");