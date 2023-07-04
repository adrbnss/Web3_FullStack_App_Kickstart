import web3 from "./web3";
import CampaignFactory from "../build/contracts/CampaignFactory.json";

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  "0xfdaB1c3f94586CF629d2260D4D1aEF40CdD9d92e"
);

export default instance;
