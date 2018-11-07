const mongoose = require('mongoose');
const Schema = mongoose.Schema;//创建实例模型
const {Mixed, ObjectId} = Schema.Types;//存储任意类型的数据  Mixed是可以任意类型

const movieSchema = new Schema({
  doubanId: {
    unique: true,
    type: String
  },
  category: [{
    type: ObjectId,
    ref: 'Category'
  }],
  rate: Number,
  title: String,
  summary: String,
  video: String,
  poster: String,
  cover: String,
  rawTitle: String,

  videoKey: String,
  posterKey: String,
  coverKey: String,

  movieTypes: [String],
  pubdate: Mixed,
  year: Number,
  tags: [String],
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
//在保存之前 pre
movieSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})
mongoose.model('Movie', movieSchema);
