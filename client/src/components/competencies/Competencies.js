import React, { useState, useEffect } from 'react';
import { CardActions, CardContent, Card, Button, Typography, } from "@mui/material";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AddIcon from "@mui/icons-material/Add";
import { MoodleContractAddress } from '../../config';
import { ethers } from 'ethers';
import MoodleAbi from '../../utils/Moodle.json'
import toast, { Toaster } from 'react-hot-toast';
import "./Competencies.css"

const Competencies = () => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [correctNetwork, setCorrectNetwork] = useState(false);

    const moodleUrl = "http://localhost/moodle/moodle/moodle/webservice/rest/server.php?";
    const studentToken = "3b7a98acff9965d83e130c098e489930";
    const [competenciesCoursesList, setCompetenciesCoursesList] = useState([]);
    const [txError, setTxError] = useState(null);

    useEffect(() => {
        connectWallet()
    }, []);

    useEffect(() => {

        fetchCompetencies();
    }, []);


    const fetchCompetencies = () => {
        const URLParams = new URLSearchParams({
            wsfunction: "core_competency_list_plan_competencies",
            wstoken: studentToken,
            moodlewsrestformat: "json",
            id: 2,
        });

        fetch(moodleUrl + URLParams)
            .then((response) => response.json())
            .then((result) => {
                if (result) {
                    setCompetenciesCoursesList(result);
                    console.log(result);
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
    const submitCompetencies = async (competency) => {
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

                const timeCreated = new Date(
                    competency.usercompetency.timecreated * 1000
                ); // Convert timestamp to milliseconds

                // Add competency data to the blockchain
                let moodleTx = await MoodleContract.addCompetency(
                    competency.competency.shortname,
                    competency.usercompetency.gradename,
                    timeCreated.toLocaleString(),
                    false
                );

                toast.success("Competency has been successfully added to the blockchain");
                console.log(moodleTx);
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log("Error submitting new Competency", error);
            setTxError(error.message);
        }
    };

    return (

        <div >
            <Toaster />
            {competenciesCoursesList.map((competency) => (

                <Card
                    style={{
                        margin: 30,
                        width: 800,
                        height: 200,
                        padding: 30,
                        position: "relative",
                    }}
                    key={competency.competency.id}
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
                            <EmojiEventsIcon /> {competency.competency.shortname}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="#1d8bfd"
                            style={{
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 3,
                            }}
                        >
                            {competency.usercompetency.gradename}
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
                                Since: {new Date(competency.usercompetency.timecreated * 1000).toLocaleString()}
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
                                    submitCompetencies(competency);

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

export default Competencies;
