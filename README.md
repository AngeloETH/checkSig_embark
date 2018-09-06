Implementation of ecrecovery in solidity using embark framework

web3 version: v1.0.0-beta.34

run test:

in Authorization directory
```
embark test test\Authorization_spec.js
```
Results:

```
 Authorization contract
    √ register: owner verify signer (verified[owner][signer] = true) (61ms)
    √ user1 => CheckSig(TEST_MESSAGE, v, r, s, owner) === true
    √ user1 => CheckSig(WRONG_MESSAGE, v, r, s, owner) === false
    √ Random user => CheckSig(WRONG_MESSAGE, v, r, s, user2) === false
    √ Cancel: owner remove signer (verified[owner][signer] = false)


  5 passing (294ms)

 > All tests passed
```

