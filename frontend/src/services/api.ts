import axios from "axios";
import { ActivityFormInput, Entry, AIReport, SummaryStats, AdminAnalytics, UserProfile } from "../types";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export const entryService = {
  async createEntry(data: ActivityFormInput & { clientUuid?: string }): Promise<{ success: boolean; data: Entry }> {
    const storedUser = localStorage.getItem("ecosense_user");
    let userEmail: string | undefined;
    let userId: string | undefined;
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        userEmail = u.email;
        userId = u.id;
      } catch {}
    }

    const response = await api.post("/entries", { ...data, userEmail, userId });
    return response.data;
  },

  async syncBatch(entries: any[]): Promise<{ success: boolean; syncedCount: number; data: Entry[] }> {
    const response = await api.post("/entries/sync", { entries });
    return response.data;
  },

  async getEntries(params?: {
    page?: number;
    limit?: number;
    search?: string;
    transportMode?: string;
    energySource?: string;
    sortBy?: string;
    order?: "asc" | "desc";
  }): Promise<{
    success: boolean;
    data: Entry[];
    pagination: { page: number; limit: number; totalCount: number; totalPages: number };
  }> {
    const response = await api.get("/entries", { params });
    return response.data;
  },

  async getEntryById(id: string): Promise<{ success: boolean; data: Entry }> {
    const response = await api.get(`/entries/${id}`);
    return response.data;
  },

  async deleteEntry(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/entries/${id}`);
    return response.data;
  },
};

export const summaryService = {
  async getSummary(): Promise<{ success: boolean; data: SummaryStats }> {
    const response = await api.get("/summary");
    return response.data;
  },
};

export const reportService = {
  async generateReport(entryId?: string): Promise<{ success: boolean; data: AIReport }> {
    const response = await api.post("/report", { entryId });
    return response.data;
  },
};

export const adminService = {
  async getAnalytics(): Promise<{ success: boolean; data: AdminAnalytics }> {
    const response = await api.get("/admin/analytics");
    return response.data;
  },
};

export const profileService = {
  async getProfile(): Promise<{ success: boolean; data: UserProfile }> {
    const response = await api.get("/profile");
    return response.data;
  },

  async updateProfile(data: Partial<UserProfile>): Promise<{ success: boolean; data: UserProfile }> {
    const response = await api.put("/profile", data);
    return response.data;
  },
};

export const telemetryService = {
  async predictMode(speedKmH: number, distanceKm: number) {
    const response = await api.post("/telemetry/predict-mode", { speedKmH, distanceKm });
    return response.data;
  },

  async submitCorrection(payload: {
    entryId?: string;
    predictedMode: string;
    actualMode: string;
    speedKmH?: number;
    distanceKm?: number;
    reason?: string;
  }) {
    const response = await api.post("/telemetry/correct-mode", payload);
    return response.data;
  },

  async getMultiTimeframeSummary(timeframe: "daily" | "weekly" | "monthly") {
    const response = await api.get("/telemetry/summaries", { params: { timeframe } });
    return response.data;
  },
};

