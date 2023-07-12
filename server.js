const express = require("express");
const path = require("path");
const session = require("express-session");
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

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
const messageSchema = new mongoose.Schema({
  user: String,
  content: String,
  // Autres champs si nécessaire...
  });
//const User = mongoose.model("User", userSchema);
const User = mongoose.model("User", userSchema, "utilisateurs");
const Message = mongoose.model('Message', messageSchema, 'messages');
const { ensureAuthenticated } = require("./middleware");
//const newRecord = new User({ ID: "115", password: 'mehdi' });
//newRecord.save();
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
    req.session.username = user;
    res.redirect("/");
    } else {
    // Échec de l'authentification, renvoyez une réponse appropriée
    res.status(401).send("Échec de l'authentification");
    }
});

// Middleware pour gérer les redirections
app.use((req, res, next) => {
if (req.originalUrl === "/login" || req.originalUrl === "/login.html") {
return next();
}
if (!req.session.username) {
return res.redirect("/login");
}
next();
});

// Route pour la page d'accueil
app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route pour la page de connexion
app.get("/login", (req, res) => {
if (req.session.username) {
res.redirect("/");
} else {
res.sendFile(path.join(__dirname, "public", "login.html"));
}
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

// Servir les fichiers statiques du dossier 'public'
app.use(express.static(path.join(__dirname, "public")));

// Gestion des connexions socket.io
io.on("connection", (socket) => {
  console.log("User connected");
  // Écoutez les messages de chat émis par les clients
  socket.on("chat message", async(msg) => {
        console.log("Message reçu:", msg);
        try {
        // Créez un nouveau message et 
        const newMessage = new Message({ user: "115", content: msg });
        await newMessage.save();
         
        // Envoyez le message aux autres clients  
        io.emit("chat message", { user: "115", content: msg });
        } catch (error) {
        console.error("Error saving message to database:", error);
        }
        //});
        // Diffusez le message à tous les clients connectés
        io.emit("chat message", msg);
  });
  socket.on("disconnect", () => {
  console.log("User disconnected");
  });
});

// Gérer les autres événements de socket.io ici

// Démarrage du serveur
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 