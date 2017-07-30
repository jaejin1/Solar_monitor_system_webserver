var mysql = require('mysql-wrapper');
var dbconfig = require('../databases.js');
//var dbconfig_login = require('/../databases_login.js');

var num = [];
var h_solar_rad = [];
var s_solar_rad = [];
var module_temp = [];
var ambient_temp = [];
var co2 = [];
var gyro_x = [];
var gyro_y = [];
var gyro_z = [];
var r_phase_current = [];
var s_phase_current = [];
var t_phase_current = [];
/*
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
*/
exports.login = function(req, res){
  res.render('login',{})
}


exports.chart_dbconnect = function(req, res){
  var connection = mysql(dbconfig);

  console.log(req.session);
  console.log(req.session.passport.user.user_id);

  //connection.connect();
  connection.query('select * from test3 order by num desc limit 7',{}, function(err, result){
    for(var i =0; i < 7; i++){
      if(result && result.length >0){
        num.push(result[i].num);
        h_solar_rad.push(result[i].h_solar_rad);
        s_solar_rad.push(result[i].s_solar_rad);
        module_temp.push(result[i].module_temp);
        ambient_temp.push(result[i].ambient_temp);
        co2.push(result[i].co2);
        gyro_x.push(result[i].gyro_x);
        gyro_y.push(result[i].gyro_y);
        gyro_z.push(result[i].gyro_z);
        r_phase_current.push(result[i].r_phase_current);
        s_phase_current.push(result[i].s_phase_current);
        t_phase_current.push(result[i].t_phase_current);
      }
    }
    console.log(err)
  });

  res.render('chart',{
    userid: req.session.passport.user.user_id,
    num: num,
    h_solar_rad: h_solar_rad,
    s_solar_rad: s_solar_rad,
    module_temp: module_temp,
    ambient_temp: ambient_temp,
    co2: co2,
    gyro_x: gyro_x,
    gyro_y: gyro_y,
    gyro_z: gyro_z,
    r_phase_current: r_phase_current,
    s_phase_current: s_phase_current,
    t_phase_current: t_phase_current
  })
  num = [];
  h_solar_rad = [];
  s_solar_rad = [];
  module_temp = [];
  ambient_temp = [];
  co2 = [];
  gyro_x = [];
  gyro_y = [];
  gyro_z = [];
  r_phase_current = [];
  s_phase_current = [];
  t_phase_current = [];
}
