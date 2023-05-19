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
import GradeIcon from '@mui/icons-material/Grade';
import { Grid } from "semantic-ui-react";
import Grade from "../../images/grade.jpg";


const GradeList = () => {
    const [grades, setGrades] = useState([]);
    const [currentAccount, setCurrentAccount] = useState("");
    const [correctNetwork, setCorrectNetwork] = useState(false);
    const [txError, setTxError] = useState(null);

    useEffect(() => {
        connectWallet();
    }, []);
    useEffect(() => {
        getGrades();
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

    const getGrades = async () => {
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

                let badges = await MoodleContract._getGradeList();
                setGrades(badges);
                console.log(badges);
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
            setTxError(error.message);
        }
    };
    const deleteBadge = async (gradeId) => {
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

                let deleteTaskTx = await MoodleContract.deleteGrade(gradeId, true);
                let allGrades = await MoodleContract._getGradeList();
                setGrades(allGrades);
                console.log(allGrades);

                // Filter the badges array to exclude deleted badges
                setGrades((prevGrades) =>
                    prevGrades.filter((grade) => !grade.isDeleted)
                );
                toast.success("Grade has been successfully deleted");
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
                    {grades.filter((grade) => !grade.isDeleted).length > 0 ? (
                        grades
                            .filter((grade) => !grade.isDeleted)
                            .map((grade) => (
                                <Card
                                    style={{
                                        margin: 30,
                                        width: 500,
                                        height: 200,
                                        padding: 30,
                                        position: "relative",
                                    }}
                                    key={grade.id}
                                >
                                    <CardContent>
                                    <Typography
                            gutterBottom
                            variant="h3"
                            style={{
                                margin: 5,
                                display: "inline-flex",
                                alignItems: "center",

                            }}
                        >
                           {grade.grade} 
                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="primary"
                                            style={{
                                                display: "-webkit-box",
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                WebkitLineClamp: 3,
                                            }}
                                        >
                                            {grade.courseFullName}
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
                                            {grade.courseShortName}
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
                                        <GradeIcon style={{ color: "#FFD700", width: 60, height: 60 }} />
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
                                                onClick={() => deleteBadge(grade.id)}
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
                                                Since {grade.createdAt}
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
                                src={Grade}
                                alt=""
                                style={{ maxWidth: "700px", maxHeight: "400px" }}
                            />
                            <Typography color='primary'> No active Grades available.</Typography>
                        </div>
                    )}
                </div>
            </Grid>
        </div>
    );
};

export default GradeList;
