const cp = require('child_process');
const {resolve} = require('path');
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

//子进程
(async () => {
  const script = resolve(__dirname, '../crawler/trailer-list.js');
  const child = cp.fork(script, []);//cp.fork(script, []) script爬虫脚本 返回一个子进程对象
  let invoked = false;//标识 是否进程跑起来
  child.on('error', err => {
    if (invoked) return;
    invoked = true;
    console.log(err)
  });
  child.on('exit', code => {
    if (invoked) return;
    invoked = true;
    let err = code === 0 ? null : new Error('exit code' + code);
    console.log(err)
  });
  child.on('message', data => {
    let result = data.result;
    result.forEach(async function(item) {
      let movie = await Movie.findOne({
        doubanId: item.doubanId
      })
      //如果没有id 就存储整体
      if(!movie) {
        movie = new Movie(item)
        await movie.save()
      }
    })
    console.log(data)
    console.log('hahahhahah哈哈哈')
  });
})();
