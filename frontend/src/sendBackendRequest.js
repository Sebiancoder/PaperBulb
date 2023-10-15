const backendUrl = "https://paper-bulb-1.csmtu2rs75560.us-east-1.cs.amazonlightsail.com/";

function sendBackendRequest(endpoint, the_rest) {
  const apiUrl = backendUrl + endpoint + "?" + the_rest;
  console.log(apiUrl)
  return fetch(apiUrl, {mode: 'cors'})
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





