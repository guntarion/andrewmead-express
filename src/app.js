const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');
const layoutsPath = path.join(__dirname, '../templates/layouts');

// Setup handlebars engine and views location
app.engine(
  'hbs',
  engine({
    extname: 'hbs', // sets the extension name to .hbs
    defaultLayout: 'main', // sets the default layout to main.hbs
    layoutsDir: layoutsPath, // path to layouts folder
    partialsDir: partialsPath, // path to partials folder
  })
);
app.set('view engine', 'hbs');
app.set('views', viewsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Home',
  });
});

app.get("/chats", (req, res) => {
  res.render("chats", {
    title: "Chats",
  });
});

app.get('/datachat', (req, res) => {
  res.render('datachat', {
    title: 'Data Chat',
  });
});

app.get("/pages", (req, res) => {
  res.render("pages", {
    title: "Pages",
  });
});

app.get("/forms", (req, res) => {
  res.render("forms", {
    title: "Forms",
  });
});


app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
  });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000.');
});
