var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/test/native/spec-runner', function(req, res, next) {
    res.render('native/specRunner');
});

router.get('/test/dom/spec-runner', function(req, res, next) {
    res.render('dom/specRunner');
});

module.exports = router;
