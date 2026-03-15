const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const port = process.argv.length > 2 ? process.argv[2] : 3000;

let apiRouter = express.Router();
app.use(`/api`, apiRouter);
app.use(express.json());

let users = [];
let dice = []
let scores = [];



app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});