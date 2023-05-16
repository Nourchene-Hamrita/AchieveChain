import React, { useEffect, useState } from "react";
import { MoodleContractAddress } from "../../config";
import { ethers } from "ethers";
import MoodleAbi from "../../utils/Moodle.json";
import toast, { Toaster } from 'react-hot-toast';
import {
    CardActions,
    CardContent,
    Card,
    IconButton,
    Typography,
    Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import { Grid } from "semantic-ui-react";
import Badge from "../../images/badge.jpg";
import './Badges.css'

const BadgeList = () => {
    const [badges, setBadges] = useState([]);
    const [currentAccount, setCurrentAccount] = useState("");
    const [correctNetwork, setCorrectNetwork] = useState(false);
    const [txError, setTxError] = useState(null);

    useEffect(() => {
        connectWallet();
    }, []);
    useEffect(() => {
        getBadges();
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

    const getBadges = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const MoodleContract = new ethers.Contract(
                    MoodleContractAddress,
                    MoodleAbi.abi,
                    signer
                );

                let badges = await MoodleContract._getBadgeList();
                setBadges(badges);
                console.log(badges);
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
            setTxError(error.message);
        }
    };
    const deleteBadge = async (badgeId) => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const MoodleContract = new ethers.Contract(
                    MoodleContractAddress,
                    MoodleAbi.abi,
                    signer
                );

                let deleteTaskTx = await MoodleContract.deleteBadge(badgeId, true);
                let allBadges = await MoodleContract._getBadgeList();
                setBadges(allBadges);
                console.log(allBadges);

                // Filter the badges array to exclude deleted badges
                setBadges((prevBadges) =>
                    prevBadges.filter((badge) => !badge.isDeleted)
                );
                toast.success("Competency has been successfully deleted");
                //window.location.reload();
            } else {
                console.log("Ethereum object doesn't exist");
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="container-badges">
            <Toaster />
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
                <div>
                    {badges.filter((badge) => !badge.isDeleted).length > 0 ? (
                        badges
                            .filter((badge) => !badge.isDeleted)
                            .map((badge) => (
                                <Card
                                    style={{
                                        margin: 30,
                                        width: 500,
                                        height: 200,
                                        padding: 30,
                                        position: "relative",
                                    }}
                                    key={badge.id}
                                >
                                    <CardContent>
                                        <Typography
                                            gutterBottom
                                            variant="h6"
                                            style={{
                                                margin: 5,
                                                display: "inline-flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            {badge.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="rgb(50,205,50)"
                                            style={{
                                                display: "-webkit-box",
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                WebkitLineClamp: 3,
                                            }}
                                        >
                                            {badge.description}
                                        </Typography>
                                    </CardContent>
                                    <CardActions
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            right: 0,
                                            margin: 10,
                                            zIndex: 1,
                                        }}
                                    >
                                        <MilitaryTechIcon style={{ color: "#FFD700", width: 60, height: 60 }} />
                                    </CardActions>
                                    <div
                                        style={{ display: "flex", justifyContent: "space-between" }}
                                    >
                                        <CardActions
                                            style={{
                                                position: "absolute",
                                                bottom: 0,
                                                right: 0,
                                                margin: 10,
                                            }}
                                        >
                                            <IconButton
                                                variant="outlined"
                                                color="primary"
                                                aria-label="modifier club"
                                                size="small"
                                                style={{ backgroundImage: 'none' }}
                                                onClick={() => deleteBadge(badge.id)}
                                            >
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </CardActions>
                                        <CardActions
                                            style={{
                                                margin: 20,
                                                position: "absolute",
                                                bottom: 0,
                                                left: 0,
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                style={{
                                                    display: "-webkit-box",
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    WebkitLineClamp: 3,
                                                }}
                                            >
                                                by {badge.issuername}
                                            </Typography>
                                        </CardActions>
                                        <CardActions
                                            style={{
                                                margin: 10,
                                                position: "absolute",
                                                bottom: 0,
                                                right: 0,
                                            }}
                                        ></CardActions>
                                    </div>
                                </Card>
                            ))
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                position: "absolute",
                                top: "150%",
                                left: "45%",
                                transform: "translate(-50%, -50%)",
                            }}
                        >
                            <img
                                src={Badge}
                                alt=""
                                style={{ maxWidth: "500px", maxHeight: "350px" }}
                            />
                            <Typography color='primary'> No active badges available.</Typography>
                        </div>
                    )}
                </div>
            </Grid>
        </div>
    );
};

export default BadgeList;
