var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/prototype', function(req, res, next) {
    res.render('prototype');
});

router.get('/test/native/spec-runner', function(req, res, next) {
    res.render('native/specRunner');
});

router.get('/test/dom/spec-runner', function(req, res, next) {
    res.render('dom/specRunner');
});

router.get('/elements', function(req, res, next) {
    res.render('elements');
})

module.exports = router;
