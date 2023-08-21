const express = require('express');
const path = require('path');
const session = require('express-session');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 3000;

const uri = 'mongodb://127.0.0.1:27017/ma_base_de_donnees';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB:'));
db.once('open', () => {
  console.log('Connecté à MongoDB');
});

const userSchema = new mongoose.Schema({
  ID: String,
  password: String,
});
const messageSchema = new mongoose.Schema({
  user: String,
  content: String,
});
const User = mongoose.model('User', userSchema, 'utilisateurs');
const Message = mongoose.model('Message', messageSchema, 'messages');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

// Route pour obtenir le nom de l'utilisateur connecté
app.get('/username', (req, res) => {
  if (req.session && req.session.username) {
    res.json({ username: req.session.username.ID });
  } else {
    res.status(401).send('Not authenticated');
  }
});

// Route pour la page de connexion
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ ID: username });
  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.username = user;
    res.redirect('/');
  } else {
    res.status(401).send('Échec de l\'authentification');
  }
});

app.use((req, res, next) => {
  if (req.originalUrl === '/login' || req.originalUrl === '/login.html') {
    return next();
  }
  if (!req.session.username) {
    return res.redirect('/login');
  }
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  if (req.session.username) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('User connected');
  socket.on('chat message', async (msg) => {
    console.log('Message reçu:', msg);
    try {
      // Fetch the user from the database using `msg.user`
      const user = await User.findOne({ ID: msg.user });

      if (user) {
        const newMessage = new Message({ user: user.ID, content: msg.message });
        await newMessage.save();
        console.log({ user: user.ID, content: msg.message });
        io.emit('chat message', { user: user.ID, content: msg.message });
      } else {
        console.log(`User: ${msg.user} not found in the database.`);
      }
    } catch (error) {
      console.error('Error saving message to database:', error);
    }
  });
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});