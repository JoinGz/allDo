let mongoose = require('mongoose')
let bcrypt = require('bcrypt-nodejs')
let SALT_FACTOR = 10
let userTable = mongoose.Schema({
  username: { type: String, unique: true, require: true },
  password: { type: String, require: true },
  createDate: { type: Date, default: Date.now },
  intro: String,
  displayName: String
})
userTable.methods.name = function () {
  return this.displayName || this.username
}
userTable.pre('save', function(done)  {
  let user = this
  // 没修改密码
  if (!user.isModified('password')) {
    return done()
  }

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) {
      return done(err)
    }

    bcrypt.hash(user.password, salt, ()=>{}, function(err, hashedPassword) {
      if (err) {
        return done(err)
      }
      user.password = hashedPassword
      done()
    })
  })
})
userTable.methods.checkPassword = function (guess, done) {
  bcrypt.compare(guess, this.password, function(err, isMatch) {
    done(err, isMatch)
  })
}
let User = mongoose.model('allUser', userTable)
module.exports = User
