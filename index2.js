// const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require("./iss_promised");

// //when IP is fetched successfully it will return a promise with resolve and reject functions along with the value i.e. the body which contains IP address (in the case of resolve)
// fetchMyIP()
// // this then would fetch the resolve and its value and called fetchCoordsByIP function which is passed as a callback and which again would return a new promise
//   .then(fetchCoordsByIP)
//   //this then would fetch the resolve and its value and called fetchISSFlyOverTimes function which is passed as a callback and which again would return a new promise
//   .then(fetchISSFlyOverTimes)
//   //this then would fetch the resolve and its value and its callback function would be called in which we are printing that value i.e. the body
//   .then(body => console.log(body))

const { nextISSTimesForMyLocation } = require("./iss_promised");

const printPassTimes = function (passTimes) {
  for (const passTime of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(passTime.risetime);
    const duration = passTime.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });
