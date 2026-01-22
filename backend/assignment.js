import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    teacherUsername: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    maxScore: {
        type: Number,
        default: 100
    }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment;
