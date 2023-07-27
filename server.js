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

const uri = "mongodb://127.0.0.1:27017/ma_base_de_donnees";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erreur de connexion à MongoDB:"));
db.once("open", () => {
console.log("Connecté à MongoDB");
});

const userSchema = new mongoose.Schema({
ID: String,
password: String,
});
const messageSchema = new mongoose.Schema({
  user: String,
  content: String,
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
    if (user && user.password === password) {
    req.session.username = user;
    res.redirect("/");
    } else {
    res.status(401).send("Échec de l'authentification");
    }
});

// gérer les redirections
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

app.use(express.static(path.join(__dirname, "public")));

// Gestion des connexions socket.io
io.on("connection", (socket) => {
  console.log("User connected");
  socket.on("chat message", async(msg) => {
        console.log("Message reçu:", msg);
        try {
        const newMessage = new Message({ user: "basma", content: msg });
        await newMessage.save(); 
        io.emit("chat message", { user: "basma", content: msg });
        } catch (error) {
        console.error("Error saving message to database:", error);
        }
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