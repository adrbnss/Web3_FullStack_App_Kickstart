import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import campaign from "../ethereum/campaign";

class RequestRow extends Component {
  onApprove = async () => {
    const campaignInstance = campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();
    await campaignInstance.methods
      .approveRequest(this.props.id)
      .send({ from: accounts[0] });
  };

  onFinalize = async () => {
    const campaignInstance = campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();
    await campaignInstance.methods
      .finalizeRequest(this.props.id)
      .send({ from: accounts[0] });
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;
    const readyToFinalize = request.approvalCount > approversCount / 2;
    return (
      <Row
        disabled={request.complete}
        positive={readyToFinalize && !request.complete}
      >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {request.approvalCount}/{approversCount}
        </Cell>
        <Cell>
          <Button
            disabled={request.complete}
            color="green"
            basic
            onClick={this.onApprove}
          >
            Approve
          </Button>
        </Cell>
        <Cell>
          <Button
            disabled={request.complete}
            color="blue"
            basic
            onClick={this.onFinalize}
          >
            Finalize
          </Button>
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
