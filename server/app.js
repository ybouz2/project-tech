const express = require('express');
const app = express();
const port = 3000;

const { engine } = require ('express-handlebars');

app.set('view engine', 'hbs');

app.engine('hbs', engine({
  layoutsDir: `${__dirname}/views/layouts`,
  extname: 'hbs',
  defaultLayout: 'index',
  partialsDir: `${__dirname}/views/partials`
  }));

app.use (express.static('public'));

app.get('/', (req, res) => {
  res.render('main');
})

app.get('/login', (req, res) => {
  res.send("Log In of maak een account");
});

app.get('/about', (req, res) => {
  res.send("Over mij");
});

app.get('/matches', (req, res) => {
  res.send("Hier kun je je matches zien");
});

app.get('*', (req, res) => {
  res.send("404 page");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});