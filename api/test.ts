import UserCollection from '../user/collection';
import type {User} from '../user/model';
import {MONGO_SRV} from '../global';
import mongoose from 'mongoose';

const mongoConnectionUrl = MONGO_SRV;
if (!mongoConnectionUrl) {
  throw new Error('Please add the MongoDB connection SRV as \'MONGO_SRV\'');
}

mongoose
  .connect(mongoConnectionUrl)
  .then(m => {
    console.log('Connected to MongoDB');
    const db = m.connection;
  })
  .catch(err => {
    console.error(`Error connecting to MongoDB: ${err.message as string}`);
  });

mongoose.connection.on('error', err => {
  console.error(err);
});

const makeBlankUsers = async (usernames: string[]): Promise<User[]> => Promise.all(usernames.map(async username => {
  const user = await UserCollection.findOneByUsername(username);
  if (user) {
    await UserCollection.deleteOne(user._id);
  }

  return UserCollection.addOne(username, '1');
}));

const req = async (method: string, url: string, body?: Record<string, string>) => {
  url = `http://localhost:3000${url}`;
  console.log(`Making ${method} request to ${url} with body ${body ? JSON.stringify(body) : 'empty'}`);
  let f;
  if (body) {
    f = fetch(url, {method, credentials: 'include', body: JSON.stringify(body), headers: {'Content-Type': 'application/json'}});
  } else {
    f = fetch(url, {method, credentials: 'include'});
  }

  await f.then(async res => res.json()).then(res => {
    console.log(res);
  });
};

async function simulateFriendship() {
  const users = await makeBlankUsers(['alice', 'bob', 'carol']);

  // Login as alice
  await req('POST', '/api/users/session', {username: 'alice', password: '1'});
  // Log out
  await req('DELETE', '/api/users/session');

  // Login as bob
  await req('POST', '/api/users/session', {username: 'bob', password: '1'});
}

async function main() {
  await simulateFriendship();
}

main().then(() => {
  console.log('Done');
}).catch(err => {
  console.error(err);
});
