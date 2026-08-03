# Testing Checklist — FASE 3 Admin Dashboard

**Date:** 2026-08-03  
**Scope:** All 12 pages + 11 components  
**Status:** Ready for QA

---

## Manual Testing Checklist

### Pages to Test (12)

#### 1. Dashboard Home (`/admin`)
- [ ] Page loads without errors
- [ ] Health indicators display
- [ ] 5 status cards visible (API, DB, Redis, Worker, Beat)
- [ ] Stats cards show numbers (tenants, files)
- [ ] Recent tenants list loads
- [ ] Refresh button works
- [ ] Real-time polling active (check Network tab every 5s)
- [ ] Mobile responsive (test on 375px width)
- [ ] Dark theme applied
- [ ] No console errors

**Expected behavior:** Should see live health status + stats without delays

---

#### 2. Tenants List (`/admin/tenants`)
- [ ] Page loads without errors
- [ ] Table displays all tenants
- [ ] Pagination works (10 per page)
- [ ] Click Edit → navigates to detail page
- [ ] Click Delete → shows confirmation dialog
- [ ] Confirm delete → removes from list
- [ ] Click "New Tenant" → navigates to create page
- [ ] Refresh button works
- [ ] Filter by storage type works (if available)
- [ ] Sort by name/email works
- [ ] Mobile responsive
- [ ] Dark theme consistent
- [ ] No console errors

**Expected behavior:** CRUD operations flow smoothly, no data loss

---

#### 3. Create Tenant (`/admin/tenants/new`)
- [ ] Page loads without errors
- [ ] Form fields visible (name, email, storage, prompt)
- [ ] Storage type dropdown has 4 options
- [ ] Form validation works (try submit empty)
- [ ] Type in fields → values update
- [ ] Submit → creates tenant + redirects to list
- [ ] Click Cancel → goes back
- [ ] Error handling (server error)
- [ ] Loading state visible
- [ ] Mobile responsive
- [ ] Dark theme consistent
- [ ] No console errors

**Expected behavior:** Form validates client-side, backend accepts via API

---

#### 4. Edit Tenant (`/admin/tenants/[id]`)
- [ ] Page loads with tenant data
- [ ] Form pre-filled with current values
- [ ] Edit a field → value updates
- [ ] Submit → saves changes + redirects
- [ ] Click back button → returns to list
- [ ] Error handling (server error)
- [ ] Loading state visible
- [ ] Show related storage type
- [ ] Mobile responsive
- [ ] Dark theme consistent
- [ ] No console errors

**Expected behavior:** Data persists, changes reflect immediately

---

#### 5. Files Browser (`/admin/files`)
- [ ] Page loads without errors
- [ ] File table displays (file path, tenant, status, created)
- [ ] Status badges color-coded correctly
- [ ] Filter by tenant dropdown works
- [ ] View button visible on each row
- [ ] Click View → navigates to file detail
- [ ] Stats cards show (total, completed, pending)
- [ ] Refresh button works
- [ ] Mobile responsive
- [ ] Dark theme consistent
- [ ] No console errors

**Expected behavior:** Shows all files across tenants with proper filtering

---

#### 6. File Detail (`/admin/files/[id]`)
- [ ] Page loads with file metadata
- [ ] File path displays correctly
- [ ] File size in MB
- [ ] Status badge visible
- [ ] Analysis results display
- [ ] Summary text visible
- [ ] Objects listed with confidence
- [ ] Risk level indicator
- [ ] Recommended action shown
- [ ] Download JSON button works
- [ ] "Request Adjustment" button visible
- [ ] Back button returns to files
- [ ] Error handling (file not found)
- [ ] Pending state (spinner)
- [ ] Failed state (error message)
- [ ] Mobile responsive
- [ ] Dark theme consistent
- [ ] No console errors

**Expected behavior:** Shows complete analysis + options to request adjustment

---

