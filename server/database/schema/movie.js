const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { Mixed , ObjectId } = Schema.Types;//存储任意类型的数据

const movieSchema = new Schema({
  doubanId:{
    unique: true,
    type: String
  },
  category:[{
    type: ObjectId,
    ref:'Category'
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
  tags: String,
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
//在保存之前
movieSchema.pre('save', function(next) {
  if(this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})
mongoose.model('Movie',movieSchema);
