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

const uri = 'mongodb://localhost:27017/ma_base_de_donnees';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB:'));
db.once('open', () => {
  console.log('Connecté à MongoDB');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//const express = require('express');
const User = require('./models/user');
const Conversation = require('./models/Conversation');

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


// Route pour la page de connexion
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const userRecord = await User.findOne({ ID: username });
  if (userRecord && bcrypt.compareSync(password, userRecord.password)) {
    req.session.userId = userRecord.ID;
    req.session.role = userRecord.role; 
    res.redirect('/');
  } else {
    res.status(401).send('Échec de l\'authentification');
  }
});

app.get('/admin', (req, res) => {
  if (req.session.role === 'admin') {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
  } else {
    res.status(403).send('Access denied');
  }
});

app.use((req, res, next) => {
if (req.originalUrl === '/login' || req.originalUrl === '/login.html') {
return next();
}
if (!req.session.userId) {
return res.redirect('/login');
}
next();
});

app.get('/', (req, res) => {
  if (req.session.role === 'admin') {
    res.redirect('/admin');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// Route pour obtenir le nom de l'utilisateur connecté et son email
app.get('/username', async (req, res) => {
  if (req.session && req.session.userId) {
    const user = await User.findOne({ ID: req.session.userId });
    if (user) {
      res.json({ 
        username: user.ID, 
        userId: user.ID,  
        email: user.email 
      });
    } else {
      res.status(404).send('User not found');
    }
  } else {
    res.status(401).send('Not authenticated');
  }
});

// Route pour obtenir tous les utilisateurs
app.get('/all-users', async (req, res) => {
  const users = await User.find({});
  res.json(users.map(user => ({ email: user.email, userId: user.ID })));
}); 

app.get('/login', (req, res) => {
if (req.session.userId) {
res.redirect('/');
} else {
res.sendFile(path.join(__dirname, 'public', 'login.html'));
}
});

app.get('/logout', (req, res) => {
req.session.destroy();
res.redirect('/login');
});

// Route pour obtenir tous les utilisateurs
app.get('/users', async (req, res) => {
  if (req.session.role !== 'admin') {
    return res.status(403).send('Access denied');
  }

  const users = await User.find({});
  res.json(users);
});

// Route pour obtenir toutes les conversations
app.get('/conversations', async (req, res) => {
  if (req.session.role !== 'admin') {
    return res.status(403).send('Access denied');
  }

  const conversations = await Conversation.find({});
  res.json(conversations);
});

app.use(express.static(path.join(__dirname, 'public')));
// Ajouter un utilisateur
app.post('/users', async (req, res) => {
  if (req.session.role !== 'admin') {
    return res.status(403).send('Access denied');
  }

  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.send(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});
// Modifier un utilisateur
app.put('/users/:id', async (req, res) => {
  if (req.session.role !== 'admin') {
    return res.status(403).send('Access denied');
  }

  try {
    const user = await User.findOneAndUpdate({ ID: req.params.id }, req.body, { new: true });
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

// Supprimer un utilisateur
app.delete('/users/:id', async (req, res) => {
  if (req.session.role !== 'admin') {
    return res.status(403).send('Access denied');
  }

  const user = await User.findOneAndRemove(req.params.id);
  res.send(user);
});
io.on('connection', (socket) => {
  console.log('User connected');
  socket.on('chat message', async (msg) => {
    console.log('Message reçu:', msg);
    try {
      const user = await User.findOne({ ID: msg.user });
      if (!user) {
        console.error("User not found");
        return;
      }
      
      if (!user.ID || !msg.recipient) {
       console.error("User ID or recipient is null");
        return;
      }
      
      const update = {
        $push: {
          messages: {
            sender: user.ID, 
            recipient: msg.recipient, 
            content: msg.content,
            date: new Date().toISOString()
          }
        },
        $addToSet: {
          participants: { $each: [user.ID, msg.recipient] }
        }
      };
      
      const options = { upsert: true, new: true, setDefaultsOnInsert: true };
      const conversation = await Conversation.findOneAndUpdate(
        { participants: { $size: 2, $in: [User.ID, msg.recipient] } }, 
        update, 
        options
      );

      io.emit('chat message', { 
        user: user.ID, 
        content: msg.content,
        date: conversation.messages[conversation.messages.length - 1].date
      });
      console.log('Date to be sent:', conversation.messages[conversation.messages.length - 1].date);
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