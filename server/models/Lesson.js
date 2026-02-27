import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  objectives: [{
    type: String,
    trim: true
  }],
  content: {
    type: [mongoose.Schema.Types.Mixed],
    required: true,
    default: []
  },
  isEnriched: {
    type: Boolean,
    default: false
  },
  hinglishText: {
    type: String,
    default: ""
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  }
}, {
  timestamps: true
});

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;
