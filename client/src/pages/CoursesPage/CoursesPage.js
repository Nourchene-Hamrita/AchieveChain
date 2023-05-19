import { Grid, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { MoodleContractAddress } from '../../config';
import { ethers } from 'ethers';
import MoodleAbi from '../../utils/Moodle.json'

import UniversityImage from "../../images/university.jpg"
import './CoursePage.css'
import Course from '../../components/courses/Course';
const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [currentAccount, setCurrentAccount] = useState('');
    const [correctNetwork, setCorrectNetwork] = useState(false);
    const [txError, setTxError] = useState(null)

    useEffect(() => {
        connectWallet()
    }, []);


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
    const getCourses = async () => {
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

                let coursesFinished = await MoodleContract.getFinishedCourses()

                let coursesUnFinished = await MoodleContract.getUnfinishedCourses()


                console.log(coursesFinished);
                console.log("Courses:- ")
                console.log(coursesUnFinished);


                let courses = coursesFinished.concat(coursesUnFinished)
                setCourses(courses);

            } else {
                console.log("Ethereum object doesn't exist!")
            }
        } catch (error) {
            console.log(error)
            setTxError(error.message)
        }
    }

    const clickCourseFinished = async (id) => {
        console.log(id);

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

                let moodleTx = await MoodleContract.setFinished(id, true);

                console.log(moodleTx);
            } else {
                console.log("Ethereum object doesn't exist!")
            }
        } catch (error) {
            console.log('Error Submitting new Course', error)
            setTxError(error.message)
        }
    }
    return (
        <div className='container-course'>
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
                            Courses List
                            <button

                                style={{
                                    position: "absolute",
                                    top: 2,
                                    right: 20,
                                    margin: 6,

                                }}
                                onClick={getCourses}
                            >
                                Get Courses
                            </button>
                        </Typography>
                    </Paper>
                </Grid>
                {courses.length === 0 ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        top:"150%",
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}>
                        <img src={UniversityImage} alt=''style={{ maxWidth: '350px', maxHeight: '350px' }} />
                        <Typography align='center' color="secondary">Click To Get Courses Stored On The Blockchain...</Typography>
                    </div>
                ) : (
                    courses.map((course) => (
                        <Course
                            key={course.id}
                            id={parseInt(course.id)}
                            name={course.name}
                            year={parseInt(course.year).toString()}
                            description={course.description}
                            finished={course.finished.toString()}
                            clickCourseFinished={clickCourseFinished}
                        />
                    ))
                )}


            </Grid>
        </div>
    );
}

export default CoursesPage;
