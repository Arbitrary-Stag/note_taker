// Declared dependencies, and necessary server boiler plate //
const express = require('express');
const fs = require('fs');
const path = require('path');
const id = require('./id-generator/id.js');
const notes = require('./db/db.json');
const app = express();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// html redirect requests //
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

// This get request asks the server to read the json file in which the notes are stored,
// and then parses that data and saves it in a new variable called notes.
// Then the server uses json to respond that data to the user. 
app.get('/api/notes', (req, res) => {

  fs.readFile("./db/db.json", "utf8", (err, jsonString) => {
    if (err) {
      return res.status(500).json({err});
    }

    try {
      const notes = JSON.parse(jsonString);
      res.json(notes);
    } catch (err) {
      return res.status(500).json({err});
    }
  });
})

// This post request works much the same as the get request above, except it also uses the id fuction to 
// ascribe unique id's to the notes being saved and are then pushed to the body.
// Lastly, the json file in which the notes are stored is rewritten to include the new note.
app.post('/api/notes', (req, res) => {

  fs.readFile('./db/db.json', 'utf8', (err, jsonString) => {
    if (err) {
      return res.status(500).json({err});
    }

    const notes = JSON.parse(jsonString);

    try {
      req.body.id = id();
      notes.push(req.body);
    } catch (err) {
      return res.status(500).json({err});
    }
  
    fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        return res.status(500).json({err});
      }

      try {
       res.json(JSON.parse(notes));
      } catch (err) {
        return res.status(500).json({err});
      }
    });
  }); 
})

// This request is called when the user selects to delete a saved note.
// The json file is read, the data parsed and saved within a variable.
// Then a filter function is called on the variable to filter out the object with the same id used in the api call.
// Lastly the json file is rewritten without the deleted note.
app.delete('/api/notes/:id', (req,res) => {

  fs.readFile('./db/db.json', 'utf8', (err, notes) => {
   
    if (err) {
      return res.status(500).json({err});
    }

    let data = JSON.parse(notes);

    data = data.filter(object => {
      return object.id !== req.params.id;
    });

    fs.writeFile('./db/db.json', JSON.stringify(data, null, 2), (err) => {

      if (err) {
        return res.status(500).json({err});
      }
     
      res.json(JSON.parse(notes));
    });
  });
})
