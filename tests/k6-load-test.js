import http from 'k6/http';
import { check, sleep } from 'k6';

// 3x Peak Traffic Simulation (200 Concurrent Virtual Users)
export const options = {
  stages: [
    { duration: '30s', target: 50 },   // Warm-up ramp
    { duration: '1m', target: 200 },    // Peak load (200 VU)
    { duration: '30s', target: 200 },   // Sustained 3x peak
    { duration: '20s', target: 0 },     // Ramp down
  ],
  thresholds: {
    // 99% of requests must complete under 1500ms (1.5 seconds)
    http_req_duration: ['p(99)<1500'],
    // Less than 1% failed requests
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:3000';
const API_URL = __ENV.API_URL || 'http://localhost:4000';

export default function () {
  // 1. Visit Public Landing Page
  const homeRes = http.get(`${BASE_URL}/`);
  check(homeRes, {
    'Homepage status is 200': (r) => r.status === 200,
    'Homepage loaded under 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);

  // 2. Visit Compress Tool Page
  const compressRes = http.get(`${BASE_URL}/tools/compress`);
  check(compressRes, {
    'Compress page status is 200': (r) => r.status === 200,
  });

  sleep(0.5);

  // 3. Visit Pricing Matrix
  const pricingRes = http.get(`${BASE_URL}/pricing`);
  check(pricingRes, {
    'Pricing page status is 200': (r) => r.status === 200,
  });

  sleep(1);

  // 4. Test API Health Endpoint
  const healthRes = http.get(`${API_URL}/api/health`);
  check(healthRes, {
    'API health status is 200': (r) => r.status === 200,
    'API health responded in < 150ms': (r) => r.timings.duration < 150,
  });

  sleep(1);
}
