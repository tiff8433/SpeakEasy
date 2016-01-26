var express = require('express');
var analysis = require('./controllers/analysis.controller.js');
var router = express.Router();
var user = require('./controllers/user.controller.js');

// eventually use Auth


router.post('/api/analyze', function(req, res){
  analysis.analyze(req.body.shortcode, res);
});

router.post('/user/login', function(req, res){
	user.login(req, res);
})

router.post('/user/signup', function(req, res){
	user.createUser(req, res);
})

router.get('/user/logout', function(req, res){
  user.logout(req, res);
})
module.exports = router;
