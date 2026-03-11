// Test API endpoint for getAllOrders
const token = localStorage.getItem('token');
console.log('Token:', token ? 'exists' : 'not found');

fetch('http://localhost:5000/api/orders', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
})
.then(response => {
    console.log('Status:', response.status);
    return response.json();
})
.then(data => {
    console.log('Response:', data);
})
.catch(error => {
    console.error('Error:', error);
});
