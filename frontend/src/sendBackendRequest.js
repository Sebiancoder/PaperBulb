// backend url
const backendUrl = 'we need to figure this out';

// Function to make a request
function sendBackendRequest(endpoint, args, the_rest) {

  apiUrl = backendUrl + endpoint + "?" + the_rest

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





