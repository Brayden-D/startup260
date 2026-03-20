const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
const diceCollection = db.collection("dice");
const scoreCollection = db.collection('scores');

(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connect to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

//users
function getUser(username) {
  return userCollection.findOne({ username: username });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  await userCollection.updateOne({ username: user.username }, { $set: user });
}

async function updateUserRemoveAuth(user) {
  await userCollection.updateOne({ username: user.username }, { $unset: { token: 1 } });
}

//dice
async function getRandomDie(username) {
  const query = { username: { $ne: username } };

  const count = await diceCollection.countDocuments(query);

  if (count === 0) {
    return null;
  }

  const random = Math.floor(Math.random() * count);

  const result = await diceCollection
    .find(query)
    .skip(random)
    .limit(1)
    .toArray();

  return result[0];
}

async function getUserDie(username) {
  return diceCollection.findOne({ username: username });
}

async function updateUserDie(username, newDie) {
  const existing = await diceCollection.findOne({ username: username });
    await diceCollection.updateOne(
      { username: username },
      { $set: { die: newDie } }
    );

  return { username, die: newDie };
}

//scores
async function addScore(score) {
  return scoreCollection.insertOne(score);
}

function getHighScores() {
  const query = {};
  const options = {
    sort: { score: -1 },
    limit: 50,
  };

  return scoreCollection.find(query, options).toArray();
}

async function updateUserScore(username, newScore) {
  const user = await getUser(username);

  if (!user) return null;

  const maxScore = Math.max(user.maxScore || 0, newScore);

  await userCollection.updateOne(
    { username: username },
    {
      $set: {
        score: newScore,
        maxScore: maxScore,
      },
    }
  );

  return { score: newScore, maxScore };
}

async function getUserScore(username) {
  const user = await getUser(username);
  return user?.score;
}


module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  updateUserRemoveAuth,
  addScore,
  getHighScores,
};
