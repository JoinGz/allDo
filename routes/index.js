let express = require('express')
// 以当前文件为起点目录
let User = require('../modules/user')
let passport = require("passport");
let router = express.Router()
router.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.err = req.flash("err");
  res.locals.infos = req.flash("info");
  next()
})
async function home(req, res, next) {
  let alluser = await User.find({}, {
    _id: 0,
    password: 0,
  }, {
    sort: {
      createDate: 1
    }
  }, (err, data) => {
    if (err) {
      console.log('数据库查找出错: ' + err)
      return next(err)
    }
    return data
  })
  res.render('index', {
    alluser: alluser
  })
}
router.get('/', home)
router.get('/signup', (req, res) => {
  res.render('signup')
})
router.post('/signup', (req, res) => {
  let name = req.body.username
  let key = req.body.password
  User.findOne({
    username: name
  }, {
    _id: 0,
    password: 0
  }, (err, data) => {
    if (err) {
      console.log(`查找用户出错 ${err}`);
      return next(err)
    }
    if (data) {
      res.render('signup', {
        err: '用户名已存在！φ(>ω<*) '
      })
    } else {
      User.create({
        username: name,
        password: key
      }, (err, data) => {
        if (err) {
          console.log(`写出数据出错  ${err}`)
          return next(err)
        }
        console.log('写入成功')
        res.redirect("/")
      })
    }
  })
})
let IsIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    req.flash("err", "You must be logged in to see this page.")
    res.redirect("/login")
  }
}
router.get('/edit/:username', (req, res) => {
  let username = req.params.username
  User.find({
    username
  }, (err, data) => {
    if (err) {
      return next(err)
    }
    res.render('edit', {
      edit: data
    })
  })
})
router.post('/edit', IsIn, (req, res) => {
  let username = req.user.username
  let dname = req.body.dname
  let intro = req.body.intro
  User.update({
    username: username
  }, {
    $set: {
      intro: intro,
      displayname: dname
    }
  }, (err, data) => {
    if (err) {
      return next(err)
    }
    // console.log('更新成功')
    res.redirect("/")
  })
})
router.get('/login', (req, res) => {
  res.render('login')
})
router.post('/login', passport.authenticate("login", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}))
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect("/")
})
module.exports = router