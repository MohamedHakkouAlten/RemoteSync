/**
 * Associate Dashboard DTO
 * Contains all information needed for the associate dashboard
 */
export interface AssociateDashboardDTO {
    // Current project information
    currentProject?: {
        id: string;
        name: string;
        client: string;
        startDate: string;
        endDate: string;
    };
    
    // Upcoming events/rotations
    upcomingRotations: {
        id: string;
        date: string;
        type: string;
        description: string;
    }[];
    
    // Recent notifications
    recentNotifications: {
        id: string;
        message: string;
        date: string;
        read: boolean;
    }[];
    
    // Project stats
    stats: {
        totalProjects: number;
        currentProjects: number;
        completedProjects: number;
    };
}
