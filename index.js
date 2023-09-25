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
