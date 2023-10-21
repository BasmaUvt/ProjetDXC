const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const uri = "mongodb://127.0.0.1:27017/ma_base_de_donnees";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erreur de connexion à MongoDB:"));
db.once("open", () => {
  console.log("Connecté à MongoDB");
  hashPasswords();
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
    enum: ['user', 'admin'],
    default: 'user'
}
});
const User = mongoose.model("User", UserSchema, "users");

async function hashPasswords() {
  try {
    const users = await User.find({});

    for (const user of users) {
      if (!user.password.startsWith('$2a$')) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(user.password, salt);
        user.password = hashedPassword;
        await user.save();
      }
    }
    console.log('Password hashing complete');
  } catch (error) {
    console.error('Error hashing passwords:', error);
  } finally {
    mongoose.connection.close();
  }
}