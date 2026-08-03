# FASE 3: Admin Dashboard — Strategic Alignment

**Document:** Strategic roadmap for Admin Dashboard implementation  
**Date:** 2026-08-03  
**Scope:** FASE 3 planning aligned with product vision  
**Owner:** VisionBridge Development Team

---

## 🎯 Project Objectives Alignment

### VisionBridge Product Vision

**Core Value Proposition:**
VisionBridge is a **visual intelligence platform** that adds AI-powered analysis to image/video files already produced by customer cameras, DVRs, NVRs, or cloud storage. It watches customer-owned storage (Google Drive, Dropbox, S3, local folders, API upload), analyzes with Moondream Vision LLM, consolidates findings, and emits reports or webhooks.

**Key Differentiators:**
1. ✅ **Non-invasive:** No direct camera integration (no RTSP, ONVIF, DVR hacking)
2. ✅ **Storage-agnostic:** Works with any storage system customer already owns
3. ✅ **Async processing:** Batch analysis, not real-time (lower cost, simpler)
4. ✅ **Audit trail:** All decisions logged, human-reviewable
5. ✅ **Multi-tenant SaaS:** Tenant isolation via FK-based partitioning

**Business Model:**
- **Pricing tiers:** Starter ($299/mo, 1K files), Professional ($999/mo, 10K files), Enterprise (custom)
- **Unit economics:** Moondream API cost ~$645/year for 100 tenants at 1000 files/tenant/month
- **GTM:** B2B enterprise (50–500 employees) with existing camera systems
- **Target launch:** Q1 2027

**Market Segments:**
- Retail loss prevention
- Warehouse/logistics monitoring
- Factory floor safety
- Building/facility automation
- Parking lot/perimeter security

---

## FASE Timeline & Dependencies

```
FASE 1 (Core MVP)        ✅ COMPLETE (Jul 2026)
  → REST API, Moondream, webhooks, audit logs, 22 tests

FASE 2 (Background Tasks) ✅ COMPLETE (Aug 3, 2026)
  → Celery polling, analysis, reporting
  → Multi-tenant SaaS isolation
  → 6 background tasks + 2 schedulers
  → OAuth 2.0, credential encryption, monitoring, backups

FASE 3 (Admin Dashboard)  🔜 IN PROGRESS (Aug 3–Oct 3, 2026)
  ├─ PHASE 3A: Core Management (Week 1-2, 8 days)
  │   → Tenant CRUD pages ✅ (IMPLEMENTED)
  │   → File browser ✅ (IMPLEMENTED)
  │   → Reports list ✅ (IMPLEMENTED)
  │   → Settings/system health ✅ (IMPLEMENTED)
  │
  ├─ PHASE 3B: Advanced Features (Week 3-4, 10 days) ⏳ NEXT
  │   → File detail viewer + analysis results
  │   → Report detail + charts (Recharts)
  │   → Audit log viewer
  │   → Adjustment request management
  │   → OAuth credential picker
  │
  └─ PHASE 3C: Polish & Deploy (Week 5-6, 8 days) ⏳ PLANNED
      → Mobile optimization
      → Performance tuning
      → Documentation
      → Docker deploy to VPS

FASE 4 (Client Dashboard) 📅 PLANNED (Nov–Dec 2026)
  → File gallery for clients
  → Analysis results viewer
  → Report download (PDF/CSV)
  → Adjustment request form (PT-BR NLP)

FASE 5+ (Integrations)   📅 PLANNED (Jan 2027+)
  → Email delivery (SendGrid)
  → SMS alerts (Twilio)
  → CMS/ERP integrations
  → Advanced analytics

GA Launch               🚀 Q1 2027
```

---

## FASE 3 Strategic Goals

### Goal 1: **Enable Tenant Onboarding** 🎯
**Why:** Cannot acquire customers without admin capability to create/manage accounts.

**Success Criteria:**
- ✅ Admin can CRUD tenants in <2 minutes per tenant
- ✅ Storage type selector (Google Drive, Dropbox, S3, local)
- ✅ Search prompt customization (PT-BR natural language)
- ✅ Real-time validation of storage credentials

**Implementation Coverage:**
- ✅ PHASE 3A: Tenant Create/Edit/Delete pages
- ⏳ PHASE 3B: OAuth picker for credentials
- ⏳ PHASE 3B: Test connection button

---

### Goal 2: **Provide Operational Visibility** 🎯
**Why:** Admins must monitor system health, file processing, and error rates.

**Success Criteria:**
- ✅ Real-time health indicators (API, DB, Redis, Celery)
- ✅ File discovery status (pending, processing, completed, failed)
- ✅ Report generation tracking
- ✅ Error alerts with actionable details

