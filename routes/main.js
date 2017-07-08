exports.chartview = function(req, res){

  connection.connect();
  connection.query('SELECT * from test3', function(err, rows, fields) {
    if(err) throw err;

    if(rows && rows.length >0){
      var test1 = rows[0]
      var test2 = test1.co2
      console.log(test1);
      console.log(test2);
    }
  });

  connection.end();

  res.render('ejstest',{
    title: "testtest",
    length: 5
  })

};
