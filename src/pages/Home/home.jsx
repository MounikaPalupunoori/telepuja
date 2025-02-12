import React, { useEffect, useState } from 'react';
import moment from "moment";
import '../../css/index.css';
import coin from '../../assets/img/coin.png';
import logo from '../../assets/img/logo.png';
import purohit from '../../assets/img/purohit.png';
import VideoConference from "../jitsi";
import Avatar from "../../assets/img/avatar.jpg";
import temple from '../../assets/img/temple.png';
import SideBar from '../sidenav.jsx';
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
  Popover,
  Button
} from 'framework7-react';
import { getLoggedinUserDetails, getTempleNames, templeAcceptEmail, getPurohitNotifications, updateAsCompleted, getpurohitnames, updateNotifRequest, getTodayPurohitPuja, acceptEmail, rejectEmail, cancelService, purohithCancelService, purohithCancelMail, devoteeCancelMail, thankYouMail }
  from "../../utils/api";
import userDetails from '../../js/user_details';
import { useDispatch } from 'react-redux';
import { getUserDetails } from '../../store/actions/auth';


const HomePage = (props) => {

  const user = JSON.parse(localStorage.getItem("current_user"));
  const [userData, setUserData] = useState({});
  const [upcomingEventsDevotee, setUpcomingEventsDevotee] = useState([]);
  const [recentEventsDevotee, setRecentEventsDevotee] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [purohitPujas, setPurohitPujas] = useState([]);
  const [upcomingEventsShowData, setUpcomingEventsShowData] = useState(false);
  const [recentEventsShowData, setRecentEventsShowData] = useState(false);
  const [latestUpdateShowData, setLatestUpdateShowData] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [kitData, setKitData] = useState([]);
  const [email, setEmail] = useState('');
  const [roomName, setRoomName] = useState('');
  const [callStatus, setCallStatus] = useState(false);
  const [list, setList] = useState([]);
  const [latestUpdates, setlatestUpdates] = useState([]);
  const [purohitList, setPurohitList] = useState([]);
  const dispatch = useDispatch();
  const [completedStatus, setCompletedStatus] = useState(false);


  window.setInterval(function () {
    let date = new Date();
    let today = moment(new Date()).format('DD-MM-YYYY');
    let todayDay = today.split("-")[0];
    let todayMonth = today.split("-")[1];
    let todayYear = today.split("-")[2];
    (upcomingEventsDevotee && upcomingEventsDevotee.length > 0 ?
      upcomingEventsDevotee.forEach((item) => {

        // if (todayDay >= moment(item.requestedDate).format('DD-MM-YYYY').split("-")[0] &&
        //   todayMonth >= moment(item.requestedDate).format('DD-MM-YYYY').split("-")[1] &&
        //  todayYear >= moment(item.requestedDate).format('DD-MM-YYYY').split("-")[2] &&
        //   date.getHours() >= item.requestedTime.split(" ")[0].split("-")[1].split(":")[0] &&
        //   date.getMinutes() >= item.requestedTime.split(" ")[0].split("-")[1].split(":")[1] &&
        //   date.getSeconds() >= 0) {
        // updateAsCompleted(item._id)
        //     .then((resp) => {
        //       if (resp) {
        //         /* thankYouMail(item)
        //           .then((mail) => {
        //           })
        //           .catch((err) => {
        //             throw new Error(err);
        //           }); */
        //       }
        //     })
        //     .catch((error) => {
        //       throw new Error(error);
        //     });
        // }
        let requestTime = item.requestedTime.split("-")
        let requestTimeStartTimeHours = requestTime[0].split(":")[0];
        let requestTimeStartTimeMins = requestTime[0].split(":")[1];
        let requestTimeEndTimeHours = requestTime[1].split(" ")[0].split(":")[0];
        let requestTimeEndTimeMins = requestTime[1].split(" ")[0].split(":")[1];

        let currentTimeMilliseconds = moment().valueOf();
        let requestedTimeMilliseconds = item.requestedDate;
        const startTimeWithOutHours = new Date(requestedTimeMilliseconds).setHours(requestTimeStartTimeHours);
        const startTimeWithOutMinutes = new Date(startTimeWithOutHours).setMinutes(requestTimeStartTimeMins);
        const startTimeWithOutSeconds = new Date(startTimeWithOutMinutes).setSeconds(0);

        const endTimeWithOutHours = new Date(requestedTimeMilliseconds).setHours(requestTimeEndTimeHours);
        const endTimeWithOutMinutes = new Date(endTimeWithOutHours).setMinutes(requestTimeEndTimeMins);
        const endTimeWithOutSeconds = new Date(endTimeWithOutMinutes).setSeconds(0);

        if (currentTimeMilliseconds < startTimeWithOutSeconds) {
          item.isCancel = true;
        }
        else {
          item.isCancel = false;
        }

        if (currentTimeMilliseconds > endTimeWithOutSeconds) {
          item.isTimeCompleted = true;
        }
        else {
          item.isTimeCompleted = false;
        }
        if (today === moment(item.requestedDate).format('DD-MM-YYYY')) {

          if (date.getHours() == requestTimeStartTimeHours && date.getHours() == requestTimeEndTimeHours
            && date.getMinutes() >= requestTimeStartTimeMins && date.getMinutes() <= requestTimeEndTimeMins && item.status === "Accepted") {
            item.joinButton = true;
          } else if (date.getHours() == requestTimeStartTimeHours && date.getHours() < requestTimeEndTimeHours && date.getMinutes() >= requestTimeStartTimeMins && item.status === "Accepted") {
            item.joinButton = true;
          } else if (date.getHours() > requestTimeStartTimeHours && date.getHours() == requestTimeEndTimeHours && date.getMinutes() <= requestTimeEndTimeMins && item.status === "Accepted") {
            item.joinButton = true;
          } else {
            item.joinButton = false;
          }

        } else {
          item.joinButton = false;
        }
      }) : null);
    (purohitPujas && purohitPujas.length > 0 ?
      purohitPujas.forEach((item) => {


        if (today === moment(item.requestId.requestedDate).format('DD-MM-YYYY')) {

          let requestTime = item.requestId.requestedTime.split("-")
          let requestTimeStartTimeHours = requestTime[0].split(":")[0];
          let requestTimeStartTimeMins = requestTime[0].split(":")[1];
          let requestTimeEndTimeHours = requestTime[1].split(" ")[0].split(":")[0];
          let requestTimeEndTimeMins = requestTime[1].split(" ")[0].split(":")[1];

          let currentTimeMilliseconds = moment().valueOf();
          let requestedTimeMilliseconds = item.requestId.requestedDate;
          const startTimeWithOutHours = new Date(requestedTimeMilliseconds).setHours(requestTimeStartTimeHours);
          const startTimeWithOutMinutes = new Date(startTimeWithOutHours).setMinutes(requestTimeStartTimeMins);
          const startTimeWithOutSeconds = new Date(startTimeWithOutMinutes).setSeconds(0);

          const endTimeWithOutHours = new Date(requestedTimeMilliseconds).setHours(requestTimeEndTimeHours);
          const endTimeWithOutMinutes = new Date(endTimeWithOutHours).setMinutes(requestTimeEndTimeMins);
          const endTimeWithOutSeconds = new Date(endTimeWithOutMinutes).setSeconds(0);

          if (currentTimeMilliseconds > startTimeWithOutSeconds) {
            item.completeButton = true;
          }
          else {
            item.completeButton = false;
          }

          if (currentTimeMilliseconds > endTimeWithOutSeconds) {
            item.isTimeCompleted = true;
          }
          else {
            item.isTimeCompleted = false;
          }

          if (date.getHours() == requestTimeStartTimeHours && date.getHours() == requestTimeEndTimeHours
            && date.getMinutes() >= requestTimeStartTimeMins && date.getMinutes() <= requestTimeEndTimeMins && item.requestId.status === "Accepted") {
            item.joinButton = true;
            //item.completeButton = true;
          } else if (date.getHours() == requestTimeStartTimeHours && date.getHours() < requestTimeEndTimeHours && date.getMinutes() >= requestTimeStartTimeMins && item.requestId.status === "Accepted") {
            item.joinButton = true;
            //item.completeButton = true;
          } else if (date.getHours() > requestTimeStartTimeHours && date.getHours() == requestTimeEndTimeHours && date.getMinutes() <= requestTimeEndTimeMins && item.requestId.status === "Accepted") {
            item.joinButton = true;
            //item.completeButton = true;
          }
          else {
            item.joinButton = false;
            //item.completeButton = false;
          }
        } else {
          item.joinButton = false;
          //item.completeButton = false;
        }
      }) : null)
  }, 2000);

  const forward = () => {
    f7.dialog.alert('Forward');
  };
  const handleUpdateReq = (data, type, requestType) => {
    f7.preloader.show();
    const obj = {};
    let array = [];
    obj.notificationId = data.requestId._id;
    obj.type = type;
    let kit1 = ""; let kit2 = ""; let kit3 = ""; let kit4 = "";
    let kit = data.requestId.purohithServiceId ? data.requestId.purohithServiceId.ServiceKit.split(',') : null;
    if (kit && kit.length > 0) {
      kit1 = kit[0];
      kit2 = kit[1];
      kit3 = kit[2];
      kit4 = kit[3];
    }
    let mailDetails = {
      userName: data.requestId.devoteeId.firstName + " " + data.requestId.devoteeId.lastName,
      mail: data.requestId.devoteeId.email,
      purohithName: data.requestId.purohithName,
      requestedDate: data.requestId.date,
      requestedTime: data.requestId.requestedTime,
      serviceName: data.requestId.serviceName,
      kit1: kit1,
      kit2: kit2,
      kit3: kit3,
      kit4: kit4
    }
    if (type === 'Accepted') {
      if (requestType === 'TempleService') {
        templeAcceptEmail(mailDetails)
          .then((result) => {
            setEmail(result);
          })
          .catch((error) => {
            console.warn(error);
          });
      } else {
        acceptEmail(mailDetails)
          .then((result) => {
            setEmail(result);
          })
          .catch((error) => {
            console.warn(error);
          });
      }
    }
    else {
      rejectEmail(mailDetails)
        .then((result) => {
          setEmail(result);
        })
        .catch((error) => {
          console.warn(error);
        })
    }
    //f7.dialog.preloader();
    updateNotifRequest(obj)
      .then((resp) => {
        if (resp.status === 200) {
          getPurohitNotificationData();
        }

      })
      .catch((error) => {
        // toastr.error(error.message);
      });
    f7.preloader.hide();
  };

  const completedPuja = (data) => {
    let mailDetails = {
      userName: data.requestId.devoteeId.firstName + " " + data.requestId.devoteeId.lastName,
      mail: data.requestId.devoteeId.email,
      purohithName: data.requestId.purohithName,
      requestedDate: data.requestId.date,
      requestedTime: data.requestId.requestedTime,
      serviceName: data.requestId.serviceName,
    }
    f7.dialog.confirm(data.requestId.serviceName + ' ' + 'Pooja is completed', 'Completed Pooja', function () {
      updateAsCompleted(data.requestId._id).then((resp) => {
        if (resp) {
          thankYouMail(mailDetails)
            .then((result) => {
              setEmail(result);
            })
            .catch((error) => {
              console.warn(error);
            })
        }
        getPurohitNotificationData();

      });
    })
  };
  const updateUpcomingEventsShowData = (value) => {
    setUpcomingEventsShowData(value);
  };
  const updatelatestUpdateShowData = (value) => {
    setLatestUpdateShowData(value);
  };
  const updateRecentEventsShowData = (value) => {
    setRecentEventsShowData(value);
  };

  const getPurohitNotificationData = () => {
    let array = [];
    let purohitPujaData = [];
    f7.preloader.show();
    dispatch(getUserDetails(user.uid));
    getLoggedinUserDetails(user.uid).then((resp) => {
      setUserData(resp);
      if (resp && resp.role != 'devotee') {
        getPurohitNotifications(resp._id, resp.role)
          .then((respData) => {
            if (respData) {
              respData.forEach((x, index) => {
                let currentDate = new Date(moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })._d).getTime();
                if (x.requestId) {
                  if (x.requestId.requestedDate >= currentDate && x.requestId.status == "Requested") {
                    array.push(x);
                  }
                  if (x.requestId.requestedDate >= currentDate && x.requestId.status == "Accepted") {
                    purohitPujaData.push(x);
                  }

                }

              })
            }
            setPurohitPujas(purohitPujaData);
            setNotifications(array);
            f7.preloader.hide();
          });
      } else {
        let list = [];
        let recentEventArray = [];
        getTodayPurohitPuja(resp._id, resp.role)
          .then((resp) => {
            if (resp) {
              resp.forEach(element => {
                let currentDate = new Date(moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })._d).getTime();
                let req = moment(element.requestedDate).set({ hour: 0, minute: 0, second: 0, millisecond: 0 })._d;
                let date = new Date(req).getTime();
                if (date >= currentDate && (element.status == 'Accepted' || element.status == 'Requested')) {
                  list.push(element);
                }
                if (element.status == 'Completed') {
                  recentEventArray.push(element);
                }
              });
            }

            setUpcomingEventsDevotee(list.reverse());
            setRecentEventsDevotee(recentEventArray);
          });
        f7.preloader.hide();
      }
    });
  };
  const cancelPuja = (obj) => {

    f7.dialog.confirm('Do you want to cancel Puja?', 'Cancel Puja', function () {
      cancelService(obj._id, obj.status).then((resp) => {
        if (resp) {
          devoteeCancelMail(obj)
            .then((resp) => {

            })
            .catch((error) => {
              console.warn(error);
            })
          purohithCancelMail(obj)
            .then((resp) => {

            })
            .catch((error) => {
              console.warn(error);
            })
        }
        getPurohitNotificationData();

      });
    })
  };
  const purohithCancelPuja = (data) => {
    let mailDetails = {
      userName: data.requestId.devoteeId.firstName + " " + data.requestId.devoteeId.lastName,
      mail: data.requestId.devoteeId.email,
      purohithName: data.requestId.purohithName,
      requestedDate: data.requestId.date,
      requestedTime: data.requestId.requestedTime,
      serviceName: data.requestId.serviceName,
    }
    f7.dialog.confirm('Do you want to cancel Puja?', 'Cancel Puja', function () {
      purohithCancelService(data.requestId._id).then((resp) => {
        if (resp) {
          rejectEmail(mailDetails)
            .then((result) => {
              setEmail(result);
            })
            .catch((error) => {
              console.warn(error);
            })
        }
        getPurohitNotificationData();

      });
    })
  };

  const getKitDetails = (item) => {
    var splitData = item.purohithServiceId ? (item.purohithServiceId.ServiceKit ? item.purohithServiceId.ServiceKit.split(",") : null) : (item.templeServiceId.ServiceKit ? item.templeServiceId.ServiceKit.split(",") : null);
    setKitData(splitData);
  };

  useEffect(() => {
    if (user && user.uid) {
      getPurohitNotificationData();
      setInterval(() => {
        setCurrentTime(new Date().getTime());
      }, 1000);
    }
  }, [user.uid]);

  useEffect(() => {
    if (userData && userData._id)
      getTempleNames().then((resp) => {
        setList(resp);
      });
  }, [userData._id]);

  useEffect(() => {
    if (userData._id && list) {
      if (!latestUpdates.length) {
        getLatestUpdates();
      }
    }
  }, [list]);

  const getLatestUpdates = () => {
    let finalUpdates = [];
    getpurohitnames().then((respdata) => {
      setPurohitList(respdata);
      list.forEach((x) => {
        finalUpdates.push(x);
      })
      respdata.forEach((x) => {
        finalUpdates.push(x);
      })
      finalUpdates.sort(function (a, b) { return moment(b.createdAt).format('x') - moment(a.createdAt).format('x') });
      finalUpdates.forEach((x, index) => {
        if (index < 5)
          latestUpdates.push(x);
      })
    });
  }

  const handleClick = (event) => {
    event.preventDefault();
    window.location.reload();
  }

  const changeCallStatus = (status, value, completedTime, startJoin) => {
    // if (isMobile) {
    // f7.dialog.alert('Please join the event from your desktop while we get it to work for mobiles.', 'TelePuja', function () {

    // })
    // setCallStatus(status);
    // } 
    if (completedTime) {
      f7.dialog.alert('Your event has been completed. Need any help please contact support team.', function () {
      })
    }
    else if (value === false) {
      f7.dialog.alert('You can join this event on' + '<br> ' + startJoin, 'TelePuja', function () {
      })
    }
    else {
      var elem = document.getElementById("main-view");
      elem.scrollIntoView();
      setCallStatus(status);
    }
  }

  const navigateService = (item) => {
    item.requestType = "TempleService";
    item.service = "home";
    // item.serviceTokens="3000"
    props.f7router.navigate('/services/' + item._id, { props: { details: item } });
  }
  const donateTokens = (item, requestType, request) => {
    if (requestType === "callToAction") {
      item.requestType = "callToAction";
    }
    item.request = request;
    // item.requestType = "TempleService";
    props.f7router.navigate('/donation/', { props: { donate: item } });
  }

  return (
    <Page name="home" className="color-deeporange custom-bg padding-top">
      {/* Top Navbar */}
      <div>
        <Navbar className="header-bg navbar-position">
          <NavLeft>
            <Link href='/home/'>
              <img className="logoimage" src={logo} width="60" onClick={handleClick}></img>
            </Link>
          </NavLeft>
        </Navbar>
      </div>
      <Toolbar tabbar tabbar-labels bottom className="custom-tabbar">
        <div className="toolbar-inner">
          <Link className="tab-link tab-outer tab-link-active bottom-nav-icon" iconMd="material:home" iconIos="material:home" href="">
            <span className="tabbar-label bottom-nav-text">Home</span>
          </Link>
          {userData.role == 'devotee' ? <Link className="tab-link tab-outer bottom-nav-icon" href="/temples/">
            <img src={temple} width="30"></img>
            <span className="tabbar-label bottom-nav-text">Temples</span>
          </Link> : null}
          {userData.role == 'devotee' ? <Link className="tab-link tab-outer bottom-nav-icon" href="/purohits/">
            <img src={purohit} width="30"></img>
            <span className="tabbar-label bottom-nav-text">Purohits</span>
          </Link> : null}
          {userData.role == 'devotee' ? <Link className="tab-link tab-outer bottom-nav-icon" iconMd="material:favorite_border" iconIos="material:favorite_border" style={{ 'color': '#fff' }} href="/favouritesPage/">
            <span className="tabbar-label bottom-nav-text">Favorites</span>
          </Link> : null}
        </div>
      </Toolbar>
      {/* sidenavbar */}

      <SideBar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />

      {/* content */}
      {
        callStatus ?
          <Row className="justify-content-flex-end display-flex" style={{ 'margin': '5px' }}>
            <button className={"col button button-fill button-round text-color-white"} raised style={{ 'right': '5px', 'top': '-3px', 'width': '50px', 'height': '50px', 'backgroundColor': '#000', 'margin': '1px 4px 0px 4px' }} onClick={() => { changeCallStatus(false, true, false, ''); }}>X</button>
            <VideoConference roomName={roomName} />
          </Row> :
          list && list.length > 0 && userData.role == 'devotee' ? (
            <Swiper scrollbar autoplay={{ delay: 3000 }} className="home-swiper">
              {list.map((item, i) => (
                <SwiperSlide className="home-slider" >
                  <img src={item.Image_URL[0].url} style={{ zIndex: '1', width: '100%', height: '100%' }} onClick={() => navigateService(item)} >
                  </img>
                  <div style={{ position: "absolute", top: "0", padding: "10px" }}>
                    <div style={{ fontSize: "20px", padding: "5px", fontWeight: "600", backgroundColor: "#f27d0d", borderRadius: "5px", color: 'white', display: "flex" }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: "18px", color: '#ff8c00', fontWeight: "600", paddingTop: "5px", display: "flex" }}>
                      {item.city.name + "," + item.state.name + "," + item.country.name}
                    </div>
                    {item.defaultService ?
                      <div onClick={() => navigateService(item)}><button style={{ width: "auto", margin: "10px 0px" }} className="col button button-fill button-round color-green text-color-white">{item.defaultService}</button>
                      </div> : null}
                    <Button style={{ width: "100px" }} className="col button button-fill button-round color-yello text-color-white" onClick={() => donateTokens(item, "callToAction", "donate")}>Donate</Button>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : null
      }
      {userData.role == 'devotee' ? <BlockTitle className="card-badge">Latest Updates</BlockTitle> : null}
      {
        userData.role == 'devotee' ? <Card className="home-card" style={{ minheight: '250px', overflowY: 'hidden' }}>
          <CardContent padding={false}>
            <List mediaList className="list-homepage" >

              {latestUpdates && latestUpdates.length > 0 ?
                latestUpdates.map((item, index) => (
                  (index < 2) || latestUpdateShowData ?
                    <Block >

                      <Row style={{ 'borderBottom': ' 0.5px solid #ccc', paddingTop: '7px' }}>
                        <Col>
                          <Row className="justify-content-start display-flex" >
                            <Link href="#" className="link-data" style={{ 'margin': '1px' }}>{item.name ? item.name : (item.firstName + item.lastName)}</Link>
                            {item.templeservices ? < p style={{ 'margin': '1px' }}>onboarded to TelePuja</p> : <p style={{ 'margin': '1px' }}>joined TelePuja</p>}
                          </Row>
                          {/* <p style={{ 'margin': '1px' }}>{item.name ? item.name : (item.firstName + item.lastName)}</p> */}
                          <p style={{ 'fontSize': '11px', 'margin': '1px' }}>{item.name ? item.city.name + ', ' + item.state.name + ', ' + item.country.name + ' ' : (item.city.name + ', ' + item.state.name + ', ' + item.country.name + ' ')}</p>
                          <p style={{ 'fontSize': '11px', 'margin': '1px' }}>{(moment(item.createdAt).format("ddd DD-MMM-YY"))}</p>
                        </Col>
                      </Row>

                    </Block> : null
                ))
                : <List>
                  <ListItem
                    title="No Events" style={{ paddingTop: '15px' }}>
                  </ListItem>
                </List>
              }
            </List>
            {!latestUpdateShowData && latestUpdates.length > 2 ?
              <Row className="justify-content-start display-flex" style={{ padding: "5px" }}>
                <p style={
                  { 'margin': '5px 0em 0px 1em', 'color': 'Blue', 'fontSize': '12px', 'fontWeight': '700', 'cursor': 'pointer' }} onClick={() => updatelatestUpdateShowData(!latestUpdateShowData)}>Show More  </p>
                <i className="material-icons md-only display-flex" style={{ 'marginTop': '3px', 'color': 'blue' }}>arrow_drop_down</i>
              </Row> : null}
            {latestUpdateShowData && latestUpdates.length > 2 ?
              <Row className="justify-content-start display-flex" style={{ padding: "5px" }}>
                <p style={{ 'margin': '5px 0em 0px 1em', 'color': 'Blue', 'fontSize': '12px', 'fontWeight': '700', 'cursor': 'pointer' }} onClick={() => updatelatestUpdateShowData(!latestUpdateShowData)}>Show Less  </p>
                <i className="material-icons md-only display-flex" style={{ 'marginTop': '2px', 'color': 'blue' }}>arrow_drop_up</i>
              </Row> : null}

          </CardContent>
        </Card> : null
      }
      {userData.role == 'devotee' ? <BlockTitle className="card-badge">Upcoming Events</BlockTitle> : null}
      {
        userData.role == 'devotee' ? <Card className="home-card" style={{ minheight: '250px', overflowY: 'hidden' }}>
          <CardContent padding={false}>
            <List mediaList className="list-homepage" style={{ objectFit: 'cover', overflowY: 'auto', }}>
              {upcomingEventsDevotee && upcomingEventsDevotee.length > 0 ?
                upcomingEventsDevotee.map((item, index) => (
                  (index < 2) || upcomingEventsShowData ?
                    <Block >
                      <Row style={{ 'borderBottom': ' 0.5px solid #ccc', paddingTop: '7px' }}>
                        <Col>
                          <Row className="justify-content-start display-flex">
                            <p style={{ 'margin': '1px', 'fontSize': '15px' }}>{item.purohithServiceId ? item.purohithServiceId.name : item.templeServiceId.name}</p><p style={{ 'margin': '1px', 'fontSize': '15px' }}>{item.requestType == "PurohithService" ? (" by " + item.purohithName) : "at " + item.purohithName} </p>
                          </Row>
                          <Col>
                            <p style={{ 'fontSize': '11px', 'margin': '1px' }}>{item.templeId ? item.templeId.address : item.purohithId.address}</p>
                            <p style={{ 'fontSize': '11px', 'margin': '1px' }}>{(moment(item.requestedDate).format("ddd DD-MMM-YY"))}</p>
                            <p style={{ 'fontSize': '11px', 'margin': '1px' }}>{item.requestedTime}</p>
                            {item.status == 'Requested' ?
                              <p style={{ 'fontSize': '12px', 'color': '#b568a0', 'margin': '1px 4px 0px 4px' }}>Pending Confirmation</p>
                              : null}

                          </Col>


                        </Col>
                        <Row style={{ 'margin': '10px 0px' }} className="justify-content-start display-flex">
                          {item.requestType == "PurohithService" && item.status == 'Accepted' ? <Link popoverOpen=".popover-menu" onClick={() => getKitDetails(item)}><span title="Puja Kit"><Icon className="material-icons md-only" style={{ 'fontSize': '27px', 'marginTop': '3px' }} >info</Icon> </span></Link> : null}
                          <button title="Join Puja" className={"col button button-fill button-round text-color-white bg-green"} raised style={{ 'width': '80px', 'height': '30px', 'margin': '1px 4px 0px 4px' }}
                            onClick={() => { changeCallStatus(true, item.joinButton, item.isTimeCompleted, (moment(item.requestedDate).format("ddd DD-MMM-YY")) + " at" + " " + item.requestedTime); setRoomName(item.meetingId) }}>Join</button>
                          {item.isCancel ? <button title="Cancel Puja" className={"col button button-fill button-round text-color-white"} raised style={{ 'width': '80px', 'height': '30px', 'backgroundColor': '#f05929', 'margin': '1px 4px 4px 4px' }} onClick={() => cancelPuja(item)}>Cancel</button> : null}

                          {item.requestType === "PurohithService" && item.status == 'Accepted' ?
                            <button title="Dakshina" className={"col button button-fill button-round text-color-white"} raised style={{ 'width': '100px', 'height': '30px', 'margin': '1px 4px 4px 4px' }} onClick={() => donateTokens(item, item.requestType, "dakshina")}>Dakshina</button>
                            : null}
                          {item.requestType === "TempleService" && item.status == 'Accepted' ?
                            <button title="Donate" className={"col button button-fill button-round text-color-white"} raised style={{ 'width': '100px', 'height': '30px', 'margin': '1px 4px 4px 4px' }} onClick={() => donateTokens(item, item.requestType, "donate")}>Donate</button>
                            : null}
                        </Row>
                      </Row>
                    </Block> : null
                ))
                : <List>
                  <ListItem
                    title="No Events" style={{ paddingTop: '15px' }}>
                  </ListItem>
                </List>
              }
            </List>
            {!upcomingEventsShowData && upcomingEventsDevotee.length > 2 ?
              <Row className="justify-content-start display-flex" style={{ padding: "5px" }} >
                <p style={{ 'margin': '5px 0em 0px 1em', 'color': 'Blue', 'fontSize': '12px', 'fontWeight': '700', cursor: 'pointer' }} onClick={() => updateUpcomingEventsShowData(!upcomingEventsShowData)}>Show More  </p>
                <i className="material-icons md-only display-flex" style={{ 'marginTop': '3px', 'color': 'blue' }}>arrow_drop_down</i>
              </Row> : null}

            {upcomingEventsShowData && upcomingEventsDevotee.length > 2 ?
              <Row className="justify-content-start display-flex" style={{ padding: "5px" }}>
                <p style={{ 'margin': '5px 0em 0px 1em', 'color': 'Blue', 'fontSize': '12px', 'fontWeight': '700', cursor: 'pointer' }} onClick={() => updateUpcomingEventsShowData(!upcomingEventsShowData)}>Show Less </p>
                <i className="material-icons md-only display-flex" style={{ 'marginTop': '2px', 'color': 'blue' }}>arrow_drop_up</i>
              </Row> : null}

          </CardContent>
        </Card> : null
      }
      {userData.role == 'devotee' ? <BlockTitle className="card-badge">Recent Events</BlockTitle> : null}
      {
        userData.role == 'devotee' ? <Card className="home-card" style={{ minheight: '250px', overflowY: 'hidden' }}>
          <CardContent padding={false}>
            <List mediaList className="list-homepage">

              {recentEventsDevotee && recentEventsDevotee.length > 0 ?
                recentEventsDevotee.map((item, index) => (
                  (index < 2) || recentEventsShowData ?
                    <Block>
                      <Row style={{ 'borderBottom': ' 0.5px solid #ccc', paddingTop: '7px' }}>
                        <Col>
                          <Row className="justify-content-start display-flex">
                            <p style={{ 'margin': '1px', 'fontSize': '15px' }}>{item.purohithServiceId ? item.purohithServiceId.name : item.templeServiceId.name}</p><p style={{ 'margin': '1px', 'fontSize': '15px' }}>{item.requestType == "PurohithService" ? (" by " + item.purohithName) : "at " + item.purohithName} </p>
                          </Row>
                          <Col >
                            <p style={{ 'fontSize': '11px', 'margin': '1px' }}>{item.templeId ? item.templeId.address : item.purohithId.address}</p>
                            <p style={{ 'fontSize': '11px', 'margin': '1px' }}>{(moment(item.requestedDate).format("ddd DD-MMM-YY"))}</p>
                            <p style={{ 'fontSize': '11px', 'margin': '1px' }}>{item.requestedTime}</p>

                          </Col>
                        </Col>

                        <Row className="justify-content-center display-flex" style={{ 'marginTop': '5px' }}>
                          {item.requestType === "PurohithService" ?
                            <button title="Dakshina" className={"col button button-fill button-round text-color-white"} raised style={{ 'width': '100px', 'height': '30px', 'margin': '1px' }} onClick={() => donateTokens(item, item.requestType, "dakshina")}>Dakshina</button>
                            : null}
                          {item.requestType === "TempleService" ?
                            <button title="Donate" className={"col button button-fill button-round text-color-white"} raised style={{ 'width': '100px', 'height': '30px', 'margin': '1px' }} onClick={() => donateTokens(item, item.requestType, "donate")}>Donate</button>
                            : null}
                        </Row>
                      </Row>

                    </Block> : null
                ))

                : <List>
                  <ListItem
                    title="No Events" style={{ 'paddingTop': '15px' }}>
                  </ListItem>
                </List>
              }
            </List>
            {!recentEventsShowData && recentEventsDevotee.length > 2 ?
              <Row className="justify-content-start display-flex" style={{ paddingTop: "7px" }}>
                <p style={{ 'margin': '5px 0em 0px 1em', 'color': 'Blue', 'fontSize': '12px', 'fontWeight': '700', 'cursor': 'pointer' }} onClick={() => updateRecentEventsShowData(!recentEventsShowData)}>Show More  </p>
                <i class="material-icons md-only display-flex" style={{ 'marginTop': '3px', 'color': 'blue' }}>arrow_drop_down</i>
              </Row> : null}
            {recentEventsShowData && recentEventsDevotee.length > 2 ?
              <Row className="justify-content-start display-flex" style={{ padding: "5px" }}>
                <p style={{ 'margin': '5px 0em 0px 1em', 'color': 'Blue', 'fontSize': '12px', 'fontWeight': '700', 'cursor': 'pointer' }} onClick={() => updateRecentEventsShowData(!recentEventsShowData)}>Show Less  </p>
                <i class="material-icons md-only display-flex" style={{ 'marginTop': '2px', 'color': 'blue' }}>arrow_drop_up</i>
              </Row> : null}

          </CardContent>
        </Card> : null
      }
      {(userData.role == 'purohit' || userData.role == 'temple') ? <BlockTitle className="card-badge">Devotee Request</BlockTitle> : null}
      {
        (userData.role == 'purohit' || userData.role == 'temple') ? <Card className="home-card" style={{ 'maxHeight': 'none', }}>
          <CardContent padding={false}>
            {notifications && notifications.length > 0 ? (
              notifications.map((item, index) => (
                item.requestId.status == 'Requested' ?
                  (<Block>
                    <Block strong className="justify-content-space-between display-flex">
                      <Col>
                        <Row >
                          <p className="strong" style={{ 'font-weight': '700', 'margin': '2px' }}> Name: </p> <p style={{ 'margin': '2px' }}>{item.requestId.devoteeId.firstName} {item.requestId.devoteeId.lastName}</p>
                        </Row>
                        <Row >
                          <p className="strong" style={{ 'font-weight': '700', 'margin': '2px' }}> Puja: </p> <p style={{ 'margin': '2px' }}>{(item.requestId.templeServiceId && item.requestId.templeServiceId.name) ? item.requestId.templeServiceId.name : item.requestId.purohithServiceId.name}</p>
                        </Row>
                        {/* <Row >
                    <p className="strong" style={{'font-weight': '700', 'margin': '2px' }}> Email: </p> <p style={{  'margin': '2px' }}>{notifications[index].requestId.devoteeId.email}</p>
                  </Row> */}
                        <Row>
                          <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px' }}> Date: </p> <p style={{ 'margin': '2px' }}>{" " + moment(item.requestId.requestedDate).format("ddd DD-MMM-YY")}{" "}</p>
                        </Row>
                        <Row>
                          <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px' }}> Timings: </p> <p style={{ 'margin': '2px' }}>{" " + item.requestId.requestedTime} {" "}</p>
                        </Row>
                        <Row >
                          <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px' }}> Tokens: </p> <p style={{ 'margin': '2px' }}>{item.requestId.tokens}</p>
                        </Row>
                      </Col>
                      <Row className="justify-content-center display-flex" style={{ margin: "10px 0px" }}>
                        {item.requestId.requestType === 'TempleService' ?
                          <Button fill round style={{ 'width': '100px', 'backgroundColor': '#f27d0d', 'margin': '2px' }} onClick={() => handleUpdateReq(item, 'Accepted', 'TempleService')}>
                            Accept
                          </Button>
                          :
                          <Button fill round style={{ 'width': '100px', 'backgroundColor': '#f27d0d', 'margin': '2px' }} onClick={() => handleUpdateReq(item, 'Accepted', 'PurohithService')}>
                            Accept
                          </Button>}

                        <Button fill round style={{ 'width': '100px', 'backgroundColor': '#b568a0', 'margin': '2px' }} onClick={() => handleUpdateReq(item, 'Rejected')}>
                          Decline
                        </Button>
                      </Row>
                    </Block>

                  </Block>) : (
                    <List>
                      <ListItem
                        title="No Requests" style={{ paddingTop: '15px' }}>

                      </ListItem>
                    </List>
                  )

              ))) : (
              <List>
                <ListItem
                  title="No Requests">
                </ListItem>
              </List>
            )}
          </CardContent>
        </Card> : null
      }
      {(userData.role == 'purohit' || userData.role == 'temple') ? <BlockTitle className="card-badge">My Pujas</BlockTitle> : null}
      {
        (userData.role == 'purohit' || userData.role == 'temple') ? <Card className="home-card" style={{ 'maxHeight': 'none', }}>
          <CardContent padding={false} style={{ 'marginTop': '10px' }}>
            {purohitPujas && purohitPujas.length > 0 ? (
              purohitPujas.map((item, index) => (
                item.requestId.status == 'Accepted' ?
                  (<Block>
                    {/* <ListItem>{notifications[index].requestId.devoteeId.firstName}{index}</ListItem> */}

                    {/* <ListItem>{item.requestId.tokens}</ListItem>  */}
                    <Block strong className="justify-content-space-between display-flex">
                      <Col>
                        <Row >
                          <p className="strong" style={{ 'font-weight': '700', 'margin': '2px' }}> Name: </p> <p style={{ 'margin': '2px' }}>{item.requestId.devoteeId.firstName} {item.requestId.devoteeId.lastName}</p>
                        </Row>
                        <Row >
                          <p className="strong" style={{ 'font-weight': '700', 'margin': '2px' }}> Puja: </p> <p style={{ 'margin': '2px' }}>{(item.requestId.templeServiceId && item.requestId.templeServiceId.name) ? item.requestId.templeServiceId.name : item.requestId.purohithServiceId.name}</p>
                        </Row>
                        {/* <Row >
                    <p className="strong" style={{'font-weight': '700', 'margin': '2px' }}> Email: </p> <p style={{  'margin': '2px' }}>{notifications[index].requestId.devoteeId.email}</p>
                  </Row> */}
                        <Row>
                          <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px' }}> Date: </p> <p style={{ 'margin': '2px' }}>{" " + moment(item.requestId.requestedDate).format("ddd DD-MMM-YY")}{" "}</p>
                        </Row>
                        <Row>
                          <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px' }}> Timings: </p> <p style={{ 'margin': '2px' }}>{" " + item.requestId.requestedTime}{" "}</p>
                        </Row>
                        <Row >
                          <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px' }}> Tokens: </p> <p style={{ 'margin': '2px' }}>{item.requestId.tokens}</p>
                        </Row>
                      </Col>
                      <Row className="justify-content-center display-flex">
                        <Button fill className="bg-green" round style={{ 'width': '100px', 'margin': '2px' }} onClick={() => { changeCallStatus(true, item.joinButton, item.isTimeCompleted, (moment(item.requestId.requestedDate).format("ddd DD-MMM-YY")) + " at" + "  " + item.requestId.requestedTime); setRoomName(item.requestId.meetingId) }}>
                          Join
                        </Button>
                        {item.completeButton ?
                          <Button fill round style={{ 'width': '100px', 'margin': '2px', 'backgroundColor': ' #77B300' }} onClick={() => completedPuja(item)}>
                            Complete
                          </Button> : null}
                        {!item.completeButton ? <Button fill round style={{ 'width': '100px', 'backgroundColor': '#f05929', 'margin': '2px' }} onClick={() => purohithCancelPuja(item)}>
                          Cancel
                        </Button> : null}

                      </Row>
                    </Block>

                  </Block>) : (
                    <List>
                      <ListItem
                        title="No Requests">

                      </ListItem>
                    </List>
                  )

              ))) : (
              <List>
                <ListItem
                  title="No Pujas">
                </ListItem>
              </List>
            )}
          </CardContent>
        </Card> : null
      }
      <Popover className="popover-menu">
        <Block className="tooltip-info">

          <ul>
            {kitData && kitData.length > 0 ?
              kitData.map((item) => (
                <li>{item}</li>
              ))
              : null}
          </ul>
        </Block>


      </Popover>
    </Page >
  );
};

export default HomePage;