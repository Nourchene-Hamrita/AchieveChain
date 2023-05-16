const main = async() => {
  // Deploy ContractCourse
    const contractFactory = await ethers.getContractFactory('Moodle');
    const contract = await contractFactory.deploy();
    await contract.deployed();
  
    console.log("Contract deployed to: ", contract.address);
    console.log(contract);

    // Deploy ContractAuth
    const contractAuthFactory = await ethers.getContractFactory('Authentication');
    const contractAuth = await contractAuthFactory.deploy();
    await contractAuth.deployed();
  
    console.log("ContractAuth deployed to: ", contractAuth.address);
    console.log(contractAuth);
 
 }
 
  
  const runMain = async() => {
    try {
      await main();
      process.exit(0);
    } catch(error) {
      console.log(error);
      process.exit(1);
    }
  }
  
  runMain();