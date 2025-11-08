import { Community } from '../../types/CommunityTypes';

interface FeaturedCommunitiesProps {
    communities: Community[];
    loading: boolean;
    onJoinCommunity: (communityId: string) => void;
    onViewAll: () => void;
}

const FeaturedCommunities = ({ 
    communities, 
    loading, 
    onJoinCommunity, 
    onViewAll 
}: FeaturedCommunitiesProps) => {
    if (loading) {
        return (
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Communities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                                <div className="bg-white p-6 rounded-b-lg border border-t-0">
                                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Featured Communities</h2>
                    <button
                        onClick={onViewAll}
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                        View All →
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {communities.map((community) => (
                        <div key={community._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                            <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 relative">
                                {community.bannerImage ? (
                                    <img
                                        src={community.bannerImage}
                                        alt={community.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                                        {community.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {community.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {community.shortDescription || community.description}
                                </p>
                                
                                <div className="flex items-center text-sm text-gray-500 mb-4">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {community.location?.city}, {community.location?.state}
                                </div>

                                {community.amenityIds && community.amenityIds.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {community.amenityIds.slice(0, 3).map((amenity) => (
                                            <span
                                                key={amenity._id}
                                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                            >
                                                {amenity.name}
                                            </span>
                                        ))}
                                        {community.amenityIds.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                +{community.amenityIds.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                )}

                                <button
                                    onClick={() => onJoinCommunity(community._id)}
                                    className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Join Community
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {communities.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No featured communities available</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedCommunities;
