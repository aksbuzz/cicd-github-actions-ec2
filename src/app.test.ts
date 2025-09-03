import request from 'supertest';
import app from './app';

describe('GET /', () => {
  it('should return 200 OK with a hello message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Hello, World!');
  });
});
