import React, { useState, useEffect } from 'react';
import { CardActions, CardContent, Card, Button, Typography, } from "@mui/material";
import GradeIcon from '@mui/icons-material/Grade';
import AddIcon from "@mui/icons-material/Add";
import { MoodleContractAddress } from '../../config';
import { ethers } from 'ethers';
import MoodleAbi from '../../utils/Moodle.json'
import toast, { Toaster } from 'react-hot-toast';
import './Grades.css'

const Grades = () => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [correctNetwork, setCorrectNetwork] = useState(false);

    const moodleUrl = "http://localhost/moodle/moodle/moodle/webservice/rest/server.php?";
    const studentToken = "3b7a98acff9965d83e130c098e489930";
    const [gradesList, setGradesList] = useState([]);
    const [coursesList, setCoursesList] = useState([]);
    const [txError, setTxError] = useState(null);

    useEffect(() => {
        connectWallet()
    }, []);

    useEffect(() => {

        fetchGrades();

    }, []);

    const fetchCourses = (id) => {
        const URLParams = new URLSearchParams({
            wsfunction: "core_course_get_courses",
            wstoken: studentToken,
            moodlewsrestformat: "json",
            "options[ids][0]": id,
        });

        return fetch(moodleUrl + URLParams)
            .then((response) => response.json())
            .then((result) => {
                if (result && result.length > 0) {
                    return result[0]; // Assuming there is only one course with the given ID
                }
                return {
                    fullname: "Course Not Found",
                    shortname: "",
                    startdate: "",
                };
            })
            .catch((err) => {
                console.error(err);
                return {
                    fullname: "Error Fetching Course",
                    shortname: "",
                    startdate: "",
                };
            });
    };

    const fetchGrades = () => {
        const URLParams = new URLSearchParams({
            wsfunction: "gradereport_overview_get_course_grades",
            wstoken: studentToken,
            moodlewsrestformat: "json",
            userid: 3,
        });

        fetch(moodleUrl + URLParams)
            .then((response) => response.json())
            .then((result) => {
                if (result && result.grades && result.grades.length > 0) {
                    const grades = result.grades;
                    setGradesList(grades);
                    console.log(grades);

                    // Fetch course details for each grade
                    const fetchCourseDetails = grades.map((grade) =>
                        fetchCourses(grade.courseid)
                    );
                    Promise.all(fetchCourseDetails).then((courseDetails) => {
                        const updatedGradesList = grades.map((grade, index) => ({
                            ...grade,
                            courseName: courseDetails[index].fullname || "Course Name Not Available",
                            courseShortname: courseDetails[index].shortname || "",
                            courseStartDate: courseDetails[index].startdate || "",
                        }));
                        setGradesList(updatedGradesList);
                    });
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
    const submitGrade = async (grade) => {
        // Find the grade with the matching ID in the gradesList
        //const grade = gradesList.find((grade) => grade.id === gradeId);

        if (grade) {
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

                    // Fetch the course details for the grade
                    const courseDetails = await fetchCourses(grade.courseid);
                    const timeCreated = new Date(
                        courseDetails.startdate * 1000
                    ); // Convert timestamp to milliseconds

                    let moodleTx = await MoodleContract.addGrade(
                        grade.grade || "", // Provide a default value for grade if it's undefined
                        courseDetails ? courseDetails.fullname : "", // Use course full name if available
                        courseDetails ? courseDetails.shortname : "", // Use course short name if available
                        courseDetails ? timeCreated.toLocaleString(): "", // Use course start date if available
                        false
                    );
                    toast.success("Grade has been successfully added to the blockchain");
                    console.log(moodleTx);
                } else {
                    console.log("Ethereum object doesn't exist!");
                }
            } catch (error) {
                console.log('Error submitting new Grade', error);
                setTxError(error.message);
            }
        } else {
            console.log("Grade not found");
        }
    };
    //console.log(coursesList)
    return (
        <div className='container-grades'>
            <Toaster />
            {gradesList.map((grade) => (
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
                            <GradeIcon style={{ width: 40, height: 40, color: "#FFD700" }} /> {grade.grade} {/* Display the course name */}
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
                            {grade.courseName}
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
                            {grade.courseShortname}
                        </Typography>
                    </CardContent>
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
                                submitGrade(grade)

                            }}
                        >
                            Add to blockchain
                        </Button>
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
                            Since: {new Date(grade.courseStartDate * 1000).toLocaleString()}
                        </Typography>
                    </CardActions>
                </Card>
            ))}
        </div>
    );
}

export default Grades;
