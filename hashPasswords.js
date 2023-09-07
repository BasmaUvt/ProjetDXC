const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const uri = "mongodb://127.0.0.1:27017/ma_base_de_donnees";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erreur de connexion à MongoDB:"));
db.once("open", () => {
  console.log("Connecté à MongoDB");
  hashPasswords();  // Appelez la fonction hashPasswords une fois que la connexion est établie
});

const UserSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true
},
email: {
    type: String,
    required: true,
    unique: true
},
password: {
    type: String,
    required: true
},
role: {
    type: String,
    enum: ['user', 'admin'],  // le champ "role" peut être soit 'user' soit 'admin'
    default: 'user'   // par défaut, le champ "role" est 'user'
}
});
const User = mongoose.model("User", UserSchema, "users");

async function hashPasswords() {
  // Récupère tous les utilisateurs
  const users = await User.find({});

  for (const user of users) {
    // Si le mot de passe n'a pas encore été haché
    if (!user.password.startsWith('$2a$')) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(user.password, salt);
      user.password = hashedPassword;
      await user.save();
    }
  }

  console.log('Password hashing complete');
}