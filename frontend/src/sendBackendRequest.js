const backendUrl = "http://127.0.0.1:5000/";

function sendBackendRequest(endpoint, the_rest) {
  const apiUrl = backendUrl + endpoint + "?" + the_rest;

  return fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Request failed');
      }
      return response.json();
    })
    .then((data) => {
      console.log('Backend request successful');
      return data; // Returning the fetched data
    })
    .catch((error) => {
      console.error('Error:', error);
      throw error;
    });
}

export default sendBackendRequest; // Exporting the function as default





