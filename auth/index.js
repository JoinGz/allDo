let passport = require("passport")
let LocalStrategy = require("passport-local").Strategy
let User = require("../modules/user")
passport.use('login',new LocalStrategy((username,password,done)=>{
  User.findOne({username:username},(err, data)=>{
    if(err){
      console.log(`查找用户名出错:${err}`)
      done(err)
    }else if(data){
      data.checkPassword(password,(err, pass)=>{
        if(err){
          console.log(`核对密码:${err}`)
          return done(err)
        }
        if(pass){
          return done(null, data)
        }else{
          return done(null,false,{message:'密码或用户名不正确'})
        }
      })
    }else{
      return done(null,false,{message:'无此用户名'})
    }
  })
}))
module.exports = ()=>{
  // 这里的user应该是上面done(null,data)传过来的data
  passport.serializeUser((user, done)=>{
    done(null, user._id)
  })
  passport.deserializeUser((id, done)=> {
    // user就是数据库找到的匹配项，然后给了req.user
    User.findById(id, (err, user)=> {
        done(err, user);
    })
  })
}