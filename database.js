const express = require("express");
const session = require("express-session");
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 3000;

// Connexion à MongoDB
const uri = "mongodb://127.0.0.1:27017/ma_base_de_donnees";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erreur de connexion à MongoDB:"));
db.once("open", () => {
  console.log("Connecté à MongoDB");
});

// Schéma et modèle d'utilisateur
const userSchema = new mongoose.Schema({
  ID: String,
  password: String,
  // Autres champs si nécessaire...
});

const User = mongoose.model("User", userSchema, "utilisateurs");

app.use(cors());

// Utilisez les options CORS appropriées pour votre cas
app.use(cors());
const { ensureAuthenticated } = require("./middleware");

// Remplacez 'your-angular-project-folder' par le nom de votre dossier Angular
const angularDistFolder = path.join(__dirname, '../frontend/MonChat/dist');

app.use(express.static(angularDistFolder));
app.get('*', (req, res) => {
  res.sendFile(path.join(angularDistFolder, 'index.html'));
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Route pour la page de connexion
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Recherchez l'utilisateur dans la base de données en utilisant le champ 'ID'
  const user = await User.findOne({ ID: username });

  // Vérifiez si l'utilisateur existe et si le mot de passe correspond
  if (user && user.password === password) {
    // Authentification réussie, effectuez les actions nécessaires
    req.session.username = username;
    res.redirect("/");
  } else {
    // Échec de l'authentification, renvoyez une réponse appropriée
    res.status(401).send("Échec de l'authentification");
  }
});

// Route pour la page d'accueil
app.get("/", (req, res) => {
  res.sendFile(path.join(angularDistFolder, 'index.html'));
});

// Route pour la déconnexion
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

app.get("/", (req, res) => {
  if (req.session.username) {
    res.redirect("/chat");
  } else {
    res.redirect("/login.html");
  }
});

app.get("/chat", ensureAuthenticated, (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Gestion des connexions socket.io
io.on("connection", (socket) => {
  console.log("User connected");

  // Écoutez les messages de chat émis par les clients
  socket.on("chat message", async (msg) => {
    console.log("Message reçu:", msg);
    try {
      // Créez un nouveau message et enregistrez-le dans la base de données
      const newMessage = new Message({ username: req.session.username, content: data });
      await newMessage.save();

      // Envoyez le message aux autres clients
      io.emit("chat message", { username: req.session.username, content: msg });
    } catch (error) {
      console.error("Error saving message to database:", error);
    }
    // Diffusez le message à tous les clients connectés
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Démarrage du serveur
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});