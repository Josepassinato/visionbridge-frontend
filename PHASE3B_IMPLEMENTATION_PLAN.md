# FASE 3B: Advanced Features Implementation Plan

**Timeline:** Aug 10 - Aug 31 (est. 10 developer days)  
**Priority:** Adjustment Requests > File Detail > Reports Charts > Audit Log > OAuth > Manual Actions  
**Owner:** VisionBridge Frontend Team

---

## Week 3-4 Detailed Breakdown

### WEEK 3 (Aug 10-16)

#### Day 1-2: Adjustment Request Queue & Approval Workflow
**Component:** `AdjustmentRequestManager` (core business logic)

**What Gets Built:**
- [ ] `app/admin/adjustment-requests/page.tsx` — List all pending requests
- [ ] `components/admin/forms/AdjustmentApprovalDialog.tsx` — Approve/reject UI
- [ ] API client methods: `listAdjustmentRequests()`, `approveRequest()`, `rejectRequest()`
- [ ] Real-time polling for new requests (5s interval)
- [ ] Status badges: pending, approved, rejected, implemented

**Features:**
- Filter by status (pending, approved, rejected)
- Filter by tenant
- Sort by created_at (newest first)
- Show tenant + file context
- Admin notes field (required for approval)
- Bulk approval checkbox (nice-to-have)

**Why First:** This is the **core customer feedback loop**. Without it, you can't iterate with clients. Critical for FASE 4 handoff.

**Success Criteria:**
- ✅ Can approve/reject any pending request in <30 seconds
- ✅ Request status updates live (polling)
- ✅ Admin notes visible in audit trail
- ✅ Email notification on approval (placeholder for backend)

---

#### Day 3-4: File Detail Viewer
**Component:** `FileDetailsPanel` (analysis results display)

**What Gets Built:**
- [ ] Complete `app/admin/files/[id].tsx` (full page)
- [ ] `components/admin/viewers/AnalysisResultViewer.tsx` — JSON/formatted display
- [ ] `components/admin/viewers/DetectionViewer.tsx` — Bounding boxes overlay (if supported)
- [ ] API client method: `getFile()`, `getAnalysis()`
- [ ] Link to related adjustment requests

**Features:**
- Show file metadata (path, size, storage type, created_at)
- Show analysis status (pending, processing, completed, failed)
- Display analysis result JSON with syntax highlighting
- Show timestamps (analyzed_at, created_at)
- "Request Adjustment" button (links to FASE 3B Day 1)
- "Re-analyze" button (manual trigger, optional)
- Download analysis as JSON

**Why Second:** Provides **context for adjustment requests**. Admin needs to understand what the analysis found before approving changes.

**Success Criteria:**
- ✅ JSON viewer renders large responses (>1MB) without hanging
- ✅ Timestamps display in user timezone
- ✅ Error states show clearly (analysis_error field)
- ✅ Can quickly jump to related adjustment requests

---

#### Day 5: Buffer / Catch-up Day
- Refinement based on testing
- Bug fixes from PHASE 3A integration
- Code review + merge PR

---

### WEEK 4 (Aug 17-23)

#### Day 6-7: Report Detail Page + Charts
**Component:** `ReportDetailsPanel` (KPI visualization)

**What Gets Built:**
- [ ] Complete `app/admin/reports/[id].tsx` (full page)
- [ ] `components/admin/charts/DetectionTimeline.tsx` — Line chart (Recharts)
- [ ] `components/admin/charts/ObjectDistribution.tsx` — Bar chart (Recharts)
- [ ] `components/admin/charts/SuccessRateGauge.tsx` — Gauge chart (Recharts)
- [ ] API client method: `getReport()`
- [ ] CSV export button

**Features:**
- Show report metadata (period, generated_at, tenant)
- **Timeline chart:** Detection count by hour/day (line chart)
- **Distribution chart:** Objects by type (bar chart)
- **Success gauge:** % successful analyses (gauge/radial)
- Show raw findings JSON (collapsible)
- Download as JSON (already working)
- Download as CSV (new)
- Share link button (optional)

**Why Third:** **Business intelligence** critical for sales / customer success. Proves ROI to stakeholders.

