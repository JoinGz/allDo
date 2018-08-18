let express = require('express')
let mongoose = require('mongoose')
let path = require('path')
let bodyParser = require('body-parser')
let cookieParser = require('cookie-parser')
let session = require('express-session')
let flash = require('connect-flash')
let passport = require("passport");
let routes = require('./routes')
let auth = require("./auth");
let app = express()
mongoose.connect('mongodb://localhost:27017/one',{useNewUrlParser:true},(err)=>{
    if(err){
        console.log('链接数据库失败'+err);
    }
})
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(
  session({
    secret: 'key of Gz',
    resave: true,
    saveUninitialized: true
  })
)
app.use(passport.initialize())
app.use(passport.session())
auth()
app.use(flash())
app.use(routes)
app.listen(3000,()=>{
  console.log('Ready GO!')
})