import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { communityApi } from '../apis/community';
import { Community, Event, Announcement, Amenity } from '../types/CommunityTypes';
import { useAuth } from '../hooks/useAuth';
import { showMessage } from '../utils/Constant';
import AuthModal from '../components/ui/AuthModal';
import HeroSection from '../components/landing/HeroSection';
import FeaturedCommunities from '../components/landing/FeaturedCommunities';
import RecentEvents from '../components/landing/RecentEvents';
import RecentAnnouncements from '../components/landing/RecentAnnouncements';
import AmenitiesSection from '../components/landing/AmenitiesSection';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    
    const [featuredCommunities, setFeaturedCommunities] = useState<Community[]>([]);
    const [recentEvents, setRecentEvents] = useState<Event[]>([]);
    const [recentAnnouncements, setRecentAnnouncements] = useState<Announcement[]>([]);
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

    useEffect(() => {
        fetchLandingPageData();
    }, []);

    const fetchLandingPageData = async () => {
        try {
            setLoading(true);
            const [communitiesRes, eventsRes, announcementsRes, amenitiesRes] = await Promise.all([
                communityApi.getFeaturedCommunities(6),
                communityApi.getRecentEvents(6),
                communityApi.getRecentAnnouncements(6),
                communityApi.getAllAmenities()
            ]);

            setFeaturedCommunities(communitiesRes.data || []);
            setRecentEvents(eventsRes.data || []);
            setRecentAnnouncements(announcementsRes.data || []);
            setAmenities(amenitiesRes.data || []);
        } catch (error: any) {
            console.error('Error fetching landing page data:', error);
            showMessage(error.message || 'Failed to load data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinCommunity = async (communityId: string, message?: string) => {
        if (!isAuthenticated) {
            setPendingAction(() => () => handleJoinCommunity(communityId, message));
            setShowAuthModal(true);
            return;
        }

        try {
            const response = await communityApi.createJoinRequest({ communityId, message });
            showMessage(response.message || 'Join request submitted successfully', 'success');
        } catch (error: any) {
            showMessage(error.message || 'Failed to submit join request', 'error');
        }
    };

    const handleAuthSuccess = () => {
        setShowAuthModal(false);
        if (pendingAction) {
            pendingAction();
            setPendingAction(null);
        }
    };

    const handleViewAllCommunities = () => {
        navigate('/communities');
    };

    const handleViewAllEvents = () => {
        navigate('/events');
    };

    const handleSignIn = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Header */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">Community Platform</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            {!isAuthenticated ? (
                                <>
                                    <button
                                        onClick={handleSignIn}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={() => navigate('/register')}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                    >
                                        Register
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                    Dashboard
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <HeroSection onExplore={handleViewAllCommunities} />

            {/* Featured Communities */}
            <FeaturedCommunities
                communities={featuredCommunities}
                loading={loading}
                onJoinCommunity={handleJoinCommunity}
                onViewAll={handleViewAllCommunities}
            />

            {/* Recent Events */}
            <RecentEvents
                events={recentEvents}
                loading={loading}
                onViewAll={handleViewAllEvents}
            />

            {/* Recent Announcements */}
            <RecentAnnouncements
                announcements={recentAnnouncements}
                loading={loading}
            />

            {/* Amenities Section */}
            <AmenitiesSection
                amenities={amenities}
                loading={loading}
            />

            {/* Footer */}
            <Footer />

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => {
                    setShowAuthModal(false);
                    setPendingAction(null);
                }}
                onSuccess={handleAuthSuccess}
            />
        </div>
    );
};

export default LandingPage;
