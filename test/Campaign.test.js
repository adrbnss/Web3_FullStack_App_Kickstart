const assert = require("assert");
const Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:7545");

const dataCampaign = require("../build/contracts/Campaign.json");
const dataCampaignFactory = require("../build/contracts/CampaignFactory.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(dataCampaignFactory.abi)
    .deploy({ data: dataCampaignFactory.bytecode })
    .send({ from: accounts[0], gas: "10000000" });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "10000000",
  });

  [campaignAddress] = await factory.methods.getDeployedCampaign().call();

  campaign = await new web3.eth.Contract(dataCampaign.abi, campaignAddress);
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the contract manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("allows people to contribute and marks them as approvers", async () => {
    await campaign.methods
      .contribute()
      .send({ value: "200", from: accounts[1] });

    const isContributer = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributer);
  });

  it("requires a minimul contribution", async () => {
    try {
      await campaign.methods.contribute().send({ value: 5, from: accounts[1] });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("allows a manager to make a payment request", async () => {
    await campaign.methods
      .createRequest("Buy batteries", "100", accounts[1])
      .send({ from: accounts[0], gas: "1000000" });

    const request = await campaign.methods.requests(1).call();
    assert.equal("Buy batteries", request.description);
  });

  it("proccesses requests", async () => {
    await campaign.methods
      .contribute()
      .send({ from: accounts[0], value: web3.utils.toWei("10", "ether") });

    await campaign.methods
      .createRequest("Test", web3.utils.toWei("5", "ether"), accounts[1])
      .send({ from: accounts[0], gas: "1000000" });

    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    await campaign.methods
      .finalizeRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.toWei(balance, "ether");
    balance = parseFloat(balance);

    assert(balance > 104);
  });
});
