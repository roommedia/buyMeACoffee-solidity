
const hre = require("hardhat");

// return the Ethere balance of a given address.
async function getBalance(address) {
const balanceBigInt = await hre.waffle.provider.getBalance(address);
return hre.ethers.utils.formatEther(balanceBigInt);
}


// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
  let idx = 0;
  for(const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address))
    idx++
  }
}

// Logs the memos stored on-chain from coffee purchases
async function printMemos(memos) {
  for (const { timestamp, name: tipper, from: tipperAddress, message, coffeeSize } of memos) {
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}" coffeeSize: (${coffeeSize})`)
  }
}

async function main() {
  const [owner, tipper] = await hre.ethers.getSigners();

  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();

  console.log("buyMeACoffee deployed to ", buyMeACoffee.address);

  const addresses = [owner.address, tipper.address, buyMeACoffee.address];  
  console.log("== start ==");
  await printBalances(addresses);

  async function buyCoffee() {
    console.log("== buying ==")
    for(i = 0; i < 4; i++){
      const newTipper = await hre.ethers.getSigners();
      let coffeeSize = Number(i) % 2 === 0 ? "1" : "2"
      const tip = {value: hre.ethers.utils.parseEther(coffeeSize)};
      await buyMeACoffee.connect(newTipper[i]).buyCoffee("Jjhon","NIce one", tip)
    }
  }

  await buyCoffee()

  console.log(" == bought coffee ==");
  await printBalances(addresses);

  await buyMeACoffee.connect(owner).withdrawTips();
  
  console.log("== withdrawnTips");
  await printBalances(addresses);

  console.log("== memos ==");
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);
} 

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
