/**
 * Created by Administrator on 2018/9/21.
 * @author yangkun
 */
// http://api.douban.com/v2/movie/subject/1764796
  const rp = require('request-promise-native');
async function fetchMovie(item) {
  const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}`;
  return res = await rp(url);
}
;(async () => {
    let movies = [
      {
        doubanId: 1292213,
        title: '大话西游之大圣娶亲',
        rate: 9.2,
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2455050536.jpg'
      },
      {
        doubanId: 1851857,
        title: '蝙蝠侠：黑暗骑士',
        rate: 9.1,
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p462657443.jpg'
      }
    ];
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
