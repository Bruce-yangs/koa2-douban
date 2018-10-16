const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const Mixed = Schema.Types.Mixed;//存储任意类型的数据

const SALT_WORK_FACTOR = 10;
const MAX_LOGIN_ATTEMPTS = 5;//尝试密码次数5次
const LOCK_TIME = 2 * 60 * 60 * 1000;//冻结2个小时
const userSchema = new Schema({
  unsername: {
    unique: true,//标识唯一
    type: String,
    required:true,
  },
  email: {
    unique: true,
    type: String,
    required:true,
  },
  password: {
    unique: true,
    type: String,
  },
  lockUntil:Number,//锁定时间
  loginAttempts:{//尝试登陆次数
    type:Number,
    required:true,
    default:0,
  },
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    },
  },
});
//增加虚拟字段  区分是否被冻结
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})


//在保存之前
userSchema.pre('save', function(next)  {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})
userSchema.pre('save', function(next)  {
  if (!this.isModified('password')) return next()
  //加密库
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err)
      this.password = hash;
      next()
    })
  })
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})

//对比密码
userSchema.methods = {
  comparePassword: (_password, password) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, (err, isMatch) => {
        if (!err) resolve(isMatch)
        else reject(err)
      })
    })
  },
  incLoginAttepts: (user) => {
    return new Promise((resolve,reject) => {
      if(this.lockUntil && this.lockUntil < Date.now()) {
        this.update({
          $set: {
            loginAttempts: 1
          },
          $unset: {//设置为1毫秒
            lockUntil:1
          }
        }, (err) => {
          if(!err) resolve(true)
          else reject(err)
        })
      } else {
        let updates = {
          $inc: {
            loginAttempts:1
          }
        }
        //满足条件 就锁住
        if(this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
          updates.$set = {
            lockUntil: Date.now() + LOCK_TIME
          }
        }
        this.update(updates, err => {
          if(!err) resolve(true)
          else reject(err)
        })
      }
    })
  }
}

mongoose.model('User', userSchema);
