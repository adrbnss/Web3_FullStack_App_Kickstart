const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

const dataCampaign = require("../build/contracts/Campaign.json");
const dataCampaignFactory = require("../build/contracts/CampaignFactory.json");

const provider = new HDWalletProvider(
  "demise project panic young success vault chief rose because hire defy regret",
  // remember to change this to your own phrase!
  "https://goerli.infura.io/v3/9d51d358b6c9487abf34ab6a344d8d74"
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  try {
    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy from account", accounts[0]);

    const result = await new web3.eth.Contract(dataCampaignFactory.abi)
      .deploy({ data: dataCampaignFactory.bytecode })
      .send({ from: accounts[0], gas: "10000000" });

    console.log("Contract deployed to", result.options.address);
    provider.engine.stop();
  } catch (error) {
    console.log(error);
  }
};
deploy();
