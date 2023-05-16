require("@nomicfoundation/hardhat-toolbox");

require('dotenv').config();


// console.log("LOCALHOST_URL:", process.env.LOCALHOST_URL);
// console.log("ACCOUNT_PRIVATE_KEY:", process.env.ACCOUNT_PRIVATE_KEY);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    localhost: {
      url: process.env.LOCALHOST_URL,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY_1,
      process.env.ACCOUNT_PRIVATE_KEY_2,],
    }
  }
};