#### 7. Adjustment Requests (`/admin/adjustment-requests`)
- [ ] Page loads without errors
- [ ] Request table displays
- [ ] Columns: tenant, request, status, created
- [ ] Status badges color-coded
- [ ] Filter by status dropdown works
- [ ] Approve button visible for pending only
- [ ] Reject button visible for pending only
- [ ] Click Approve → dialog shows
- [ ] Dialog has admin notes textarea
- [ ] Notes required (try submit empty)
- [ ] Submit approval → updates list
- [ ] Request status changes to "approved"
- [ ] Click Reject → rejection dialog
- [ ] Submit rejection → updates list
- [ ] Approved requests show disabled button
- [ ] Stats cards show totals
- [ ] Mobile responsive
- [ ] Dark theme consistent
- [ ] No console errors

**Expected behavior:** Full approval workflow works end-to-end

---

#### 8. Reports List (`/admin/reports`)
- [ ] Page loads without errors
- [ ] Report table displays
- [ ] Columns: tenant, period, files, success, failed, generated
- [ ] Pagination works
- [ ] Filter by tenant works
- [ ] Click View → navigates to detail
- [ ] Download button visible
- [ ] Date range formats correctly
- [ ] Success count calculated
- [ ] Stats cards: total reports, files analyzed, success rate %
- [ ] Mobile responsive
- [ ] Dark theme consistent
- [ ] No console errors

**Expected behavior:** Shows all reports with proper metrics

---

#### 9. Report Detail (`/admin/reports/[id]`)
- [ ] Page loads without errors
- [ ] Report metadata displayed (period, generated, status)
- [ ] Key metrics cards (total files, successful, failed)
- [ ] Success rate gauge renders (pie chart)
- [ ] Success % displayed correctly
- [ ] Detection timeline chart renders (line)
- [ ] Object distribution chart renders (bar)
- [ ] Findings summary cards visible
- [ ] Raw data JSON viewer present
- [ ] CSV download button works
- [ ] Back button returns to reports
- [ ] Charts responsive on mobile
- [ ] Mobile responsive
- [ ] Dark theme consistent
- [ ] No console errors

**Expected behavior:** Charts render smoothly, CSV export creates file

---

#### 10. Audit Logs (`/admin/audit-logs`)
- [ ] Page loads without errors
- [ ] Audit log entries displayed
- [ ] Columns: actor, action, entity type, entity ID, timestamp
- [ ] Filter by entity type works
- [ ] Filter by actor works
- [ ] Click row → expands details
- [ ] Details show JSON data
- [ ] Timestamps format correctly (relative: "2 hours ago")
- [ ] Stats cards: total actions, unique actors, entity types
- [ ] Mobile responsive
- [ ] Dark theme consistent
- [ ] No console errors

**Expected behavior:** Shows all audit trail with expandable details

---

#### 11. Settings (`/admin/settings`)
- [ ] Page loads without errors
- [ ] System status section visible
- [ ] 5 health indicators (API, DB, Redis, Worker, Beat)
- [ ] Indicators show correct status (✓ or ✗)
- [ ] Configuration section shows API URL + environment
- [ ] About section shows version + framework
- [ ] Status auto-updates (polling every 5s)
- [ ] Mobile responsive
- [ ] Dark theme consistent
- [ ] No console errors

**Expected behavior:** Live health monitoring

---

#### 12. Admin Layout (in all pages)
- [ ] Sidebar visible on desktop
- [ ] Sidebar collapsed on mobile (hamburger menu)
- [ ] Navigation links clickable
- [ ] Active link highlighted
- [ ] Logo/title visible
- [ ] Logout button present
- [ ] Mobile menu toggle works
- [ ] Menu overlay appears/disappears
- [ ] Dark theme consistent
- [ ] No console errors

**Expected behavior:** Consistent layout across all pages

---

## Component Tests (11)

### 1. AdminLayout
- [ ] Sidebar renders on desktop
- [ ] Mobile menu renders on small screens
- [ ] Navigation links are correct
- [ ] Active state highlights properly
- [ ] Logout button visible

### 2. DataTable
- [ ] Table renders with correct columns
- [ ] Sorting indicators appear when sortable
- [ ] Rows display without truncation (until small screen)
- [ ] Empty state message shows
- [ ] Loading skeleton appears
- [ ] Error state displays

