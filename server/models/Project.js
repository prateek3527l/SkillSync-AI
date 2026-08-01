const mongoose = require('mongoose');

const projectSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a project title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    technologies: {
      type: [String],
      required: true,
      validate: [v => v.length <= 10, 'Cannot exceed 10 technologies'],
    },
    githubUrl: {
      type: String,
      match: [
        /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/,
        'Please use a valid GitHub repository URL',
      ],
    },
    liveDemoUrl: {
      type: String,
      match: [
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        'Please use a valid URL',
      ],
    },
    coverImage: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      required: true,
      enum: ['Planning', 'In Progress', 'Completed'],
      default: 'Planning',
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Web Development',
        'Mobile App',
        'AI / ML',
        'Backend',
        'Full Stack',
        'Open Source',
        'Other',
      ],
      default: 'Other',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);
