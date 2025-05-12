// server.js (Node/Express backend)
const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');
const fs         = require('fs');
const path       = require('path');
const crypto     = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE  = path.join(__dirname, 'data', 'posts.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

function readJSON(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return fallback; }
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}
function hash(pw) {
  return crypto.createHash('sha256').update(pw).digest('hex');
}

function readUsers() { return readJSON(USERS_FILE, {}); }
function writeUsers(u) { writeJSON(USERS_FILE, u); }
function readPosts() { return readJSON(DATA_FILE, []); }
function writePosts(p) { writeJSON(DATA_FILE, p); }

// Create post (and register if new) with password
app.post('/posts', (req, res) => {
  const { name, message, password } = req.body;
  if (!name || !message || !password) {
    return res.status(400).json({ error: 'Name, message and password required.' });
  }
  const users = readUsers();
  if (!users[name]) {
    users[name] = hash(password);
    writeUsers(users);
  } else if (users[name] !== hash(password)) {
    return res.status(401).json({ error: 'Incorrect password.' });
  }
  const posts = readPosts();
  const newPost = {
    id:         Date.now().toString(),
    name,
    message,
    createdAt:  new Date().toISOString(),
    interactions: {},
    likes:      0,
    dislikes:   0
  };
  posts.push(newPost);
  writePosts(posts);
  res.status(201).json(newPost);
});

// List posts
app.get('/posts', (req, res) => {
  const posts = readPosts();
  posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(posts);
});

// Delete post with password
app.delete('/posts/:id', (req, res) => {
  const { password } = req.body;
  const posts = readPosts();
  const post  = posts.find(p => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found.' });
  }
  const users = readUsers();
  if (!password || users[post.name] !== hash(password)) {
    return res.status(401).json({ error: 'Incorrect password.' });
  }
  writePosts(posts.filter(p => p.id !== post.id));
  res.status(204).end();
});

// Like/Dislike toggle: only one per IP; switching removes previous
['like','dislike'].forEach(action => {
  app.post(`/posts/:id/${action}`, (req, res) => {
    const ip    = req.ip;
    const posts = readPosts();
    const post  = posts.find(p => p.id === req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    post.interactions = post.interactions || {};
    const prev = post.interactions[ip];
    if (prev === action) {
      delete post.interactions[ip];
    } else {
      post.interactions[ip] = action;
    }
    const vals = Object.values(post.interactions);
    post.likes    = vals.filter(v => v === 'like').length;
    post.dislikes = vals.filter(v => v === 'dislike').length;
    writePosts(posts);
    res.json({ likes: post.likes, dislikes: post.dislikes });
  });
});

// Clear all posts (optional)
app.post('/clear', (req, res) => {
  writePosts([]);
  res.json({ message: 'Cleared.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
