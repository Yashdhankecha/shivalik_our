const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const seedProfessionalCommunities = async () => {
    try {
        // Connect to MongoDB
        const dbUrl = process.env.ENTRYTRACKING_DB_URL || 'mongodb+srv://harshvyas:karanharshyash@rcommunity.mur42js.mongodb.net/shivalik_db';
        const dbName = process.env.DB_NAME || 'shivalik_db';
        
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(dbUrl, {
            dbName: dbName
        });
        console.log('✅ Connected to MongoDB');

        // Import model after connection
        const CommunitiesModel = mongoose.model('communities', new mongoose.Schema({
            name: { type: String, required: true, unique: true },
            description: { type: String, required: true },
            category: { type: String, required: true },
            image: { type: String },
            managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
            members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
            pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
            pulses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'pulses' }],
            marketplaceListings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'marketplaceListings' }],
            events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'events' }],
            peopleCount: { type: Number, default: 0 },
            location: { type: String },
            tags: [{ type: String }],
            status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
            createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
            deletedAt: { type: Date },
            isDeleted: { type: Boolean, default: false }
        }, { timestamps: true }));

        // Clear existing communities (optional - comment out if you want to keep old data)
        // await CommunitiesModel.deleteMany({});
        // console.log('🗑️  Cleared existing communities');

        // Get a valid managerId from existing users
        const User = mongoose.model('users', new mongoose.Schema({}, { strict: false }));
        let managerUser = await User.findOne({});
        
        if (!managerUser) {
            console.log('⚠️  No users found. Creating a default manager user...');
            managerUser = await User.create({
                name: 'Community Manager',
                email: 'manager@community.com',
                password: 'password123' // In production, this should be hashed
            });
        }
        
        const managerId = managerUser._id;
        console.log(`👤 Using manager ID: ${managerId}`);

        // Seed data for professional communities
        const communities = [
            {
                name: "Women in Real Estate",
                description: "Empowering women professionals across the real estate industry with mentorship, collaboration, and growth opportunities.",
                category: "Professionals",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800",
                managerId: managerId,
                members: [],
                pendingRequests: [],
                pulses: [],
                marketplaceListings: [],
                events: [],
                peopleCount: 0,
                location: "Ahmedabad City",
                tags: ["real estate", "women", "networking"],
                status: "active"
            },
            {
                name: "South Ahmedabad Developers",
                description: "Builders and developers from South Ahmedabad sharing updates, collaborations, and market insights.",
                category: "Developers",
                image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
                managerId: managerId,
                members: [],
                pendingRequests: [],
                pulses: [],
                marketplaceListings: [],
                events: [],
                peopleCount: 0,
                location: "South Ahmedabad",
                tags: ["developers", "builders", "south zone"],
                status: "active"
            },
            {
                name: "Narol Brokers Circle",
                description: "A professional network for property brokers operating in and around Narol for verified deals and partnerships.",
                category: "Brokers",
                image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
                managerId: managerId,
                members: [],
                pendingRequests: [],
                pulses: [],
                marketplaceListings: [],
                events: [],
                peopleCount: 0,
                location: "Narol, Ahmedabad",
                tags: ["brokers", "networking", "real estate"],
                status: "active"
            },
            {
                name: "Ahmedabad Property Investors",
                description: "Investors group tracking ROI, market trends, and project performance across the Ahmedabad region.",
                category: "Investors",
                image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
                managerId: managerId,
                members: [],
                pendingRequests: [],
                pulses: [],
                marketplaceListings: [],
                events: [],
                peopleCount: 0,
                location: "Ahmedabad",
                tags: ["investment", "ROI", "real estate"],
                status: "active"
            },
            {
                name: "Real Estate Legal Experts",
                description: "Community of legal advisors specializing in property law, RERA compliance, and developer documentation.",
                category: "Consultants",
                image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800",
                managerId: managerId,
                members: [],
                pendingRequests: [],
                pulses: [],
                marketplaceListings: [],
                events: [],
                peopleCount: 0,
                location: "Ahmedabad",
                tags: ["law", "consultants", "rera"],
                status: "active"
            },
            {
                name: "CRE Tech Professionals",
                description: "A group of tech experts, data scientists, and marketers shaping digital transformation in commercial real estate.",
                category: "Tech Professionals",
                image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
                managerId: managerId,
                members: [],
                pendingRequests: [],
                pulses: [],
                marketplaceListings: [],
                events: [],
                peopleCount: 0,
                location: "Gujarat Region",
                tags: ["technology", "proptech", "innovation"],
                status: "active"
            },
            {
                name: "Gujarat Builders Association",
                description: "State-level builders network for policy discussions, regulatory compliance, and industry best practices.",
                category: "Builders",
                image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800",
                managerId: managerId,
                members: [],
                pendingRequests: [],
                pulses: [],
                marketplaceListings: [],
                events: [],
                peopleCount: 0,
                location: "Gujarat",
                tags: ["builders", "association", "policy"],
                status: "active"
            },
            {
                name: "Luxury Real Estate Circle",
                description: "Exclusive network for high-end property deals, luxury project collaborations, and premium client connections.",
                category: "Professionals",
                image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
                managerId: managerId,
                members: [],
                pendingRequests: [],
                pulses: [],
                marketplaceListings: [],
                events: [],
                peopleCount: 0,
                location: "Ahmedabad",
                tags: ["luxury", "premium", "high-end"],
                status: "active"
            }
        ];

        // Insert communities
        const insertedCommunities = await CommunitiesModel.insertMany(communities);
        console.log(`✅ Successfully seeded ${insertedCommunities.length} professional communities`);
        
        // Display seeded communities
        insertedCommunities.forEach((community, index) => {
            console.log(`\n${index + 1}. ${community.name}`);
            console.log(`   Category: ${community.category}`);
            console.log(`   Location: ${community.location}`);
            console.log(`   Tags: ${community.tags.join(', ')}`);
        });

        console.log('\n🎉 Database seeding completed successfully!');
        
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
        process.exit(0);
    }
};

// Run the seed function
seedProfessionalCommunities();
