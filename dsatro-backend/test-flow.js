// fetch is built-in in Node 18+

async function runTest() {
  try {
    // 1. Get courses
    const res1 = await fetch('http://localhost:5000/api/courses');
    const data1 = await res1.json();
    const courseId = data1.courses[0]._id;
    console.log('Course ID:', courseId);

    // 2. Create Order
    const res2 = await fetch('http://localhost:5000/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId,
        name: 'Test User',
        email: 'test@example.com',
        mobile: '1234567890'
      })
    });
    const data2 = await res2.json();
    console.log('Create Order:', data2);

    // 3. Verify Payment
    const res3 = await fetch('http://localhost:5000/api/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: data2.razorpayOrderId,
        razorpay_payment_id: `pay_mock_123`,
        razorpay_signature: `sig_mock_123`,
        name: 'Test User',
        email: 'test@example.com'
      })
    });
    const data3 = await res3.json();
    console.log('Verify Payment:', data3);
  } catch (err) {
    console.error('Error in script:', err);
  }
}

runTest();
