var express = require('express');
//var async = require('async');
var id_async = date_async = require('async');

module.exports = function (app) {

app.get('/gallerybuilder/v1/tags', function(req, res){

   if (typeof req.param('id') === "undefined") {
      res.statusCode = 400;
      res.send('Error 400: tag id missing');
   }

   var tag_id_params = req.query.id.split(" ");
   var tag_id = [];
   for (index in tag_id_params) {
      tag_id.push(parseInt(tag_id_params[index]));
   }

   var current_date = start_date = new Date();
   var date_filter;
   if (typeof req.param('range') === "undefined")
      date_filter = 90;
   else
      date_filter = parseInt(req.query.range);

   start_date.setDate(current_date.getDate() - date_filter);
   var dates = [];
   for(i = 1; i <= date_filter; i++) {
      var range_date = new Date();
      range_date.setDate(range_date.getDate() - i);
      dates.push(range_date);
   }

   gallery_build(app, tag_id, dates, function(result_arr) {
      var path_arr = [];
      //console.log(JSON.stringify(result_arr));
      for (i = 0; i < result_arr.length; i++) {
         var dict = result_arr[i];
         //console.log(dict[0].local_path)
         var img_path = dict[0].local_path;
         path_arr.push(img_path);
      }
      res.send(path_arr);
   });

});
};

function gallery_build(app, tag_ids, date_stamps, callback) {
   var result_arr = [];
   var back_date = new Date();

   date_async.eachSeries(date_stamps, function(date_stamp, callback) {
      back_date.setDate(date_stamp.getDate()-1);

      id_async.eachSeries(tag_ids, function(tag_id, callback) {
         var id_key = tag_id.toString();

         app.database.select('local_path').from('image').where('updated_at','<',date_stamp)
         .andWhere('updated_at','>',back_date).whereIn('image_id', function() {
            this.select('image_id').from('item').whereIn('item_id', function() {
               this.select('item_id').from('itemtag').where('tag_id',tag_id);
            })
         })
         .then(function(rows) {
            //Data format of 'rows':[{"local_path":"20"}]
            //Inner async loop callback
            if (rows[0] != undefined)
               result_arr.push(rows);
            callback();
         })
         .catch(function(error) {
            console.error(error);
         });

      }, function(err) {
         if (err)
            console.log(err);
         else {
            //Outer async loop callback
            callback();
         }
      });
   }, function(err) {
      if (err)
            console.log(err);
         else {
            //Function callback
            callback(result_arr);
         }
   });
}