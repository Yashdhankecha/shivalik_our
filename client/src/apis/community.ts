import apiClient from './apiService';

// Community related API calls
export const communityApi = {
    // Get featured communities for landing page
    getFeaturedCommunities: async (limit: number = 6) => {
        const response = await apiClient.get(`/community/communities/featured?limit=${limit}`);
        return response.data;
    },

    // Get all communities with pagination
    getAllCommunities: async (params: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
    } = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.status) queryParams.append('status', params.status);
        
        const response = await apiClient.get(`/community/communities?${queryParams.toString()}`);
        return response.data;
    },

    // Get community by ID
    getCommunityById: async (id: string) => {
        const response = await apiClient.get(`/community/communities/${id}`);
        return response.data;
    },

    // Get recent events
    getRecentEvents: async (limit: number = 6) => {
        const response = await apiClient.get(`/community/events/recent?limit=${limit}`);
        return response.data;
    },

    // Get recent announcements
    getRecentAnnouncements: async (limit: number = 6) => {
        const response = await apiClient.get(`/community/announcements/recent?limit=${limit}`);
        return response.data;
    },

    // Get all amenities
    getAllAmenities: async () => {
        const response = await apiClient.get('/community/amenities');
        return response.data;
    },

    // Create join request (requires authentication)
    createJoinRequest: async (data: {
        communityId: string;
        message?: string;
    }) => {
        const response = await apiClient.post('/community/join-requests', data);
        return response.data;
    },

    // Get user's join requests (requires authentication)
    getUserJoinRequests: async () => {
        const response = await apiClient.get('/community/join-requests/user');
        return response.data;
    }
};

export default communityApi;
