import React, { useState, useEffect, useContext } from 'react';
import logo from '../assets/img/logo.png';
import coin from '../assets/img/coin.png';
import Avatar from "../assets/img/avatar.jpg";
import SideBar from "./sidenav";
import toastr from 'toastr';

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
    Block,
    Col,
    Button,
    NavLeft,
    NavRight,
    Icon,
    List,
    ListItem,
    ListInput,
    Link,
    Row,
} from "framework7-react";
import {
    getLoggedinUserDetails, donation, devoteeDonateMail, purohithDonateMail
} from '../utils/api';
import loggedInUser from '../js/userdetails.js';
import { useSelector } from 'react-redux';

const DonationPage = (props) => {
    const donationDetails = props.donate;
    let requestType = props.donate.requestType;
    let obj = props.data;

    const [balance, setBalance] = useState("");
    const [errorMessage, setErrorMessage] = useState(false);
    const [errorMessageToken, setErrorMessageToken] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [popUp,setPopUp] = useState(false);

    const userData = useSelector((state => state && state.auth && state.auth.userDetails));
    const submitDonation = (tokens, id) => {
        tokens = Number(tokens);
        let data = {}, mail = {};
        setErrorMessage(false)
        setSuccessMessage(false)
        data.tokens = tokens;
        data.devoteeId = userData._id;
        if (userData.firstName && userData.lastName) {
            data.devoteeName = userData.firstName + " " + userData.lastName;
        }
        else {
            return;
        }
        mail.userName = userData.firstName + " " + userData.lastName;
        mail.mail = userData.email;
        data.requestType = donationDetails.requestType;

        if (requestType === "PurohithService") {
            data.purohithId = donationDetails.purohithId._id;
            data.purohithName = donationDetails.purohithId.firstName + " " + donationDetails.purohithId.lastName;
            mail.purohithName = donationDetails.purohithId.firstName + " " + donationDetails.purohithId.lastName;
            mail.purohithMail = donationDetails.purohithId.email;
        }
        else if (donationDetails.requestType === "TempleService") {
            data.templeId = donationDetails.templeId._id;
            data.purohithName = donationDetails.templeId.name;
            mail.purohithName = donationDetails.templeId.name;
            mail.purohithMail = donationDetails.templeId.email;
        } else if (donationDetails.requestType === "callToAction" && donationDetails.request === "dakshina") {
            data.purohithId = donationDetails._id;
            data.requestType = "PurohithService";
            data.purohithName = donationDetails.firstName + " " + donationDetails.lastName;
            mail.purohithMail = donationDetails.email;
            mail.purohithName = donationDetails.firstName + " " + donationDetails.lastName;

        }
        else if (donationDetails.requestType === "callToAction" && donationDetails.request === "donate") {
            data.templeId = donationDetails._id;
            data.requestType = "TempleService";
            data.purohithName = donationDetails.name;
            mail.purohithName = donationDetails.name;
            mail.purohithMail = donationDetails.email;
        }
        if (tokens<=0) {
            setErrorMessageToken(true);
            //setErrorMessage(true);
        }
        else if (userData.tokens < tokens) {
            setErrorMessageToken(false);
            setErrorMessage(true);
        } else {
            setErrorMessageToken(false);
            setErrorMessage(false);
            donation(data)
                .then((resp) => {
                    f7.preloader.show();
                    if (resp && resp.statusCode === 200) {
                        if ( (donationDetails.requestType === "callToAction" || donationDetails.requestType === "TempleService") && donationDetails.request === "donate") {
                            toastr.success("Thank you for Donation");  
                        }
                        else  {
                            toastr.success("Thank you for Dakshina");   
                        }
                        devoteeDonateMail(mail)
                            .then((resp) => { });
                        purohithDonateMail(mail)
                            .then((resp) => { });
                        f7.preloader.hide();
                        setTimeout(() => {
                            props.f7router.navigate('/home/');
                        }, 5000);
                    }
                })
        }

    };
    const goBack = () => {
        let data = props.details;
        if (props.details) {
            if (props.details.request == "Donate") {
                data.requestType = "TempleService";
            } else {
                data.requestType = "PurohithService";
            }
            props.f7router.navigate('/services/' + data._id, { props: { details: data } });
        } else {
            props.f7router.navigate('/home/');
        }
    }

    return (
        <Page name="services" className="color-deeporange custom-bg padding-top">
            <div>
                <Navbar className="header-bg navbar-position">
                    <NavLeft>
                        <span onClick={() => goBack()}><Icon onClick={() => goBack()} f7="arrow_left" color="black" style={{ fontWeight: '600', fontSize: '20px', paddingLeft: '8px', cursor: "pointer" }}></Icon></span>
                        <BrowserView>
                            <Link href='/home/'>
                                <img className="logoimage" src={logo} width="60"></img>
                            </Link>
                        </BrowserView>
                    </NavLeft>
                    <NavTitle style={{ color: 'white' }}>
                        {requestType == "callToAction" && donationDetails.request ? donationDetails.request : requestType && requestType === "PurohithService" ?
                            <h5>Dakshina</h5> :
                            <h5>Donate</h5>}
                    </NavTitle>
                </Navbar>
            </div>
            <SideBar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />

            <Block style={{ 'backgroundolColor': '#FFFFFF', 'height': '400px', 'margin': '15px' }}>
                {requestType == "PurohithService" ?
                    <Block>
                        <Row >
                            <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px', 'fontSize': '16px', 'color': '#ff9500' }}>{" " + donationDetails.purohithId.firstName + " " + donationDetails.purohithId.lastName}</p>
                        </Row>
                        <Row>
                            <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px', 'fontSize': '14px', 'color': '#ff9500' }}>{" " + donationDetails.purohithId.address}</p>
                        </Row>
                        <Row>
                            <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px', 'fontSize': '14px', 'color': '#ff9500' }}>{" " + donationDetails.purohithId.phone}</p>
                        </Row>
                    </Block> :
                    requestType == "TempleService" ?
                        <Block>

                            <Row >
                                <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px', 'fontSize': '14px', 'color': '#ff9500' }}>{donationDetails.purohithName} </p>

                            </Row>
                            <Row>
                                {/* <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px' }}>{" " +  donationDetails.city.name + ", " + donationDetails.country.name }</p> */}

                            </Row>
                            <Row>
                                {/* <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px' }}>{" " + donationDetails.purohithId.phone}</p> */}

                            </Row>

                        </Block> : requestType = "callToAction" ?

                            <Block>
                                <Row>
                                    <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px', 'fontSize': '14px', 'color': '#ff9500' }}>{donationDetails.name ? donationDetails.name : donationDetails.firstName}</p>
                                </Row>
                                <Row>
                                    <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px', 'fontSize': '14px', 'color': '#ff9500' }}> {donationDetails.address ? donationDetails.address : null}{"," + donationDetails.city.name + ", " + donationDetails.country.name}</p>
                                </Row>
                            </Block> : null}


                {/* <form> */}
                <List noHairlines>
                    <ListInput
                        type="number"
                        outline
                        validate pattern="[0-9]*"
                        label="Tokens"
                        value={balance}
                        onInput={(e) => {
                            setErrorMessage(false);
                            setErrorMessageToken(false);
                            setBalance(e.target.value);
                        }}
                        style={{ color: 'orange' }}
                    />
                </List>
                {/* </form> */}
                {(errorMessageToken) ? (
                    <Block className="display-flex justify-content-center" style={{ 'color': 'red' }}>
                        <p style={{ margin: '0px 4px 0px 0px' }}>Please enter number of Tokens to be added</p>

                    </Block>
                ) : null}
                {(errorMessage) ? (
                    <Block className="display-flex justify-content-center" style={{ 'color': 'red' }}>
                        <div style={{ position: 'relative' }}>
                            <p style={{ margin: '0px 4px 0px 40px' }}>Insufficient Tokens,  </p>

                            <Link href='/mywallet/' style={{ textDecoration: 'underline', fontWeight: " 700" }}>Please click here to Add tokens</Link>

                        </div>
                    </Block>
                ) : null}
                {successMessage ? (
                    <Block className="display-flex justify-content-center" style={{ 'color': 'green' }}>
                        Tokens sent successfully.
                    </Block>
                ) : null}
                <Block className="justify-content-center display-flex">

                    <Button
                        fill
                        className="submit-btn"
                        onClick={() => submitDonation(balance, userData._id)}>
                        Submit
                      </Button>
                </Block>
            </Block>
        </Page >
    );
};
export default DonationPage;