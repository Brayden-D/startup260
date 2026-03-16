const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const port = process.argv.length > 2 ? process.argv[2] : 3000;
const authCookieName = 'token';

let apiRouter = express.Router();
app.use(`/api`, apiRouter);
app.use(express.json());
app.use(cookieParser());

let users = [];
let dice = []
let scores = [];

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
    delete user.token;
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
// GetSRandomDice
apiRouter.get('/dice', verifyAuth, (_req, res) => {
  if (dice.length === 0) {
    res.status(404).send({ msg: "No dice available" });
    return;
  }

  res.send(dice[Math.floor(Math.random() * dice.length)]);
});

// GetUserDie
apiRouter.get('/die', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  res.send(user.die);
});

// UpdateUserDie
apiRouter.post('/die', verifyAuth, (req, res) => {
  const result = updateUserDie({
    username: req.user.username,
    die: req.body.die
  });

  res.send(result);
});

// SCORES
// GetScores
apiRouter.get('/scores', verifyAuth, (_req, res) => {
  res.send(scores);
});

// SetUserScore
apiRouter.post('/score', verifyAuth, async (req, res) => {
  const score = updateUserScore({
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

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


// HELPER FUNCS
async function createUser(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const die = [1, 2, 3, 4, 5, 6]

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

  if (users.findIndex(d => d.username === username) !== -1) {
    return "error: user already exists"
  }

  users.push(user);
  dice.push(userDie);

  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  return users.find((u) => u[field] === value);
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

function updateUserDie(newDie) {
  const i = dice.findIndex(d => d.username === newDie.username);

  if (i === -1) {
    return "error: user not found";
  }

  dice[i].die = newDie.die;

  return dice[i];
}

function updateUserScore(newScore) {
  const userIndex = users.findIndex(d => d.username === newScore.username);
  const scoreIndex = scores.findIndex(d => d.username === newScore.username);

  users[userIndex].score = newScore.score;

  const currentMax = scores[scoreIndex].score;
  if (newScore.score > currentMax) {
    users[userIndex].maxScore = newScore.score;
    updateLeaderboard(newScore);
  }

  return users[userIndex];
}

function updateLeaderboard(newScore) {
  let found = false;
  for (const [i, prevScore] of scores.entries()) {
    if (newScore.score > prevScore.score) {
      scores.splice(i, 0, newScore);
      found = true;
      break;
    }
  }

  if (!found) {
    scores.push(newScore);
  }

  if (scores.length > 10) {
    scores.length = 10;
  }

  return scores;
}
