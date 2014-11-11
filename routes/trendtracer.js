var express = require('express');
var async = require('async');
//var id_async = date_async = require('async');

module.exports = function (app) {
  //app.use('/trendtracer',trendRouter);

app.get('/trendtracer/v1/tags', function(req, res){

   if (typeof req.param('id') === "undefined") {
      res.statusCode = 400;
      res.send('Error 400: series id missing');
   }
   var series_id = "Series " + req.param("series");

   if (typeof req.param('id') === "undefined") {
      res.statusCode = 400;
      res.send('Error 400: tag id missing');
   }

   //var tag_id_params = req.query.id.split(" ");
   var tag_id_params = req.param('id');
   var tag_id = [];
   if (tag_id_params.length == 2) {
      tag_id = tag_id_params[0] == '0' ? parseInt(tag_id_params[1]) : parseInt(tag_id_params[0]);
   }
   else {
      for (index in tag_id_params) {
         if (tag_id_params[index] == '0'){
            continue;
         }
         else {
            tag_id.push(parseInt(tag_id_params[index]));
         }
      }
   }

   var current_date = start_date = new Date();
   var date_filter;
   if (typeof req.param('range') === "undefined")
      date_filter = 30;
   else
      date_filter = parseInt(req.query.range);

   start_date.setDate(current_date.getDate() - date_filter);
   var dates = [];
   for(i = 1; i <= date_filter; i++) {
      var range_date = new Date();
      range_date.setDate(range_date.getDate() - i);
      dates.push(range_date);
   }

   if(tag_id_params.length == 2) {
      trend_trace_1(app, tag_id, dates, series_id, function(result_arr) {
         res.statusCode = 200;
         res.header("Access-Control-Allow-Origin", "http://localhost");
         res.header("Access-Control-Allow-Methods", "GET, POST");
         res.json(result_arr);
      });
   }
   else if(tag_id_params.length == 3) {

      trend_trace_2(app, tag_id, dates, series_id, function(result_arr) {
         res.statusCode = 200;
         res.header("Access-Control-Allow-Origin", "http://localhost");
         res.header("Access-Control-Allow-Methods", "GET, POST");
         res.json(result_arr);
      });
   }
   else if(tag_id_params.length == 4) {

      trend_trace_3(app, tag_id, dates, series_id, function(result_arr) {
         res.statusCode = 200;
         res.header("Access-Control-Allow-Origin", "http://localhost");
         res.header("Access-Control-Allow-Methods", "GET, POST");
         res.json(result_arr);
      });
   }
   else {
      res.send("TOO MANY TAGS");
   }

   /*
   trend_trace(app, tag_id, dates, function(result_arr) {
      res.statusCode = 200;
      res.header("Access-Control-Allow-Origin", "http://localhost");
      res.header("Access-Control-Allow-Methods", "GET, POST");
      res.json(result_arr);
   });
   */

   /*
   tag = parseInt(req.query.id);

   if (typeof req.param('ts') === "undefined") {
      res.statusCode = 400;
      res.send('Error 400: timestamp missing');
   }
   
   var dates = req.query.ts;
   var parseDates = [];
   for (var i = 0; i < dates.length; i++) {
      //var dateParts = dates[i].split('-');
      //parseDates[i] = new Date(dateParts[0], dateParts[1]-1, dateParts[2]); //months are 0-based
      parseDates.push(new Date(Date.parse(dates[i])));
   }
   */

   /*
   if (req.query.id.length > 1) {
      tag = parseInt(req.query.id[0])
   }

   //sample test dates
   var testDates = [];
   dateString1 = "2014-06-30";
   dateString2 = "2014-07-30";
   dateString3 = "2014-08-30";
   dateString4 = "2014-08-30";
   dateString5 = "2014-09-30";
   dateString6 = "2014-10-30";

   var returnData = [
   {"x":dateString1, "y":"30"},
   {"x":dateString2, "y":"200"},
   {"x":dateString3, "y":"100"},
   {"x":dateString4, "y":"400"},
   {"x":dateString5, "y":"150"},
   {"x":dateString6, "y":"250"}
   ];

   testDates.push(new Date(Date.parse(dateString1)));
   testDates.push(new Date(Date.parse(dateString2)));
   testDates.push(new Date(Date.parse(dateString3)));
   testDates.push(new Date(Date.parse(dateString4)));
   testDates.push(new Date(Date.parse(dateString5)));
   testDates.push(new Date(Date.parse(dateString6)));
   */

   /*
   get_trace_count(app, tag, testDates, function(gramInfo) {
      res.statusCode = 200;
      res.header("Access-Control-Allow-Origin", "http://localhost");
      res.header("Access-Control-Allow-Methods", "GET, POST");
      res.json(gramInfo);
      //res.json(returnData);
      //res.json('test');
   });
   */


});
};

