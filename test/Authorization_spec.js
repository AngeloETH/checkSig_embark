// our DTwitter contract object to test
const Authorization = require('Embark/contracts/Authorization');

const authorization = Authorization.methods;

const TEST_MESSAGE = web3.utils.keccak256('Joyso!');

const WRONG_MESSAGE = web3.utils.keccak256('Bitfinex!');

//variables that will be updated in the tests
let accounts = new Object();
let r,s,v;

config({
    contracts: {
      Authorization: {
        // would pass constructor args here if needed
      }
    }
  }, (err, theAccounts) => {
    accounts.signer = theAccounts[0];               
    accounts.owner  = theAccounts[5];
    accounts.user1  = theAccounts[2];
    accounts.user2  = theAccounts[4];
    accounts.random = theAccounts[9];
    web3.eth.sign(TEST_MESSAGE,accounts.signer, (err,sig) => {
        r = '0x' + sig.slice(2,66);
        s = '0x' + sig.slice(66,130);
        v = parseInt(sig.slice(130,132))+27;
    });
});
contract("Authorization contract", function (){
    
    


    it('register: owner verify signer (verified[owner][signer] = true)', async function(){
        
        await authorization.register(accounts.signer).send({from: accounts.owner});
        assert.equal(await authorization.getVerified(accounts.signer).call({from: accounts.owner}),true);
    })

    it('user1 => CheckSig(TEST_MESSAGE, v, r, s, owner) === true', async function(){
        assert.equal(await authorization.checkSig(TEST_MESSAGE, v, r, s, accounts.owner).call({from: accounts.user1}),true);
    })

    it('user1 => CheckSig(WRONG_MESSAGE, v, r, s, owner) === false', async function(){
        assert.equal(await authorization.checkSig(WRONG_MESSAGE, v, r, s, accounts.owner).call({from: accounts.user1}),false);
    })

    it('Random user => CheckSig(WRONG_MESSAGE, v, r, s, user2) === false', async function(){
        assert.equal(await authorization.checkSig(TEST_MESSAGE, v, r, s, accounts.user2).call({from: accounts.random}),false);
    })

    it('Cancel: owner remove signer (verified[owner][signer] = false)',async function(){
        await authorization.cancel(accounts.signer).send({from: accounts.owner});
        assert.equal(await authorization.getVerified(accounts.signer).call({from: accounts.owner}),false);
    })

    it('user1 => CheckSig(TEST_MESSAGE, v, r, s, owner) === false. The owner has removed the signer', async function(){
        assert.equal(await authorization.checkSig(TEST_MESSAGE, v, r, s, accounts.owner).call({from: accounts.user1}),false);
    })
    
    
})
  
  