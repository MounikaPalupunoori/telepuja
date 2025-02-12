import React, {useState, useEffect} from 'react';
import logo from '../assets/img/logo.png';
import {auth, firestore} from "../firebase/firebase";
import "toastr/build/toastr.css";
import toastr from "toastr"
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
} from 'framework7-react';
import { invalid } from 'moment';

const LoginPage = (props) => {
  const { f7Props, actualProps } = props;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loginScreenOpened, setLoginScreenOpened] = useState(false);

  const signIn = () => {
    f7.dialog.alert(`Username: ${username}<br>Password: ${password}`, () => {
      f7.loginScreen.close();
    });
  };
  const onChangeHandler = (event) => {
    const {name, value} = event.currentTarget;
    // if(email==""){
    //   f7.
    // }
   if(name === 'email') {
        setEmail(value);
    }
    
    else if(name === 'password'){
      setPassword(value);
    }
  };
  const signInWithEmailAndPasswordHandler = (event, email, password) => {
    event.preventDefault();
    if(password =="" && email==""){
      toastr.error("Please enter a valid email & password to login.");
    }
    else 
    if(email==""){
      toastr.error("Please Enter Email");
    }
    else 
    if(password ==""){
      toastr.error("Please Enter Password to Login");
    }
    auth.signInWithEmailAndPassword(email, password)
    .then(result=> {
      if (result.user.emailVerified) {
        localStorage.setItem("current_user", JSON.stringify({
          'uid': result.user.uid,
          'email': result.user.email,
          'emailVerified': result.user.emailVerified,
          'refreshToken': result.user.refreshToken,
        }));
        props.f7router.navigate('/home/');
      } else {
        toastr.error("We have sent an email with a confirmation link to your email address. In order to complete the sign-up process, please click the confirmation link.");
      }
    })
    .catch(error => {
      if(error.code === "auth/wrong-password" && password !=""){
        toastr.error("Invalid password");
      }
      else if(error.code==="auth/user-not-found"){
        toastr.error("Account Doesn't exists");
      }
      else if(error.code ==="auth/invalid-email" && email!=""){
        toastr.error("Invalid Email Address")
      }
      // console.error("Error signing in with password and email", error);
    });
  };
  
  
  // useEffect(() => {
  //   let user = localStorage.getItem('current_user') != null ? JSON.parse(localStorage.getItem('current_user')) : {};
  //   if (user.uid && window.location.pathname === "/") {
  //     props.f7router.navigate('/home/');
  //   }
  // }, []);

  return(
    <Page loginScreen className="color-deeporange">
      <LoginScreenTitle style={{'color': '#aa0a80'}}>
        <img src={logo} alt="logo"/>
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
          onChange = {(event) => onChangeHandler(event)}
        >
        </ListInput>
        <ListInput
          outline
          label="Password"
          floatingLabel
          type="password"
          name="password"
          value={password}
          id="password"
          placeholder="Your password"
          clearButton
          onChange = {(event) => onChangeHandler(event)}
        >
        </ListInput>
        <Block style={{'color': '#ff6b22'}} >
        <Link href="/forgotpassword/" animate={false} ignoreCache={true}>Forgot Password?</Link> 
        </Block>
      </List>
      <List>
        <Block style={{'display': 'flex', 'justifyContent': 'center'}}>
          <Button fill round raised style={{'width': '150px'}} onClick = {(event) => {signInWithEmailAndPasswordHandler(event, email, password)}}>
            Login
          </Button>        
        </Block>
        <BlockFooter>
          <p>Don't have an account? <Link href="/signup/" animate={false} ignoreCache={true}>Signup</Link></p>
        </BlockFooter>
      </List>
    </Page>
  );
};
export default LoginPage;



