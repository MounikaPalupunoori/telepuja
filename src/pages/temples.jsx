import React, { useState, useEffect, useContext } from "react";
import logo from '../assets/img/logo.png';
import coin from '../assets/img/coin.png';
import logogrey from '../assets/img/logogrey.png';
import Avatar from "../assets/img/avatar.jpg";
import purohit from '../assets/img/purohit.png';
import temple from '../assets/img/temple.png';
import SideBar from "./sidenav";
import {
  f7,
  Preloader,
  Col,
  Searchbar,
  theme,
  Toolbar,
  Navbar,
  Popup,
  Page,
  NavLeft,
  NavRight,
  NavTitle,
  Link,
  Block,
  List,
  Icon,
  ListInput,
  ListItem,
  Button,
} from "framework7-react";
import toastr from 'toastr';
import {
  getTempleNames, getLoggedinUserDetails, makeFavourite, readFavourite, removeFavourite
} from "../utils/api";
import loggedInUser from '../js/userdetails';
import { useDispatch, useSelector } from "react-redux";
import { createFavourites, deleteFavouites, readFavourites } from "../store/actions/favourite";
import userDetails from "../js/user_details";
// import Navbar from'../pages/navbar.jsx';


const TemplesList = (props) => {
  const [list, setList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [favouriteList, setFavouriteList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [seachClear, setSeachClear] = useState(false);
  const [isToolbar, setToolbar] = useState(true);
  const dispatch = useDispatch();

  const userData = useSelector((state => state && state.auth && state.auth.userDetails));
  useEffect(() => {
    f7.preloader.show();
    if (userData && userData._id) {
      getTempleNames().then((resp) => {
        setList(resp);
        setFilterList(resp);
        f7.preloader.hide();
      });
    }
  }, [userData && userData._id]);

  const favourites = useSelector((state => state && state.favourite && state.favourite.favourites));
  useEffect(() => {
    if (dispatch && userData && userData._id) {
      dispatch(readFavourites(userData._id));
    }
  }, [userData && userData._id]);


  //filter
  const filterTemples = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value == "") {
      setSeachClear(false);
    }
    else {
      setSeachClear(true);
    }
    if (event.target.value == "" && window.innerWidth <= 450) {
      setToolbar(false);
    }
    else {
      setToolbar(true);
    }
    let newList = filterList;
    let filtered_list = newList.map(temples => {
      let templeServices = (temples.templeservices.map(temple => { return temple['name'] })).toString();
      if (temples.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
        temples.country.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
        temples.state.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
        temples.city.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
        temples.address.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
        templeServices.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
        return temples;
      } else {
        return;
      }
    }).filter(x => x);
    if (filtered_list.length == 0) {
      setList([]);
    } else {
      setList(filtered_list);
    }
  }

  const showServices = (item) => {
    item.requestType = "TempleService";
    item.donate = "Donate";
    item.service = "temple";
    props.f7router.navigate('/services/' + item._id, { props: { details: item } });
  };

  //clearSearch
  const clearSearch = (event) => {
    setSearchTerm('');
    setSeachClear(false);
    event.preventDefault();
    setList(filterList);
  }

  //updatefav
  const updateFavourite = (item, e) => {
    e.stopPropagation();
    let obj = {};
    obj.devoteeId = userData._id;
    obj.favouriteId = item._id;
    obj.name = item.name;
    obj.image = item.Image_URL;
    obj.address = item.city.name + ',' + item.state.name + ',' + item.country.name;
    obj.role = "temple";
    dispatch(createFavourites(obj));
    toastr.success('Added to Favourites List');
  }

  //deletefav
  const deleteFavourite = (favourite, e) => {
    e.stopPropagation();
    if (favourite && favourite._id) {
      dispatch(deleteFavouites(favourite._id));
      toastr.success('Removed' + ' ' + favourite.name + ' ' + 'from Favourite List');
    }
  }

  const hideToolbar = () => {
    if (window.innerWidth <= 450) {
      setToolbar(false);
    }
    else {
      setToolbar(true);
    }
  }
  
  return (
    <Page name="Temples" className="color-deeporange custom-bg padding-top">
      <div>
        <Navbar className="header-bg navbar-position">
          <NavLeft>
            <Link href='/home/'>
              <img className="logoimage" src={logo} width="60" ></img>
            </Link>
          </NavLeft>
          <NavTitle style={{ color: 'white' }}>Temples</NavTitle>
        </Navbar>
      </div>
      <SideBar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />
      <div>
        <Searchbar
          clearButton={false}
          disableButton={false}
          placeholder="Search Temple or Service.."
          onChange={(event) => filterTemples(event)}
          onFocus={() => hideToolbar()}
          value={searchTerm}>
          {seachClear && <span onClick={(event) => clearSearch(event)}>
            <Icon className="clearSearch" material="close"></Icon></span>}
        </Searchbar>
      </div>
      {isToolbar &&
        <Toolbar tabbar tabbar-labels bottom className="custom-tabbar">
          <div className="toolbar-inner">
            <Link className="tab-link tab-outer bottom-nav-icon" iconMd="material:home" iconIos="material:home" href="/home/">
              <span className="tabbar-label bottom-nav-text">Home</span>
            </Link>
            <Link className="tab-link tab-outer tab-link-active bottom-nav-icon" href="/temples/">
              <img src={temple} width="30"></img>
              <span className="tabbar-label bottom-nav-text">Temples</span>
            </Link>
            <Link className="tab-link tab-outer bottom-nav-icon" href="/purohits/">
              <img src={purohit} width="30"></img>
              <span className="tabbar-label bottom-nav-text">Purohits</span>
            </Link>
            <Link className="tab-link tab-outer bottom-nav-icon" iconMd="material:favorite_border" iconIos="material:favorite_border" style={{ 'color': '#fff' }} href="/favouritesPage/">
              <span className="tabbar-label bottom-nav-text">Favorites</span>
            </Link>
          </div>
        </Toolbar>}
      {list.length > 0 ? (
        <List mediaList className="temple-list">
          {list && list.length > 0 ? (
            list.sort((a, b) => a.name > b.name ? 1 : -1).map((item, i) => (
              <ListItem
                key={i}
                className="temple-item cursor-pointer"
                title={item.name}
                subtitle={item.city.name + "," + item.state.name + "," + item.country.name}
                onClick={() => showServices(item)}
              // after={<Icon style={{ 'color': 'red', 'fontSize': '22px' }} onClick={updateFavourite}material=" favorite_border"></Icon>}
              >
                <img
                  slot="media"
                  src={item.Image_URL[0] ? item.Image_URL[0].url : logogrey}
                  width="65"
                  height="55"
                  className="temple-image"
                />

                <div onClick={(event) => updateFavourite(item, event)} style={{ 'float': "right", padding: '5px', marginTop: '-45px', backgroundColor: '#f5f5ef', borderRadius: '50%' }}>
                  <span style={{ cursor: 'pointer' }}>
                    <Icon style={{ 'color': 'red', 'fontSize': '22px' }} material="favorite_border"></Icon></span>
                </div>

                {favourites && favourites.length > 0 && (
                  favourites.map((favourite) => (
                    (favourite && favourite.favouriteId === item._id) && (
                      <div onClick={(event) => deleteFavourite(favourite, event)} style={{ 'float': "right", padding: '5px', marginTop: '-45px', backgroundColor: '#f5f5ef', borderRadius: '50%' }}>
                        <span style={{ cursor: 'pointer' }}>
                          <Icon style={{ 'color': 'red', 'fontSize': '22px' }} material="favorite"></Icon></span>
                      </div>
                    ))
                  ))}

              </ListItem>
            ))
          ) : (
            <Block>No Temples to show</Block>
          )}
        </List>
      ) : (
        <Block strong>
          <p>
            No matching results to show
          </p>
        </Block>
      )}
    </Page>
  );
};

export default TemplesList;
