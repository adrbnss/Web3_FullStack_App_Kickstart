// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract CampaignFactory {
    address[] public deployedCampaings;

    function createCampaign(uint256 _minimum) public {
        address newCampaign = address(new Campaign(_minimum, msg.sender));
        deployedCampaings.push(newCampaign);
    }

    function getDeployedCampaign() public view returns (address[] memory) {
        return deployedCampaings;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint256 public approversCount;
    uint256 public minimumContribution;
    uint256 nbRequests = 1;
    mapping(address => bool) public approvers;
    mapping(uint256 => Request) public requests;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint256 _minimum, address _creator) {
        manager = _creator;
        minimumContribution = _minimum;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string memory _description,
        uint256 _value,
        address payable _recipient
    ) public restricted {
        Request storage newRequest = requests[nbRequests];
        nbRequests++;

        newRequest.description = _description;
        newRequest.value = _value;
        newRequest.recipient = _recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint256 _index) public {
        Request storage request = requests[_index];

        require(!request.complete);
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint256 _index) public restricted {
        Request storage request = requests[_index];

        require(!request.complete);
        require(request.approvalCount > (approversCount / 2));

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            minimumContribution,
            address(this).balance,
            nbRequests,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return nbRequests;
    }
}
