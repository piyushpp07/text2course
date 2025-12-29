import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  orderIndex: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Module = mongoose.model('Module', moduleSchema);

export default Module;
