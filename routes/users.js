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
  if (req.body.email == false){
    res.render('users/new', {error: "Email cannot be blank"})
  } else {
    User.find({email: req.body.email}, function (err, docs) {
      if (docs.length === 0) {
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(req.body.password, salt, function(err, hash) {
            user = User.insert({ email: req.body.email, passwordDigest: hash });
            req.session.currentUserEmail = user.query.email;
            res.redirect('/');
          });
        });
      } else {
        res.render('users/new', {error: "Email already exists", email: req.body.email})
      }
    })
  }
});


module.exports = router;
