var path = require('path');
var express = require('express');

module.exports = function (app) {

  var public_root = path.resolve('public');
  app.get('/',function(req, res){
  	res.sendfile(public_root + '/index.html');
  });

  app.use('/css',express.static(public_root+'/css'));
  app.use('/img',express.static(public_root+'/img'));
  app.use('/js',express.static(public_root+'/js'));
  app.use('/fonts',express.static(public_root+'/fonts'));
  app.use('/includes',express.static(public_root+'/includes'));
  app.use('/lib',express.static(public_root+'/lib'));

};