**Success Criteria:**
- ✅ Charts render smoothly without performance dips
- ✅ CSV export includes headers + all fields
- ✅ Date range selection works (optional refinement)
- ✅ Mobile responsive (charts stack vertically)

---

#### Day 8: Audit Log Viewer
**Component:** `AuditLogTable` (compliance + ops)

**What Gets Built:**
- [ ] `app/admin/audit-logs/page.tsx` — List all admin actions
- [ ] `components/admin/tables/AuditLogTable.tsx` — Dedicated table component
- [ ] API client method: `getAuditLogs()`
- [ ] Filter by date range
- [ ] Filter by entity type (tenant, file, report)
- [ ] Filter by actor

**Features:**
- Display columns: actor, action, entity_type, entity_id, timestamp, details
- Sortable by timestamp
- Filterable by date, entity type, actor
- Show action details in expandable row
- Real-time polling (10s interval)

**Why Fourth:** Compliance + troubleshooting. Less urgent than business features, but important for production readiness.

**Success Criteria:**
- ✅ Can find any action within 5 seconds
- ✅ Pagination works for large audit logs
- ✅ Date filter intuitive
- ✅ No sensitive data exposed (API keys, passwords)

---

#### Day 9-10: OAuth Credential Picker
**Component:** `OAuthSetupWizard` (onboarding UX)

**What Gets Built:**
- [ ] `components/admin/dialogs/OAuthSetupDialog.tsx` — Multi-step wizard
- [ ] `components/admin/auth/GoogleDriveOAuth.tsx` — Google Drive flow
- [ ] `components/admin/auth/DropboxOAuth.tsx` — Dropbox flow
- [ ] `components/admin/auth/S3Credentials.tsx` — S3 credential form
- [ ] "Test Connection" button + validation
- [ ] Link to FASE 3B Day 1 adjustment requests

**Features:**
- Step 1: Select storage type (dropdown)
- Step 2: OAuth flow (Google Drive, Dropbox) or manual creds (S3)
- Step 3: Validate connection (test bucket access)
- Step 4: Save + update tenant config
- Inline help text for each storage type
- Error handling with retry

**Why Fifth:** Improves **onboarding UX significantly**. Current implementation stores empty `storage_config`; this fixes it.

**Success Criteria:**
- ✅ OAuth redirect flow works end-to-end
- ✅ S3 credential validation works
- ✅ Can update tenant storage after initial creation
- ✅ Error messages actionable (not generic)

---

#### Day 11-12: Manual Trigger Actions + Polish
**Component:** `ManualActionButtons` (ops tooling)

**What Gets Built:**
- [ ] "Poll Now" button in tenant detail page
- [ ] "Analyze Now" button in file detail page
- [ ] "Generate Report Now" button in dashboard
- [ ] Loading states + success/error toasts
- [ ] API client methods: `triggerTenantPolling()`, `triggerAnalysis()`, `triggerReportGeneration()`
- [ ] Code review + final fixes

**Features:**
- Buttons appear with confirmation dialogs
- Show task ID after trigger
- Poll for task status (optional)
- Show result notification

**Why Sixth:** Nice-to-have for ops team. Allows manual intervention if automation fails.

**Success Criteria:**
- ✅ Confirmation dialog prevents accidents
- ✅ User gets feedback when action triggers
- ✅ No race conditions (button disabled after click)

---

## File Structure (PHASE 3B)

```
app/admin/
├── adjustment-requests/
│   └── page.tsx                    ✅ LIST queue + filter
├── files/
│   └── [id].tsx                    ✅ Detail viewer (PHASE 3A partial)
├── reports/
│   └── [id].tsx                    ✅ Detail + charts (PHASE 3A partial)
└── audit-logs/
    └── page.tsx                    ✅ Audit log viewer

components/admin/
├── forms/
│   └── AdjustmentApprovalDialog.tsx ✅ Approval workflow
├── dialogs/
│   └── OAuthSetupDialog.tsx        ✅ OAuth + S3 creds
├── viewers/
│   ├── AnalysisResultViewer.tsx    ✅ JSON viewer
│   └── DetectionViewer.tsx         ✅ Bounding boxes (if backend provides)
├── charts/
│   ├── DetectionTimeline.tsx       ✅ Line chart (Recharts)
│   ├── ObjectDistribution.tsx      ✅ Bar chart (Recharts)
│   └── SuccessRateGauge.tsx        ✅ Gauge (Recharts)
├── tables/
│   └── AuditLogTable.tsx           ✅ Audit log table
└── auth/
    ├── GoogleDriveOAuth.tsx        ✅ OAuth flow
    ├── DropboxOAuth.tsx            ✅ OAuth flow
    └── S3Credentials.tsx           ✅ Manual form

lib/admin/
├── api-client.ts                   ⏳ ADD methods for PHASE 3B
└── polling-hook.ts                 (no changes needed)
```

