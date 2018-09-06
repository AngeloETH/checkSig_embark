pragma solidity ^0.4.24;


contract Authorization {
    

    mapping (address => mapping (address => bool)) private verified;  //[owner][signer]
    
    event change(address indexed owner, address indexed signer, bool rights);

    constructor() public{
    }


    function register(address signer) public {         //register signer
        require (signer != msg.sender);
        require (verified[msg.sender][signer] != true);
        verified[msg.sender][signer] = true;
        emit change(msg.sender, signer, verified[msg.sender][signer]);
        
    }

    function checkSig(bytes32 _hash, uint8 v, bytes32 r, bytes32 s, address owner) public view returns (bool) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = keccak256(prefix, _hash);
        address signer = ecrecover(prefixedHash, v, r, s);
        return verified[owner][signer];
    }

    function cancel(address signer) public {
        require (signer != msg.sender);
        require ( verified[msg.sender][signer] == true);
        verified[msg.sender][signer] = false;
        emit change(msg.sender, signer, verified[msg.sender][signer]);
    }

    function getVerified (address signer) public view returns (bool) {
        require (signer != msg.sender);
        return verified[msg.sender][signer];
    }


}

