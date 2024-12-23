/**
 * Utility function to fetch data from a given URL.
 * @param {string} url - The URL to fetch data from.
 * @param {RequestInit} options - The options for the fetch request (method, headers, etc.).
 * @returns {Promise<any>} The response data in JSON format.
 * @throws {Error} Throws an error if the request fails or if the response is not ok.
 */
export const fetchData = async (url: string, options: RequestInit): Promise<any> => {
  try {
    const response = await fetch(url, options);

    // Check if the response is not OK (status 200-299)
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    // Parse the response as JSON
    const data = await response.json();
    return data;
  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching data:', error);

    // Rethrow the error to be handled by the caller
    throw new Error(`Error fetching data from ${url}: ${error.message}`);
  }
};

// URL and options for the fetch request
const url = 'https://api.barkprotocol.net/data';
const options: RequestInit = {
  method: 'GET', // You can use 'POST', 'PUT', etc., as needed
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-token-here', // Replace with your actual token
  },
};

const fetchDataFromAPI = async () => {
  try {
    const data = await fetchData(url, options);
    console.log('Fetched data:', data); // Display the fetched data in the console
  } catch (error) {
    console.error('Error occurred while fetching data:', error);
  }
};

fetchDataFromAPI();