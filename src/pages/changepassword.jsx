import React, { useState, useEffect } from 'react';
import logo from '../assets/img/logo.png';
import coin from '../assets/img/coin.png';
import Avatar from "../assets/img/avatar.jpg";
import { auth, googleAuthProvider } from "../firebase/firebase.js";
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import {
    Page,
    Icon,
    NavTitle,
    NavRight,
    NavLeft,
    List,
    ListInput,
    Navbar,
    Link,
    Block,
    Button,
    Message,
    f7,
} from 'framework7-react';
import {
    login,
    getLoggedinUserDetails,
    changepassword
} from '../utils/api';
import loggedInUser from '../js/userdetails';
import toastr from 'toastr';
import { useSelector } from 'react-redux';
const isNumberRegx = /\d/;
const specialCharacterRegx = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
const upperCase = /[A-Z]/;
const lowerCase = /[a-z]/;
const ChangepPasswordPage = (props) => {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isOpen, setIsOpen] = useState(true);
    const [newPasswordFocused, setNewPasswordFocused] = useState(false);
    const [newPasswordValidity, setNewPasswordValidity] = useState({
        minChar: null,
        number: null,
        specialChar: null,
        upper: null,
        lower: null
    });
    const userData = useSelector((state => state && state.auth && state.auth.userDetails));
    //old password
    const handlePassword = (event) => {
        event.preventDefault();
        let password = event.target.value;
        setPassword(password);
    };
    //newpassword
    const handleNewPassword = (event) => {
        event.preventDefault();
        let newPassword = event.target.value;
        setNewPassword(newPassword);
        setNewPasswordValidity({
            minChar: newPassword.length >= 6 ? true : false,
            number: isNumberRegx.test(newPassword) ? true : false,
            specialChar: specialCharacterRegx.test(newPassword) ? true : false,
            upper: upperCase.test(newPassword) ? true : false,
            lower: lowerCase.test(newPassword) ? true : false
        });
    };
    //confirmpassword
    const handleConfirmPassword = (event) => {
        event.preventDefault();
        let confirmPassword = event.target.value;
        setConfirmPassword(confirmPassword);
    };
    //submit
    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        if (!password || !newPassword || !confirmPassword) {
            setErrorMessage("Please enter all details");
        }
        else if (newPassword.length < 6 || newPassword.search(isNumberRegx) == -1 ||
            newPassword.search(specialCharacterRegx) == -1 ||
            newPassword.search(upperCase) == -1 || newPassword.search(lowerCase) == -1) {
            setErrorMessage("Sorry! Your Password Doesn't Currently Meet The Requirements");
        }
        else if (newPassword !== confirmPassword) {
            setErrorMessage("NewPassword and Confirm Password Must be Same");
        }
        else {
            let obj = {};
            obj.email = userData.email;
            obj.password = password;
            login(obj)
                .then((resp) => {
                    if (resp) {
                        let changePassword = newPassword;
                        f7.preloader.show();
                        auth.currentUser.updatePassword(changePassword).then(function (changedPassword) {
                            // setSuccessMessage("Password Changed successfully");
                            toastr.success("Password has been updated successfully");
                            f7.preloader.hide();
                            setTimeout(() => {
                                setIsOpen(false);
                            }, 1000);
                        }).catch(function (err) {
                            toastr.error("To many failed password attempts,please try after 30minutes");
                        });
                    }
                }).catch(function (err) {
                    toastr.error("Incorrect password");
                });
        }
    };
    return (
        <div>
            {isOpen ?
                <div name="services" className="color-deeporange custom-bg popup-box">
                    <div className="box" style={{ maxWidth: '600px' }}>
                        <List noHairlines style={{ margin: '0px' }}>
                            <p style={{ color: 'black', fontSize: '18px', margin: '12px 0px 3px 16px', fontWeight: '500' }}>Change Password</p>
                            <ListInput
                                outline
                                label="Old Password *"
                                name="password"
                                type="password"
                                floatingLabel
                                onChange={handlePassword}
                            >
                            </ListInput>
                            <ListInput
                                outline
                                floatingLabel
                                label="New Password *"
                                // info="8 characters minimum"
                                required
                                name="password"
                                type="password"
                                onFocus={() => setNewPasswordFocused(true)}
                                onChange={handleNewPassword}
                            >
                            </ListInput>
                            {newPasswordFocused && (
                                <PasswordStrengthIndicator validity={newPasswordValidity} />
                            )}
                            <ListInput
                                outline
                                floatingLabel
                                label="Confirm New Password *"
                                name="password"
                                type="password"
                                onChange={handleConfirmPassword}
                            >
                            </ListInput>
                        </List>
                        {errorMessage ? (
                            <Block className="display-flex justify-content-center" style={{ 'color': 'red', 'margin': '20px 0px 0px 0px' }}>
                                {errorMessage}
                            </Block>) : null}
                        {successMessage ? (
                            <Block className="display-flex justify-content-center" style={{ 'color': 'green' }}>
                                {successMessage}
                            </Block>) : null}
                        <Block className="" style={{ 'display': 'flex', 'justifyContent': 'center', 'margin': '15px' }}>
                            <Button fill raised style={{ 'width': '50%' }}
                                onClick={handleSubmit}>Change</Button>
                        </Block>
                        <Block className="" style={{ 'display': 'flex', 'justifyContent': 'center', 'margin': '20px' }}>
                            <Button style={{ 'width': '50%', 'border': '1px solid' }}
                                onClick={props.handleClose}>Cancel</Button>
                        </Block>
                    </div>
                </div > : null}
        </div>
    );
};
export default ChangepPasswordPage;