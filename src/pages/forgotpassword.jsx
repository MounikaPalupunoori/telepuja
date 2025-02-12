import React, { useState, useEffect } from 'react';
import logo from '../assets/img/logo.png';
import { auth, firestore } from "../firebase/firebase";
import {
    f7,
    Page,
    LoginScreenTitle,
    List,
    ListInput,
    Button,
    Block,
    Link

} from 'framework7-react';
import toastr from 'toastr';

import { forgotPassword } from '../utils/api.js';


const ForgotPasswordPage = (props) => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    //const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!email) {
            setErrorMessage("Please enter a valid Email Address");
        } else {
            forgotPassword(email)
                .then((resp) => {
                    toastr.success(`We sent an email to ${email} with a link to get back into your account.`);
                })
                .catch((err) => {
                    if (err) {
                        let message = "Email entered does not exist";
                        setErrorMessage(message);
                    }

                })
        }
    }


    return (
        <Page loginScreen className="color-deeporange">
            <LoginScreenTitle style={{ 'color': '#aa0a80' }}>
                <img src={logo} alt="logo" />
                <br></br>
        TelePuja
      </LoginScreenTitle>
            <List form>
                <ListInput
                    outline
                    label="Email"
                    floatingLabel
                    type="text"
                    name="email"
                    value={email}
                    id="email"
                    placeholder="Your email"
                    clearButton
                    validate
                    autofocus
                    onInput={(e) => {
                        setErrorMessage('');
                        setEmail(e.target.value);
                    }}
                >
                </ListInput>
            </List>
            {errorMessage ? (
                <Block className="display-flex justify-content-center" style={{ 'color': 'red' }}>
                    {errorMessage}
                </Block>) : null
            }
            <Block style={{ 'display': 'flex', 'justifyContent': 'center', fontSize: '20px' }}>
                <Button fill round raised style={{ 'width': '150px' }} onClick={handleSubmit}>Send Link</Button>
            </Block>
            <Block style={{ 'display': 'flex', 'justifyContent': 'center', fontSize: '20px' }}>
                <Link href="/" animate={false} ignoreCache={true}>cancel</Link>
            </Block>
        </Page>
    );
};
export default ForgotPasswordPage;