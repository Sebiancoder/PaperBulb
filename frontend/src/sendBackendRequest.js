// backend url
const backendUrl = 'http://your-flask-backend.com/api/data';

// Function to make a request
function sendBackendRequest() {
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Request failed');
      }
      return response.json();
    })
    .then((data) => {
      // Process the data returned by the Flask backend
      console.log('Backend request successful');
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}





