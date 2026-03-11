const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  category:{
    type: String,
    required: true
  },
  author:{
    type: String,
    default: 'Đang cập nhật'
  },
  publisher:{
    type: String,
    default: 'Đang cập nhật'
  },
  publishedDate:{
    type: Date,
    default: null
  },
  status:{
    type: String,
    enum: ['flash-sale', null],
    default: null
  },
  coverImage:{
    type: String,
    required: true
  },
  oldPrice:{
    type: Number,
    required: true
  }, 
  newPrice:{
    type: Number,
    required: true
  },
  stock:{
    type: Number,
    required: true,
    default: 0
  },
  rewardPoints:{
    type: Number,
    required: true,
    default: 0
  },
  favorites:{
    type: Number,
    default: 0
  },
  createdAt:{
    type: Date,
    default: Date.now
  }

},{
     timestamps: true 
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;