**Implementation Coverage:**
- ✅ PHASE 3A: Dashboard home + settings page
- ✅ PHASE 3A: File browser with status filtering
- ✅ PHASE 3A: Reports list with aggregated stats
- ⏳ PHASE 3B: Audit log viewer (who did what, when)

---

### Goal 3: **Enable Feedback Loop** 🎯
**Why:** Customers request adjustments (increase sensitivity, change search prompt). Admin must review/approve.

**Success Criteria:**
- ✅ View pending adjustment requests per tenant
- ✅ Approve/reject with admin notes
- ✅ Track request status (pending → approved → implemented → closed)

**Implementation Coverage:**
- ⏳ PHASE 3B: Adjustment request queue + approval UI
- ⏳ PHASE 3B: Link to analysis results for context

---

### Goal 4: **Support Data-Driven Decisions** 🎯
**Why:** Business needs metrics: # tenants, # files processed, success rates, errors, costs.

**Success Criteria:**
- ✅ Dashboard KPIs (tenants, files, success rate)
- ✅ Per-tenant breakdown (files, analyses, errors)
- ✅ Report download (JSON/CSV for analysis)
- ✅ Trend visualization (over 7/30/90 days)

**Implementation Coverage:**
- ✅ PHASE 3A: Stats cards on dashboard
- ✅ PHASE 3A: Reports list with success rate calc
- ⏳ PHASE 3B: Report detail with charts (Recharts)
- ⏳ PHASE 3B: CSV export

---

### Goal 5: **Achieve Production Readiness** 🎯
**Why:** Cannot launch GA without confidence in system reliability, security, performance.

**Success Criteria:**
- ✅ Dashboard load time <2s (p95)
- ✅ Real-time polling latency <500ms
- ✅ Mobile-responsive (tablet + phone)
- ✅ Error handling for API outages
- ✅ Type-safe throughout (TypeScript strict)
- ✅ Security: Bearer token auth, no hardcoded secrets

**Implementation Coverage:**
- ✅ PHASE 3A: Responsive design (Tailwind mobile-first)
- ✅ PHASE 3A: Error boundaries + retry logic
- ✅ PHASE 3A: Real-time polling with exponential backoff
- ⏳ PHASE 3B: Load testing (1000 concurrent users)
- ⏳ PHASE 3C: Performance tuning
- ⏳ PHASE 3C: Security audit

---

## How FASE 3 Supports FASE 4 & Roadmap

### FASE 4 Enablement
FASE 3 Admin Dashboard is **prerequisite for FASE 4 Client Dashboard:**
- Tenants must exist and be healthy (FASE 3 prerequisite)
- Files must be analyzed and stored (FASE 2 + 3 prerequisite)
- Reports must exist and be exportable (FASE 2 + 3 prerequisite)
- Adjustment request workflow must be proven (FASE 3 prerequisite)

### Revenue Path (FASE 4+)
FASE 4 builds client-facing UIs on top of FASE 3 admin infrastructure:
- Client sees their files (sourced from /client/files endpoint)
- Client sees analysis results (sourced from /client/analysis endpoint)
- Client downloads reports (sourced from /client/reports endpoint)
- Client requests adjustments (posts to /client/request-adjustment endpoint)
- Admin processes requests (via FASE 3 adjustment request queue)

**Without FASE 3:** No way to verify system works operationally before selling to customers.

---

## Component Inventory & Dependencies

### PHASE 3A (Core) — Week 1-2

| Component | Files | Dependencies | Business Impact |
|-----------|-------|------|-----------------|
| **Tenant CRUD** | page.tsx, new.tsx, [id].tsx, TenantForm.tsx | API client | ⭐⭐⭐ Onboarding |
| **File Browser** | page.tsx, DataTable.tsx | API client, polling hook | ⭐⭐ Visibility |
| **Reports List** | page.tsx | API client | ⭐⭐ KPIs |
| **Settings** | page.tsx | Health polling | ⭐⭐ Ops visibility |
| **Admin Layout** | AdminLayout.tsx | Sidebar nav | ⭐⭐⭐ All pages |
| **Shared Comps** | DataTable, StatusBadge, DeleteDialog | Tailwind, Radix | ⭐⭐ Reusability |

**Status:** ✅ COMPLETE (8 files, 1200+ LOC)

---

### PHASE 3B (Advanced) — Week 3-4

