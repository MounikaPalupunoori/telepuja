import React, { useState, useEffect, createContext } from 'react';
import { auth, firestore } from "../firebase/firebase";
import logo from '../assets/img/logo.png'
import coin from '../assets/img/coin.png';
import Avatar from "../assets/img/avatar.jpg";
import {
  f7,
  f7ready,
  App,
  Panel,
  Views,
  View,
  Popup,
  Page,
  Navbar,
  Toolbar,
  NavRight,
  Link,
  Block,
  BlockTitle,
  LoginScreen,
  LoginScreenTitle,
  List,
  ListItem,
  ListInput,
  ListButton,
  BlockFooter,
  Icon,
  theme
} from 'framework7-react';
import { getLoggedinUserDetails } from '../utils/api';
import routes from '../js/routes';
import { Provider } from 'react-redux';
import store from '../store/store';

export const appContext = createContext();
const MyApp = () => {
  const f7params = {
    name: 'TelePuja', // App name
    theme: 'auto', // Automatic theme detection
    // App store
    store: store,
    // App routes
    routes: routes,
    navbar: {
      mdCenterTitle:true
    }
  };
  const [authUser, setAuthUser] = useState('');
  const [userDetails, setUserDetails] = useState({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginScreenOpened, setLoginScreenOpened] = useState(false);
  useEffect(() => {
    var parsedAuthUser;
    const localAuthUser = localStorage.getItem("current_user");
    if (localAuthUser) {
      parsedAuthUser = JSON.parse(localAuthUser);
      setAuthUser(parsedAuthUser);
    }
  }, []);
  useEffect(() => {
    if (authUser) {
      getLoggedinUserDetails(authUser.uid)
        .then((resp) => {
          if (resp) {
            resp.tokens = (resp.tokens).toFixed(2);
            setUserDetails(resp);
            setLoginScreenOpened(true);
          }
          else {
            console.warn("No user details found.");
          }
        })
        .catch(error => {
          throw new Error(error);
        });
    }
  }, [authUser]);

  const signOut = () => {
    auth.signOut()
      .then(function () {
        localStorage.clear();
        window.location.href = "/";
      })
      .catch(function (error) {
        console.log("Error signing out " + error);
      });
  }
  const alertLoginData = () => {
    f7.dialog.alert('Username: ' + username + '<br>Password: ' + password, () => {
      f7.loginScreen.close();
    });
  }
  f7ready(() => {
    // Call F7 APIs here
  });

  return (
    <Provider store = {store}>
      <appContext.Provider value={{
      authUser,
      setAuthUser,
      userDetails,
      setUserDetails
    }}>
      <App {...f7params} >
        <Panel right cover>
          <View>
            <Page className="custom-side-menu">
              <List>
                <ListItem title="My Profile" link="/profile/" view=".view-main" panelClose>
                  <Icon slot="media" f7="person_alt"></Icon>
                </ListItem>
              </List>
            </Page>
          </View>
        </Panel>

        {/* Your main view, should have "view-main" class */}

        {authUser.uid && loginScreenOpened && (<View id="main-view" main className="safe-areas" url="/home/" />)}
        {authUser.uid == null && (<View id="main-view" main className="safe-areas" url="/" />)}
      </App>
      </appContext.Provider>
    </Provider>
  )
}
export default MyApp;