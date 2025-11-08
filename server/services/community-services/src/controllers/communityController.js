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
            status: { $in: ['active'] },
            isDeleted: false
        })
        .populate('managerId', 'name email')
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
        const statusParam = req.query.status;

        const filter = {
            isDeleted: false
        };

        // Handle status filter - only filter if status is explicitly provided
        if (statusParam) {
            filter.status = { $in: [statusParam, statusParam.toLowerCase(), statusParam.charAt(0).toUpperCase() + statusParam.slice(1).toLowerCase()] };
        }
        // If no status param, show ALL communities (don't filter by status)

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        const communities = await CommunitiesModel.find(filter)
            .populate('managerId', 'name email')
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
        .populate('managerId', 'name email')
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
        .populate('communityId', 'name image location')
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
        .populate('communityId', 'name image')
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
        
        console.log('=== Join Request Debug ===');
        console.log('req.user:', req.user);
        console.log('req.userId:', req.userId);
        console.log('req.headers.authorization:', req.headers.authorization);
        
        // Check if user is authenticated
        if (!req.user) {
            console.error('User not authenticated, req.user is null/undefined');
            return res.status(401).send(response.toJson('Authentication required. Please login to join communities'));
        }
        
        // Get userId - could be either _id or id depending on middleware
        const userId = req.user._id || req.user.id || req.userId;
        console.log('Extracted userId:', userId);
        
        if (!userId) {
            console.error('User ID not found. req.user:', JSON.stringify(req.user), 'req.userId:', req.userId);
            return res.status(401).send(response.toJson('Authentication required. Please login to join communities'));
        }
        
        console.log('Creating join request for user:', userId, 'community:', communityId);

        // Check if community exists
        const community = await CommunitiesModel.findOne({
            _id: communityId,
            isDeleted: false
        });

        if (!community) {
            return res.status(404).send(response.toJson(messages['en'].common.not_exists));
        }

        // Check for existing request (including deleted ones due to unique index)
        const existingRequest = await CommunityJoinRequestsModel.findOne({
            userId,
            communityId
        });

        if (existingRequest) {
            // If request exists but is deleted, reactivate it
            if (existingRequest.isDeleted) {
                existingRequest.isDeleted = false;
                existingRequest.status = 'Pending';
                existingRequest.message = message || '';
                existingRequest.reviewedBy = null;
                existingRequest.reviewedAt = null;
                existingRequest.reviewNotes = null;
                existingRequest.deletedAt = null;
                await existingRequest.save();
                console.log('Reactivated deleted join request:', existingRequest._id);
                return res.status(201).send(response.toJson(
                    'Join request submitted successfully',
                    existingRequest
                ));
            }
            
            // If active request exists, return error
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

        try {
            await joinRequest.save();
            console.log('Join request created successfully:', joinRequest._id);
        } catch (saveError) {
            // Handle duplicate key error (E11000)
            if (saveError.code === 11000) {
                console.error('Duplicate join request detected:', saveError);
                return res.status(400).send(response.toJson(
                    'You have already requested to join this community'
                ));
            }
            throw saveError; // Re-throw other errors
        }

        return res.status(201).send(response.toJson(
            'Join request submitted successfully',
            joinRequest
        ));

    } catch (err) {
        console.error('Error creating join request:', err);
        const statusCode = err.statusCode || 500;
        const errMess = err.message || err;
        return res.status(statusCode).send(response.toJson(errMess));
    }
};

// Get User's Join Requests (Requires Authentication)
const getUserJoinRequests = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send(response.toJson('Authentication required'));
        }
        
        const userId = req.user._id || req.user.id || req.userId;
        if (!userId) {
            return res.status(401).send(response.toJson('Authentication required'));
        }

        const requests = await CommunityJoinRequestsModel.find({
            userId,
            isDeleted: false
        })
        .populate('communityId', 'name image location')
        .populate('reviewedBy', 'name')
        .sort({ createdAt: -1 })
        .lean();

        return res.status(200).send(response.toJson(
            messages['en'].common.detail_success,
            requests
        ));

    } catch (err) {
        console.error('Error fetching join requests:', err);
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

