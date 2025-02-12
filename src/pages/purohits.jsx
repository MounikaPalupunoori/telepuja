import React, { useState, useEffect, useContext } from "react";
import logo from '../assets/img/logo.png';
import coin from '../assets/img/coin.png';
import logogrey from '../assets/img/logogrey.png';
import Avatar from "../assets/img/avatar.jpg";
import purohit from '../assets/img/purohit.png';
import temple from '../assets/img/temple.png';
import {
  f7,
  Preloader,
  Searchbar,
  theme,
  Toolbar,
  Col,
  Popup,
  Page,
  NavLeft,
  NavRight,
  NavTitle,
  Block,
  List,
  ListInput,
  ListItem,
  Button,
  Link,
  Icon,
  Navbar,
} from "framework7-react";
import {
  getpurohitnames,
  getServicesList,
  getLoggedinUserDetails, readFavourite, makeFavourite, removeFavourite
} from "../utils/api";
import toastr from 'toastr';
import loggedInUser from '../js/userdetails';
import SideBar from "./sidenav";
import { useDispatch, useSelector } from "react-redux";
import { createFavourites, deleteFavouites, readFavourites } from "../store/actions/favourite";


const PurohitList = (props) => {

  const [list, setList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [service, setService] = useState("");
  const [favouriteList, setFavouriteList] = useState('');
  const [fee, setFee] = useState("");
  const [serviceList, setServiceList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [seachClear, setSeachClear] = useState(false);
  const [isToolbar, setToolbar] = useState(true);
  const dispatch = useDispatch();

  const userData = useSelector((state => state && state.auth && state.auth.userDetails));

  const favourites = useSelector((state => state && state.favourite && state.favourite.favourites));

  useEffect(() => {
    f7.preloader.show();
    if (userData && userData._id) {
      getpurohitnames().then((resp) => {
        setList(resp);
        setFilterList(resp);
        f7.preloader.hide();
      });
    }

  }, [userData && userData._id]);


  useEffect(() => {
    if (userData && userData._id) {
      dispatch(readFavourites(userData._id));
    }
  }, [userData && userData._id]);

  useEffect(() => {
    if (userData && userData._id) {
      getServicesList(userData._id).then((resp) => setServiceList(resp));
    }
  }, [userData && userData._id]);


  const filterPurohits = (event) => {
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
    let purohits = newList.map(x => {
      //et purohitsServices = (x.purohithservices.map(a => { return a['servicename'] })).toString();
      if (x.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
        x.lastName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
        x.country.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
        x.state.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
        x.city.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
        return x;
      }
    }).filter(x => x);
    if (event.target.value === "") {
      setList(newList)
    }
    else {
      setList(purohits);
    }
  }

  useEffect(() => {
    setFee(service.split(",")[1]);
  }, [service]);

  const showServices = (item) => {
    item.requestType = "PurohithService";
    item.donate = "Dakshina";
    props.f7router.navigate('/services/' + item._id, { props: { details: item } });
  };

  const clearSearch = (event) => {
    setSearchTerm('');
    setSeachClear(true);
    event.preventDefault();
    setList(filterList);
  }

  //making favourite in purohith page
  const updateFavourite = (item, e) => {
    e.stopPropagation();
    let obj = {};
    obj.devoteeId = userData._id;
    obj.favouriteId = item._id;
    obj.name = item.firstName + " " + item.lastName;
    obj.image = item.Image_URL;
    obj.address = item.city.name + ',' + item.state.name + ',' + item.country.name;
    obj.role = 'purohit';
    dispatch(createFavourites(obj));
    toastr.success('Added to Favourites List');
  }
  //deleting favourites in purohith page
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
    <Page name="Purohits" className="color-deeporange custom-bg padding-top">
      <div>
        <Navbar className="header-bg navbar-position">
          <NavLeft>
            <Link href='/home/'>
              <img className="logoimage" src={logo} width="60" ></img>
            </Link>
          </NavLeft>
          <NavTitle style={{ color: 'white' }}>Purohits</NavTitle>
        </Navbar>
      </div>
      {/* sidenavbar */}
      <SideBar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />
      <div>
        <Searchbar
          clearButton={false}
          disableButton={false}
          placeholder="Search Purohit or Service.."
          onChange={(event) => filterPurohits(event)}
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
            <Link className="tab-link tab-outer bottom-nav-icon" href="/temples/">
              <img src={temple} width="30"></img>
              <span className="tabbar-label bottom-nav-text">Temples</span>
            </Link>
            <Link className="tab-link tab-outer tab-link-active bottom-nav-icon" href="/purohits/">
              <img src={purohit} width="30"></img>
              <span className="tabbar-label bottom-nav-text">Purohits</span>
            </Link>
            <Link className="tab-link tab-outer bottom-nav-icon" iconMd="material:favorite_border" iconIos="material:favorite_border" style={{ 'color': '#fff' }} href="/favouritesPage/">
              <span className="tabbar-label bottom-nav-text">Favorites</span>
            </Link>
          </div>
        </Toolbar>}
      {list && list.length > 0 ? (
        <List mediaList className="purohit-list">
          {list && list.length > 0 ? (
            list.sort((a, b) => a.firstName + " " + a.lastName > b.firstName + " " + b.lastName ? 1 : -1).map((item, i) => (
              <ListItem
                key={i}
                className="purohit-item cursor-pointer"
                title={item.firstName + " " + item.lastName}
                subtitle={item.city.name + "," + item.state.name + "," + item.country.name}
                onClick={() => showServices(item)}
              >
                <img
                  slot="media"
                  src={item.Image_URL.length > 0 ? item.Image_URL.map((image, i) => image.url) : logogrey}
                  width="65"
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

export default PurohitList;
