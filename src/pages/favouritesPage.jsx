import React, { useState, useEffect, useContext } from 'react';
import logo from '../assets/img/logo.png';
import logogrey from '../assets/img/logogrey.png';
import toastr from 'toastr';
import temple from '../assets/img/temple.png';
import purohit from '../assets/img/purohit.png';
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
import loggedInUser from '../js/userdetails';
import { getLoggedinUserDetails, getTempleNames, getpurohitnames, readFavourite, removeFavourite, removeAllFavourites }
  from "../utils/api";
import { useDispatch, useSelector } from 'react-redux';
import { deleteAllFavouites, deleteFavouites, readFavourites } from '../store/actions/favourite';
import { purohithNames, templeNames } from '../store/actions/helpers';

const FavouritePage = (props) => {
  const [templesList, setTempleList] = useState([]);
  const [purohithList, setPurohithList] = useState([]);
  const [favouriteList, setFavouriteList] = useState([]);
  const dispatch = useDispatch();

  const userData = useSelector((state => state && state.auth && state.auth.userDetails));
  const temples = useSelector((state => state && state.helpers && state.helpers.temples));
  const purohiths = useSelector((state => state && state.helpers && state.helpers.purohiths));
  useEffect(() => {
    f7.preloader.show();
    if (userData && userData._id) {
      dispatch(readFavourites(userData._id));
      setTimeout(() => {
        f7.preloader.hide();
      }, 2000);
     
    }
  }, [userData && userData._id]);
  
  useEffect(() => {
    if (userData && userData._id) {
      dispatch(templeNames());
    }
  }, [userData && userData._id]);

  useEffect(() => {
    if (userData && userData._id) {
      dispatch(purohithNames());
    }
  }, [userData && userData._id]);



  const favourites = useSelector((state => state && state.favourite && state.favourite.favourites));


  const navigateToServive = (item) => {
    if (item.role === 'temple') {
      console.log(templesList);
      temples.forEach((temple) => {
        if (temple._id === item.favouriteId) {
          temple.requestType = "TempleService";
          temple.donate = "Donate";
          temple.service = "temple";
          props.f7router.navigate('/services/' + temple._id, { props: { details: temple } });
        }
      });
    }
    else {
      purohiths.forEach((purohith) => {
        if (purohith._id === item.favouriteId) {
          purohith.requestType = "PurohithService";
          purohith.donate = "Dakshina";
          props.f7router.navigate('/services/' + purohith._id, { props: { details: purohith } });
        }
      });
    }
  }
  //remove all fav
  const removeAllFav = (userData) => {
    if (userData && userData._id) {
      f7.dialog.confirm('Are you sure you want to remove all the Favourites ', function () {
        dispatch(deleteAllFavouites(userData._id));
      });
    }
  }
  //delete Favourite
  const deleteFavourite = (favourite) => {
    if (favourite && favourite._id) {
      f7.dialog.confirm('Are you sure you want to remove' + ' ' + favourite.name + ' ' + 'from Favourites', function () {
        /* removeFavourite(favourite._id)
          .then((resp) => {
            if (resp) {
              favouriteListData();
              
            }
          })
          .catch((err) => {
            throw new Error(err);
          }); */
        dispatch(deleteFavouites(favourite._id));
        toastr.success('Removed' + ' ' + favourite.name + ' ' + 'from Favourite List')
      });
    }
  }
  return (
    <Page name="favourite" className="color-deeporange custom-bg padding-top" style={{ overflowX: 'hidden' }}>
      <div>
        <Navbar className="header-bg navbar-position">
          <NavLeft>
            <Link href='/home/'>
              <img className="logoimage" src={logo} width="60"></img>
            </Link>
          </NavLeft>
          <NavTitle style={{ color: 'white' }}>Favourites</NavTitle>
        </Navbar>
      </div>
      <Toolbar tabbar tabbar-labels bottom className="custom-tabbar">
        <div className="toolbar-inner">
          <Link className="tab-link tab-outer bottom-nav-icon" iconMd="material:home" iconIos="material:home" href="/home/">
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
          {userData.role == 'devotee' ? <Link className="tab-link tab-outer tab-link-active bottom-nav-icon" iconMd="material:favorite_border" iconIos="material:favorite_border" style={{ 'color': '#fff' }} href="/favouritesPage/">
            <span className="tabbar-label bottom-nav-text">Favorites</span>
          </Link> : null}
        </div>
      </Toolbar>
      <SideBar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />
      <Block style={{ margin: '10px 0px' }}>
        {favourites && favourites.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ fontSize: '18px', fontWeight: '600', color: 'red', cursor: 'pointer' }} onClick={() => removeAllFav(userData)}>Remove All
               </div>
          </div>)}
        <Row className="justify-content-space-around" >
          {favourites && favourites.length > 0 ? (
            (favourites.map((item, i) => (
              <Card style={{ minHeight: '250px', width: '320px' }}>
                <div className="close-icon" style={{ 'float': "right", }} onClick={() => deleteFavourite(item)}>
                  <Icon style={{ 'color': 'red', 'fontSize': '22px', cursor: 'pointer' }} material="highlight_off"></Icon>
                </div>
                { item.image && item.image.length > 0 ?
                  <Swiper scrollbar autoplay={{ delay: 3000 }} onClick={() => navigateToServive(item)} style={{ width: '300px', height: '240px' }} >
                    {item.image && item.image.length > 0 ?
                      item.image.map((pic, i) =>
                        <SwiperSlide className="home-slider" >
                          <img
                            src={pic.url}
                            width="300"
                            height="240"
                          />
                        </SwiperSlide>
                      ) :
                      <SwiperSlide className="home-slider" >
                        <img
                          src={logogrey}
                          width="300"
                          height="240"
                        />
                      </SwiperSlide>}
                  </Swiper> :
                  <Swiper className="home-swiper" style={{ width: '300px', height: '240px' }} >
                    <SwiperSlide className="home-slider">
                      <img
                        src={item.Image && item.image.length > 0 ? item.image.url : logogrey}
                        width="230"
                        height="170"
                      />
                    </SwiperSlide>
                  </Swiper>
                }
                <Block style={{ padding: '10px', fontSize: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>{item.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>{item.address}</div>
                </Block>
              </Card>
            )))) : (

            <Block className="display-flex justify-content-center background-color" style={{ 'margin': '0px' }}>
              <Block style={{ 'marginTop': '15px' }}>
                <Row className="justify-content-center" style={{ margin: '0px' }} >
                  <Icon style={{ fontSize: '50px', color: 'red' }} material="favorite_border"></Icon>
                </Row>
                <Row className="justify-content-center" style={{ margin: '0px' }}>
                  <h3 style={{ margin: '0px' }}>No Favourites as yet</h3>
                </Row>
                <Row className="justify-content-center" style={{ 'margin': '20px' }}>
                  <Button style={{ 'width': '150px', 'border': '1px solid' }} href='/temples/'>Select temple</Button>
                </Row>
                <Row className="justify-content-center" style={{ 'margin': '20px' }}>
                  <Button href='/purohits/' style={{ 'width': '150px', 'border': '1px solid' }}>Select purohit</Button>
                </Row>
              </Block>
            </Block>
          )}
        </Row>
      </Block>
    </Page>
  )
}
export default FavouritePage;