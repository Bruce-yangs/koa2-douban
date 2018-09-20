/**
 * Created by Administrator on 2018/9/19.
 * @author yangkun
 */
const Koa = require('koa')
const app = new Koa()
app.use(async (ctx,next)=> {
    ctx.body = '电影首页'
})
app.listen(8090)