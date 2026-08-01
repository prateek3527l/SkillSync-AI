/**
 * SkillSync AI – Server Unit Tests
 * 
 * Uses Jest + Supertest to test API endpoints.
 * Run: npm test (from the /server directory)
 */

const request = require('supertest');
const jestMock = require('jest');

jest.mock('../models/User', () => {
  return {
    findOne: jest.fn().mockImplementation(() => {
      return {
        select: jest.fn().mockReturnThis(),
        matchPassword: jest.fn().mockResolvedValue(false),
      };
    }),
    create: jest.fn(),
  };
});

const app = require('../server');

// ─── Health Check ──────────────────────────────────────────────────────────
describe('GET /api/health', () => {
  it('should return 200 with status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('environment');
  });
});

// ─── 404 Not Found ─────────────────────────────────────────────────────────
describe('Unknown Route', () => {
  it('should return 404 for undefined routes', async () => {
    const res = await request(app).get('/api/nonexistent-route');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message');
  });
});

// ─── Auth – Input Validation ───────────────────────────────────────────────
describe('POST /api/auth/register', () => {
  it('should return 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'bad@test.com' }); // missing name and password
    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'not-an-email', password: 'password123' });
    expect(res.statusCode).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  it('should return 401 for incorrect credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@notexist.com', password: 'wrongpassword' });
    expect(res.statusCode).toBe(401);
  });
});

// ─── Protected Routes ─────────────────────────────────────────────────────
describe('Protected Routes', () => {
  it('should return 401 when accessing /api/projects without a token', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.statusCode).toBe(401);
  });

  it('should return 401 when accessing /api/resume without a token', async () => {
    const res = await request(app).get('/api/resume');
    expect(res.statusCode).toBe(401);
  });

  it('should return 401 for /api/analytics/overview without a token', async () => {
    const res = await request(app).get('/api/analytics/overview');
    expect(res.statusCode).toBe(401);
  });
});

// ─── Rate Limiting ────────────────────────────────────────────────────────
// NOTE: Rate limiting tests should be integration-level; skipped here to
// avoid slowing the CI test suite. Verify manually with a load testing tool.
describe('Security', () => {
  it('should have x-content-type-options header (Helmet)', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });
});