---

## Backend Dependencies

### APIs Required from Backend (Not Yet Implemented)

For PHASE 3B to work, backend needs these endpoints:

```
✅ EXISTING (already have):
  GET    /admin/tenants
  POST   /admin/tenants
  PATCH  /admin/tenants/{id}
  DELETE /admin/tenants/{id}
  GET    /client/files
  GET    /client/analysis/{file_id}
  GET    /client/reports
  GET    /health

⏳ NEEDED (backend PHASE 3B):
  GET    /admin/adjustment-requests
         Params: tenant_id, status
         Response: [{id, tenant_id, request_text, status, created_at}]

  POST   /admin/adjustment-requests/{id}/approve
         Body: {admin_notes: "..."}
         Response: {id, status, message}

  POST   /admin/adjustment-requests/{id}/reject
         Body: {admin_notes: "..."}
         Response: {id, status, message}

  GET    /admin/audit-logs
         Params: date_from, date_to, entity_type, actor
         Response: [{actor, action, entity_type, entity_id, timestamp, details}]

  POST   /admin/tenants/{id}/poll-now
         Response: {task_id, status}

  POST   /admin/files/{id}/analyze-now
         Response: {task_id, status}

  POST   /admin/tenants/{id}/generate-report-now
         Response: {task_id, status}

  POST   /oauth/google-drive/authorize
         Response: {auth_url}

  GET    /oauth/google-drive/callback?code=X&state=Y
         Response: {status: "authorized"}

  POST   /oauth/dropbox/authorize
         Response: {auth_url}

  GET    /oauth/dropbox/callback?code=X&state=Y
         Response: {status: "authorized"}

  POST   /admin/tenants/{id}/test-storage-connection
         Response: {status: "ok|error", message}
```

**Note:** Some of these (OAuth, adjustment requests) are already partially implemented in backend FASE 2. Frontend just needs to wire them up. Others (audit-logs, manual actions) need backend implementation.

---

## Testing Strategy (PHASE 3B)

### Unit Tests
- AdjustmentApprovalDialog component
- AnalysisResultViewer component
- Chart components (with mock data)
- API client methods

### Integration Tests
- Full adjustment request workflow (list → approve → verify)
- File detail page loads + shows analysis
- Report detail + charts render
- Audit log filtering

### E2E Tests (Playwright)
- Create tenant → view files → request adjustment → approve
- View report → download CSV
- OAuth flow (if possible to mock)

### Manual Testing Checklist
- [ ] All pages load in <2s
- [ ] Mobile responsive (test on iPhone + iPad)
- [ ] Dark theme applied consistently
- [ ] Error states show clearly
- [ ] Real-time polling works (check Network tab)
- [ ] No console errors
- [ ] Accessibility (keyboard nav, ARIA labels)

---

## Performance Targets (PHASE 3B)

| Metric | Target | Note |
|--------|--------|------|
| Page load | <2s | LCP target |
| Chart render | <500ms | Recharts |
| CSV export | <5s | File size < 10MB |
| API response | <500ms | Backend constraint |
| Search/filter | <100ms | Client-side |
| Mobile FCP | <3s | First Contentful Paint |

---

## Deployment & Rollout

### Staging (Aug 25)
- Deploy PHASE 3B to staging environment
- Run full test suite
- Manual QA testing
- Gather feedback

### Production (Aug 28)
- Deploy to production VPS
- Monitor error logs
- Verify all endpoints working
- Announce feature availability

### Documentation (Aug 31)
- Update README with new features
- Create API integration guide
- Add troubleshooting section
- Record demo video (optional)

---

## Known Blockers & Mitigations

