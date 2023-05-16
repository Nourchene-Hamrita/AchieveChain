import { Grid, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { MoodleContractAddress } from "../../config";
import { ethers } from "ethers";
import MoodleAbi from "../../utils/Moodle.json";
import Badges from "../../components/badges/Badges";
import { useNavigate } from "react-router-dom";
import './BadgesPage.css'
const BadgesPage = () => {
   
    const [badges, setBadges] = useState([]);
    const [currentAccount, setCurrentAccount] = useState("");
    const [correctNetwork, setCorrectNetwork] = useState(false);
    const [txError, setTxError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        connectWallet();
    }, []);

    // Calls Metamask to connect wallet on clicking Connect Wallet button
    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                console.log("Metamask not detected");
                return;
            }

            let chainId = await ethereum.request({ method: "eth_chainId" });
            console.log("Connected to chain:" + chainId);

            const localhostChainId = "0x7a69";

            if (chainId !== localhostChainId) {
                alert("You are not connected to the localhost network!");
                return;
            } else {
                setCorrectNetwork(true);
            }

            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });

            console.log("Found account", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log("Error connecting to metamask", error);
        }
    };

   


    return (
        <div className="container-badge">
            <Grid
                container
                spacing={3}
                style={{
                    marginLeft: 150,
                    width: 1000,
                    height: 200,
                    padding: 30,
                    position: "relative",
                }}
            >
                <Grid item xs={10}>
                    <Paper style={{ position: "relative", padding: 16 }}>
                        <Typography gutterBottom variant="h5" color="secondary">
                            Badges List
                            <button

                                style={{
                                    position: "absolute",
                                    top: 2,
                                    right: 20,
                                    margin: 6,

                                }}
                                onClick={() => {
                                    navigate(`/badges/list`);
                                }}
                            >
                                Get Badges
                            </button>
                        </Typography>
                    </Paper>
                </Grid>

                <Badges />
            </Grid>
        </div>
    );
};
export default BadgesPage;
