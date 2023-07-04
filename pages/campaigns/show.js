import React, { Component } from "react";
import { Card, Grid, Button } from "semantic-ui-react";
import Layout from "../../components/Layout";
import campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/contributeForm";
import { Link } from "../../routes";

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const campaignInstance = campaign(props.query.address);

    const summary = await campaignInstance.methods.getSummary().call();

    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      nbRequest: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    };
  }

  renderCards() {
    const { minimumContribution, balance, nbRequest, approversCount, manager } =
      this.props;

    const items = [
      {
        header: manager,
        meta: "Address of manager",
        description:
          "Creator of this campaign and can create spending requests",
        style: { overflowWrap: "break-word" },
        color: "red",
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description:
          "You must contribute at least this much wei to the campaign",
        color: "red",
      },
      {
        header: nbRequest,
        meta: "Number of requests",
        description: "A request is created to spend money from the campaign",
        color: "red",
      },
      {
        header: approversCount,
        meta: "Number of contributers",
        description:
          "Number of people who have already donated to this campaign",
        color: "red",
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Balance of this campaign",
        description: "Ammount of ETH currently available for this campaign",
        color: "red",
      },
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Campaign Show</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>

            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <Button primary>View Requests</Button>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
