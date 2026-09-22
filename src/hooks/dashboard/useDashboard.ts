import { useQuery } from "@tanstack/react-query";
import { apiPrivate } from "../../lib/api-client";

export interface UserGrowthData {
  name: string;
  users: number;
  active: number;
}

export interface ContentDistribution {
  name: string;
  value: number;
  color: string;
}

export interface RecentActivity {
  id: string;
  user: string;
  action: string;
  time: string;
  type: string;
}

export interface DashboardOverviewResponse {
  totalUsers: number;
  activeSessions: number;
  engagement: number;
  totalContent: number;
  userGrowthData: UserGrowthData[];
  contentDistribution: ContentDistribution[];
  recentActivity: RecentActivity[];
}

interface ApiResponse {
  success: boolean;
  data: DashboardOverviewResponse;
}

export function useDashboardOverview() {
  return useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: async () => {
      const res = await apiPrivate.get<ApiResponse>("/admin/dashboard/overview");
      return res.data.data;
    },
  });
}