| Component | Files | Dependencies | Business Impact |
|-----------|-------|------|-----------------|
| **File Detail Viewer** | [id].tsx | API client | ⭐⭐ Analysis context |
| **Report Charts** | [id].tsx + Recharts | API data | ⭐⭐ KPI visualization |
| **Audit Log** | page.tsx, AuditTable.tsx | API audit endpoint | ⭐⭐ Compliance |
| **Adjustment Requests** | page.tsx, ApprovalDialog.tsx | API adjustment endpoint | ⭐⭐⭐ Feedback loop |
| **OAuth Picker** | OAuthSetupDialog.tsx | OAuth routes (backend) | ⭐⭐⭐ Onboarding |
| **Manual Actions** | Buttons in various | API trigger endpoints | ⭐ Ops tooling |

**Status:** ⏳ TODO (est. 10 days)

---

### PHASE 3C (Polish) — Week 5-6

| Component | Files | Dependencies | Business Impact |
|-----------|-------|------|-----------------|
| **Mobile Optimization** | CSS breakpoints | Tailwind mobile-first | ⭐⭐ UX |
| **Performance Tuning** | Code splitting, lazy load | Next.js dynamic | ⭐ Performance |
| **Docker Deploy** | Dockerfile, nginx.conf | Docker Compose | ⭐⭐ Deployment |
| **Documentation** | README, API docs, runbook | Markdown | ⭐⭐ Support |
| **Load Testing** | Playwright E2E | Test harness | ⭐⭐ Reliability |

**Status:** ⏳ TODO (est. 8 days)

---

## Critical Path Analysis

**Blocking Dependencies:**
1. ✅ Backend API must be healthy (FASE 2 complete)
2. ✅ OAuth flows must be implemented (FASE 2 complete)
3. ✅ Credential encryption must work (FASE 2 complete)
4. ⏳ Adjustment request endpoints must exist (backend TODO)
5. ⏳ Audit log endpoint must exist (backend TODO)

**Parallelization Opportunities:**
- PHASE 3A: All 4 pages can be built in parallel (file browser, tenant CRUD, reports, settings)
- PHASE 3B: File detail + report charts can be built simultaneously
- PHASE 3C: Docker + documentation + perf tuning can happen in parallel

---

## Success Metrics & KPIs

### Development Velocity
- ✅ PHASE 3A: 8 days (target: meet/beat)
- ⏳ PHASE 3B: 10 days (target: meet)
- ⏳ PHASE 3C: 8 days (target: meet)
- **Total FASE 3:** 26 days (start Aug 3, finish ~Sep 1)

### Quality Metrics
- TypeScript strict mode: 100% coverage
- Test coverage: >80% (target)
- Lighthouse score: >90 (target)
- Accessibility (WCAG): Level AA (target)

### Performance Targets
| Metric | Target | Current |
|--------|--------|---------|
| Dashboard load | <2s p95 | TBD |
| Page transition | <200ms | TBD |
| API response | <500ms | TBD |
| Mobile responsive | 100% | ✅ (Tailwind) |
| TypeScript strict | 100% | ✅ |

### User Experience
- Onboarding: <2 min to create first tenant
- File discovery: <5 sec to see recent files
- Report generation: <10 sec to see monthly summary
- Error recovery: <30 sec to retry after API outage

---

## Risk Mitigation

### High Risks

| Risk | Probability | Impact | Mitigation |
|------|-----------|--------|-----------|
| Backend API unstable | 30% | Blocks all testing | Real API in Docker, rollback plan |
| OAuth integration missing | 20% | Blocks credential setup | Fallback: manual JSON entry |
| Celery tasks fail | 40% | Blocks file processing | Health checks, alerting, manual trigger |
| Mobile UX breaks | 15% | Poor user experience | Test on real devices, Lighthouse |

### Mitigation Strategies
- Daily Docker health checks
- Manual test matrix (Chrome, Safari, Firefox, Mobile)
- Fallback UI states for API errors
- Comprehensive error logging

---

## Communication & Handoff

### FASE 3 → FASE 4 Handoff
When FASE 3 is complete (Sep 1):
1. **Admin Dashboard is production-ready** for internal use
2. **All FASE 2 APIs are proven working** (via admin usage)
3. **Adjustment request workflow validated** (prerequisite for client feedback)
4. **FASE 4 Frontend engineers can start** immediately on Client Dashboard

### FASE 4 → Sales Handoff
When FASE 4 is complete (Dec 1):
1. **Complete product ready for beta** (admin + client dashboards)
2. **Sales can invite 5-10 beta customers**
3. **Gather feedback before GA** (Jan 2027)
4. **Fix issues and scale for GA** (Feb-Mar 2027)

---

## Implementation Priorities (PHASE 3B Ordering)

**Based on business impact + development risk:**

