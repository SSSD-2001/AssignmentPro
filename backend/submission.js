import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    studentUsername: {
        type: String,
        required: true
    },
    submissionText: {
        type: String,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    grade: {
        type: Number,
        default: null
    },
    feedback: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['submitted', 'graded'],
        default: 'submitted'
    }
});

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
