import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:18088';

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  storage_type: 'local' | 'gdrive' | 'dropbox' | 's3';
  storage_config: Record<string, any>;
  search_prompt: string;
  created_at: string;
  updated_at: string;
}

export interface TenantListResponse {
  tenants: Tenant[];
  total: number;
  page: number;
  limit: number;
}

export interface TenantCreateRequest {
  name: string;
  email: string;
  storage_type: 'local' | 'gdrive' | 'dropbox' | 's3';
  storage_config: Record<string, any>;
  search_prompt: string;
}

export interface TenantUpdateRequest {
  name?: string;
  email?: string;
  search_prompt?: string;
  storage_config?: Record<string, any>;
}

export interface ProcessedFile {
  id: string;
  tenant_id: string;
  file_path: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface TenantReport {
  id: string;
  tenant_id: string;
  period_start: string;
  period_end: string;
  total_files: number;
  successful_analyses: number;
  failed_analyses: number;
  created_at: string;
  updated_at: string;
}

export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    api: 'healthy' | 'unhealthy';
    database: 'healthy' | 'unhealthy';
    redis: 'healthy' | 'unhealthy';
    celery_worker: 'running' | 'not_running';
    celery_beat: 'running' | 'not_running';
  };
}

export interface AdjustmentRequest {
  id: string;
  tenant_id: string;
  file_id?: string;
  request_text: string;
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
  admin_notes?: string;
  created_at: string;
  resolved_at?: string;
}

export interface AdjustmentRequestListResponse {
  requests: AdjustmentRequest[];
  total: number;
  page: number;
  limit: number;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  entity_type: string;
  entity_id: string;
  timestamp: string;
  details: Record<string, any>;
}

export interface AuditLogListResponse {
  logs: AuditLogEntry[];
  total: number;
  page: number;
  limit: number;
}

export class AdminApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: error.message,
          status: error.response?.status || 500,
          details: error.response?.data,
        };
        return Promise.reject(apiError);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
  }

  // Auth
  async verifyHealth(): Promise<HealthResponse> {
    const { data } = await this.client.get('/health');
    return data;
  }

  // Tenants
  async listTenants(page: number = 1, limit: number = 10): Promise<TenantListResponse> {
    const { data } = await this.client.get('/admin/tenants', {
      params: { page, limit },
    });
    return data;
  }

  async getTenant(id: string): Promise<Tenant> {
    const { data } = await this.client.get(`/admin/tenants/${id}`);
    return data;
  }

  async createTenant(req: TenantCreateRequest): Promise<Tenant> {
    const { data } = await this.client.post('/admin/tenants', req);
    return data;
  }

  async updateTenant(id: string, req: TenantUpdateRequest): Promise<Tenant> {
    const { data } = await this.client.patch(`/admin/tenants/${id}`, req);
    return data;
  }

  async deleteTenant(id: string): Promise<void> {
    await this.client.delete(`/admin/tenants/${id}`);
  }

  // Files
  async listFiles(
    tenantId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    files: ProcessedFile[];
    total: number;
  }> {
    const { data } = await this.client.get(`/client/files`, {
      params: { tenant_id: tenantId, page, limit },
      headers: { 'X-Tenant-ID': tenantId },
    });
    return data;
  }

  async getFile(fileId: string): Promise<ProcessedFile> {
    const { data } = await this.client.get(`/assets/${fileId}`);
    return data;
  }

  async getFileAnalysis(fileId: string): Promise<any> {
    const { data } = await this.client.get(`/analysis-runs?asset_id=${fileId}`);
    return data.results?.[0] || null;
  }

  // Analysis & Reports
  async getAnalysis(tenantId: string, fileId: string): Promise<any> {
    const { data } = await this.client.get(`/client/analysis/${fileId}`, {
      headers: { 'X-Tenant-ID': tenantId },
    });
    return data;
  }

  async listReports(tenantId: string, page: number = 1): Promise<{
    reports: TenantReport[];
    total: number;
  }> {
    const { data } = await this.client.get(`/client/reports`, {
      params: { tenant_id: tenantId, page },
      headers: { 'X-Tenant-ID': tenantId },
    });
    return data;
  }

  async getReport(tenantId: string, reportId: string): Promise<TenantReport> {
    const { data } = await this.client.get(`/client/reports/${reportId}`, {
      headers: { 'X-Tenant-ID': tenantId },
    });
    return data;
  }

  // Adjustment Requests
  async listAdjustmentRequests(
    page: number = 1,
    limit: number = 20,
    status?: string
  ): Promise<AdjustmentRequestListResponse> {
    const { data } = await this.client.get(`/admin/adjustment-requests`, {
      params: { page, limit, status },
    });
    return data;
  }

  async getAdjustmentRequest(id: string): Promise<AdjustmentRequest> {
    const { data } = await this.client.get(`/admin/adjustment-requests/${id}`);
    return data;
  }

  async approveAdjustmentRequest(id: string, adminNotes: string): Promise<AdjustmentRequest> {
    const { data } = await this.client.post(
      `/admin/adjustment-requests/${id}/approve`,
      { admin_notes: adminNotes }
    );
    return data;
  }

  async rejectAdjustmentRequest(id: string, adminNotes: string): Promise<AdjustmentRequest> {
    const { data } = await this.client.post(
      `/admin/adjustment-requests/${id}/reject`,
      { admin_notes: adminNotes }
    );
    return data;
  }

  async createAdjustmentRequest(
    tenantId: string,
    fileId: string,
    description: string
  ): Promise<AdjustmentRequest> {
    const { data } = await this.client.post(`/admin/adjustment-requests`, {
      tenant_id: tenantId,
      file_id: fileId,
      request_text: description,
    });
    return data;
  }

  // Manual Actions
  async triggerTenantPolling(tenantId: string): Promise<any> {
    const { data } = await this.client.post(`/admin/tenants/${tenantId}/poll-now`, {});
    return data;
  }

  async triggerAnalysis(tenantId: string, fileId: string): Promise<any> {
    const { data } = await this.client.post(`/admin/files/${fileId}/analyze-now`, {
      tenant_id: tenantId,
    });
    return data;
  }

  async generateReportNow(tenantId: string): Promise<any> {
    const { data } = await this.client.post(`/admin/tenants/${tenantId}/generate-report-now`, {});
    return data;
  }

  // Audit Logs
  async getAuditLogs(
    page: number = 1,
    limit: number = 50,
    entityType?: string,
    actor?: string
  ): Promise<AuditLogListResponse> {
    const { data } = await this.client.get(`/admin/audit-logs`, {
      params: { page, limit, entity_type: entityType, actor },
    });
    return data;
  }
}

export const apiClient = new AdminApiClient();