1. **Adjustment Request Queue** (FASE 3B Week 1)
   - Why: Critical feedback loop for customer success
   - Risk: Moderate (new endpoint in backend)
   - Impact: ⭐⭐⭐ Directly supports revenue model

2. **File Detail Viewer** (FASE 3B Week 1)
   - Why: Context for adjustment requests
   - Risk: Low (reuse existing components)
   - Impact: ⭐⭐ Better UX, fewer support tickets

3. **Report Charts** (FASE 3B Week 2)
   - Why: Data visualization critical for KPI tracking
   - Risk: Low (Recharts well-tested)
   - Impact: ⭐⭐ Business intelligence

4. **Audit Log** (FASE 3B Week 2)
   - Why: Compliance, troubleshooting, security
   - Risk: Low (straightforward data display)
   - Impact: ⭐⭐ Compliance + ops

5. **OAuth Credential Picker** (FASE 3B Week 3)
   - Why: Secure credential management, UX polish
   - Risk: Moderate (OAuth integration complex)
   - Impact: ⭐⭐⭐ Onboarding UX improvement

6. **Manual Trigger Actions** (FASE 3B Week 3)
   - Why: Ops tooling (force poll, analyze, report)
   - Risk: Low (simple button + API call)
   - Impact: ⭐ Nice-to-have for ops team

---

## Success Definition

### FASE 3 is "Done" when:

**Functional Completeness:**
- ✅ Admin can create, read, update, delete tenants
- ✅ Admin can view all files across all tenants with filtering
- ✅ Admin can view all reports with success rate metrics
- ✅ Admin can view system health in real-time
- ✅ Admin can approve/reject adjustment requests
- ✅ Admin can see audit trail of all actions

**Quality Completeness:**
- ✅ All pages responsive (mobile, tablet, desktop)
- ✅ No TypeScript errors (strict mode)
- ✅ Error states handled gracefully
- ✅ Loading states visible
- ✅ Real-time polling working (5-10s updates)
- ✅ Dashboard loads in <2s

**Operational Readiness:**
- ✅ Dockerized and deployable to VPS
- ✅ Environment variables properly configured
- ✅ API authentication working (Bearer token)
- ✅ Error logging comprehensive
- ✅ No hardcoded secrets

**Documentation:**
- ✅ README with setup instructions
- ✅ Deployment guide
- ✅ API integration guide
- ✅ Troubleshooting tips

---

## Next Actions (PHASE 3B — Starting Now)

1. **Implement Adjustment Request UI** (PHASE 3B Week 1)
   - Create `app/admin/adjustment-requests/page.tsx` (list queue)
   - Create approval dialog component
   - Integrate with backend API

2. **Implement File Detail Viewer** (PHASE 3B Week 1)
   - Complete `app/admin/files/[id].tsx` (show analysis results)
   - JSON viewer for analysis response
   - Link to adjustment request form

3. **Implement Report Detail + Charts** (PHASE 3B Week 2)
   - Complete `app/admin/reports/[id].tsx` (show details)
   - Add Recharts visualization (timeline, distribution, success rate)
   - Add CSV export button

4. **Implement Audit Log** (PHASE 3B Week 2)
   - Create `app/admin/audit-logs/page.tsx`
   - Table with actor, action, entity, timestamp, details
   - Filter by date range + entity type

5. **Implement OAuth Credential Picker** (PHASE 3B Week 3)
   - Create `app/admin/tenants/[id]/oauth-setup.tsx`
   - Google Drive OAuth flow
   - Dropbox OAuth flow
   - S3 credential form
   - Test connection button

---

**Owner:** VisionBridge Development  
**Next Review:** 2026-08-10  
**Last Updated:** 2026-08-03

---

## Appendix: Backend API Expectations

### Missing Endpoints (Backend TODO)

For PHASE 3B to work, backend needs:

```http
# Adjustment Requests
GET    /admin/adjustment-requests?tenant_id=X&status=pending
POST   /admin/adjustment-requests/{id}/approve
       Body: {admin_notes: "..."}
POST   /admin/adjustment-requests/{id}/reject
       Body: {admin_notes: "..."}

# Audit Log
GET    /admin/audit-logs?date_from=X&date_to=Y&entity_type=tenant
       Response: [{actor, action, entity_type, entity_id, timestamp, details}]

# Manual Actions
POST   /admin/tenants/{id}/poll-now
POST   /admin/files/{id}/analyze-now
POST   /admin/tenants/{id}/generate-report-now
```

**Current Status:** Skeleton endpoints exist; implementation TBD in backend FASE 3.

---

**This document ensures FASE 3 stays aligned with product vision and business objectives.**
