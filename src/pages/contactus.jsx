
import React, { useState, useEffect } from 'react';
import logo from '../assets/img/logo.png';
import coin from '../assets/img/coin.png';
import Avatar from "../assets/img/avatar.jpg";
import SideBar from "./sidenav";
import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";
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
} from 'framework7-react';
import {
    getLoggedinUserDetails,
    getTodayPurohitPuja,
    sendContactComplaintMail,
    sendContactFeedbackMail,
} from '../utils/api';
import loggedInUser from '../js/userdetails';
import toastr, { success } from 'toastr';
import moment from 'moment';
import { useSelector } from 'react-redux';
const ContactUsPage = (props) => {
    const [email, setEmail] = useState('');
    const [recentEventsDevotee, setRecentEventsDevotee] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [feedback, setFeedback] = useState('');
    //const [userData, setuserDetails] = useState({});
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [response, setResponseMessage] = useState({});
    const [type, setType] = useState('');

    const userData = useSelector((state => state && state.auth && state.auth.userDetails));
    useEffect(() => {
        if (userData && userData._id) {
            setEmail(userData.email);
            let list = [];
            let recentEventArray = [];
            getTodayPurohitPuja(userData._id, userData.role)
                .then((resp) => {
                    resp.forEach(element => {
                        if (element.status == 'Completed') {
                            recentEventArray.push(element);
                        }
                    });
                    setRecentEventsDevotee(recentEventArray);
                });
        }
    }, [userData && userData._id]);

    const handleSubmit = () => {
        if (type == 'Feedback') {
            if (!selectedEvent) {
                setErrorMessage('please select all the fields')
            } else {
                let payload = {
                    mail: email,
                    userName: userData.firstName + " " + userData.lastName,
                    selectedEvent: selectedEvent,
                    feedback: feedback,
                    message: message
                }
                sendContactFeedbackMail(payload).then((resp) => {
                    if (resp) {
                        setResponseMessage(resp);
                        setErrorMessage('');

                    } else {
                        console.warn("No resp");
                    }
                })
                    .catch(error => {
                        throw new Error(error);
                    });
            }
        } else {
            if (!feedback) {
                setErrorMessage('')
            } else {
                let payload = {
                    mail: email,
                    userName: userData.firstName + " " + userData.lastName,
                    selectedEvent: selectedEvent,
                    feedback: feedback,
                    message: message
                }
                sendContactComplaintMail(payload).then((resp) => {
                    if (resp) {
                        setResponseMessage(resp);
                        setErrorMessage('');

                    } else {
                        console.warn("No resp");
                    }
                })
                    .catch(error => {
                        throw new Error(error);
                    });
            }
        }
    }
    const handleChange = (e) => {
        setType(e.target.value);
        setFeedback('');
    }


    return (
        <Page style={{ backgroundColor: "#FFFFFF" }} name="services" className="color-deeporange custom-bg padding-top">
            <div>
                <Navbar className="header-bg navbar-position">
                    <NavLeft>
                        <MobileView>
                            <Link href="/home/" slot="left" className="link back">
                                <Icon f7="arrow_left" color="black" style={{ fontWeight: '600', fontSize: '20px', paddingRight: '8px' }}></Icon>
                            </Link>
                        </MobileView>
                        <BrowserView>
                            <Link href='/home/'>
                                <img className="logoimage" src={logo} width="60"></img>
                            </Link>
                        </BrowserView>
                    </NavLeft>
                    <NavTitle style={{ color: 'white' }}>Contact Us</NavTitle>
                </Navbar>
            </div>
            <SideBar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />
            <List noHairlines style={{ overflow: 'hidden' }}>
                {/* <h3 style={{ color: 'black', 'textAlign':'center', }}>Contact Us</h3> */}
                <h5 style={{ color: 'orange', position: 'relative', left: '20px', top: '20px' }}>Your Email</h5>
                <ListInput
                    outline
                    value={email}
                    disabled
                ></ListInput>
                <div onChange={handleChange} style={{ margin: " 0px 20px", }}>
                    <List>
                        <input type="radio" name='type' value='Feedback' />Feedback
                        <input type="radio" name='type' value='Complaint' />Complaint
                    </List>
                </div>
            </List>
            {type && type == 'Complaint' ?
                <List noHairlines style={{ overflow: 'hidden' }}>

                    <ListInput
                        outline
                        label="Recent Events"
                        type="select"
                        onInput={(e) => {
                            setSelectedEvent(e.target.value);
                        }}
                    >
                        <option>Select</option>
                        {/* {recentEventsDevotee && recentEventsDevotee.length > 0 ?
                        recentEventsDevotee.map((item, i) => (
                     <option>{item} </option>
                    ))
                        : null}
                     <option>ALL</option> */}
                        {
                            recentEventsDevotee.map((item, i) => (
                                <option value={item.serviceName + ", " + item.requestedTime + ", " + moment(item.requestedDate).format('DD/MM/YYYY')}>
                                    {item.serviceName + ", " + item.requestedTime + ", " + moment(item.requestedDate).format('DD/MM/YYYY')}
                                </option>
                            ))}
                        <option value="none">None</option>
                    </ListInput>
                    <ListInput
                        outline
                        label="Feedback"
                        type="select"
                        onInput={(e) => {
                            setFeedback(e.target.value);
                        }}
                    >
                        <option>Select</option>
                        <option>Technical Issue Audio/video</option>
                        <option>Temple/Purohit didnot attend</option>
                        <option>Not Satisfied with Quality</option>
                        <option>Other</option>
                    </ListInput>

                </List>

                : null}
            {type && type == 'Feedback' ?
                <List noHairlines style={{ overflow: 'hidden' }}>
                    <ListInput
                        outline
                        label="Recent Events"
                        type="select"
                        onInput={(e) => {
                            setSelectedEvent(e.target.value);
                        }}
                    >
                        <option>Select</option>
                        {/* {recentEventsDevotee && recentEventsDevotee.length > 0 ?
                        recentEventsDevotee.map((item, i) => (
                     <option>{item} </option>
                    ))
                        : null}
                     <option>ALL</option> */}
                        {
                            recentEventsDevotee.map((item, i) => (
                                <option value={item.serviceName + ", " + item.requestedTime + ", " + moment(item.requestedDate).format('DD/MM/YYYY')}>
                                    {item.serviceName + ", " + item.requestedTime + ", " + moment(item.requestedDate).format('DD/MM/YYYY')}
                                </option>
                            ))}
                        <option value="none">None</option>
                    </ListInput>
                </List>
                : null}
            {type && type == 'Feedback' || feedback && feedback == "Other" ?
                <List className="item-content item-input">
                    <div className="item-inner" style={{ padding: '20px', backgroundColor: '#fff', }}>
                        <div className="title label" style={{ color: 'orange', position: 'relative', marginLeft: '10px' }}>Message</div>
                        <div className="item-input-wrap">
                            <textarea value={message} onInput={(e) => { setMessage(e.target.value); }} type="text" name="message" placeholder="Type Your Message Here" style={{ border: '1px solid gray', marginRight: '5px', paddingLeft: '8px' }}></textarea>
                        </div>
                    </div>
                </List>

                : null}

            {errorMessage ? (
                <Block className="display-flex justify-content-center" style={{ 'color': 'red' }}>
                    {errorMessage}
                </Block>
            ) : null}
            <Block className="" style={{ 'display': 'flex', 'justifyContent': 'center' }}>
                <Button className="col button button-fill color-orange" fill round raised style={{ 'width': '100px' }}
                    onClick={handleSubmit}>Submit</Button>
            </Block>
        </Page >
    );
}
export default ContactUsPage;