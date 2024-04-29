const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');

const app = express();
const fs = require('fs');

require("dotenv").config();
const OpenAI = require("openai");
const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');
const layoutsPath = path.join(__dirname, '../templates/layouts');

// Setup handlebars engine and views location
app.engine(
  "hbs",
  engine({
    extname: "hbs", // sets the extension name to .hbs
    defaultLayout: "main", // sets the default layout to main.hbs
    layoutsDir: layoutsPath, // path to layouts folder
    partialsDir: partialsPath, // path to partials folder
    helpers: {
      truncate: function (str, numWords) {
        var words = str.split(" ");
        if (words.length > numWords) {
          words = words.slice(0, numWords);
          return words.join(" ") + "...";
        }
        return str;
      },
    },
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

/*
This route reads the chatsData.json file, parses the JSON data, and then renders the "chats" view with the parsed data. 
This is used to display the chat data on a webpage.
*/
app.get('/chats', async (req, res) => {
    const chatsPath = path.join(__dirname, "chatsData.json");
    fs.readFile(chatsPath, "utf8", async (err, data) => {
        if (err) {
            console.error(err);
            return res
                .status(500)
                .send("An error occurred while reading the chats.json file.");
        }
        const chats = JSON.parse(data);

        // Add the OpenAI completion code here
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "Tell me a simple funny joke about cats." }],
            model: "gpt-3.5-turbo",
        });

        res.render("chats", {
            title: "Chats",
            chats: chats,
            message: completion.choices[0].message.content,
        });
    });
});
/*
This route also reads the chatsData.json file and parses the JSON data,
but instead of rendering a view, it sends the parsed data as a JSON response.
This is an API endpoint that can be used by client-side JavaScript or other clients to fetch the chat data.
*/
app.get("/api/chats", (req, res) => {
  const chatsPath = path.join(__dirname, "chatsData.json");
  fs.readFile(chatsPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .send("An error occurred while reading the chatsData.json file.");
    }
    res.json(JSON.parse(data));
  });
});
app.get('/datachat', (req, res) => {
  res.render('datachat', {
    title: 'Data Chat',
  });
});

app.get('/pages', (req, res) => {
  res.render('pages', {
    title: 'Pages',
  });
});

app.get('/forms', (req, res) => {
  res.render('forms', {
    title: 'Forms',
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
