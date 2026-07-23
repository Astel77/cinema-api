import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboard(): Promise<{
        totalUsers: number;
        totalCustomers: number;
        totalMovies: number;
        totalCinemas: number;
        totalSessions: number;
        totalReservations: number;
        totalRevenue: number;
        topMovies: any[];
    }>;
}
