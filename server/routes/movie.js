const Router = require('koa-router');
const mongoose = require('mongoose')
//拿到所有模型
const router = new Router();

router.get('/moives/all', function (ctx, next) {
  const Movie = mongoose.model('Movie');

  const movies =  Movie.find({}).sort({
    'meta.createdAt': -1
  });
  ctx.body = {
    movies
  }
});
router.get('/moives/detail/:id', function (ctx, next) {
  const Movie = mongoose.model('Movie');
  const id = ctx.params.id;
  const movie =  Movie.findOne({_id: id});
  ctx.body = {
    movie
  }
});

module.exports = router;
