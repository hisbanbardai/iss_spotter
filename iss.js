const request = require("request");
const API_ENDPOINT = "https://api.ipify.org/?format=json";

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request(API_ENDPOINT, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      //Error() creates a new error object
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body).ip;
    data ? callback(null, data) : callback(error, null);
  });
};

module.exports = { fetchMyIP };
