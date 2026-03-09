// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SecureStorage {
    mapping(address => string) private documentHashes;

    event DocumentStored(address indexed user, string hash);

    function storeDocument(string memory _hash) external {
        require(bytes(_hash).length > 0, "Hash cannot be empty");
        documentHashes[msg.sender] = _hash;
        emit DocumentStored(msg.sender, _hash);
    }

    function verifyDocument(string memory _hash) external view returns (bool) {
        string memory storedHash = documentHashes[msg.sender];
        if (bytes(storedHash).length == 0) {
            return false;
        }
        return keccak256(bytes(storedHash)) == keccak256(bytes(_hash));
    }
}
