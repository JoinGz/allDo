let express = require('express')
// let User = require('./modules/user')
let router = express.Router()
router.get('/',(req,res,next)=>{
  res.render('index')
})