var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var db = require('monk')('localhost/user-auth');
var User = db.get('users');

router.post('/', function(req, res, next) {
  User.findOne({ email: req.body.email }).on('success', function (user) {
    bcrypt.compare(req.body.password, user.passwordDigest, function(err, valid) {
      if (valid) {
        req.session.currentUserEmail = user.email;
        res.redirect('/');
      };
    });
  });
});

module.exports = router;
