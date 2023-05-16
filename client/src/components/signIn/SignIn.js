import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Card, Message } from 'semantic-ui-react';
import AuthValidation from '../../utils/AuthValidation';
import 'semantic-ui-css/semantic.min.css'
import { useNavigate } from 'react-router-dom';
import './SignIn.css'

const SignIn = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [digicode, setDigicode] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [status, setStatus] = useState('');
    const [loggedIn, setLoggedIn] = useState(true);
    const navigate = useNavigate();

    const onSignIn = async () => {
        if (username !== '' && password !== '' && digicode !== '') {
            let usernameToSend = username.trim();

            if (password.length < 8) {
                setAlertMessage("at least 8 characters for password");
                setStatus('failed');
                setPassword('');
                setDigicode('');
                return;
            }

            if (digicode.length !== 6) {
                setAlertMessage("6 digit required for digicode");
                setStatus('failed');
                setDigicode('');
                return;
            }

            let userAddress = await props.contract.methods.getUserAddress().call({ from: props.account });

            if (userAddress === '0x0000000000000000000000000000000000000000') {
                setAlertMessage('Account does not exists');
                setStatus('failed');
                setUsername('');
                setPassword('');
                setDigicode('');
                return;
            }

            let validated = await AuthValidation(username, props.account, password, digicode, props.web3, props.contract);

            if (!validated) {
                setAlertMessage('Incorrect log in');
                setStatus('failed');
                setUsername('');
                setPassword('');
                setDigicode('');
                return;
            }

            setUsername('');
            setPassword('');
            setDigicode('');
            setStatus('success');
            setAlertMessage("Sign in successful");
            setLoggedIn(false);
            localStorage.setItem("loggedIn", loggedIn);


            props.userSignedIn(loggedIn, usernameToSend);
            console.log(loggedIn)

        }

        setUsername('');
        setPassword('');
        setDigicode('');
        navigate('/home')
    }

    return (
        <div className='container-signIn'>
            <div className="sign-up">
                Sign in to your account
                <div className='signup-form'>
                    <Card fluid centered>
                        <Card.Content>
                            <Form size='large'>
                                {alertMessage !== '' && status === 'failed' ? (
                                    <Message negative>{alertMessage}</Message>
                                ) : alertMessage !== '' && status === 'success' ? (
                                    <Message positive>{alertMessage}</Message>
                                ) : (
                                    console.log('')
                                )}
                                <Form.Field required>
                                    <input
                                        type='text'
                                        placeholder='username'
                                        value={username}
                                        autoComplete="username"
                                        onChange={e => setUsername(e.target.value)}
                                    />
                                </Form.Field>
                                <Form.Field required>
                                    <input
                                        type='password'
                                        placeholder='password'
                                        value={password}
                                        autoComplete="current-password"
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </Form.Field>
                                <Form.Field required>
                                    <input
                                        type='text'
                                        placeholder='6 digit code'
                                        value={digicode}
                                        autoComplete="digicode"
                                        onChange={e => setDigicode(e.target.value)}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Button type='submit' primary fluid size='large' onClick={onSignIn}>
                                        Sign in
                                    </Button>
                                </Form.Field>
                            </Form>
                        </Card.Content>
                    </Card>
                    {props.signedUp ? (
                        console.log()
                    ) :
                        <div className="signin-onUp">
                            Don't have an account? <Link to='/sign-up'>Sign up</Link>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
export default SignIn;
