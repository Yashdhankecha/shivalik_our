import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { communityApi } from '../apis/community';
import { Community as CommunityType } from '../types/CommunityTypes';
import { showMessage } from '../utils/Constant';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { 
  Search, Users, Star,
  ChevronRight, MapPin, Settings, LogOut, Building2,
  UserPlus, Check, Clock, Dumbbell, Waves, Car, Shield, TreePine,
  ShoppingBag, Calendar, Home
} from 'lucide-react';

interface JoinRequest {
  communityId: string;
  status: 'pending' | 'approved' | 'rejected';
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('communities');
  
  // Dynamic data from API
  const [allCommunities, setAllCommunities] = useState<CommunityType[]>([]);
  const [myCommunities, setMyCommunities] = useState<CommunityType[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCommunities();
    fetchJoinRequests();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      console.log('Fetching communities...');
      // Fetch ALL communities without any status filter
      const response = await communityApi.getAllCommunities({ limit: 100 });
      console.log('API Response:', response);
      
      // Backend returns: { message: "...", result: { communities: [...], pagination: {...} } }
      if (response.result) {
        const communities = response.result.communities || [];
        console.log('Communities found:', communities.length, communities);
        setAllCommunities(communities);
        // Filter user's communities - show first 5 for now
        setMyCommunities(communities.slice(0, 5));
      } else if (response.data) {
        // Fallback: check if data is in response.data
        const communities = response.data.communities || response.data || [];
        console.log('Communities found (fallback):', communities.length, communities);
        setAllCommunities(communities);
        setMyCommunities(communities.slice(0, 5));
      } else {
        console.warn('No data in response:', response);
      }
    } catch (error: any) {
      console.error('Error fetching communities:', error);
      console.error('Error details:', error.response?.data);
      showMessage(error.message || 'Failed to load communities', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinRequests = async () => {
    try {
      // Skip if no auth token
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.log('No auth token, skipping join requests fetch');
        return;
      }

      const response = await communityApi.getUserJoinRequests();
      if (response.data) {
        setJoinRequests(response.data.map((req: any) => ({
          communityId: req.communityId?._id || req.communityId,
          status: req.status.toLowerCase()
        })));
      }
    } catch (error) {
      // User might not be authenticated, that's okay
      console.log('Could not fetch join requests:', error);
    }
  };

  const handleJoinCommunity = async (communityId: string) => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      console.log('Join request - Token exists:', !!token);
      console.log('Join request - User data:', userData);
      
      if (!token || !userData) {
        showMessage('Please login to join communities', 'error');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
        return;
      }

      console.log('Sending join request for community:', communityId);
      await communityApi.createJoinRequest({ communityId });
      showMessage('Join request sent to community admin!', 'success');
      // Update join requests state to show "Requested" button
      setJoinRequests([...joinRequests, { communityId, status: 'pending' }]);
    } catch (error: any) {
      console.error('Join request error:', error);
      if (error.message?.includes('Authentication') || error.message?.includes('login')) {
        showMessage('Please login to join communities', 'error');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        showMessage(error.message || 'Failed to send join request', 'error');
      }
    }
  };

  const getJoinRequestStatus = (communityId: string) => {
    const request = joinRequests.find(r => r.communityId === communityId);
    return request?.status;
  };

  const getCommunityColor = (index: number) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-purple-500 to-pink-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-blue-500',
      'from-pink-500 to-rose-500',
      'from-teal-500 to-cyan-500',
      'from-yellow-500 to-orange-500'
    ];
    return colors[index % colors.length];
  };

  const filteredCommunities = allCommunities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const demoAmenities = [
    { icon: Dumbbell, name: 'Gym', color: 'text-red-600' },
    { icon: Waves, name: 'Pool', color: 'text-blue-600' },
    { icon: Car, name: 'Parking', color: 'text-gray-600' },
    { icon: Shield, name: 'Security', color: 'text-green-600' },
    { icon: Users, name: 'Club', color: 'text-purple-600' },
    { icon: TreePine, name: 'Garden', color: 'text-emerald-600' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-950 to-black">
      {/* Top Navigation Bar */}
      <nav className="bg-black/40 backdrop-blur-xl shadow-sm sticky top-0 z-50 border-b border-emerald-900/30">
        <div className="max-w-full px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-green-800 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-green-600 bg-clip-text text-transparent">
                Real Estate Community
              </span>
            </div>

            {/* Right Actions - Profile Only */}
            <div className="flex items-center gap-3">
              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 hover:bg-emerald-900/30 rounded-full px-4 py-2 transition-colors border border-emerald-800/30"
                >
                  <Avatar className="w-9 h-9 border-2 border-emerald-500">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-green-800 text-white font-semibold">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-emerald-100 font-medium">{user?.name || 'User'}</span>
                  <ChevronRight className={`w-4 h-4 text-emerald-300 transition-transform ${showUserMenu ? 'rotate-90' : ''}`} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-emerald-900/40 py-2">
                    <div className="px-4 py-3 border-b border-emerald-900/30">
                      <p className="font-semibold text-emerald-100">{user?.name || 'User'}</p>
                      <p className="text-sm text-gray-400">{user?.email}</p>
                    </div>
                    <button className="w-full px-4 py-2 text-left hover:bg-emerald-900/30 flex items-center gap-3 text-emerald-100" onClick={() => navigate('/profile')}>
                      <Settings className="w-4 h-4 text-emerald-500" />
                      <span>Profile</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left hover:bg-emerald-900/30 flex items-center gap-3 text-emerald-100" onClick={() => navigate('/settings')}>
                      <Settings className="w-4 h-4 text-emerald-500" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left hover:bg-red-900/30 text-red-400 flex items-center gap-3"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex max-w-full">
        {/* LEFT SIDEBAR - My Communities Navigation */}
        <aside className="w-72 bg-gray-900/80 backdrop-blur-sm border-r border-emerald-900/30 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
          <div className="p-4">
            {/* Search Communities */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search communities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 bg-gray-800 border-gray-700 text-emerald-100 placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="mb-6 space-y-2">
              <button
                onClick={() => setActivePage('communities')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activePage === 'communities'
                    ? 'bg-emerald-900/40 text-emerald-100 border border-emerald-700/50'
                    : 'text-gray-400 hover:bg-emerald-900/20 hover:text-emerald-200'
                }`}
              >
                <Building2 className="w-5 h-5" />
                <span className="font-medium">Communities</span>
              </button>
              
              <button
                onClick={() => setActivePage('marketplace')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activePage === 'marketplace'
                    ? 'bg-emerald-900/40 text-emerald-100 border border-emerald-700/50'
                    : 'text-gray-400 hover:bg-emerald-900/20 hover:text-emerald-200'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="font-medium">Marketplace</span>
              </button>
              
              <button
                onClick={() => setActivePage('events')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activePage === 'events'
                    ? 'bg-emerald-900/40 text-emerald-100 border border-emerald-700/50'
                    : 'text-gray-400 hover:bg-emerald-900/20 hover:text-emerald-200'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Events</span>
              </button>
            </div>

            {/* Your Communities */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wide">My Communities</h3>
              </div>
              
              {loading ? (
                <div className="text-center py-4 text-gray-400">Loading...</div>
              ) : myCommunities.length > 0 ? (
                <div className="space-y-1">
                  {myCommunities.map((community, index) => (
                    <div
                      key={community._id}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-900/20 transition-all group cursor-pointer"
                      onClick={() => navigate(`/community/${community._id}`)}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCommunityColor(index)} flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition-transform`}>
                        {community.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-emerald-100 text-sm">{community.name}</p>
                        <p className="text-xs text-gray-400">{community.peopleCount || 0} members</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">No communities joined yet</p>
              )}
            </div>
          </div>
        </aside>

        {/* MAIN SECTION - Browse All Communities */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activePage === 'communities' && (
            <>
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-emerald-100 mb-2">All Communities</h1>
                <p className="text-gray-400">Discover and join communities that match your interests</p>
              </div>

              {/* Communities Grid */}
              {loading ? (
                <div className="text-center py-12 text-gray-400">Loading communities...</div>
              ) : filteredCommunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map((community, index) => {
                const joinStatus = getJoinRequestStatus(community._id);
                const communityImage = community.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800';
                
                return (
                  <Card key={community._id} className="hover:shadow-xl hover:shadow-emerald-900/30 transition-all duration-300 border-2 border-emerald-900/20 hover:border-emerald-700/50 overflow-hidden bg-gray-800 group">
                    <div className="relative">
                      <div className="h-56 overflow-hidden bg-gray-900">
                        <img 
                          src={communityImage} 
                          alt={community.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800';
                          }}
                        />
                      </div>
                      
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
                      
                      {/* Category Badge */}
                      <Badge className="absolute top-3 right-3 bg-emerald-600/90 backdrop-blur-sm text-white border-0 capitalize shadow-lg">
                        {community.category}
                      </Badge>
                      
                      {/* Location badge */}
                      {community.location && typeof community.location === 'string' && (
                        <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs text-emerald-300 font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {community.location}
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-5 space-y-4">
                      <div>
                        <h3 className="font-bold text-xl mb-2 text-emerald-100 line-clamp-1">
                          {community.name}
                        </h3>
                        <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                          {community.description || 'Professional real estate community'}
                        </p>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span className="text-gray-400">
                            <span className="text-emerald-300 font-medium">{community.peopleCount || 0}</span> Members
                          </span>
                        </div>
                      </div>

                      {/* Tags */}
                      {community.tags && Array.isArray(community.tags) && community.tags.length > 0 && (
                        <div>
                          <div className="flex flex-wrap gap-2">
                            {community.tags.slice(0, 3).map((tag, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-1 bg-emerald-900/30 text-emerald-300 text-xs rounded-full border border-emerald-800/30"
                              >
                                #{tag}
                              </span>
                            ))}
                            {community.tags.length > 3 && (
                              <span className="text-xs text-emerald-400">+{community.tags.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      )}

                      <Button 
                        className={`w-full shadow-lg ${
                          joinStatus === 'pending'
                            ? 'bg-yellow-600 hover:bg-yellow-700'
                            : joinStatus === 'approved'
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800'
                        }`}
                        onClick={() => {
                          if (joinStatus === 'approved') {
                            // If approved/joined, open community detail page
                            navigate(`/community/${community._id}`);
                          } else if (!joinStatus) {
                            // If not requested yet, send join request
                            handleJoinCommunity(community._id);
                          }
                          // If pending, do nothing (button shows status)
                        }}
                        disabled={joinStatus === 'pending'}
                      >
                        {joinStatus === 'pending' ? (
                          <>
                            <Clock className="w-4 h-4 mr-2" />
                            Requested
                          </>
                        ) : joinStatus === 'approved' ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Open Community
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Join Community
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No communities found</p>
              <p className="text-gray-500 text-sm">Try adjusting your search</p>
            </div>
          )}
            </>
          )}
          
          {activePage === 'marketplace' && (
            <div className="text-center py-20">
              <ShoppingBag className="w-20 h-20 text-emerald-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-emerald-100 mb-2">Marketplace</h2>
              <p className="text-gray-400">Coming soon...</p>
            </div>
          )}
          
          {activePage === 'events' && (
            <div className="text-center py-20">
              <Calendar className="w-20 h-20 text-emerald-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-emerald-100 mb-2">Events</h2>
              <p className="text-gray-400">Coming soon...</p>
            </div>
          )}
        </main>

        {/* RIGHT SIDEBAR - Removed */}
      </div>
    </div>
  );
};

export default UserDashboard;
