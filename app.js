var express = require('express')
var mongoose = require('mongoose')
var path = require('path')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var flash = require('connect-flash')
var passport = require("passport");
// var setUpPassport = require("./setuppassport");
var routes = require('./routes/index.js')
var app = express()
mongoose.connect('mongodb://localhost:27017/one',{useNewUrlParser:true},(err)=>{
    if(err){
        console.log('链接数据库失败'+err);
    }
})
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(routes)
app.listen(3000,()=>{
  console.log('Ready GO!')
})