### 3. StatusBadge
- [ ] All status types render with correct colors
- [ ] Text displays correctly
- [ ] No overflow issues

### 4. TenantForm
- [ ] All form fields visible
- [ ] Storage type dropdown works
- [ ] Submit button disabled until required fields filled
- [ ] Error message displays on submit failure

### 5. DeleteConfirmDialog
- [ ] Dialog appears on delete
- [ ] Item name displays
- [ ] Cancel button closes dialog
- [ ] Delete button triggers action
- [ ] Loading state shows while deleting

### 6. AdjustmentApprovalDialog
- [ ] Dialog appears on approve/reject
- [ ] Icon changes (green for approve, red for reject)
- [ ] Request details visible
- [ ] Admin notes textarea present
- [ ] Notes required validation works
- [ ] Submit button triggers action

### 7-9. Charts (DetectionTimeline, ObjectDistribution, SuccessRateGauge)
- [ ] Chart renders without errors
- [ ] Data points visible
- [ ] Tooltip works on hover
- [ ] Legend visible
- [ ] Responsive to container size
- [ ] Dark theme applied

### 10. AnalysisResultViewer
- [ ] Collapsed by default (summary shown)
- [ ] Click "Show" → expands JSON
- [ ] Click "Hide" → collapses JSON
- [ ] Copy button copies JSON
- [ ] Copy feedback ("Copied") shows
- [ ] No code injection risks (JSON.stringify safe)

### 11. API Client
- [ ] All methods resolve correctly
- [ ] Error handling works (try with bad data)
- [ ] Bearer token included in requests
- [ ] Type checking on responses

---

## Browser Compatibility Testing

### Desktop Browsers
- [ ] Chrome/Chromium 90+ (latest)
  - [ ] All pages load
  - [ ] Charts render smoothly
  - [ ] No console errors
  - [ ] Responsive design works

- [ ] Safari 14+
  - [ ] All pages load
  - [ ] Charts render smoothly
  - [ ] No console errors
  - [ ] Responsive design works
  - [ ] Dark theme renders

- [ ] Firefox 88+
  - [ ] All pages load
  - [ ] Charts render smoothly
  - [ ] No console errors
  - [ ] Responsive design works

### Mobile Browsers
- [ ] Safari on iPhone (iOS 14+)
  - [ ] All pages load
  - [ ] Touch interactions work
  - [ ] Hamburger menu opens
  - [ ] Forms submittable
  - [ ] Charts scrollable

- [ ] Chrome on Android (10+)
  - [ ] All pages load
  - [ ] Touch interactions work
  - [ ] Forms submittable
  - [ ] Charts responsive

---

## Performance Testing

### Load Time
- [ ] Dashboard home <2s
- [ ] Tenant list <1s
- [ ] File browser <1s
- [ ] Report detail (with charts) <2s
- [ ] Audit logs <1s

### Runtime Performance
- [ ] No jank when scrolling
- [ ] Charts render smoothly
- [ ] Filters responsive (<100ms)
- [ ] Sorting responsive (<100ms)
- [ ] Modal animations smooth

### Memory
- [ ] No memory leaks (DevTools)
- [ ] Page navigation doesn't accumulate listeners
- [ ] Polling doesn't create duplicate intervals

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Can tab through all interactive elements
- [ ] Focus visible on all buttons
- [ ] Enter/Space works on buttons
- [ ] Escape closes modals
- [ ] Form inputs accessible

### Screen Readers
- [ ] Page titles announced
- [ ] Button labels clear
- [ ] Form labels associated
- [ ] Error messages announced
- [ ] Loading states announced

### Color Contrast
- [ ] All text meets WCAG AA (4.5:1)
- [ ] Status badges distinguishable
- [ ] Links distinguishable from text

---

## Security Testing

### Authentication
- [ ] No credentials in localStorage
- [ ] No API keys in console logs
- [ ] Bearer token in requests only
- [ ] Token not visible in Network tab (HTTPS only)

