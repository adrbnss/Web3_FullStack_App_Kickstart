import React, { Component } from "react";
import factory from "../ethereum/factory";
import { Card, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Layout from "../components/Layout";
import { Link } from "../routes";

class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaign().call();

    return { campaigns };
  }

  renderCampaign() {
    const item = this.props.campaigns.map((address) => {
      return {
        header: address,
        description: <Link route={`/campaigns/${address}`}>View Campaign</Link>,
        fluid: true,
      };
    });

    return <Card.Group items={item} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Open campaigns</h3>

          <Link route="/campaigns/new">
            <Button
              floated="right"
              content="Create Campaign"
              icon="add circle"
              primary
            />
          </Link>

          {this.renderCampaign()}
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
