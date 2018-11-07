const mongoose = require('mongoose')
const db = 'mongodb://localhost/douban-test';
const glob = require('glob');
const {resolve} = require('path');
mongoose.Promise = global.Promise;

//同步加载所有schema下的所有文件
exports.initSchemas = () => {
  glob.sync(resolve(__dirname,'./schema','**/*.js')).forEach(require)
}

exports.connect = () => {
  let maxConnectTimes = 0;
  return new Promise((resolve,reject) => {
    if(process.env.NODE_ENV !== 'production') {
      mongoose.set('debug',true)
    }
    mongoose.connect(db,{useNewUrlParser:true});
    //当数据库断开后 重新连接
    mongoose.connection.on('disconnnected',() => {
      maxConnectTimes++;
      if(maxConnectTimes < 5) {
        mongoose.connect(db,{useNewUrlParser:true})
      } else {
        throw new Error('数据库挂了吧，快去修下')
      }
    });
    //当数据库出错的时候
    mongoose.connection.on('error',(err) => {
      maxConnectTimes++
      if(maxConnectTimes < 5) {
        mongoose.connect(db,{useNewUrlParser:true})
      } else {
        throw new Error('数据库挂了吧，快去修下')
      }
    });
    mongoose.connection.once('open', () => {
      // const Dog = mongoose.model('Dog',{name:String})
      // const doga = new Dog({name:'阿尔法'})
      // doga.save()
      //   .then((res) => {
      //     console.log(res)
      //     console.log('wang')
      //   })

      resolve();
      console.log('MongoDB Connected successfully!')
    })
  })
}
