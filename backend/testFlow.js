import fetch from 'node-fetch';

async function testFlow() {
  console.log("Testing Registration...");
  const regRes = await fetch('http://localhost:5000/api/v1/users', { // Wait, register route is what? Let's check auth routes.
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Setup',
      email: 'tester11@gmail.com',
      password: 'mypassword123',
      phone: '1234567890'
    })
  });
  
  if(regRes.status === 404) {
     console.log("404 Route not found, let's look at server.js routes.");
  }
}
testFlow();
