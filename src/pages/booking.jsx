import React, { useState, useEffect } from 'react';
import logo from '../assets/img/logo.png';
import coin from '../assets/img/coin.png';
import Avatar from "../assets/img/avatar.jpg";
import Popup from './walletPopup.jsx';
import SideBar from "./sidenav";
import {
    f7,
    Icon,
    Page,
    Navbar,
    NavTitle,
    Block,
    Button,
    Link,
    NavRight,
    NavLeft,
    List,
    Row,
    BlockTitle,
    PieChart
} from "framework7-react";
import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";
import userDetails from '../js/user_details'
import { getLoggedinUserDetails, createDevoteeRequest, sendDevoteeEmail, sendPurohithEmail, createTimeSlot, createMeetId } from '../utils/api';
import { useSelector } from 'react-redux';
import moment from "moment";
import toastr from "toastr";
import { user } from '../firebase/firebase';

const Bookingpage = (props) => {

    let data = "";
    const bookingData = props.bookingData;
    const timeslotData = props.timeslotData;
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [meetData, setMeetData] = useState([]);
    const [remainingBal, setRemainingBal] = useState("");
    const [remainingBalValue, setRemainingBalValue] = useState("");
    const [displayRemainingBal, setDisplayRemainingBal] = useState("");
    const [reqTokens, setReqTokens] = useState("")
    const [tokens, setTokens] = useState(0);

    const userData = useSelector(state => state && state.auth && state.auth.userDetails);



    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

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

    useEffect(() => {
        if (userData && userData._id) {
            let reqToken = Number(bookingData.tokens);
            setReqTokens(reqToken);
            setError("");
            if ((Number(userData.tokens)) > reqToken) {
                setRemainingBal(((Number(userData.tokens)) - reqToken));
                setDisplayRemainingBal(((Number(userData.tokens)) - reqToken).toFixed(2));
                setRemainingBalValue('New Balance');

            } else if ((Number(userData.tokens)) == reqToken) {
                setRemainingBal(((Number(userData.tokens)) - reqToken));
                setDisplayRemainingBal(((Number(userData.tokens)) - reqToken).toFixed(2));
                setRemainingBalValue('New Balance')
            } else {
                setRemainingBal((Number(userData.tokens)));
                setDisplayRemainingBal(((Number(userData.tokens))).toFixed(2));
                setRemainingBalValue('Available Tokens');

            }
        }


    }, [userData && userData.tokens]);
    const bookservice = () => {
        if (Number(userData.tokens) < (Number(bookingData.tokens))) {
            let message = "Please Add Tokens";
            setError(message);
        }
        else {
            let obj = {}
            if (bookingData.requestType === 'TempleService' && userData.firstName && userData.lastName && userData.email && timeslotData.timeSlot) {
                obj.requestType = "TempleService";
                obj.requestedDate = bookingData.bookingSlot;
                obj.requestedTime = timeslotData.timeSlot;
                obj.devoteeId = userData._id;
                obj.templeServiceId = bookingData.templeServiceId;
                obj.templeId = bookingData.templeId;
                obj.status = "Requested";
                obj.tokens = Number(bookingData.tokens);
                obj.tokenQuantity = Number(bookingData.tokens);
                obj.purohithName = bookingData.name;
                obj.serviceName = bookingData.serviceName;
                obj.userName = userData.firstName + " " + userData.lastName;
                obj.mail = userData.email;
                obj.purohithMail = bookingData.templeEmail;
                obj.imageId = bookingData.image;
                obj.date = timeslotData.bookingDate;
                // obj.meetingId = "";
                let obj1 = {
                    date: timeslotData.bookingDate,
                    templeServiceId: bookingData.templeServiceId,
                    templeId: bookingData.templeId,
                    requestedTime: timeslotData.timeSlot
                }
                if (!bookingData.approval_needed) {
                    obj.status = "Accepted";
                }
                createMeetId(timeslotData.bookingDate, timeslotData.timeSlot, bookingData.templeServiceId, bookingData.templeId)
                    .then((resp) => {
                        if (resp.length > 0) {
                            obj.meetingId = resp[0].meetingId;
                        } else {
                            obj.meetingId = Math.random().toString(36).substring(2, 12);
                        }
                        createDevoteeRequest(obj)
                            .then((resp) => {
                                if (resp.status === 200) {
                                    sendDevoteeEmail(obj)
                                        .then((result) => {
                                            setDevoteeEmail(result);
                                        })
                                        .catch((error) => {
                                            console.warn(error);
                                        });
                                    if (bookingData.approval_needed) {
                                        sendPurohithEmail(obj)
                                            .then((result) => {
                                                setPurohithEmail(result);
                                            })
                                            .catch((error) => {
                                                console.warn(error);
                                            });
                                    }

                                    createTimeSlot(timeslotData).then((resp) => {
                                    })
                                    data = {
                                        type: "templeService",
                                        name: bookingData.name,
                                        service: bookingData.serviceName,
                                        time: moment(parseInt(bookingData.bookingSlot)).format("hh:mm a"),
                                        timeSlot: bookingData.timeslot,
                                        date: moment(parseInt(bookingData.bookingSlot)).format("ddd DD-MMM-YY")
                                    }
                                    props.f7router.navigate('/confirmbooking/' + bookingData._id, { props: { bookedData: data } });
                                }
                            })
                            .catch((error) => toastr.error(error.message));
                        // setMeetData(resp);
                        // console.log(resp);
                    })
                    .catch((error) => toastr.error(error.message));
                // console.log(meetData, Math.random().toString(36).substring(2, 12), "asdfgh");
                // if (meetData) {
                //     if (meetData.length > 0) {
                //         console.log(meetData[0])
                //         obj.meetingId = meetData[0].meetingId;
                //     } else {
                //         obj.meetingId = Math.random().toString(36).substring(2, 12);
                //     }
                // }

            }
            else {
                if (userData.firstName && userData.lastName && userData.email && timeslotData.timeSlot) {
                    obj.requestType = "PurohithService";
                    obj.requestedDate = bookingData.bookingSlot;
                    obj.requestedTime = timeslotData.timeSlot;
                    obj.purohithId = bookingData.purohitId;
                    obj.devoteeId = userData._id;
                    obj.devoteeUserId = userData.userId;
                    obj.purohithServiceId = bookingData.purohitServiceId;
                    obj.status = "Requested";
                    obj.tokens = Number(bookingData.tokens);
                    obj.tokenQuantity = Number(bookingData.tokens);
                    obj.purohithName = bookingData.name;
                    obj.serviceName = bookingData.serviceName;
                    obj.userName = userData.firstName + " " + userData.lastName;
                    obj.mail = userData.email;
                    obj.purohithMail = bookingData.purohithEmail;
                    obj.imageId = bookingData.image;
                    obj.date = timeslotData.bookingDate;
                }
                if (!bookingData.approval_needed) {
                    obj.status = "Accepted";
                }
                createMeetId(timeslotData.bookingDate, timeslotData.timeSlot, bookingData.purohitServiceId, bookingData.purohitId)
                    .then((resp) => {
                        if (resp.length > 0) {
                            obj.meetingId = resp[0].meetingId;
                        } else {
                            obj.meetingId = Math.random().toString(36).substring(2, 12);
                        }
                        createDevoteeRequest(obj)
                            .then((resp) => {
                                if (resp.status === 200) {
                                    sendDevoteeEmail(obj)
                                        .then((result) => {
                                            setDevoteeEmail(result);
                                        })
                                        .catch((error) => {
                                            console.warn(error);
                                        });
                                    if (bookingData.approval_needed) {
                                        sendPurohithEmail(obj)
                                            .then((result) => {
                                                setPurohithEmail(result);
                                            })
                                            .catch((error) => {
                                                console.warn(error);
                                            });
                                    }

                                    createTimeSlot(timeslotData).then((resp) => {
                                    })
                                    data = {
                                        type: "purohithService",
                                        name: bookingData.name,
                                        service: bookingData.serviceName,
                                        time: moment(parseInt(bookingData.bookingSlot)).format("hh:mm a"),
                                        timeSlot: bookingData.timeslot,
                                        date: moment(parseInt(bookingData.bookingSlot)).format("DD/MM/YYYY")
                                    }
                                    props.f7router.navigate('/confirmbooking/' + bookingData.id, { props: { bookedData: data } });
                                }
                            })
                            .catch((error) => toastr.error(error.message));
                    })
                    .catch((error) => toastr.error(error.message));
            }
        };
    }
    return (
        <Page name="services" className="color-deeporange custom-bg padding-top">
            <div>
                <Navbar className="header-bg navbar-position">
                    <NavLeft>
                        <MobileView>
                            <a href="/home/" slot="left" className="link back"><Icon f7="arrow_left" backLink="Back" color="black" style={{ fontWeight: '600', fontSize: '20px', paddingRight: '8px' }}></Icon></a>
                        </MobileView>
                        <BrowserView>
                            <Link href='/home/'>
                                <img className="logoimage" src={logo} width="60"></img>
                            </Link>
                        </BrowserView>
                    </NavLeft>
                    <NavTitle style={{ color: 'white' }}>Booking Service</NavTitle>
                </Navbar>
            </div>
            <SideBar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />
            <Block style={{ backgroundColor: "#ffffff" }}>
                <div>
                    <List>
                        <div style={{ color: '#ff9500', 'textAlign': 'left', marginTop: 'auto', fontSize: '20px', fontWeight: '600' }}>{bookingData.name}<hr color='#8e8e93'></hr></div>
                        <div >{bookingData.address + ", " + bookingData.city + ", " + bookingData.state + ", " + bookingData.country}</div>
                        <hr color='#8e8e93'></hr>
                        <div >Service : {bookingData.serviceName}</div>
                        <hr color='#8e8e93'></hr>
                        <div >Note : {bookingData.note}</div>
                        <hr color='#8e8e93'></hr>
                        <Block className="justify-content-space-between display-flex" style={{ border: '2px solid orange', margin: '2px' }}>
                            <Row>Event Time : </Row>
                            {/* <Row>{moment(parseInt(bookingData.bookingSlot)).format("hh:mm a")}</Row> */}
                            <Row>{bookingData.timeslot}</Row>
                        </Block>
                        <Block className="justify-content-space-between display-flex" style={{ border: '2px solid orange', margin: '2px', marginTop: '5px' }}>
                            <Row>Event Date : </Row>
                            <Row>{moment(parseInt(bookingData.bookingSlot)).format("ddd DD-MMM-YY")}</Row>
                        </Block> <hr color='#8e8e93'></hr>
                        <div>
                            <p >Available Tokens : {Number(userData.tokens).toFixed(2)}</p>
                            <h3 style={{ color: 'green' }}>Tokens Needed : {Number(bookingData.tokens).toFixed(2)}</h3>
                        </div>
                        {/* <ListItem>Available Tokens:{authUser.tokens}</ListItem>
            <div>
                <List>
                    <div style={{ color: '#ff9500', 'textAlign': 'left', marginTop: 'auto', fontSize: '20px', fontWeight: '600' }}>{bookingData.name}<hr color='#8e8e93'></hr></div>
                    <div style={{ color: 'white' }}>{bookingData.address + ", " + bookingData.city + ", " + bookingData.state + ", " + bookingData.country}</div>
                    <hr color='#8e8e93'></hr>
                    <div style={{ color: 'white' }}>Service : {bookingData.serviceName}</div>
                    <hr color='#8e8e93'></hr>
                    <div style={{ color: 'white' }}>Note : {bookingData.note}</div>
                    <hr color='#8e8e93'></hr>
                    <Block className="justify-content-space-between display-flex" style={{ color: 'white', border: '2px solid orange', margin: '2px' }}>
                        <Row>Booking Time : </Row>
                        <Row>{moment(parseInt(bookingData.bookingSlot)).format("hh:mm a")}</Row>
                    </Block>
                    <Block className="justify-content-space-between display-flex" style={{ color: 'white', border: '2px solid orange', margin: '2px', marginTop: '5px' }}>
                        <Row>Booking Date : </Row>
                        <Row>{moment(parseInt(bookingData.bookingSlot)).format("MMMM DD,YYYY")}</Row>
                    </Block> <hr color='#8e8e93'></hr>
                    <div>
                        <p style={{ color: 'white' }}>Available Tokens : {userDetails.tokens}</p>
                        <h3 style={{ color: 'green' }}>Tokens Needed : {bookingData.tokens}</h3>
                    </div>
                    {/* <ListItem>Available Tokens:{authUser.tokens}</ListItem>
                    <ListItem style={{ color: 'green' }}>Tokens Needed : {bookingData.tokens}</ListItem> */}

                    </List>
                    <Block>
                        {reqTokens && userData.tokens ? <PieChart
                            tooltip
                            datasets={[
                                {
                                    label: remainingBalValue,
                                    value: remainingBal,
                                    color: '#588038',
                                    size: "200"
                                },
                                {
                                    label: 'Token required',
                                    value: reqTokens,
                                    color: '#FF0000',
                                },

                            ]}
                        /> : null}
                        {reqTokens && userData.tokens ? <Block className="display-flex justify-content-center" style={{ margin: '0px' }}>
                            <Block className="display-flex justify-content-center">
                                <div className="pie-display-box" style={{ backgroundColor: '#588038' }}>

                                </div>
                                <span style={{ marginLeft: '5px' }}>
                                    {remainingBalValue} - {displayRemainingBal}
                                </span>
                            </Block>
                            <Block className="display-flex justify-content-center">
                                <div className="pie-display-box" style={{ backgroundColor: '#FF0000' }}>

                                </div>
                                <span style={{ marginLeft: '5px' }}>
                                    Token Required - {reqTokens.toFixed(2)}
                                </span>
                            </Block>
                        </Block> : null}
                    </Block>
                    <List>
                        {error ? (
                            <Block className="display-flex justify-content-center" style={{ color: 'red' }}>
                                <p onClick={() => { togglePopup() }} style={{ textDecoration: 'underline', fontWeight: " 700", margin: '0px', cursor: 'pointer' }}> Please click here to Add Tokens</p>
                            </Block>) : null
                        }
                        <Block className="" style={{ 'display': 'flex', 'justifyContent': 'center' }}>
                            <Button class="col button button-fill button-round color-green" fill round raised style={{ 'width': '170px' }} onClick={() => bookservice()}>Confirm Service</Button>
                        </Block>
                        <Block style={{ 'display': 'flex', 'justifyContent': 'center', fontSize: '20px' }}>
                            <Button className="link col button color-raised border-raised" style={{ border: '2px solid', 'width': '100px', borderRadius: '70px' }} onClick={() => { props.f7router.back() }}>Cancel</Button>
                        </Block>
                    </List>
                </div>
            </Block>
            {isOpen && <Popup
                handleClose={togglePopup}
            />}
        </Page>
    );
};
export default Bookingpage;