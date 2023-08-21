const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

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
const User = mongoose.model("User", userSchema, "utilisateurs");

// Supposez que vous avez une liste d'utilisateurs avec des mots de passe en clair
const users = [
  { ID: 'basma', password: '123' },
  { ID: 'mariem', password: '123' },
  { ID: 'nesrine', password: '123' },
];

// Hachez chaque mot de passe et mettez à jour l'utilisateur correspondant dans la base de données
users.forEach(async (user) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(user.password, salt);

  await User.updateOne({ ID: user.ID }, { $set: { password: hashedPassword } });
});