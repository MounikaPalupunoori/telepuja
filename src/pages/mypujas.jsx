import React, { useState, useEffect, useContext } from 'react';
import moment from "moment";
import logo from '../assets/img/logo.png';
import coin from '../assets/img/coin.png';
import Avatar from "../assets/img/avatar.jpg";
import logogrey from '../assets/img/logogrey.png';
import SideBar from "./sidenav";

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
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";
import { getTodayPurohitPuja }
  from "../utils/api";
import { useSelector } from 'react-redux';
const NotificationsPage = () => {

  const [myPujaList, setMyPujaList] = useState([]);
  const userData = useSelector((state => state && state.auth && state.auth.userDetails));
  console.log(userData);
  useEffect(() => {
    f7.preloader.show();
    if (userData && userData._id) {
      getTodayPurohitPuja(userData._id, userData.role)
        .then((resp) => {
          resp.sort(function (a, b) { return moment(b.createdAt).format('x') - moment(a.createdAt).format('x') });
          setMyPujaList(resp);
          f7.preloader.hide();
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  }, [userData && userData._id]);
  return (
    <Page name="notifications" className="color-deeporange custom-bg padding-top">
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
          <NavTitle style={{ color: 'white' }}>Pujas</NavTitle>
        </Navbar>
      </div>
      <SideBar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />

      <List mediaList className="purohit-list">
        {myPujaList && myPujaList.length > 0 ? (
          myPujaList.map((item, i) => (
            item.purohithId ? (
              <ListItem
                key={i}
                className="purohit-item"
                title={(userData.role === "devotee" && item.purohithName) ? item.purohithName : ""}
              // subtitle={item.purohithId.address}
              >
                {userData.role != "devotee" ? (
                  <Row className="justify-content-start display-flex">
                    <p style={{ margin: '0px', color: 'green' }}>{item.userName}</p>
                  </Row>
                ) : (
                  <Row className="justify-content-start display-flex">
                    <p className="puja-ft-wt">Location: {"  "} </p><p style={{ 'margin': '2px', 'color': 'green' }}> {item.purohithId.address ? item.purohithId.address : ""}</p>
                  </Row>
                )}
                <Row className="justify-content-start display-flex">
                  <p className="puja-ft-wt">Service: {"  "} </p><p style={{ 'margin': '2px', }}> {item.serviceName ? item.serviceName : ""}</p>
                </Row>
                <Row className="justify-content-start display-flex">
                  <p className="puja-ft-wt">  Booked Date: </p><p style={{ 'margin': '2px' }}> {(moment(item.requestedDate).format("ddd DD-MMM-YY") ? moment(item.requestedDate).format("ddd DD-MMM-YY") : "")} {" "} {item.requestedTime ? item.requestedTime : ""}</p>
                </Row>
                <Row className="justify-content-start display-flex">
                  <p className="puja-ft-wt">Tokens: {"  "} </p><p style={{ 'margin': '2px', 'color': 'green' }}> {item.tokens}</p>
                </Row>
                <Row className="justify-content-start display-flex">
                  <p className="puja-ft-wt">Status: {"  "}</p>
                  {item.status == "Completed" ? <p className="puja-status" style={{ 'backgroundColor': ' #77B300' }}>{item.status}</p> : null}
                  {item.status == "Requested" ? <p className="puja-status" style={{ 'backgroundColor': '#FF9900' }}>{item.status}</p> : null}
                  {item.status == "Accepted" ? <p className="puja-status" style={{ 'backgroundColor': '#ffc107' }}>{item.status}</p> : null}
                  {item.status == "Rejected" ? <p className="puja-status" style={{ 'backgroundColor': '#FF1A1A' }}>{item.status}</p> : null}
                  {item.status == "Cancelled" ? <p className="puja-status" style={{ 'backgroundColor': 'red' }}>{item.status}</p> : null}
                </Row>
                {userData.role != "devotee" ?
                  (<img style={{ alignSelf: 'center !important' }}
                    slot="media"
                    src={logogrey}
                    width="100"
                    height="100"
                    className="temple-image"
                  />) : (<img
                    slot="media"
                    src={item.imageId}
                    width="100"
                    height="100"
                    className="temple-image"
                  />)}
              </ListItem>
            ) : (
              <ListItem
                key={i}
                className="temple-item"
                title={(userData.role === "devotee" && item.purohithName) ? item.purohithName : ""}
              // subtitle={item.purohithId.address}
              >
                {userData.role != "devotee" ? (
                  <Row className="justify-content-start display-flex">
                    <p style={{ margin: '0px', color: 'green' }}>{item.userName}</p>
                  </Row>
                ) : (
                  <Row className="justify-content-start display-flex">
                    <p className="puja-ft-wt">Location: {"  "} </p><p style={{ 'margin': '2px', 'color': 'green' }}> {item.templeId.address ? item.templeId.address : null}</p>
                  </Row>
                )}
                <Row className="justify-content-start display-flex">
                  <p className="puja-ft-wt">Service: {"  "} </p><p style={{ 'margin': '2px', }}> {item.serviceName ? item.serviceName : ""}</p>
                </Row>
                <Row className="justify-content-start display-flex">
                  <p className="puja-ft-wt">  Booked Date: </p><p style={{ 'margin': '2px' }}> {(moment(item.requestedDate).format("ddd DD-MMM-YY") ? moment(item.requestedDate).format("ddd DD-MMM-YY") : "")} {" "} {item.requestedTime ? item.requestedTime : null}</p>
                </Row>
                <Row className="justify-content-start display-flex">
                  <p className="puja-ft-wt">Tokens: {"  "} </p><p style={{ 'margin': '2px', 'color': 'green' }}> {item.tokens}</p>
                </Row>
                <Row className="justify-content-start display-flex">
                  <p className="puja-ft-wt">Status: {"  "}</p>
                  {item.status == "Completed" ? <p className="puja-status" style={{ 'backgroundColor': ' #77B300' }}>{item.status}</p> : null}
                  {item.status == "Requested" ? <p className="puja-status" style={{ 'backgroundColor': '#FF9900' }}>{item.status}</p> : null}
                  {item.status == "Accepted" ? <p className="puja-status" style={{ 'backgroundColor': '#ffc107' }}>{item.status}</p> : null}
                  {item.status == "Rejected" ? <p className="puja-status" style={{ 'backgroundColor': '#FF1A1A' }}>{item.status}</p> : null}
                  {item.status == "Cancelled" ? <p className="puja-status" style={{ 'backgroundColor': 'red' }}>{item.status}</p> : null}
                </Row>
                {userData.role != "devotee" ?
                  (<img style={{ alignSelf: 'center !important' }}
                    slot="media"
                    src={logogrey}
                    width="100"
                    height="100"
                    className="temple-image"
                  />) : (<img
                    slot="media"
                    src={item.imageId}
                    width="100"
                    height="100"
                    className="temple-image"
                  />)}

              </ListItem>
            )
          ))
        ) : /* (
          <div>
            <Block style={{ 'display': 'flex', 'justifyContent': 'center', 'margin': '20px' }}>
              <Button style={{ 'width': '150px', 'border': '1px solid' }} href='/temples/'>Select temple</Button>
            </Block>

            <Block style={{ 'display': 'flex', 'justifyContent': 'center', 'margin': '20px' }}>
              <Button href='/purohits/' style={{ 'width': '150px', 'border': '1px solid' }}>Select purohit</Button>
            </Block>
          </div>
        ) */
          <Row className="justify-content-center display-flex" style={{ 'marginTop': '15px', 'color': '#f27d0d' }}>
            No Pujas booked
        </Row>}
      </List>
    </Page>
  );
};
export default NotificationsPage;