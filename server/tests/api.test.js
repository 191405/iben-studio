/**
 * ============================================================================
 * AUTOMATED TEST SUITE: TELEMETRY, INQUIRIES & PORTFOLIO ENDPOINTS
 * ============================================================================
 */
const request = require('supertest');
const app = require('../src/app');

describe('IBEN Studio Core API Endpoints', () => {
  test('GET /api/v1/health should return system telemetry and database status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe('ONLINE');
    expect(res.body.system).toHaveProperty('uptimeSeconds');
    expect(res.body.database.status).toBe('CONNECTED');
  });

  test('GET /api/v1/portfolio should return list of seeded case studies', async () => {
    const res = await request(app).get('/api/v1/portfolio');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(4);
  });

  test('GET /api/v1/portfolio?discipline=solar-engineering should filter case studies', async () => {
    const res = await request(app).get('/api/v1/portfolio?discipline=solar-engineering');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.every(p => p.discipline === 'solar-engineering')).toBe(true);
  });

  test('POST /api/v1/inquiries should accept valid client inquiries', async () => {
    const payload = {
      name: 'Chinedu Okafor',
      email: 'chinedu@apextech.ng',
      discipline: 'solar-engineering',
      message: 'We require a 200kWp rooftop solar array for our industrial plant in Ikeja.'
    };

    const res = await request(app)
      .post('/api/v1/inquiries')
      .send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('pending');
    expect(res.body.data).toHaveProperty('inquiryId');
  });

  test('POST /api/v1/inquiries should reject malformed email address with 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/v1/inquiries')
      .send({
        name: 'Chinedu Okafor',
        email: 'not-an-email',
        discipline: 'solar-engineering',
        message: 'Hello world'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
