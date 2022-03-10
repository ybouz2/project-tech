require('dotenv').config()


const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash')
const session = require('express-session')
const initialize = require('./')
const methodOverride = require('method-override')
const app = express();
const port = 3000;
const { engine } = require ('express-handlebars');
const {saveUser} = require("./utils/db");
const users = [];

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.weqjj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
  
//   // perform actions on the collection object
//   client.close();
// });

const initializePassport = require('./passport-config')

initializePassport(
  passport, 
 
    email => saveUser(userMeta).find(user => user.email === email),
   id => saveUser(userMeta).find(user => user.id === id)
 )

app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }
))

app.use(methodOverride('_method'))

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next)=>{
  app.locals.success = req.flash('success')
  next();
});

app.engine('hbs', engine({
  layoutsDir: `${__dirname}/views/layouts`,
  extname: 'hbs',
  defaultLayout: 'index',
  partialsDir: `${__dirname}/views/partials`
  
  }));

app.use (express.static('public'));

app.get('/', (req, res) => {
  res.render('main') //{name: req.user.name});
})

app.get('/login',  (req, res) => {
  res.render("login");
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
})

)


app.get('/register', (req, res) => {
  res.render("register");
});



app.post('/register',  async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const userMeta = {
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    };

    console.log('testen')
    saveUser(userMeta);

    // users.push({
    //   id: Date.now().toString(),
    //   name: req.body.name,
    //   email: req.body.email,
    //   password: hashedPassword
    // })


    res.redirect('/login')

  } catch {
    res.redirect('/register')
  }
  
  console.log(users)
})



app.get('*', (req, res) => {
  res.send("404 page");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})