const mongoose = require('mongoose');

const TargetSchema = new mongoose.Schema({
    years: {
        type: String,
        enum: ['all_years', '1st_year', '2nd_year', '3rd_year', '4th_year'],
        default: 'all_years'
    },
    faculties: {
        type: String,
        enum: ['all_faculties', 'it', 'engineering', 'business'],
        default: 'all_faculties'
    }
}, { _id: false });

const PRIORITY_ORDER = {
    general: 1,
    important: 2,
    emergency: 3
};

const NoticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 140
    },
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        maxlength: 4000
    },
    type: {
        type: String,
        enum: ['general', 'important', 'emergency'],
        default: 'general'
    },
    category: {
        type: String,
        enum: ['academic', 'exams', 'events', 'library', 'holiday'],
        required: true
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    target: {
        type: TargetSchema,
        default: () => ({})
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    priorityOrder: {
        type: Number,
        default: 1,
        min: 1,
        max: 3
    },
    views: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

NoticeSchema.virtual('status').get(function getStatus() {
    const now = new Date();
    if (this.startDate > now) return 'scheduled';
    if (this.endDate < now) return 'expired';
    return 'active';
});

NoticeSchema.pre('validate', function setPriorityOrder() {
    this.priorityOrder = PRIORITY_ORDER[this.type] || 1;
});

NoticeSchema.pre('validate', function validateDateRange() {
    if (this.startDate && this.endDate && this.startDate > this.endDate) {
        throw new Error('Start date must be before or equal to end date');
    }
});

NoticeSchema.index({ isPinned: -1, priorityOrder: -1, createdAt: -1 });
NoticeSchema.index({ title: 'text', content: 'text' });
NoticeSchema.index({ category: 1, type: 1, startDate: 1, endDate: 1 });
NoticeSchema.index({ 'target.years': 1, 'target.faculties': 1 });

module.exports = mongoose.model('notice', NoticeSchema);