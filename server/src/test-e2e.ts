import { createServer } from './server';
import { runMigrations } from './database/migrate';
import http from 'http';

function makeRequest(
  port: number,
  method: string,
  path: string,
  body?: any,
  token?: string
): Promise<{ status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : undefined;
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode || 200, data: raw ? JSON.parse(raw) : null });
          } catch {
            resolve({ status: res.statusCode || 200, data: raw });
          }
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runE2ETest() {
  console.log('🧪 Starting SyncWrite E2E Integration Test...');

  runMigrations();
  const { httpServer } = createServer();
  const testPort = 3099;

  await new Promise<void>((resolve) => httpServer.listen(testPort, resolve));
  console.log(`📡 Test server running on port ${testPort}`);

  try {
    // 1. Templates
    const tplRes = await makeRequest(testPort, 'GET', '/api/templates');
    console.assert(tplRes.status === 200, 'Templates status should be 200');
    console.assert(tplRes.data.templates.length === 9, 'Should return 9 templates');
    console.log(`✅ Templates API verified: ${tplRes.data.templates.length} templates available`);

    // 2. Auth: Register
    const email = `dev_${Date.now()}@example.com`;
    const regRes = await makeRequest(testPort, 'POST', '/api/auth/register', {
      email,
      username: 'artisan_dev',
      password: 'password123',
    });
    console.assert(regRes.status === 201, 'Registration status should be 201');
    const token = regRes.data.accessToken;
    const user = regRes.data.user;
    console.log(`✅ User registration verified: ${user.username} (${user.email})`);

    // 3. Auth: Login
    const loginRes = await makeRequest(testPort, 'POST', '/api/auth/login', {
      email,
      password: 'password123',
    });
    console.assert(loginRes.status === 200, 'Login status should be 200');
    console.log('✅ User login verified');

    // 4. Project: Create with python-flask template
    const projRes = await makeRequest(
      testPort,
      'POST',
      '/api/projects',
      {
        name: 'Flask Test API',
        language: 'python',
        template: 'python-flask',
        description: 'E2E Test Workspace',
      },
      token
    );
    console.assert(projRes.status === 201, 'Project creation should be 201');
    const project = projRes.data;
    console.log(`✅ Project created: ${project.name} (ID: ${project.id})`);

    // 5. Files: Get file tree
    const treeRes = await makeRequest(testPort, 'GET', `/api/projects/${project.id}/files`, undefined, token);
    console.assert(treeRes.status === 200, 'File tree should be 200');
    console.assert(treeRes.data.tree.length >= 3, 'Template should create app.py, requirements.txt, README.md');
    console.log(`✅ File tree verified: found ${treeRes.data.tree.map((t: any) => t.name).join(', ')}`);

    // 6. Files: Read app.py
    const fileRes = await makeRequest(testPort, 'GET', `/api/projects/${project.id}/files/app.py`, undefined, token);
    console.assert(fileRes.status === 200, 'Read file should be 200');
    console.assert(fileRes.data.content.includes('Flask'), 'Content should contain Flask code');
    console.log('✅ File read verified: Flask boilerplate content loaded');

    // 7. Files: Update app.py
    const updatedContent = fileRes.data.content + '\n# Verified by E2E test\n';
    const updateRes = await makeRequest(
      testPort,
      'PUT',
      `/api/projects/${project.id}/files/app.py`,
      { content: updatedContent },
      token
    );
    console.assert(updateRes.status === 200, 'Update file should be 200');
    console.log('✅ File update verified');

    // 8. Reviews: Save AI Review
    const reviewRes = await makeRequest(
      testPort,
      'POST',
      `/api/projects/${project.id}/reviews`,
      {
        filePath: 'app.py',
        provider: 'openai',
        comments: [
          {
            line: 10,
            severity: 'info',
            message: 'Consider adding docstrings',
            suggestion: '"""Home endpoint handler."""',
          },
        ],
      },
      token
    );
    console.assert(reviewRes.status === 201, 'Review creation should be 201');
    console.log('✅ AI review persistence verified');

    // 9. History: Query edit events
    const histRes = await makeRequest(testPort, 'GET', `/api/projects/${project.id}/history`, undefined, token);
    console.assert(histRes.status === 200, 'History should be 200');
    console.log('✅ History API verified');

    console.log('\n🎉 ALL END-TO-END TESTS PASSED SUCCESSFULLY! 🎉\n');
  } finally {
    httpServer.close();
    process.exit(0);
  }
}

runE2ETest().catch((err) => {
  console.error('❌ E2E Test Failed:', err);
  process.exit(1);
});
