import axios from 'axios';

async function test() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'admin@example.com',
      password: 'password123'
    });
    
    const token = loginRes.data.token || ''; 
    const cookies = loginRes.headers['set-cookie'];
    
    // Get bookings
    const bookingsRes = await axios.get('http://localhost:5000/api/v1/bookings', {
      headers: {
        Cookie: cookies ? cookies.join('; ') : '',
        Authorization: `Bearer ${token}`
      }
    });

    const bookingId = bookingsRes.data.data[0]._id;

    // Create Order
    const orderRes = await axios.post('http://localhost:5000/api/v1/payments/create-order', {
      bookingId
    }, {
      headers: {
        Cookie: cookies ? cookies.join('; ') : '',
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Order creation successful!', orderRes.data);

  } catch (err) {
    console.error('API Error:', err.response?.status, err.response?.data || err.message);
  }
}

test();
