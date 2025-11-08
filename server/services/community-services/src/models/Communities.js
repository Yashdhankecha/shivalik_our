const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DBConnect } = require('./index.js');

const CommunitiesSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Developers', 'Investors', 'Brokers', 'Professionals', 'Builders', 'Consultants', 'Tech Professionals'],
        required: true
    },
    image: {
        type: String,
        default: null
    },
    managerId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }],
    pendingRequests: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }],
    pulses: [{
        type: Schema.Types.ObjectId,
        ref: 'pulses'
    }],
    marketplaceListings: [{
        type: Schema.Types.ObjectId,
        ref: 'marketplaceListings'
    }],
    events: [{
        type: Schema.Types.ObjectId,
        ref: 'events'
    }],
    peopleCount: {
        type: Number,
        default: 0
    },
    location: {
        type: String,
        default: null
    },
    tags: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'active',
        index: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
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

// Virtual field to compute peopleCount from members array
CommunitiesSchema.virtual('memberCount').get(function() {
    return this.members ? this.members.length : 0;
});

// Middleware to update peopleCount before saving
CommunitiesSchema.pre('save', function(next) {
    if (this.members) {
        this.peopleCount = this.members.length;
    }
    next();
});

const CommunitiesModel = DBConnect.model('communities', CommunitiesSchema);

CommunitiesModel.syncIndexes().then(() => {
    console.log('Communities Model Indexes Synced');
}).catch((err) => {
    console.log('Communities Model Indexes Sync Error', err);
});

module.exports = CommunitiesModel;

