import React, { useState, useEffect } from 'react';
import { CardActions, CardContent, Card, Button, Typography, } from "@mui/material";
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import AddIcon from "@mui/icons-material/Add";
import { MoodleContractAddress } from '../../config';
import { ethers } from 'ethers';
import MoodleAbi from '../../utils/Moodle.json'
import toast, { Toaster } from 'react-hot-toast';
import './Badges.css'

const Badges = () => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [correctNetwork, setCorrectNetwork] = useState(false);

    const moodleUrl = "http://localhost/moodle/moodle/moodle/webservice/rest/server.php?";
    const studentToken = "3b7a98acff9965d83e130c098e489930";
    const [badgesCoursesList, setBadgesCoursesList] = useState([]);
    const [txError, setTxError] = useState(null);

    useEffect(() => {
        connectWallet()
    }, []);

    useEffect(() => {

        fetchBadgesOfCourses();
    }, []);


    const fetchBadgesOfCourses = () => {
        const URLParams = new URLSearchParams({
            wsfunction: "core_badges_get_user_badges",
            wstoken: studentToken,
            moodlewsrestformat: "json",
            userid: 2,
        });

        fetch(moodleUrl + URLParams)
            .then((response) => response.json())
            .then((result) => {
                if (result && result.badges) {
                    setBadgesCoursesList(result.badges);
                    console.log(result.badges)
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };
    // Calls Metamask to connect wallet on clicking Connect Wallet button
    const connectWallet = async () => {
        try {
            const { ethereum } = window

            if (!ethereum) {
                console.log('Metamask not detected')
                return
            }

            let chainId = await ethereum.request({ method: 'eth_chainId' })
            console.log('Connected to chain:' + chainId)

            const localhostChainId = '0x7a69'

            if (chainId !== localhostChainId) {
                alert('You are not connected to the localhost network!')
                return
            } else {
                setCorrectNetwork(true);
            }

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

            console.log('Found account', accounts[0])
            setCurrentAccount(accounts[0])
        } catch (error) {
            console.log('Error connecting to metamask', error)
        }
    };
    const submitBadge = async (badgeId) => {
        // Find the badge with the matching ID in the badgesCoursesList
        const badge = badgesCoursesList.find((badge) => badge.id === badgeId);

        if (badge) {
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

                    let moodleTx = await MoodleContract.addBadge(
                        badge.name,
                        badge.description,
                        badge.issuername,
                        false
                    );
                    toast.success("Badge has been successfully added to the blockchain");
                    console.log(moodleTx);
                } else {
                    console.log("Ethereum object doesn't exist!");
                }
            } catch (error) {
                console.log('Error submitting new badge', error);
                setTxError(error.message);
            }
        } else {
            console.log("Badge not found");
        }
    };
    return (
        <div>
            <Toaster />
            {badgesCoursesList.map((badge) => (
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
                            <MilitaryTechIcon /> {badge.name}
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
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
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
                        >
                            <Button
                                id="add"
                                variant="outlined"
                                startIcon={<AddIcon />}
                                style={{ color: "white" }}
                                onClick={() => {
                                    submitBadge(badge.id)

                                }}
                            >
                                Add to blockchain
                            </Button>
                        </CardActions>
                    </div>

                </Card>
            ))}
        </div>
    );
}

export default Badges;
