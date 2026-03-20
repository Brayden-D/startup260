const express = require('express');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const DB = require('./database.js');

const port = process.argv.length > 2 ? process.argv[2] : 3000;
const authCookieName = 'token';

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
let apiRouter = express.Router();
app.use('/api', apiRouter);

// USERS
// CreateAuth a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('username', req.body.username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.username, req.body.password);

    setAuthCookie(res, user.token);
    res.send({ username: user.username });
  }
});

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('username', req.body.username);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      await DB.updateUser(user); 
      setAuthCookie(res, user.token);
      res.send({ username: user.username });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    await DB.updateUserRemoveAuth(user);
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Middleware to verify that the user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

// DICE
// GetRandomDice
apiRouter.get('/dice', verifyAuth, async (req, res) => {
  const die = await DB.getRandomDie(req.user.username);

  if (!die) {
    res.status(404).send({ msg: "No dice available" });
    return;
  }

  res.send(die);
});

// GetUserDie
apiRouter.get('/die', verifyAuth, async (req, res) => {
  const userDie = await DB.getUserDie(req.user.username);
  res.send(userDie);
});

// UpdateUserDie
apiRouter.post('/die', verifyAuth, async (req, res) => {
  const result = await updateUserDie({
    username: req.user.username,
    die: req.body.die
  });

  res.send(result);
});

// SCORES
// GetScores
apiRouter.get('/scores', verifyAuth, async (_req, res) => {
  const scores = await DB.getHighScores();
  res.send(scores);
});

// SetUserScore
apiRouter.post('/score', verifyAuth, async (req, res) => {
  const score = await updateUserScore({
    username: req.user.username,
    score: req.body.score
  });

  res.send(score);
});

// GetUserScore
apiRouter.get('/score', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  res.send(user.score);
});


// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// HELPER FUNCS
async function createUser(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const die = [1, 2, 3, 4, 5, 6]

  const existing = await DB.getUser(username);
  if (existing) {
    return "error: user already exists"
  }

  const user = {
    username: username,
    password: passwordHash,
    token: uuid.v4(),
    score: 0,
    maxScore: 0
  };

  const userDie = {
    username: username,
    die: die
  }

  await DB.addUser(user);
  await DB.updateUserDie(username, [1, 2, 3, 4, 5, 6]);

  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  if (field === 'token') {
    return await DB.getUserByToken(value);
  }

  if (field === 'username') {
    return await DB.getUser(value);
  }

  return null;
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

async function updateUserDie(newDie) {
  const result = await DB.updateUserDie(newDie.username, newDie.die);
  if (!result) {
    return "error: user not found";
  }

  return result;
}

async function updateUserScore(newScore) {
  const userResult = await DB.updateUserScore(
    newScore.username,
    newScore.score
  );

  if (!userResult) {
    return "error: user not found";
  }

  await DB.addScore(newScore);

  return userResult;
}

app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});
