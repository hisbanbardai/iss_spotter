const request = require("request");
const FETCH_MY_API_ENDPOINT = "https://api.ipify.org/?format=json";
const FETCH_COORDS_BY_API = "https://ipwho.is/";
const FETCH_ISS_FLYOVER_TIMES = "https://iss-flyover.herokuapp.com/json/";

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function (callback) {
  // use request to fetch IP address from JSON API
  request(FETCH_MY_API_ENDPOINT, (error, response, body) => {
    // error can be set if invalid domain, user is offline, etc.
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

const fetchCoordsByIP = function (ip, callback) {
  //use request to fetch co-ordinates from JSON API
  request(FETCH_COORDS_BY_API + ip, (error, response, body) => {
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
      return;
    }

    //parsing the returned body
    const parsedBody = JSON.parse(body);

    //check if success is false
    if (!parsedBody.success) {
      const msg = `Success msg was: ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(msg), null);
      return;
    }

    //Because we know the names of keys from the parsedBody therefore we can destruct the object
    const { latitude, longitude } = parsedBody;
    callback(null, { latitude, longitude });
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function ({ latitude, longitude }, callback) {
  //use request to fetch co-ordinates from JSON API
  request(
    FETCH_ISS_FLYOVER_TIMES + "?lat=" + latitude + "&lon=" + longitude,
    (error, response, body) => {
      // error can be set if invalid domain, user is offline, etc.
      if (error) {
        callback(error, null);
        return;
      }

      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching ISS pass times: ${body}`;
        //Error() creates a new error object
        callback(Error(msg), null);
        return;
      }

      //parsing the returned body
      const parsedBody = JSON.parse(body);

      callback(null, parsedBody.response);
    }
  );
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function (callback) {
  //first step is to fetch our ip address
  fetchMyIP((error, ip) => {
    //if any error occurs then invoke the callback function with error and return
    if (error) {
      callback(error, null);
      return;
    }

    //second step is to fetch the co-ordinates using the ip address we fetched from the above function
    fetchCoordsByIP(ip, (error, data) => {
      //if any error occurs then invoke the callback function with error and return
      if (error) {
        callback(error, null);
        return;
      }

      //third and final step is to fetch the fly over times using co-ordinates we fetched from the above function
      fetchISSFlyOverTimes(data, (error, data) => {
        //if any error occurs then invoke the callback function with error and return
        if (error) {
          callback(error, null);
          return;
        }

        //we have got the flyover times. Invoke the callback function with the data
        callback(null, data);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };
