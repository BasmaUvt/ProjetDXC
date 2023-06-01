// Ajoutez ce middleware dans un nouveau fichier nommé middleware.js
function ensureAuthenticated(req, res, next) {
  if (req.session.username) {
    next();
  } else {
    res.redirect("/login");
  }
}

module.exports = { ensureAuthenticated };