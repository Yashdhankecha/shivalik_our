const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DBConnect } = require('./index.js');

const CommunitiesSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        trim: true
    },
    bannerImage: {
        type: String,
        default: null
    },
    logo: {
        type: String,
        default: null
    },
    location: {
        address: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
        country: { type: String, default: 'India' },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number }
        }
    },
    isFeatured: {
        type: Boolean,
        default: false,
        index: true
    },
    highlights: [{
        type: String
    }],
    amenityIds: [{
        type: Schema.Types.ObjectId,
        ref: 'amenities'
    }],
    totalUnits: {
        type: Number,
        default: 0
    },
    occupiedUnits: {
        type: Number,
        default: 0
    },
    establishedYear: {
        type: Number
    },
    contactInfo: {
        email: { type: String },
        phone: { type: String },
        website: { type: String }
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'UnderDevelopment'],
        default: 'Active',
        index: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
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

const CommunitiesModel = DBConnect.model('communities', CommunitiesSchema);

CommunitiesModel.syncIndexes().then(() => {
    console.log('Communities Model Indexes Synced');
}).catch((err) => {
    console.log('Communities Model Indexes Sync Error', err);
});

module.exports = CommunitiesModel;

