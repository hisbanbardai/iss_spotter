const { nextISSTimesForMyLocation } = require("./iss");

const printPassTimes = function (passTimes) {
  for (const passTime of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(passTime.risetime);
    const duration = passTime.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

//calling this function with a callback function to check if there is an error then return with error msg otherwise print the flyover times
nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});



// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }

//   console.log('It worked! Returned IP:' , ip);
// });

// fetchCoordsByIP("104.205.234.66", (error, data) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }

//   console.log('It worked! Returned co-ordinates:' , data);
// });

// const latitude = "53.544389abc";
// const longitude = "-113.4909267";
// fetchISSFlyOverTimes({ latitude, longitude }, (error, data) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }

//   console.log("It worked! Returned upcoming times:", data);
// });
