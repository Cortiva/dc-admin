export const dashboardStats = {
    overview: {
        totalRevenue: 28450000,
        activeJobs: 156,
        totalCustomers: 15234,
        totalArtisans: 3420,
        pendingVerifications: 57,
        completedJobs: 2450,
        totalDisputes: 68,
        openDisputes: 23,
        disputeRate: 2.39,
    },
    charts: {
        training: [
            { name: "Attended DCA Basic", count: 312},
            { name: "Attended DCA Maturity", count: 234},
            { name: "Attended Encounter", count: 178},
            { name: "Attended DLI", count: 67},
        ],
    },
};

export const revenueTrend = [
    { date: "Dec 22", revenue: 124000 },
    { date: "Dec 23", revenue: 118000 },
    { date: "Dec 24", revenue: 98000 },
    { date: "Dec 25", revenue: 45000 },
    { date: "Dec 26", revenue: 86000 },
    { date: "Dec 27", revenue: 142000 },
    { date: "Dec 28", revenue: 156000 },
    { date: "Dec 29", revenue: 138000 },
    { date: "Dec 30", revenue: 142000 },
    { date: "Dec 31", revenue: 98000 },
    { date: "Jan 1", revenue: 112000 },
    { date: "Jan 2", revenue: 145000 },
    { date: "Jan 3", revenue: 168000 },
    { date: "Jan 4", revenue: 172000 },
    { date: "Jan 5", revenue: 158000 },
    { date: "Jan 6", revenue: 162000 },
    { date: "Jan 7", revenue: 175000 },
    { date: "Jan 8", revenue: 182000 },
    { date: "Jan 9", revenue: 178000 },
    { date: "Jan 10", revenue: 195000 },
    { date: "Jan 11", revenue: 188000 },
    { date: "Jan 12", revenue: 192000 },
    { date: "Jan 13", revenue: 205000 },
    { date: "Jan 14", revenue: 212000 },
    { date: "Jan 15", revenue: 208000 },
    { date: "Jan 16", revenue: 198000 },
    { date: "Jan 17", revenue: 215000 },
    { date: "Jan 18", revenue: 225000 },
    { date: "Jan 19", revenue: 242000 },
    { date: "Jan 20", revenue: 145000 },
];

export const topArtisans = [
    {
        id: "1",
        name: "Babatunde Cole",
        trade: "Plumber",
        jobsCompleted: 87,
        revenue: 1950000,
        rating: 4.9,
    },
    {
        id: "2",
        name: "Yusuf Bello",
        trade: "AC Technician",
        jobsCompleted: 72,
        revenue: 1620000,
        rating: 4.8,
    },
    {
        id: "3",
        name: "Chidi Okoye",
        trade: "Electrician",
        jobsCompleted: 68,
        revenue: 1480000,
        rating: 4.7,
    },
    {
        id: "4",
        name: "Emeka Okafor",
        trade: "Carpenter",
        jobsCompleted: 54,
        revenue: 980000,
        rating: 4.6,
    },
    {
        id: "5",
        name: "Amara Eze",
        trade: "Painter",
        jobsCompleted: 48,
        revenue: 720000,
        rating: 4.8,
    },
];

export const verificationQueue = {
    pending: 57,
    priority: [
        {
            id: "1",
            name: "Chidi Okonkwo",
            trade: "Plumber",
            waitingHours: 47,
            completionPercentage: 95,
        },
        {
            id: "2",
            name: "Emeka Nwosu",
            trade: "Electrician",
            waitingHours: 42,
            completionPercentage: 88,
        },
        {
            id: "3",
            name: "Adekunle Gold",
            trade: "AC Technician",
            waitingHours: 24,
            completionPercentage: 100,
        },
    ],
};

export const activeJobs = [
    {
        id: "1",
        jobCode: "VJC-2024123-001",
        title: "Leaking Kitchen Pipe",
        customer: "Amara Okafor",
        artisan: "Babatunde Cole",
        status: "in_progress",
        price: 27000,
    },
    {
        id: "2",
        jobCode: "VJC-2024124-002",
        title: "No Power in Bedroom",
        customer: "Mr. Johnson",
        artisan: "Chidi Okoye",
        status: "en_route",
        price: 15000,
    },
    {
        id: "3",
        jobCode: "VJC-2024125-003",
        title: "AC Not Cooling",
        customer: "Mrs. Adebayo",
        artisan: "Yusuf Bello",
        status: "accepted",
        price: 35000,
    },
    {
        id: "4",
        jobCode: "VJC-2024126-004",
        title: "Broken Wardrobe",
        customer: "Chioma Eze",
        artisan: "Emeka Okafor",
        status: "in_progress",
        price: 12000,
    },
];

export const recentActivity = [
    {
        id: "1",
        type: "job_completed",
        message: "Job VJC-2024123-001 completed by Babatunde Cole",
        timestamp: "2025-01-20T09:15:00Z",
        importance: "normal",
    },
    {
        id: "2",
        type: "dispute_raised",
        message: "New dispute raised by Mrs. Adebayo",
        timestamp: "2025-01-20T08:45:00Z",
        importance: "high",
    },
    {
        id: "3",
        type: "artisan_verified",
        message: "Artisan Chidi Okonkwo verified",
        timestamp: "2025-01-20T08:30:00Z",
        importance: "normal",
    },
    {
        id: "4",
        type: "customer_registered",
        message: "New customer registered: Amara Okafor",
        timestamp: "2025-01-20T08:15:00Z",
        importance: "low",
    },
    {
        id: "5",
        type: "payment_failed",
        message: "Payout for Job VJC-2024125-003 failed",
        timestamp: "2025-01-20T07:00:00Z",
        importance: "high",
    },
];

export const disputeList = [
    {
        id: "1",
        jobCode: "VJC-2024123-001",
        reason: "Work not completed",
        raisedBy: "customer",
        daysOpen: 2,
        priority: "high",
    },
    {
        id: "2",
        jobCode: "VJC-2024124-002",
        reason: "Customer refuses to pay",
        raisedBy: "artisan",
        daysOpen: 1,
        priority: "high",
    },
    {
        id: "3",
        jobCode: "VJC-2024126-004",
        reason: "Poor quality work",
        raisedBy: "customer",
        daysOpen: 0,
        priority: "medium",
    },
];

export const alerts = {
    critical: [
        {
            message:
                "Payment gateway response time increased by 300% in the last hour",
        },
    ],
};
