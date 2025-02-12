import React, { useState, useEffect, useContext } from 'react';
import moment from "moment";
import logo from '../assets/img/logo.png';
import coin from '../assets/img/coin.png';
import Avatar from "../assets/img/avatar.jpg"; 
import {
  f7,
  Page,
  Navbar,
  NavLeft,
  NavTitle,
  NavTitleLarge,
  NavRight,
  Link,
  Toolbar,
  Swiper,
  SwiperSlide,
  SwipeoutActions,
  SwipeoutButton,
  Block,
  BlockTitle,
  List,
  Card,
  CardContent,
  ListItem,
  Row,
  Col,
  Icon,
  Button
} from 'framework7-react';
import loggedInUser from '../js/userdetails';
import { getLoggedinUserDetails, getTodayPurohitPuja }
  from "../utils/api";
const NotificationsPage = () => {
  const [userData, setUserData] = useState({});
  const [myPujaList, setMyPujaList] = useState("");
  // const [myPujaList, setMyPujaList] = useState([]);
  useEffect(() => {
    // f7.preloader.show();
    let user = loggedInUser();
    if (user && user.uid) {
      getLoggedinUserDetails(user.uid)
        .then((result) => {
          if (result) {
            setUserData(result);
          }
          else {
            console.warn("No user details found");
          }
        })
        .catch(error => {
          throw new Error(error);
        })
    }
  }, []);
  useEffect(() => {
    if (userData && userData._id) {
      let role;
      if (userData.role == 'purohit') {
        role = 'purohith';
      }
      else if (role == 'temple') {
        role = 'temple';
      }
      getTodayPurohitPuja(userData._id, role)
        .then((resp) => {
          setMyPujaList(resp);
          f7.preloader.hide();
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  }, [userData]);
  return (
    <Page name="notifications" className="color-deeporange custom-bg">
     <Navbar className="header-bg">
                <a href="/home/" slot="left" className="link back"><Icon f7="arrow_left" backLink="Back" color="black" style={{fontWeight:'400',fontSize:'20px',}}></Icon></a>
                    <NavLeft className="header-detail" style={{position:'absolute' ,left:'40px'}} >
          <Link href='/mywallet/'><img src={coin}></img>
            <span className="header-credits" style={{ 'color': 'white' , 'fontSize':'19px',paddingLeft:'3px'}}>{userData.tokens}</span></Link>
        </NavLeft>
                <div style={{ 'width': '100%', 'display': 'flex', position: 'fixed', 'justifyContent': 'center', alignItems: 'center', }}>
                    <Link href='/home/'><img src={logo} width="60"></img></Link>
                </div>
                <NavRight className="header-img">
                    <Link href='/profile/'>
                        <span style={{ color: 'white' }}>
                            {userData.firstName && userData.lastName ? userData.firstName + " "  : userData.email}</span>
                        <img src={userData.imageUrl ? userData.imageUrl : Avatar}></img></Link>
                </NavRight>
            </Navbar>
      <List mediaList className="purohit-list">
        {myPujaList && myPujaList.length > 0 ? (
          myPujaList.map((item, i) => (
            item.purohithId ? (
              <ListItem
                key={i}
                className="purohit-item"
                title={item.purohithId.firstName + " " + item.purohithId.lastName}
              // subtitle={item.purohithId.address}
              >
                <Row className="justify-content-start display-flex">
                  <p style={{ 'fontSize': '12px', 'margin': '2px', 'fontWeight': '600' }}>Location: {"  "} </p><p style={{ 'fontSize': '12px', 'margin': '2px', 'color': 'green' }}> {item.purohithId.address}</p>
                </Row>
                <Row className="justify-content-start display-flex">
                  <p style={{ 'fontSize': '12px', 'margin': '2px', 'fontWeight': '600' }}>  Booked Date: </p><p style={{ 'fontSize': '12px', 'margin': '2px' }}> {(moment(item.requestedDate).format("ddd DD-MMM-YY"))} {" "} {moment(item.requestedDate).format("hh:mm A")}</p>
                </Row>
                <Row className="justify-content-start display-flex">
                  <p style={{ 'fontSize': '12px', 'margin': '2px', 'fontWeight': '600' }}>Tokens: {"  "} </p><p style={{ 'fontSize': '12px', 'margin': '2px', 'color': 'green' }}> {item.tokens}</p>
                </Row>
                <Row className="justify-content-start display-flex">
                  <p style={{ 'font-size': '12px', 'margin': '2px', 'fontWeight': '600' }}>Status: {"  "}</p>
                  {item.status == "Completed" ? <p style={{ 'fontSize': '12px', 'margin': '2px', 'color': ' #77B300', 'fontWeight': '600' }}>{item.status}</p> : null}
                  {item.status == "Requested" ? <p style={{ 'fontSize': '12px', 'margin': '2px', 'color': '#FF9900', 'fontWeight': '600' }}>{item.status}</p> : null}
                  {item.status == "Accepted" ? <p style={{ 'fontSize': '12px', 'margin': '2px', 'color': ' #E6E600', 'fontWeight': '600' }}>{item.status}</p> : null}
                  {item.status == "Rejected" ? <p style={{ 'fontSize': '12px', 'margin': '2px', 'color': '#FF1A1A', 'fontWeight': '600' }}>{item.status}</p> : null}
                </Row>
                <img
                  slot="media"
                  src={item.purohithId.Image_URL[0]}
                  width="65"
                  className="temple-image"
                />
              </ListItem>
            ) : (
                <ListItem
                  key={i}
                  className="temple-item"
                  title={item.templeId.name}
                // subtitle={item.purohithId.address}
                >
                  <Row className="justify-content-start display-flex">
                    <p style={{ 'fontSize': '12px', 'margin': '2px', 'fontWeight': '600' }}>Location: {"  "} </p><p style={{ 'fontSize': '12px', 'margin': '2px', 'color': 'green' }}> {item.templeId.address}</p>
                  </Row>
                  <Row className="justify-content-start display-flex">
                    <p style={{ 'fontSize': '12px', 'margin': '2px', 'fontWeight': '600' }}>  Booked Date: </p><p style={{ 'fontSize': '12px', 'margin': '2px' }}> {(moment(item.requestedDate).format("ddd DD-MMM-YY"))} {" "} {moment(item.requestedDate).format("hh:mm A")}</p>
                  </Row>
                  <Row className="justify-content-start display-flex">
                    <p style={{ 'fontSize': '12px', 'margin': '2px', 'fontWeight': '600' }}>Tokens: {"  "} </p><p style={{ 'fontSize': '12px', 'margin': '2px', 'color': 'green' }}> {item.tokens}</p>
                  </Row>
                  <Row className="justify-content-start display-flex">
                    <p style={{ 'font-size': '12px', 'margin': '2px', 'fontWeight': '600' }}>Status: {"  "}</p>
                    {item.status == "Completed" ? <p style={{ 'fontSize': '12px', 'margin': '2px', 'color': ' #77B300', 'fontWeight': '600' }}>{item.status}</p> : null}
                    {item.status == "Requested" ? <p style={{ 'fontSize': '12px', 'margin': '2px', 'color': '#FF9900', 'fontWeight': '600' }}>{item.status}</p> : null}
                    {item.status == "Accepted" ? <p style={{ 'fontSize': '12px', 'margin': '2px', 'color': ' #E6E600', 'fontWeight': '600' }}>{item.status}</p> : null}
                    {item.status == "Rejected" ? <p style={{ 'fontSize': '12px', 'margin': '2px', 'color': '#FF1A1A', 'fontWeight': '600' }}>{item.status}</p> : null}
                  </Row>
                  <img
                    slot="media"
                    src={item.templeId.Image_URL[0]}
                    width="65"
                    className="temple-image"
                  />
                </ListItem>
              )
          ))
        ) : (
            <Block>No Notifications to show</Block>
          )}
      </List>
    </Page>
  );
};
export default NotificationsPage;

