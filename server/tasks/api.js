/**
 * Created by Administrator on 2018/9/21.
 * @author yangkun
 */
// http://api.douban.com/v2/movie/subject/1764796
const rp = require('request-promise-native');
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

async function fetchMovie(item) {
  const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}`;
  return res = await rp(url);
}
;(async () => {
    let movies = await Movie.find({
      $or: [
        {summary: { $exists: false}},
        {summary: null},
        {title: ''},
        {summary: ''},
      ]
    });

    for(let i = 0; i < movies.length; i++) {
      let movie = movies[i]
      let movieData = await fetchMovie(movie)

      if(movieData) {
        let tags = movieData.tags || []
        movies.tags = tags
        movies.summary = movieData.summary || ''
        movies.title = movieData.title || ''
      }
    }

    movies.map(async movie => {
      let movieData = await fetchMovie(movie);
      try {
        movieData = JSON.parse(movieData);
        console.log(movieData)
      } catch (err) {
        console.log(err)
      }
    })
  })();
