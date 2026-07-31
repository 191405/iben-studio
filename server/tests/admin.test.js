/**
 * ============================================================================
 * IBEN STUDIO — ADMIN DASHBOARD & JWT AUTHENTICATION TEST SUITE
 * ============================================================================
 */
const request = require('supertest');
const app = require('../src/app');

describe('Enterprise Admin API (/api/v1/admin)', () => {
  let adminToken = '';
  let sampleInquiryId = '';

  beforeAll(async () => {
    // Submit a sample inquiry first so admin has data to inspect & update
    const inquiryRes = await request(app)
      .post('/api/v1/inquiries')
      .send({
        name: 'Chief Emeka Okafor',
        email: 'emeka.okafor@solar-test.ng',
        phone: '+2348030009999',
        discipline: 'solar-engineering',
        budget: '50m-100m',
        timeline: '1-3-months',
        message: 'Looking for a 15kVA commercial hybrid inverter and LiFePO4 battery setup.'
      });
    sampleInquiryId = inquiryRes.body.data.inquiryId;
  });

  test('POST /api/v1/admin/login — should reject invalid credentials with 401', async () => {
    const res = await request(app)
      .post('/api/v1/admin/login')
      .send({
        email: 'admin@ibenstudio.com',
        password: 'WrongPassword!'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toMatch(/Invalid enterprise admin credentials/i);
  });

  test('POST /api/v1/admin/login — should authenticate valid credentials and return JWT', async () => {
    const res = await request(app)
      .post('/api/v1/admin/login')
      .send({
        email: 'admin@ibenstudio.com',
        password: 'IbenAdmin2026!'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('admin');
    expect(res.body.user.permissions).toContain('read:inquiries');

    adminToken = res.body.token;
  });

  test('GET /api/v1/admin/inquiries — should block unauthenticated access with 401', async () => {
    const res = await request(app)
      .get('/api/v1/admin/inquiries');

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/v1/admin/inquiries — should allow access with valid Bearer JWT', async () => {
    const res = await request(app)
      .get('/api/v1/admin/inquiries')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.analytics).toBeDefined();
    expect(res.body.analytics.totalCommissions).toBeGreaterThan(0);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  test('PUT /api/v1/admin/inquiries/:id/status — should update commission status', async () => {
    const res = await request(app)
      .put(`/api/v1/admin/inquiries/${sampleInquiryId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'in-review'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('in-review');
    expect(res.body.data.updatedAt).toBeDefined();
  });

  test('GET /api/v1/admin/stats — should return executive KPI dashboard metrics', async () => {
    const res = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.system.service).toBe('IBEN Studio Enterprise API');
    expect(res.body.metrics.totalInquiries).toBeGreaterThan(0);
  });

  let createdPortfolioId = '';
  test('POST /api/v1/admin/portfolio — should create new case study with valid JWT', async () => {
    const res = await request(app)
      .post('/api/v1/admin/portfolio')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Enterprise AI Energy Platform',
        discipline: 'software-applications',
        client: 'Apex Industrial Energy',
        year: 2026,
        description: 'Real-time telemetry and energy forecasting SaaS platform.',
        metrics: '99.99% Uptime / 450MW Managed',
        tags: ['AI/ML', 'BigQuery', 'Solar']
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Enterprise AI Energy Platform');
    expect(res.body.data.id).toBeDefined();
    createdPortfolioId = res.body.data.id;
  });

  test('PUT /api/v1/admin/portfolio/:id — should update portfolio item', async () => {
    const res = await request(app)
      .put(`/api/v1/admin/portfolio/${createdPortfolioId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        metrics: '100% Uptime / 500MW Managed'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.metrics).toBe('100% Uptime / 500MW Managed');
  });

  test('DELETE /api/v1/admin/portfolio/:id — should delete portfolio item', async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/portfolio/${createdPortfolioId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
