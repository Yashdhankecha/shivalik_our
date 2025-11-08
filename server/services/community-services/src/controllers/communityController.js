const messages = require("../message");
const response = require("../config/response.js");
const { validationResult } = require('express-validator');
const CommunitiesModel = require('../models/Communities.js');
const AmenitiesModel = require('../models/Amenities.js');
const EventsModel = require('../models/Events.js');
const AnnouncementsModel = require('../models/Announcements.js');
const CommunityJoinRequestsModel = require('../models/CommunityJoinRequests.js');

// Get Featured Communities for Landing Page
const getFeaturedCommunities = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 6;
        
        const communities = await CommunitiesModel.find({
            isFeatured: true,
            status: 'Active',
            isDeleted: false
        })
        .populate('amenityIds', 'name icon')
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

        return res.status(200).send(response.toJson(
            messages['en'].common.detail_success,
            communities
        ));

    } catch (err) {
        const statusCode = err.statusCode || 500;
        const errMess = err.message || err;
        return res.status(statusCode).send(response.toJson(errMess));
    }
};

// Get All Communities (with pagination and filters)
const getAllCommunities = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';
        const status = req.query.status || 'Active';

        const filter = {
            isDeleted: false,
            status: status
        };

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { 'location.city': { $regex: search, $options: 'i' } }
            ];
        }

        const communities = await CommunitiesModel.find(filter)
            .populate('amenityIds', 'name icon')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

        const total = await CommunitiesModel.countDocuments(filter);

        return res.status(200).send(response.toJson(
            messages['en'].common.detail_success,
            {
                communities,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            }
        ));

    } catch (err) {
        const statusCode = err.statusCode || 500;
        const errMess = err.message || err;
        return res.status(statusCode).send(response.toJson(errMess));
    }
};

// Get Community Details by ID
const getCommunityById = async (req, res) => {
    try {
        const { id } = req.params;

        const community = await CommunitiesModel.findOne({
            _id: id,
            isDeleted: false
        })
        .populate('amenityIds', 'name icon category')
        .populate('createdBy', 'name email')
        .lean();

        if (!community) {
            return res.status(404).send(response.toJson(messages['en'].common.not_exists));
        }

        return res.status(200).send(response.toJson(
            messages['en'].common.detail_success,
            community
        ));

    } catch (err) {
        const statusCode = err.statusCode || 500;
        const errMess = err.message || err;
        return res.status(statusCode).send(response.toJson(errMess));
    }
};

// Get Recent Events
const getRecentEvents = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 6;
        const currentDate = new Date();

        const events = await EventsModel.find({
            isDeleted: false,
            status: { $in: ['Upcoming', 'Ongoing'] },
            eventDate: { $gte: currentDate }
        })
        .populate('communityId', 'name logo location')
        .populate('createdBy', 'name')
        .limit(limit)
        .sort({ eventDate: 1 })
        .lean();

        return res.status(200).send(response.toJson(
            messages['en'].common.detail_success,
            events
        ));

    } catch (err) {
        const statusCode = err.statusCode || 500;
        const errMess = err.message || err;
        return res.status(statusCode).send(response.toJson(errMess));
    }
};

// Get Recent Announcements
const getRecentAnnouncements = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 6;
        const currentDate = new Date();

        const announcements = await AnnouncementsModel.find({
            isDeleted: false,
            status: 'Published',
            publishDate: { $lte: currentDate },
            $or: [
                { expiryDate: null },
                { expiryDate: { $gte: currentDate } }
            ]
        })
        .populate('communityId', 'name logo')
        .populate('createdBy', 'name')
        .limit(limit)
        .sort({ isPinned: -1, publishDate: -1 })
        .lean();

        return res.status(200).send(response.toJson(
            messages['en'].common.detail_success,
            announcements
        ));

    } catch (err) {
        const statusCode = err.statusCode || 500;
        const errMess = err.message || err;
        return res.status(statusCode).send(response.toJson(errMess));
    }
};

// Get All Amenities
const getAllAmenities = async (req, res) => {
    try {
        const amenities = await AmenitiesModel.find({
            isDeleted: false,
            isActive: true
        })
        .sort({ category: 1, name: 1 })
        .lean();

        return res.status(200).send(response.toJson(
            messages['en'].common.detail_success,
            amenities
        ));

    } catch (err) {
        const statusCode = err.statusCode || 500;
        const errMess = err.message || err;
        return res.status(statusCode).send(response.toJson(errMess));
    }
};

// Create Community Join Request (Requires Authentication)
const createJoinRequest = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(response.toJson(errors.errors[0].msg));
    }

    try {
        const { communityId, message } = req.body;
        const userId = req.user.id;

        // Check if community exists
        const community = await CommunitiesModel.findOne({
            _id: communityId,
            isDeleted: false
        });

        if (!community) {
            return res.status(404).send(response.toJson(messages['en'].common.not_exists));
        }

        // Check for existing request
        const existingRequest = await CommunityJoinRequestsModel.findOne({
            userId,
            communityId,
            isDeleted: false
        });

        if (existingRequest) {
            return res.status(400).send(response.toJson(
                'You have already requested to join this community'
            ));
        }

        // Create join request
        const joinRequest = new CommunityJoinRequestsModel({
            userId,
            communityId,
            message: message || '',
            status: 'Pending'
        });

        await joinRequest.save();

        return res.status(201).send(response.toJson(
            'Join request submitted successfully',
            joinRequest
        ));

    } catch (err) {
        const statusCode = err.statusCode || 500;
        const errMess = err.message || err;
        return res.status(statusCode).send(response.toJson(errMess));
    }
};

// Get User's Join Requests (Requires Authentication)
const getUserJoinRequests = async (req, res) => {
    try {
        const userId = req.user.id;

        const requests = await CommunityJoinRequestsModel.find({
            userId,
            isDeleted: false
        })
        .populate('communityId', 'name logo location')
        .populate('reviewedBy', 'name')
        .sort({ createdAt: -1 })
        .lean();

        return res.status(200).send(response.toJson(
            messages['en'].common.detail_success,
            requests
        ));

    } catch (err) {
        const statusCode = err.statusCode || 500;
        const errMess = err.message || err;
        return res.status(statusCode).send(response.toJson(errMess));
    }
};

module.exports = {
    getFeaturedCommunities,
    getAllCommunities,
    getCommunityById,
    getRecentEvents,
    getRecentAnnouncements,
    getAllAmenities,
    createJoinRequest,
    getUserJoinRequests
};

