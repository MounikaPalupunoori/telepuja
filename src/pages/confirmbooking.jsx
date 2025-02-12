import React, { useState, useEffect, useContext } from 'react';
import logo from '../assets/img/logo.png';
import coin from '../assets/img/coin.png';
import Avatar from "../assets/img/avatar.jpg";
import SideBar from "./sidenav";
import moment from "moment";
import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
  } from "react-device-detect";
import {
    f7,
    Page,
    Navbar,
    NavTitle,
    Link,
    NavRight,
    NavLeft,
    Icon,
    List,
    ListItem,
    Block,
    Button,
} from "framework7-react";
import { getLoggedinUserDetails } from '../utils/api';
import useInterval from '../js/useIntervel';
import { useSelector } from 'react-redux';


const ConfirmBookingPage = (props) => {
    const bookingConfirmData = props.bookedData;
    //const [userData, setUserData] = useState('');
    const userData = useSelector((state=>state && state.auth && state.auth.userDetails));
   
    const redirectHome = () => {
        props.f7router.navigate('/home/');
    }
    const stopInterval = useInterval(redirectHome, 5000);
     

    const navigateMyPujas = () => {
        stopInterval(); 
        props.f7router.navigate('/mypujas/');
    }
   
    return (
        <Page name="services" className="color-deeporange custom-bg padding-top">
            <div>
                <Navbar className="header-bg navbar-position">
                    <NavLeft>
                        <MobileView>
                            <Link href='/home/'>
                                <Icon f7="arrow_left" color="black" style={{ fontWeight: '600', fontSize: '20px', paddingRight: '8px' }}></Icon>
                            </Link>
                        </MobileView>
                        <BrowserView>
                            <Link href='/home/'>
                                <img className="logoimage" src={logo} width="60"></img>
                            </Link>
                        </BrowserView>
                    </NavLeft>
                    <NavTitle style={{ color: 'white' }}> Confirm Booking</NavTitle>
                </Navbar>
            </div>
            <SideBar pageWrapId={ "page-wrap" } outerContainerId={ "outer-container" }/>
            <div>
                <Block style={{ color: '#ff9500', 'textAlign': 'center', marginTop: '20px', marginLeft: '10px', fontSize: '30px' }}>
                    {bookingConfirmData.name}
                </Block>
                <Block style={{ 'textAlign': 'center', marginLeft: '10px', fontSize: '15px', color: 'black' }}>
                    {bookingConfirmData.service + ", " + bookingConfirmData.timeSlot + ", " + bookingConfirmData.date}
                </Block>
                <Block class="block block-strong" style={{ 'display': 'flex', 'justifyContent': 'center' }}>
                    <button class="col button button-fill button-round color-green text-color-white" fill round raised style={{ 'width': '170px', }}>Service Confirmed</button>
                </Block>

                

                <Block class="block block-strong" style={{ 'display': 'flex', 'justifyContent': 'center' }}>
                    <Button class="link" style={{ color: 'black' }} onClick={navigateMyPujas}>View Booking</Button>
                </Block>
            </div>
        </Page>
    );
};

export default ConfirmBookingPage;
