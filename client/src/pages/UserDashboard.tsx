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
  Home, Search, Bell, MessageSquare, Plus, Users, TrendingUp, 
  Calendar, FileText, Image, Heart, MessageCircle, Share2, MoreHorizontal,
  ChevronRight, Award, Star, MapPin, Settings, LogOut, Sparkles, Building2,
  UserPlus, Check, Clock
} from 'lucide-react';

interface JoinRequest {
  communityId: string;
  status: 'pending' | 'approved' | 'rejected';
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  
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
      const response = await communityApi.getAllCommunities();
      if (response.data) {
        const communities = response.data.communities || response.data || [];
        setAllCommunities(communities);
        // Filter user's communities (this would come from a separate API in production)
        // For now, we'll show featured ones as "my communities"
        setMyCommunities(communities.filter((c: CommunityType) => c.isFeatured).slice(0, 3));
      }
    } catch (error: any) {
      console.error('Error fetching communities:', error);
      showMessage(error.message || 'Failed to load communities', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinRequests = async () => {
    try {
      const response = await communityApi.getUserJoinRequests();
      if (response.data) {
        setJoinRequests(response.data.map((req: any) => ({
          communityId: req.communityId?._id || req.communityId,
          status: req.status.toLowerCase()
        })));
      }
    } catch (error) {
      // User might not be authenticated, that's okay
      console.log('Could not fetch join requests');
    }
  };

  const handleJoinCommunity = async (communityId: string) => {
    try {
      await communityApi.createJoinRequest({ communityId });
      showMessage('Join request sent successfully!', 'success');
      // Update join requests state
      setJoinRequests([...joinRequests, { communityId, status: 'pending' }]);
    } catch (error: any) {
      showMessage(error.message || 'Failed to send join request', 'error');
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

  const topContributors = [
    { name: 'Alex Thompson', posts: 28, avatar: 'AT' },
    { name: 'Maria Garcia', posts: 24, avatar: 'MG' },
    { name: 'James Wilson', posts: 19, avatar: 'JW' }
  ];

  const upcomingEvents = [
    { title: 'Holiday Party', date: 'Dec 15', time: '6:00 PM', attendees: 45 },
    { title: 'Yoga Session', date: 'Dec 10', time: '8:00 AM', attendees: 18 },
    { title: 'Board Meeting', date: 'Dec 12', time: '7:00 PM', attendees: 12 }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-full px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Real Estate Community
              </span>
            </div>

            {/* Central Search */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search communities, posts, people..."
                  className="pl-12 h-11 bg-gray-50 border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50">
                <Home className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 relative">
                <MessageSquare className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              
              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-1 pr-3 transition-colors"
                >
                  <Avatar className="w-9 h-9 border-2 border-blue-500">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronRight className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-90' : ''}`} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">{user?.name || 'User'}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-3"
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
        <aside className="w-72 bg-white/80 backdrop-blur-sm border-r border-gray-200 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
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
                  className="pl-10 h-10 bg-gray-50"
                />
              </div>
            </div>

            {/* Your Communities */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">My Communities</h3>
              </div>
              
              {loading ? (
                <div className="text-center py-4 text-gray-500">Loading...</div>
              ) : myCommunities.length > 0 ? (
                <div className="space-y-1">
                  {myCommunities.map((community, index) => (
                    <div
                      key={community._id}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCommunityColor(index)} flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition-transform`}>
                        {community.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-900 text-sm">{community.name}</p>
                        <p className="text-xs text-gray-500">{community.totalUnits || 0} units</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No communities joined yet</p>
              )}
            </div>

            {/* Browse Communities Button */}
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
              onClick={() => setActiveTab('browse')}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Browse Communities
            </Button>
          </div>
        </aside>

        {/* MAIN SECTION - Browse All Communities */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Communities</h1>
            <p className="text-gray-600">Discover and join communities that match your interests</p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {['All', 'Featured', 'Popular', 'Newest'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.toLowerCase()
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Communities Grid */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading communities...</div>
          ) : filteredCommunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map((community, index) => {
                const joinStatus = getJoinRequestStatus(community._id);
                return (
                  <Card key={community._id} className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200">
                    <div className="relative">
                      <div className={`h-40 bg-gradient-to-br ${getCommunityColor(index)} rounded-t-xl`}>
                        {community.logo && (
                          <img src={community.logo} alt={community.name} className="w-full h-full object-cover rounded-t-xl" />
                        )}
                      </div>
                      {community.isFeatured && (
                        <Badge className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 border-0">
                          <Star className="w-3 h-3 mr-1 fill-yellow-900" />
                          Featured
                        </Badge>
                      )}
                      <Badge className="absolute top-3 right-3 bg-white/90 text-gray-700">
                        {community.status}
                      </Badge>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-bold text-lg mb-2">{community.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {community.description || 'A wonderful community to be part of'}
                      </p>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        {community.location?.city && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span>{community.location.city}, {community.location.state}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          <span>{community.totalUnits} Total Units • {community.occupiedUnits} Occupied</span>
                        </div>
                      </div>

                      {community.amenityIds && community.amenityIds.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {community.amenityIds.slice(0, 3).map((amenity: any, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {amenity.name || amenity}
                            </Badge>
                          ))}
                          {community.amenityIds.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{community.amenityIds.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      <Button 
                        className={`w-full ${
                          joinStatus === 'pending'
                            ? 'bg-yellow-500 hover:bg-yellow-600'
                            : joinStatus === 'approved'
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                        }`}
                        onClick={() => {
                          if (joinStatus) {
                            navigate(`/community/${community._id}`);
                          } else {
                            handleJoinCommunity(community._id);
                          }
                        }}
                      >
                        {joinStatus === 'pending' ? (
                          <>
                            <Clock className="w-4 h-4 mr-2" />
                            View Community
                          </>
                        ) : joinStatus === 'approved' ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Open Dashboard
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
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No communities found</p>
              <p className="text-gray-400 text-sm">Try adjusting your search</p>
            </div>
          )}
        </main>

        {/* RIGHT SIDEBAR - Utility Panel */}
        <aside className="w-80 p-6 space-y-6 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
          {/* Community Managers */}
          <Card className="border-2 border-blue-100">
            <CardHeader className="pb-3">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Community Managers
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {['Mike Chen', 'Lisa Wang'].map((manager, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {manager.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{manager}</p>
                    <p className="text-xs text-gray-500">Manager</p>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 px-3 text-xs">
                    Message
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Contributors */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100">
            <CardHeader className="pb-3">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Top Contributors
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {topContributors.map((contributor, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold text-sm">
                    {i + 1}
                  </div>
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                      {contributor.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{contributor.name}</p>
                    <p className="text-xs text-gray-600">{contributor.posts} posts</p>
                  </div>
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100">
            <CardHeader className="pb-3">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Upcoming Events
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event, i) => (
                <div key={i} className="bg-white rounded-lg p-3 hover:shadow-md transition-shadow">
                  <p className="font-semibold text-sm text-gray-900 mb-1">{event.title}</p>
                  <p className="text-xs text-gray-600 mb-2">{event.date} • {event.time}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{event.attendees} attending</span>
                    <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                      Join
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-2 border-orange-100">
            <CardHeader className="pb-3">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-600" />
                Quick Actions
              </h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2 bg-white hover:bg-orange-50">
                <FileText className="w-4 h-4" />
                View Documents
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 bg-white hover:bg-orange-50">
                <Calendar className="w-4 h-4" />
                Book Amenity
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 bg-white hover:bg-orange-50">
                <MessageSquare className="w-4 h-4" />
                Report Issue
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default UserDashboard;