| Blocker | Severity | Mitigation |
|---------|----------|-----------|
| Backend endpoints not ready | HIGH | Implement in parallel; use mock API if needed |
| OAuth flow complexity | MEDIUM | Focus on S3 first; Google Drive is fallback |
| Chart library issues | LOW | Recharts well-tested; fallback to text tables |
| Mobile performance | LOW | Test early; optimize if needed |

---

## Success Criteria (PHASE 3B Complete)

- ✅ All 4 new pages built and deployed
- ✅ Real-time polling working (5-10s updates)
- ✅ All error states handled gracefully
- ✅ Mobile responsive (tested)
- ✅ No TypeScript errors
- ✅ API methods documented
- ✅ Backend endpoints stubbed (even if not fully implemented)
- ✅ Charts render smoothly
- ✅ CSV export working
- ✅ OAuth flow working (at least S3)

---

## Next Phase: PHASE 3C (Polish & Deploy)

After PHASE 3B is complete:

1. **Performance Tuning** (Aug 25-26)
   - Lighthouse audit
   - Bundle size analysis
   - Code splitting optimization
   - Image optimization

2. **Docker Deployment** (Aug 27-28)
   - Dockerfile for frontend
   - nginx config for reverse proxy
   - Environment variable setup
   - TLS/SSL certificates

3. **Documentation** (Aug 29-30)
   - Setup guide
   - Deployment playbook
   - Troubleshooting FAQ
   - API integration examples

4. **Testing & QA** (Aug 31)
   - Full regression testing
   - Performance testing
   - Security audit
   - Final go-live checklist

---

**Owner:** VisionBridge Frontend Development  
**Last Updated:** 2026-08-03  
**Next Review:** 2026-08-10

---

## Appendix A: Component Responsibilities

### PHASE 3B Component Breakdown

**Day 1-2: Adjustment Requests (AdjustmentRequestManager)**
- Parent component: `AdjustmentRequestManager`
- Child: `AdjustmentRequestsTable` (list view)
- Child: `AdjustmentApprovalDialog` (approval modal)
- **Lines of code:** 500-600
- **Dependencies:** API client, polling hook, DataTable, DeleteDialog

**Day 3-4: File Details (FileDetailsPanel)**
- Parent component: `FileDetailsPanel` (page)
- Child: `AnalysisResultViewer` (JSON display)
- Child: `DetectionViewer` (if bounding boxes supported)
- **Lines of code:** 400-500
- **Dependencies:** API client, syntax highlighter, link router

**Day 6-7: Reports Charts (ReportsDetailPanel)**
- Parent component: `ReportsDetailPanel` (page)
- Child: `DetectionTimeline` (Recharts line chart)
- Child: `ObjectDistribution` (Recharts bar chart)
- Child: `SuccessRateGauge` (Recharts radial gauge)
- **Lines of code:** 700-800
- **Dependencies:** Recharts, date-fns, API client

**Day 8: Audit Logs (AuditLogTable)**
- Parent component: `AuditLogsPage` (page)
- Child: `AuditLogTable` (DataTable variant)
- **Lines of code:** 300-400
- **Dependencies:** API client, DataTable, date-fns

**Day 9-10: OAuth Setup (OAuthSetupWizard)**
- Parent component: `OAuthSetupDialog` (modal)
- Child: `GoogleDriveOAuth` (step 2)
- Child: `DropboxOAuth` (step 2)
- Child: `S3Credentials` (step 2)
- **Lines of code:** 600-700
- **Dependencies:** API client, form validation

**Day 11-12: Manual Actions (ManualActionButtons)**
- Scattered buttons in: TenantDetail, FileDetail, Dashboard
- Each button: ~50 LOC
- **Total lines:** 300-400
- **Dependencies:** API client, toast notifications

**PHASE 3B Total:** ~3000-3500 LOC

---

## Appendix B: Reference Materials

- **Recharts docs:** https://recharts.org/
- **Date-fns docs:** https://date-fns.org/
- **Tailwind responsive:** https://tailwindcss.com/docs/responsive-design
- **Next.js dynamic imports:** https://nextjs.org/docs/advanced-features/dynamic-import
- **TypeScript best practices:** https://www.typescriptlang.org/docs/handbook/
