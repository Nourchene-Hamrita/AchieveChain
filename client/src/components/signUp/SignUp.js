import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Card, Message } from 'semantic-ui-react';
import AuthenticationHash from '../../utils/AuthenticationHash';
import { useNavigate } from 'react-router-dom';
import './SignUp.css'


const SignUp = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [digicode, setDigicode] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [status, setStatus] = useState('');
    const [signedUp, setSignedUp] = useState(false);
    const navigate = useNavigate();

    const onSignUp = async () => {
        if (username !== '' && password !== '' && digicode !== '') {
            let trimmedUsername = username.trim();
            let trimmedPassword = password.trim();
            let trimmedDigicode = digicode.trim();

            if (trimmedPassword.length < 8) {
                setAlertMessage('at least 8 characters for password');
                setStatus('failed');
                setPassword('');
                setDigicode('');
                return;
            } else if (trimmedDigicode.length !== 6) {
                setAlertMessage('6 digit required for digicode');
                setStatus('failed');
                setDigicode('');
                return;
            } else {
                let userAddress = await props.contract.methods.getUserAddress().call({ from: props.account });

                if (userAddress !== '0x0000000000000000000000000000000000000000') {
                    setAlertMessage('this account already exists');
                    setStatus('failed');
                    setUsername('');
                    setPassword('');
                    setDigicode('');
                    return;
                } else {
                    let hash = await AuthenticationHash(trimmedUsername, props.account, trimmedPassword, trimmedDigicode, props.web3);

                    await props.contract.methods.register(hash).send({ from: props.account });

                    setUsername('');
                    setPassword('');
                    setDigicode('');
                    setStatus('success');
                    setAlertMessage('Signup successful');
                    setSignedUp(true);
                    navigate('/sign-in')


                    props.accountCreated(signedUp);
                    return;
                }
            }
        }
    };

    return (
        <div className='container-signUp' >
            <div className="sign-up">
                Create an account
                <div className='signup-form'>
                    <Card fluid centered>
                        <Card.Content>
                            <Form size='large'>
                                {alertMessage !== '' && status === 'failed' ?
                                    <Message negative>{alertMessage}</Message>
                                    : alertMessage !== '' && status === 'success' ?
                                        <Message positive>{alertMessage}</Message>
                                        : console.log('')
                                }
                                <Form.Field>
                                    <input
                                        required
                                        type='text'
                                        placeholder='username'
                                        value={username}
                                        autoComplete="username"
                                        onChange={e => setUsername(e.target.value)}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <input
                                        required
                                        type='password'
                                        placeholder='password'
                                        value={password}
                                        autoComplete="current-password"
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <input
                                        required
                                        type='text'
                                        placeholder='6 digit code'
                                        value={digicode}
                                        autoComplete="digicode"
                                        onChange={e => setDigicode(e.target.value)}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Button type='submit' primary fluid size='large' onClick={onSignUp}>
                                        Create account
                                    </Button>
                                </Form.Field>
                            </Form>
                        </Card.Content>
                    </Card>
                    <div className="signin-onUp">
                        Already have an account? <Link to='/sign-in'>Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SignUp;

