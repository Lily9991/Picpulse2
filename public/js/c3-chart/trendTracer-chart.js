
var chart = c3.generate({
    bindto: '#chart',
   	
   	data: {
   		x: 'x',
   		columns: [
   			/*['x',  '2013-07-01', '2013-08-01', '2013-09-01', '2013-10-01', '2013-11-01','2013-12-01'],*/
   			['x',  '2013-07-01', '2013-08-01', '2013-09-01', '2013-10-01', '2013-11-01','2013-12-01'],
   			/*['x', 'July', 'August', 'September', 'Octobor', 'November', 'December'],*/
            ['2013', 30, 200, 100, 400, 150, 250]
        ]
    },
    axis: {
      y: {
        label: { // ADD
          text: 'Trend Score',
          position: 'outer-middle'
        }  
      },

      x : {
            type : 'timeseries',
            tick: {
                fit: true,
                format: "%b %y"
            }
        }


    }

});

setTimeout(function () {
    chart.load({
        columns: [
            ['2013', 30, 200, 100, 400, 150, 250]
        ]
    });
}, 1000);



