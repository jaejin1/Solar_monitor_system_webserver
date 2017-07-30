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
var connection = mysql(dbconfig2);


//connection.connect();


passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
}, function (req, username, password, done) {
  connection.query('select * from solar_webserver where user_id in ('+ "'" +username + "'" +')',function(err,result){
    console.log(result);
    if(result && result.length > 0){
      var userid = result[0].user_id;
      return done(null,{
        'user_id': userid
      })
    }else{
      console.log('유저정보가 없습니다. ')
      return done(null, false)
    }
    console.log(err)
  });

}));


passport.serializeUser(function (user, done) {
  done(null, user)
  console.log('serializeUser');

});
passport.deserializeUser(function (user, done) {
  done(null, user);
  console.log('deserializeUser');
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
    failureRedirect: '/login',
    failureFlash: true
  }),function(req,res){
});

//app.get('/chart', main.chartview);
app.get('/login',function(req, res){

  res.render('login',{})

});

app.get('/logout', function (req, res) {
  jsalert.alert("로그아웃 되었습니다.");
  req.logout();
  res.redirect('/login');
});

app.listen(3000,function(){
  console.log('conneted 3000 port!')
})
