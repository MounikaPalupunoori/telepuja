
import React, { useState, useEffect, useContext } from 'react';
import { auth, firestore } from "../firebase/firebase";
import { slide as Menu } from 'react-burger-menu';
import Avatar from "../assets/img/avatar.jpg";
import coin from '../assets/img/coin.png';
import InviteFriends from '../pages/invitefriends.jsx';
import {
  Block,
  List,
  ListItem,
  Icon,
  Button
} from 'framework7-react';
import {
  getLoggedinUserDetails,
} from "../utils/api";
import { useSelector } from 'react-redux';
import loggedInUser from '../js/userdetails';

const SideNavBar = (props) => {
  const [isOpen, setIsOpen] = useState(true);
  const [tokens, setTokens] = useState('');
  const [inviteFriendsPopup, setInviteFriendsPopup] = useState(false);
  const [menuOpen, setmenuOpen] = useState(false)
  const [menuOpenState, setMenuOpenState] = useState(false)
  const inviteFriends = () => {
    setInviteFriendsPopup(!inviteFriendsPopup);
  }
  const inviteFriendsclose = () => {
    setInviteFriendsPopup(!inviteFriendsPopup);
    setmenuOpen({ menuOpen: false })
  }
  /* let updatedTokens = useSelector((state => state && state.payment && state.payment.data)); 
    useEffect(()=>{
        if(updatedTokens && updatedTokens.tokens){
            setTokens(updatedTokens.tokens);
        }
    },[updatedTokens && updatedTokens.tokens]) */
  const userDetails = useSelector((state => state && state.auth && state.auth.userDetails));
  /* useEffect(()=>{
    if(userDetails.tokens){
      setTokens(userDetails.tokens);
    }
  },[userDetails &&userDetails.tokens]); */

  const signOut = () => {
    auth.signOut()
      .then(function () {
        localStorage.clear();
        window.location.href = "/";
      })
      .catch(function (error) {
        throw new Error(error);
      });
  }

  const handleStateChange = (data) => {
    setmenuOpen({ menuOpen: data.isOpen })
  }
  const closeMenu = () => {
    setmenuOpen({ menuOpen: false })
  }
  return (

    <div name="sidenav">
      <Menu right isOpen={menuOpen}
        onClick={(data) => handleStateChange(data)}>
        <Block className="side-nav-logo">
          {
            (userDetails && userDetails.role && userDetails.role === "devotee") ?
              <img className="side-nav-profile" src={userDetails.imageUrl ? userDetails.imageUrl : Avatar}></img>
              : <img className="side-nav-profile" src={userDetails && userDetails.imageUrl && userDetails.imageUrl[0].url ? userDetails.imageUrl[0].url : Avatar}></img>
          }

        </Block>
        <Block className="side-nav-text">
          <span style={{ color: 'white' }}>
            {userDetails.firstName && userDetails.lastName ? userDetails.firstName + " " : userDetails.name}</span>
        </Block>
        <List className="colors">
          <ListItem title="My Profile" onClick={() => closeMenu()} className="side-nav-item-color" link="/profile/">
            <Icon slot="media" f7="person_alt"></Icon>
          </ListItem>
          <ListItem title="My Pujas" onClick={() => closeMenu()} className="side-nav-item-color" link="/mypujas/">
            <Icon slot="media" f7="calendar_today"></Icon>
          </ListItem>
          {userDetails && userDetails.role && userDetails.role ==='devotee' ?  <ListItem title="My Wallet" onClick={() => closeMenu()} className="side-nav-item-color" link="/mywallet/">
            <Icon slot="media" f7="creditcard_fill"></Icon>
          </ListItem> :  <ListItem title="Transactions" onClick={() => closeMenu()} className="side-nav-item-color" link="/mywallet/">
            <Icon slot="media" f7="creditcard_fill"></Icon>
          </ListItem>}
         
          <ListItem title="Invite Others" className="side-nav-item-color" style={{ cursor: "pointer" }} onClick={inviteFriends}>
            <Icon slot="media" f7="person_badge_plus_fill"></Icon>
          </ListItem>
          {inviteFriendsPopup && <InviteFriends handleClose={inviteFriendsclose} />}
          <ListItem title="Contact Us" onClick={() => closeMenu()} className="side-nav-item-color" link="/contactus/">
            <Icon slot="media" f7="phone_circle_fill"></Icon>
          </ListItem>
          <ListItem title="Signout" className="side-nav-item-color" style={{ cursor: "pointer" }} onClick={(event) => signOut(event)}>
            <Icon slot="media" f7="lock_fill"></Icon>
          </ListItem>
        </List>
        <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '15px', position: 'fixed', bottom: '0', }}>
          <span style={{ backgroundColor: 'orange', display: 'flex', padding: '5px', alignItems: 'center', marginRight: '5px', maxHeight: "25px", borderRadius: "5px" }}>
            <img style={{ width: '24px' }} src={coin}></img>
            <span style={{ 'color': 'white', 'fontSize': '15px', paddingLeft: '5px' }}>{userDetails.tokens}</span>
          </span>
          <span style={{ 'color': 'white', 'fontSize': '16px', }}>Tokens Available</span>
        </div>
      </Menu>
    </div>

  )
}
export default SideNavBar;