function trend_trace_1(app, tag_ids, date_stamps, series, callback) {
   var result_arr = [];
   var back_date = new Date();
   var data_pair = {};
   var id_key = series;

   async.eachSeries(date_stamps, function(date_stamp, callback) {
      data_pair = {};
      data_pair['x'] = date_stamp;
      back_date.setDate(date_stamp.getDate()-1);

      app.db.count().from('image').where('updated_at','<',date_stamp)
         .andWhere('updated_at','>',back_date).whereIn('image_id', function() {
            this.select('image_id').from('item').whereIn('item_id', function() {
               this.select('item_id').from('itemtag').where('tag_id',tag_ids);
            })
         })
         .then(function(rows) {
            obj = rows[0];
            data_pair[id_key] = parseInt(obj.count);
            result_arr.push(data_pair);
            callback();
         })
         .catch(function(error) {
            console.error(error);
         });
      }, function(err) {
         if (err)
            console.log(err);
         else {
            //result_arr.push(data_pair);
            callback(result_arr);
         }
      }
   );
}

function trend_trace_2(app, tag_ids, date_stamps, series, callback) {
   var result_arr = [];
   var back_date = new Date();
   var data_pair = {};
   var id_key = series;

   async.eachSeries(date_stamps, function(date_stamp, callback) {
      data_pair = {};
      data_pair['x'] = date_stamp;
      back_date.setDate(date_stamp.getDate()-1);

      app.db.count().from('image').where('updated_at','<',date_stamp)
         .andWhere('updated_at','>',back_date).whereIn('image_id', function() {
            this.select('image_id').from('item').whereIn('item_id', function() {
               this.select('item_id').from('itemtag').where('tag_id',tag_ids[0]).andWhere('tag_id',tag_ids[1]);
            })
         })
         .then(function(rows) {
            obj = rows[0];
            data_pair[id_key] = parseInt(obj.count);
            result_arr.push(data_pair);
            callback();
         })
         .catch(function(error) {
            console.error(error);
         });
      }, function(err) {
         if (err)
            console.log(err);
         else {
            //result_arr.push(data_pair);
            callback(result_arr);
         }
      }
   );
}

function trend_trace_3(app, tag_ids, date_stamps, series, callback) {
   var result_arr = [];
   var back_date = new Date();
   var data_pair = {};
   var id_key = series;

   async.eachSeries(date_stamps, function(date_stamp, callback) {
      data_pair = {};
      data_pair['x'] = date_stamp;
      back_date.setDate(date_stamp.getDate()-1);

      app.db.count().from('image').where('updated_at','<',date_stamp)
         .andWhere('updated_at','>',back_date).whereIn('image_id', function() {
            this.select('image_id').from('item').whereIn('item_id', function() {
               this.select('item_id').from('itemtag').where('tag_id',tag_ids[0]).andWhere('tag_id',tag_ids[1]).andWhere('tag_id',tag_ids[2]);
            })
         })
         .then(function(rows) {
            obj = rows[0];
            data_pair[id_key] = parseInt(obj.count);
            result_arr.push(data_pair);
            callback();
         })
         .catch(function(error) {
            console.error(error);
         });
      }, function(err) {
         if (err)
            console.log(err);
         else {
            //result_arr.push(data_pair);
            callback(result_arr);
         }
      }
   );
}


