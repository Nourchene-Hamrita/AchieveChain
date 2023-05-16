import Authentication from "./utils/Authentication.json";
import { AuthContractAddress } from './config';

const Contract = async (web3) => {
    const networkId = await web3.eth.net.getId();
    //const deployedNetwork = Authentication.networks[networkId];

    return new web3.eth.Contract(
        Authentication.abi,
        AuthContractAddress
    );
}

export default Contract;