pragma solidity ^0.4.0;

contract Registry {
    struct Entry {
        string  value;
        address owner;
    }
    
    event Register(string name, address who);
    
    mapping(string=>Entry) private map;
    
    uint public fee;
    address registrar;
    
    function Registry(uint initialFee) {
        fee = initialFee;
        registrar = msg.sender;
    }
    
    function register(string key, string value) payable {
        //registration has fee
        require(msg.value >= fee);
        if (map[key].owner == address(0)) {
            // not owned by anybody
            map[key] = Entry(value, msg.sender);
            Register(key, msg.sender);
            
        } else {
            // already owned by somebody
            // then only owner can register new value
            require(msg.sender == map[key].owner);
            map[key] = Entry(value, msg.sender);
        }
    }
    
    function transfer(string key, address to) {
        require(map[key].owner == msg.sender);
        string storage value = map[key].value;
        map[key] = Entry(value, to);
    }
    
    function query(string key) constant returns(string) {
        return map[key].value;
    }
    
    function withdraw(uint amount) {
        require(this.balance >= amount && registrar == msg.sender);
        msg.sender.transfer(amount);
    }
}