import React, { useState } from 'react';
import logo from '../assets/img/logo.png';
import "toastr/build/toastr.css";
import PasswordStrengthIndicator  from './PasswordStrengthIndicator';
import {
  f7,
  Page,
  LoginScreenTitle,
  List,
  ListInput,
  ListButton,
  BlockFooter,
  Navbar,
  Block,
  ListItem,
  Button,
  LoginScreen,
  Link,
  Icon
} from 'framework7-react';
import { signup } from "../utils/api";
import toastr from "toastr";
const isNumberRegx = /\d/;
const specialCharacterRegx = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
 const upperCase = /[A-Z]/;
 const lowerCase = /[a-z]/;
const SignupPage = () => {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [strength, setPasswordStrength] = useState('');
  const [signupData] = useState({});
  const [signupScreenOpened, setSignupScreenOpened] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordValidity, setPasswordValidity] = useState({
      minChar: null,
      number: null,
      specialChar: null,
      upper: null,
      lower: null
  });
  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };
  //password
  const onChangePassword = (password) => {
    setPassword(password);
    setPasswordValidity({
      minChar: password.length >= 6 ? true : false,
      number: isNumberRegx.test(password) ? true : false,
      specialChar: specialCharacterRegx.test(password) ? true : false,
      upper: upperCase.test(password) ? true : false,
      lower: lowerCase.test(password) ? true : false
    });
  };
  // Sign Up data 
  const signupUser = (event,firstName,lastName, password, confirmPassword, email) => {
    setErrorMessage('');
    setSuccessMessage('');
    if (!firstName || !lastName || !password || !confirmPassword || !email) {
      setErrorMessage("Please enter all the fields!!");
    }
    else if (password.length < 6 || password.search(isNumberRegx) == -1 || password.search(specialCharacterRegx) == -1 ||
      password.search(upperCase) == -1 || password.search(lowerCase) == -1) {
      setErrorMessage("Sorry! Your Password Doesn't Currently Meet The Requirements");
    }
    else if (password != confirmPassword) {
      setErrorMessage("Password and Confirm Password Must be Same")
    }
    else {
      const obj = {};
      obj.firstName = firstName;
      obj.lastName = lastName;
      obj.password = password;
      obj.confirmPassword = confirmPassword;
      obj.email = email;
      obj.role = "devotee";
      signup(obj)
        .then((resp) => {
          toastr.success(
            "A verification mail has been sent to your registered email. Please verify!"
          );
        })
        .catch((error) => {
          toastr.error(error.message);
        });
    }
  };
  return (
    <Page name="signup" loginScreen className="color-deeporange">
      <LoginScreenTitle style={{ 'color': '#AA0A80' }}>
        <img src={logo} alt="logo" />
        <br></br>
        TelePuja
      </LoginScreenTitle>
      <List form>
         <ListInput
          outline
          label="FirstName"
           floatingLabel
          type="text"
          placeholder="FirstName"
          value={firstName}
          onInput={(e) => {
            setFirstName(e.target.value);
          }}
           clearButton
        ></ListInput>
        <ListInput
          outline
          label="LastName"
           floatingLabel
          type="text"
          placeholder="LastName"
          value={lastName}
          onInput={(e) => {
            setLastName(e.target.value);
          }}
           clearButton
        ></ListInput>
        <ListInput
          outline
          label="Email"
          floatingLabel
          value={email}
          name="email"
          type="text"
          placeholder="abc@example.com"
          onChange={(event) => onChangeHandler(event)}
          clearButton
        >
        </ListInput>
        <ListInput
          outline
          label="Password *"
          floatingLabel
          name="password"
          value={password}
          type="password"
          placeholder="Your password"
          onFocus={() => setPasswordFocused(true)}
          onChange={(event) => onChangePassword(event.target.value)}
          clearButton
        >
        </ListInput>
        {passwordFocused && (
          <PasswordStrengthIndicator validity={passwordValidity}/>
        )}
        <ListInput
          outline
          label="Confirm Password "
          floatingLabel
          name="confirmPassword"
          value={confirmPassword}
          type="password"
          placeholder="Confirm password"
          onChange={(event) => onChangeHandler(event)}
          clearButton
        >
        </ListInput>
      </List>
      <List>
        {errorMessage ? (
          <Block className="display-flex justify-content-center" style={{ 'color': 'red' }}>
            {errorMessage}
          </Block>) : null
        }
        {successMessage ? (
          <Block className="display-flex justify-content-center" style={{ 'color': 'green' }}>
            {successMessage}
          </Block>) : null
        }
        <Block style={{ 'display': 'flex', 'justifyContent': 'center' }}>
          <Button fill round raised style={{ 'width': '150px' }} onClick={(event) => signupUser(event,firstName,lastName, password, confirmPassword, email)}>
            Signup
            </Button>
        </Block>
        <BlockFooter>
          <p>Already have an account? <Link href="/" animate={false} ignoreCache={true}>Login</Link></p>
        </BlockFooter>
      </List>
    </Page>
  );
};
export default SignupPage;
