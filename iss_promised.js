const request = require("request-promise-native");
const FETCH_MY_API_ENDPOINT = "https://api.ipify.org/?format=json";
const FETCH_COORDS_BY_API = "https://ipwho.is/";
const FETCH_ISS_FLYOVER_TIMES = "https://iss-flyover.herokuapp.com/json/";

/*
 * Makes a request to api.ipify.org to get the IP address
 * Returns: Promise of request for IP address
 */
const fetchMyIP = function () {
  return request(FETCH_MY_API_ENDPOINT);
};

/*
 * Makes a request to ipwho.is using the provided IP address to get its geographical information (latitude/longitude)
 * Input: JSON string containing the IP address
 * Returns: Promise of request for lat/lon
 */

const fetchCoordsByIP = function (body) {
  const ip = JSON.parse(body).ip;
  return request(FETCH_COORDS_BY_API + ip);
};

/*
 * Requests data from https://iss-flyover.herokuapp.com using provided lat/long data
 * Input: JSON body containing geo data response from ipwho.is
 * Returns: Promise of request for fly over data, returned as JSON string
 */

const fetchISSFlyOverTimes = function (body) {
  //Because we know the names of the keys so we can destruct it
  const { latitude, longitude } = JSON.parse(body);
  return request(
    FETCH_ISS_FLYOVER_TIMES + "?lat=" + latitude + "&lon=" + longitude
  );
};

const nextISSTimesForMyLocation = function () {
  //returning this so that we could call then() on this in index2.js
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((body) => {
      return JSON.parse(body).response;
    });
};

module.exports = { nextISSTimesForMyLocation };
