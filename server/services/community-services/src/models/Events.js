const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DBConnect } = require('./index.js');

const EventsSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    communityId: {
        type: Schema.Types.ObjectId,
        ref: 'communities',
        required: true,
        index: true
    },
    eventDate: {
        type: Date,
        required: true,
        index: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String
    },
    location: {
        type: String,
        trim: true
    },
    images: [{
        type: String
    }],
    maxParticipants: {
        type: Number,
        default: null
    },
    registeredParticipants: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }],
    eventType: {
        type: String,
        enum: ['Cultural', 'Sports', 'Educational', 'Social', 'Festival', 'Meeting', 'Other'],
        default: 'Other'
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
        default: 'Upcoming',
        index: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    createdAt: {
        type: Date,
        index: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    }
}, {
    timestamps: true
});

const EventsModel = DBConnect.model('events', EventsSchema);

EventsModel.syncIndexes().then(() => {
    console.log('Events Model Indexes Synced');
}).catch((err) => {
    console.log('Events Model Indexes Sync Error', err);
});

module.exports = EventsModel;

