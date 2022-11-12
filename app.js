const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.use(express.static("public"));
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, '/public/pages/engine.html'));
  });
  
  app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
  });