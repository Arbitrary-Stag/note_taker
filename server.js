const express = require('express');
const fs = require('fs');
const path = require('path');
const savedNotes = require('./db/db.json');
const PORT = process.env.PORT || 3001;
const app = express();

app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

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

app.post('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, jsonString) => {
    if (err) {
      return res.status(500).json({err});
    }
    const notes = JSON.parse(jsonString);
    try {
      notes.push(req.body);
    } catch (err) {
      return res.status(500).json({err});
    }
  
    fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        return res.status(500).json({err});
      }
      try {
       res.json(JSON.parse(jsonString));
      } catch (err) {
        return res.status(500).json({err});
      }
    });
  });
})
// app.delete('/', (req, res) => res.send("Navigate to /send or /routes"));