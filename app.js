var express = require("express");
var bodyParser = require('body-parser');
var mysql = require('mysql-wrapper');
var dbconfig = require('./databases.js');
var main = require('./routes/main');

var app = express();

//var connection = mysql.createConnection(dbconfig);

var connection = mysql(dbconfig);

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



app.listen(process.env.PORT, function(){
  console.log('Connected!!!');
})

app.locals.pretty = true;
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', function(req, res){
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
  /*function(err, result) {
    if(err) throw err;


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
    for (var i = 0; i < num.length; i++) {
      console.log(num[i]);
    }

  });*/




  res.render('chart',{
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

})

app.get('/chart', main.chartview);

app.listen(3000,function(){
  console.log('conneted 3000 port!')
})
