var express = require("express");
var bodyParser = require('body-parser');
var main = require('./routes/main');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var cookieSession = require('cookie-session');
var flash = require('connect-flash');
var jsalert = require('js-alert');

var mysql = require('mysql-wrapper');
var dbconfig2 = require('./databases_login.js');
var dbconfig = require('./databases.js');
var app = express();

app.use(flash());
app.use(cookieSession({
  keys: ['node_jaejin'],
  cookie: {
    maxAge: 1000 * 60 * 60 // 유효기간 1시간
  }
}));

app.use(passport.initialize());
app.use(passport.session());
//var connection = mysql.createConnection(dbconfig);
var dbconnect = mysql(dbconfig);
var connection = mysql(dbconfig2);


//connection.connect();


passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
}, function (req, username, password, done) {
  connection.query('select * from solar_webserver where user_id in ('+ "'" +username + "'" +')',function(err,result){
    console.log(result);
    if(result && result.length > 0){   // 값을 못받아올때
      var userid = result[0].user_id;
      var userpw = result[0].user_pw;
      if(userpw == password){
        return done(null,{
          'user_id': userid    // 로그인 공공
        })
      }else {
        console.log('비밀번호 오류 입니다.');
        return done(null, false)
      }
    }else{
      console.log('유저정보가 없습니다. ')
      return done(null, false)
    }
    console.log(err)
  });

}));


passport.serializeUser(function (user, done) {
  done(null, user)

});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.listen(process.env.PORT, function(){
  console.log('Connected!!!');
})


app.locals.pretty = true;
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/chart', main.chart_dbconnect);

app.post('/login',passport.authenticate('local', {
    successRedirect: '/chart',
    failureRedirect: '/loginError',
    failureFlash: true
  }),function(req,res){
});

app.get('/loginError', function(req,res){
  res.render('loginError',{})
});
//app.get('/chart', main.chartview);
app.get('/login',function(req, res){

  res.render('login',{})

});

//안전진단에 대한 창입니다.
app.get('/safe',function(req, res){
  var query = dbconnect.query('select safety from test order by num DESC limit 1',function(err,result){
      console.log(result);
      var safe = JSON.stringify(result);
      var check = '[{"safety":"unsafe"}]';
      if(safe == check){
        var ret = '불안전';
      } else{
        var ret = '안전';
      }
      res.render('safe',{ret});
    });
});

app.get('/safe2',function(req, res){
  var query = dbconnect.query('select safety from test order by num DESC limit 5',function(err,rows){
        console.log(rows);
        res.json(rows);
    });
    console.log(query);

});



app.get('/logout', function (req, res) {
  jsalert.alert("로그아웃 되었습니다.");
  req.logout();
  res.redirect('/login');
});

app.listen(3000,function(){
  console.log('conneted 3000 port!')
})
