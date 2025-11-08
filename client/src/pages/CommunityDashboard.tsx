import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { communityApi } from '../apis/community';
import { Community } from '../types/CommunityTypes';
import { showMessage } from '../utils/Constant';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import {
  ArrowLeft, Users, MapPin, Building2, Plus, Send, Heart,
  MessageCircle, Share2, ShoppingBag, Calendar, UserCheck,
  Clock, CheckCircle, Upload, QrCode, ScanLine, X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

interface Pulse {
  _id: string;
  title: string;
  description: string;
  territory: string;
  attachment?: string;
  author: {
    name: string;
    avatar?: string;
  };
  likes: number;
  comments: number;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface MarketplaceListing {
  _id: string;
  type: 'want' | 'offer';
  title: string;
  description: string;
  price: number;
  attachment?: string;
  author: {
    name: string;
    phone?: string;
  };
  createdAt: string;
  status: 'pending' | 'approved';
}

interface Member {
  _id: string;
  name: string;
  role: string;
  avatar?: string;
  phone?: string;
  email?: string;
  isManager: boolean;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  limit: number;
  registered: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  isRegistered: boolean;
  registrationStatus?: 'pending' | 'confirmed';
  attendanceMarked: boolean;
}

const CommunityDashboard = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [community, setCommunity] = useState<Community | null>(null);
  const [activeTab, setActiveTab] = useState('pulses');
  const [loading, setLoading] = useState(true);
  const [joinStatus, setJoinStatus] = useState<'not-joined' | 'requested' | 'joined'>('not-joined');

  // Tab data
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [marketplace, setMarketplace] = useState<MarketplaceListing[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  // Dialogs
  const [showPulseDialog, setShowPulseDialog] = useState(false);
  const [showListingDialog, setShowListingDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Forms
  const [pulseForm, setPulseForm] = useState({
    title: '',
    description: '',
    territory: '',
    attachment: null as File | null
  });

  const [listingForm, setListingForm] = useState({
    type: 'offer' as 'want' | 'offer',
    title: '',
    description: '',
    price: '',
    attachment: null as File | null
  });

  useEffect(() => {
    if (communityId) {
      fetchCommunityData();
      checkJoinStatus();
    }
  }, [communityId]);

  useEffect(() => {
    if (joinStatus === 'joined') {
      fetchTabData();
    }
  }, [activeTab, joinStatus]);

  const fetchCommunityData = async () => {
    try {
      setLoading(true);
      const response = await communityApi.getCommunityById(communityId!);
      setCommunity(response.data);
    } catch (error: any) {
      showMessage(error.message || 'Failed to load community', 'error');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const checkJoinStatus = async () => {
    if (!isAuthenticated) {
      setJoinStatus('not-joined');
      return;
    }

    try {
      const response = await communityApi.getUserJoinRequests();
      const request = response.data.find((r: any) => 
        r.communityId?._id === communityId || r.communityId === communityId
      );

      if (request) {
        setJoinStatus(request.status === 'Approved' ? 'joined' : 'requested');
      }
    } catch (error) {
      console.log('Could not check join status');
    }
  };

  const fetchTabData = async () => {
    // In production, these would be separate API calls
    // For now, using mock data
    if (activeTab === 'pulses') {
      // await fetchPulses();
    } else if (activeTab === 'marketplace') {
      // await fetchMarketplace();
    } else if (activeTab === 'directory') {
      // await fetchMembers();
    } else if (activeTab === 'events') {
      // await fetchEvents();
    }
  };

  const handleJoinCommunity = async () => {
    if (!isAuthenticated) {
      showMessage('Please login to join communities', 'error');
      navigate('/login');
      return;
    }

    try {
      await communityApi.createJoinRequest({ communityId: communityId! });
      setJoinStatus('requested');
      showMessage('Join request sent! Waiting for manager approval.', 'success');
    } catch (error: any) {
      showMessage(error.message || 'Failed to send join request', 'error');
    }
  };

  const handleCreatePulse = async () => {
    if (!pulseForm.title || !pulseForm.description || !pulseForm.territory) {
      showMessage('Please fill all required fields', 'error');
      return;
    }

    try {
      // In production: upload image and create pulse via API
      // const formData = new FormData();
      // formData.append('title', pulseForm.title);
      // formData.append('description', pulseForm.description);
      // formData.append('territory', pulseForm.territory);
      // formData.append('communityId', communityId!);
      // if (pulseForm.attachment) formData.append('attachment', pulseForm.attachment);
      // await apiClient.post('/community/pulses', formData);

      showMessage('Pulse submitted for approval!', 'success');
      setShowPulseDialog(false);
      setPulseForm({ title: '', description: '', territory: '', attachment: null });
    } catch (error: any) {
      showMessage(error.message || 'Failed to create pulse', 'error');
    }
  };

  const handleCreateListing = async () => {
    if (!listingForm.title || !listingForm.description || !listingForm.price) {
      showMessage('Please fill all required fields', 'error');
      return;
    }

    try {
      showMessage('Listing submitted for approval!', 'success');
      setShowListingDialog(false);
      setListingForm({ type: 'offer', title: '', description: '', price: '', attachment: null });
    } catch (error: any) {
      showMessage(error.message || 'Failed to create listing', 'error');
    }
  };

  const handleRegisterEvent = async (eventId: string) => {
    if (!isAuthenticated) {
      showMessage('Please login to register for events', 'error');
      navigate('/login');
      return;
    }

    try {
      // await apiClient.post(`/community/events/${eventId}/register`);
      showMessage('Registration request sent!', 'success');
      // Update event status
      setEvents(events.map(e => 
        e._id === eventId 
          ? { ...e, isRegistered: true, registrationStatus: 'pending' }
          : e
      ));
    } catch (error: any) {
      showMessage(error.message || 'Failed to register', 'error');
    }
  };

  const handleMarkAttendance = (event: Event) => {
    setSelectedEvent(event);
    setShowQRDialog(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading community...</p>
        </div>
      </div>
    );
  }

  if (!community) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Community Dashboard</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Community Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl font-bold">
                {community.logo ? (
                  <img src={community.logo} alt={community.name} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  community.name.substring(0, 2).toUpperCase()
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{community.name}</h1>
                <p className="text-white/90 flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {community.totalUnits} Units
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {community.location.city}, {community.location.state}
                  </span>
                </p>
              </div>
            </div>

            {/* Join Button */}
            <Button 
              className={`px-6 font-semibold ${
                joinStatus === 'joined' 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : joinStatus === 'requested'
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              }`}
              onClick={handleJoinCommunity}
              disabled={joinStatus !== 'not-joined'}
            >
              {joinStatus === 'joined' && <CheckCircle className="w-4 h-4 mr-2" />}
              {joinStatus === 'requested' && <Clock className="w-4 h-4 mr-2" />}
              {joinStatus === 'joined' ? 'Joined' : joinStatus === 'requested' ? 'Requested' : 'Join Community'}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3">
            {['Pulses', 'Marketplace', 'Directory', 'Events'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  if (joinStatus !== 'joined' && tab.toLowerCase() !== 'pulses') {
                    showMessage('Please join the community to access this tab', 'error');
                    return;
                  }
                  setActiveTab(tab.toLowerCase());
                }}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.toLowerCase()
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${joinStatus !== 'joined' && tab.toLowerCase() !== 'pulses' ? 'opacity-50' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {joinStatus !== 'joined' && activeTab !== 'pulses' ? (
          <Card className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Join to Access</h3>
            <p className="text-gray-600 mb-4">You need to join this community to view {activeTab}</p>
            <Button onClick={handleJoinCommunity} className="bg-gradient-to-r from-blue-600 to-purple-600">
              Join Community
            </Button>
          </Card>
        ) : (
          <>
            {/* Pulses Tab */}
            {activeTab === 'pulses' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Community Pulses</h2>
                  {joinStatus === 'joined' && (
                    <Dialog open={showPulseDialog} onOpenChange={setShowPulseDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Pulse
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Create New Pulse</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Territory</label>
                            <Select value={pulseForm.territory} onValueChange={(value) => setPulseForm({...pulseForm, territory: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select territory" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="general">General</SelectItem>
                                <SelectItem value="block-a">Block A</SelectItem>
                                <SelectItem value="block-b">Block B</SelectItem>
                                <SelectItem value="block-c">Block C</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Title</label>
                            <Input 
                              value={pulseForm.title}
                              onChange={(e) => setPulseForm({...pulseForm, title: e.target.value})}
                              placeholder="Enter pulse title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <Textarea
                              value={pulseForm.description}
                              onChange={(e) => setPulseForm({...pulseForm, description: e.target.value})}
                              placeholder="What's on your mind?"
                              rows={4}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Attachment (1 image)</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                              <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                              <input 
                                type="file" 
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => setPulseForm({...pulseForm, attachment: e.target.files?.[0] || null})}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setShowPulseDialog(false)} className="flex-1">
                              Cancel
                            </Button>
                            <Button onClick={handleCreatePulse} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
                              <Send className="w-4 h-4 mr-2" />
                              Submit for Approval
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                {/* Pulses Feed */}
                <div className="space-y-4">
                  {pulses.length === 0 ? (
                    <Card className="p-12 text-center">
                      <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Pulses Yet</h3>
                      <p className="text-gray-600">Be the first to share something!</p>
                    </Card>
                  ) : (
                    pulses.map((pulse) => (
                      <Card key={pulse._id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-3 mb-4">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                {pulse.author.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-bold text-gray-900">{pulse.author.name}</p>
                                  <p className="text-sm text-gray-500">{new Date(pulse.createdAt).toLocaleDateString()}</p>
                                </div>
                                <Badge>{pulse.territory}</Badge>
                              </div>
                            </div>
                          </div>
                          <h3 className="text-lg font-bold mb-2">{pulse.title}</h3>
                          <p className="text-gray-700 mb-4">{pulse.description}</p>
                          {pulse.attachment && (
                            <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                          )}
                          <div className="flex items-center gap-6 pt-4 border-t">
                            <Button variant="ghost" className="gap-2">
                              <Heart className="w-5 h-5" />
                              {pulse.likes}
                            </Button>
                            <Button variant="ghost" className="gap-2">
                              <MessageCircle className="w-5 h-5" />
                              {pulse.comments}
                            </Button>
                            <Button variant="ghost" className="gap-2">
                              <Share2 className="w-5 h-5" />
                              Share
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Marketplace Tab */}
            {activeTab === 'marketplace' && joinStatus === 'joined' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Marketplace</h2>
                  <Dialog open={showListingDialog} onOpenChange={setShowListingDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Listing
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create Marketplace Listing</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Post Type</label>
                          <Select value={listingForm.type} onValueChange={(value: 'want' | 'offer') => setListingForm({...listingForm, type: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="offer">Offer</SelectItem>
                              <SelectItem value="want">Want</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Title</label>
                          <Input 
                            value={listingForm.title}
                            onChange={(e) => setListingForm({...listingForm, title: e.target.value})}
                            placeholder="Enter listing title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Description</label>
                          <Textarea
                            value={listingForm.description}
                            onChange={(e) => setListingForm({...listingForm, description: e.target.value})}
                            placeholder="Describe your listing"
                            rows={4}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Price / Budget</label>
                          <Input 
                            type="number"
                            value={listingForm.price}
                            onChange={(e) => setListingForm({...listingForm, price: e.target.value})}
                            placeholder="Enter amount"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Attachment Image</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Click to upload image</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setShowListingDialog(false)} className="flex-1">
                            Cancel
                          </Button>
                          <Button onClick={handleCreateListing} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
                            Publish
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {marketplace.length === 0 ? (
                    <div className="col-span-full">
                      <Card className="p-12 text-center">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Listings Yet</h3>
                        <p className="text-gray-600">Be the first to create a listing!</p>
                      </Card>
                    </div>
                  ) : (
                    marketplace.map((listing) => (
                      <Card key={listing._id} className="hover:shadow-lg transition-shadow">
                        <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500"></div>
                        <CardContent className="p-4">
                          <Badge className={listing.type === 'offer' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                            {listing.type.toUpperCase()}
                          </Badge>
                          <h3 className="font-bold text-lg mt-2 mb-1">{listing.title}</h3>
                          <p className="text-2xl font-bold text-blue-600 mb-2">₹{listing.price}</p>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{listing.description}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">by {listing.author.name}</p>
                            <Button size="sm">Contact</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Directory Tab */}
            {activeTab === 'directory' && joinStatus === 'joined' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Directory</h2>
                
                {/* Community Manager */}
                <Card className="mb-6 border-2 border-blue-200 bg-blue-50">
                  <CardHeader>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-blue-600" />
                      Community Manager
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xl font-bold">
                          CM
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-lg">Manager Name</p>
                        <p className="text-sm text-gray-600">manager@community.com</p>
                        <p className="text-sm text-gray-600">+91 98765 43210</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Members List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members.length === 0 ? (
                    <div className="col-span-full">
                      <Card className="p-12 text-center">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Members Yet</h3>
                        <p className="text-gray-600">Be the first member!</p>
                      </Card>
                    </div>
                  ) : (
                    members.map((member) => (
                      <Card key={member._id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                              {member.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-semibold">{member.name}</p>
                            <p className="text-sm text-gray-600">{member.role}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && joinStatus === 'joined' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Events</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.length === 0 ? (
                    <div className="col-span-full">
                      <Card className="p-12 text-center">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Events Yet</h3>
                        <p className="text-gray-600">Check back later for upcoming events!</p>
                      </Card>
                    </div>
                  ) : (
                    events.map((event) => (
                      <Card key={event._id} className="hover:shadow-xl transition-shadow">
                        <div className="h-40 bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                          <Calendar className="w-16 h-16 text-white/50" />
                        </div>
                        <CardContent className="p-4">
                          <Badge className={
                            event.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                            event.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }>
                            {event.status}
                          </Badge>
                          <h3 className="font-bold text-lg mt-2 mb-1">{event.title}</h3>
                          <div className="space-y-1 text-sm text-gray-600 mb-3">
                            <p className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {event.date} at {event.time}
                            </p>
                            <p className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {event.location}
                            </p>
                            <p className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              {event.registered}/{event.limit} Registered
                            </p>
                          </div>

                          {/* Registration/Attendance Buttons */}
                          {event.status === 'upcoming' && !event.isRegistered && (
                            <Button 
                              className="w-full"
                              onClick={() => handleRegisterEvent(event._id)}
                              disabled={event.registered >= event.limit}
                            >
                              {event.registered >= event.limit ? 'Event Full' : 'Register'}
                            </Button>
                          )}

                          {event.isRegistered && event.registrationStatus === 'pending' && (
                            <Button className="w-full bg-yellow-500 hover:bg-yellow-600" disabled>
                              <Clock className="w-4 h-4 mr-2" />
                              Pending Approval
                            </Button>
                          )}

                          {event.isRegistered && event.registrationStatus === 'confirmed' && event.status === 'upcoming' && (
                            <Button className="w-full bg-green-500 hover:bg-green-600" disabled>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Registered
                            </Button>
                          )}

                          {event.isRegistered && event.status === 'ongoing' && !event.attendanceMarked && (
                            <Button 
                              className="w-full bg-purple-600 hover:bg-purple-700"
                              onClick={() => handleMarkAttendance(event)}
                            >
                              <QrCode className="w-4 h-4 mr-2" />
                              Mark Attendance
                            </Button>
                          )}

                          {event.attendanceMarked && (
                            <Button className="w-full bg-green-500" disabled>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Attendance Marked
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <div className="w-64 h-64 bg-white border-4 border-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <QrCode className="w-32 h-32 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Show this QR code to the event organizer to mark your attendance
            </p>
            <p className="text-xs text-gray-500">
              Event: {selectedEvent?.title}
            </p>
          </div>
          <Button onClick={() => setShowQRDialog(false)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunityDashboard;
