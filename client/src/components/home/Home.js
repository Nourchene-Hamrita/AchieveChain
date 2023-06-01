import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { MoodleContractAddress } from '../../config';
import { ethers } from 'ethers';
import MoodleAbi from '../../utils/Moodle.json'
import { theme } from '../../theme'
import { ThemeProvider } from '@mui/material/styles';
import toast, { Toaster } from 'react-hot-toast';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import { Autocomplete } from "@mui/material";

import './Home.css'


const Home = () => {

    const [currentAccount, setCurrentAccount] = useState('');
    const [correctNetwork, setCorrectNetwork] = useState(false);
    const [txError, setTxError] = useState(null);

    // const [courseName, setCourseName] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [courseYear, setCourseYear] = useState('');
    const [courseFinished, setCourseFinished] = useState('');

    const [enrolledCoursesList, setEnrolledCoursesList] = useState([]);

    const moodleUrl = "http://localhost/moodle/moodle/moodle/webservice/rest/server.php?";
    const studentToken = "3b7a98acff9965d83e130c098e489930";
    const adminToken_moodle_mobile_app = "61685e4186a4a0d7558bb0494fee8941";
    const adminExtendedToken = "c558fd7eb35e8200ea40b53d73d0b7dd";
    const studentRoleId = 5;

    useEffect(() => {
        connectWallet()
    }, []);
    useEffect(() => {

        fetchEnrolledCourses();
    }, []);




    const fetchEnrolledCourses = () => {
        const URLParams = new URLSearchParams({
            wsfunction: "core_enrol_get_users_courses",
            wstoken: studentToken,
            moodlewsrestformat: "json",
            userid: 2
        });
        fetch(moodleUrl + URLParams)
            .then((response) => response.json())
            .then((result) => {
                if (result) {
                    setEnrolledCoursesList(result)
                    console.log(result)
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
    }
    // Checks if wallet is connected to the correct network
    const checkCorrectNetwork = async () => {
        const { ethereum } = window
        let chainId = await ethereum.request({ method: 'eth_chainId' })
        console.log('Connected to chain:' + chainId)

        const localhostChainId = '0x7a69'

        if (chainId !== localhostChainId) {
            setCorrectNetwork(false)
        } else {
            setCorrectNetwork(true)
        }
    }

    const submitCourse = async () => {
        let course = {
            'name': selectedCourse,
            'year': parseInt(courseYear),
            'description': courseDescription,
            'finished': courseFinished === "yes" ? true : false
        };

        try {
            const { ethereum } = window

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const MoodleContract = new ethers.Contract(
                    MoodleContractAddress,
                    MoodleAbi.abi,
                    signer
                )

                let moodleTx = await MoodleContract.addCourse(course.name, course.year, course.description, course.finished);
                toast.success("Course has been successfully added ")
                console.log(moodleTx);
            } else {
                console.log("Ethereum object doesn't exist!")
            }
        } catch (error) {
            console.log('Error Submitting new Course', error)
            setTxError(error.message)
        }
    };
    const handleCourseSelect = (event, value) => {
        setSelectedCourse(value?.shortname || '');
        console.log(selectedCourse)
    };

    return (
        <ThemeProvider theme={theme}>
            <Container className='container' component="main" maxWidth="xs">
                <Toaster />
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "rgb(131,58,180)", width: 70, height: 70 }}>
                        <LocalLibraryIcon style={{ width: 40, height: 40 }} />
                    </Avatar>
                    <Typography component="h1" variant="h5" color="secondary">
                        Manage your Academic Achievements
                    </Typography>
                    <div>
                        <div>
                        </div>

                        {currentAccount === '' ? (
                            <button

                                onClick={connectWallet}
                            >
                                Connect Wallet
                            </button>
                        ) : correctNetwork ? (
                            <h4 >
                                Wallet Connected
                            </h4>
                        ) : (
                            <div>
                                <div>----------------------------------------</div>
                                <div>Please connect to the Localhost</div>
                                <div>and reload the page</div>
                                <div>----------------------------------------</div>
                            </div>
                        )}
                        <div >
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>

                                    {/* <input type="text" placeholder="Course Name" value={courseName} onChange={(e) => setCourseName(e.target.value)} /> */}
                                    <Autocomplete

                                        id="tags-outlined"
                                        options={enrolledCoursesList}
                                        getOptionLabel={(option) => option?.shortname || ''}
                                        filterSelectedOptions
                                        onChange={handleCourseSelect}

                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Course Name"

                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <input type="text" placeholder="Year" value={courseYear} onChange={(e) => setCourseYear(e.target.value)} />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <input type="text" placeholder="Course Description" value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={9}>
                                    <label>
                                        Have you Finished  this Course?
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <select value={courseFinished} onChange={(e) => setCourseFinished(e.target.value)}>
                                        <option value="yes">yes</option>
                                        <option value="no">no</option>
                                    </select>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <button
                                        style={{ justifyContent: "center", alignItems: "center" }}
                                        onClick={submitCourse} >
                                        Add Course
                                    </button>
                                </Grid>
                            </Grid>
                        </div>

                    </div>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default Home;