### XSS Prevention
- [ ] JSON viewer doesn't execute code
- [ ] Form inputs sanitized
- [ ] URLs safe (no javascript: protocol)

### Data Protection
- [ ] No sensitive data in URLs
- [ ] No PII in error messages
- [ ] CSV export safe
- [ ] JSON download safe

---

## Mobile Responsiveness Checklist

### Viewport Sizes to Test
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone 12)
- [ ] 540px (iPad Mini)
- [ ] 768px (iPad)
- [ ] 1024px (iPad Pro)
- [ ] 1440px (Desktop)

### Mobile-Specific
- [ ] Hamburger menu works
- [ ] Tables scroll horizontally
- [ ] Forms fit on screen (no horizontal scroll)
- [ ] Buttons large enough to tap (44px+)
- [ ] Input fields accessible
- [ ] Modals fit viewport
- [ ] Charts scale appropriately

---

## Dark Theme Verification

- [ ] Background colors dark (#111827, #1f2937)
- [ ] Text colors light (#f3f4f6, #d1d5db)
- [ ] Cards have dark borders
- [ ] Buttons have proper contrast
- [ ] Charts tooltips dark theme
- [ ] Modals dark background
- [ ] Consistent across all pages

---

## Network/API Testing

### Mocked Data (Current State)
- [ ] All pages work with mocked data
- [ ] No 404 errors from missing endpoints
- [ ] Pagination works with mock data
- [ ] Filters work with mock data

### Backend Integration (Next Step)
- [ ] Update mock data to real API calls
- [ ] Error handling for network failures
- [ ] Retry logic works
- [ ] Token refresh works (if applicable)
- [ ] Pagination with real API works

---

## Edge Cases to Test

### Empty States
- [ ] No tenants → "No tenants found"
- [ ] No files → "No files found"
- [ ] No reports → "No reports found"
- [ ] No audit logs → "No audit logs found"
- [ ] No adjustment requests → "No requests found"

### Error States
- [ ] Network error → Show error message + retry button
- [ ] 404 response → Show "Not found" + back button
- [ ] 500 response → Show error message
- [ ] Timeout → Show timeout message + retry button
- [ ] Invalid data → Handle gracefully

### Loading States
- [ ] First load shows spinner
- [ ] Refresh shows spinner
- [ ] Modal submission shows spinner
- [ ] Spinners don't block interaction (except button)

### Large Data
- [ ] 1000+ items in table (paginate)
- [ ] Large JSON in viewer (scrollable)
- [ ] Many chart data points (still performant)

---

## Regression Testing

### After Each Change
- [ ] No broken imports
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] All pages still load
- [ ] All buttons still clickable
- [ ] Navigation still works

---

## QA Sign-Off

After completing all tests:

- [ ] All critical tests passed
- [ ] No critical bugs found
- [ ] No console errors
- [ ] Mobile responsive verified
- [ ] Dark theme verified
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Ready for production

**QA Sign-Off Date:** ___________  
**QA Tester Name:** ___________  
**Status:** [ ] APPROVED [ ] NEEDS FIXES

---

## Known Issues (If Any)

1. Issue: [description]
   - Severity: [ ] Critical [ ] High [ ] Medium [ ] Low
   - Workaround: [if available]
   - Fix: [planned for when]

---

## Test Results Summary

| Category | Status | Notes |
|----------|--------|-------|
| Functionality | ⏳ | To be tested |
| Performance | ⏳ | To be tested |
| Accessibility | ⏳ | To be tested |
| Security | ⏳ | To be tested |
| Mobile | ⏳ | To be tested |
| Browser Compat | ⏳ | To be tested |

---

**Testing started:** ___________  
**Testing completed:** ___________  
**Total test time:** ___________

---

## Next Steps After QA

1. [ ] Fix any critical bugs
2. [ ] Fix any high-severity bugs
3. [ ] Document medium/low bugs
4. [ ] Integrate real backend APIs
5. [ ] Deploy to staging
6. [ ] Production deployment (Sep 1)
