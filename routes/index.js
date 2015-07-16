var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cool App, Dude', currentUserEmail: req.session.currentUserEmail});
});

router.get('/signup', function(req, res, next) {
  res.render('users/new');
});

module.exports = router;
