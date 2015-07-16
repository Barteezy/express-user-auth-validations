var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var db = require('monk')('localhost/user-auth');
var User = db.get('users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      user = User.insert({ email: req.body.email, passwordDigest: hash });
      req.session.currentUserEmail = user.query.email;
      res.redirect('/');
    });
  });
});


module.exports = router;
