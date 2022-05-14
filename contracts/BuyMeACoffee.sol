//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract BuyMeACoffee {
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message,
        string coffeeSize
    );

    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
        string coffeeSize;
    }

    Memo[] memos;

    address payable owner;

    // deploy logic!
    constructor() {
        owner = payable(msg.sender);
    }

    function buyCoffee(string memory _name,string memory _message) public payable  {
        require(msg.value > 0,"can`t buy coffee with 0 eth");

        string memory coffeeSize;

        if(msg.value == 1){
            coffeeSize = "normal";
        } 
        if(msg.value == 2) {
            coffeeSize = "large";
        }

        // Add the memo to storage!
        memos.push(
            Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message,
            coffeeSize
            )
        );

        // Emit a log event when a new memo is created!
        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message,
            coffeeSize
        );
    }

    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }

    function getMemos() public view returns(Memo[] memory){
        return memos;
    }
}
