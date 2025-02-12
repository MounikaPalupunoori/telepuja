import React, { useState, useEffect } from 'react';
import { storage } from "../firebase/firebase";
import cuid from "cuid";
import logo from '../assets/img/logo.png';
import coin from '../assets/img/coin.png';
import ChangepPasswordPage from '../pages/changepassword.jsx';
import SideBar from "./sidenav";
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
  ListInput,
  Toggle,
  Range,
  Row,
  Col,
  Icon,
  theme,
  Button,
  closeButton,
} from 'framework7-react';
import ProfilePicture from "profile-picture";
// import "profile-picture/build/ProfilePicture.css"
import Avatar from "../assets/img/avatar.jpg";
import {
  getLoggedinUserDetails,
  userRegisterDetails,
  updateProfilePictures,
  updateUserDetails,
  getpurohitnames,
  getListOfStates,
  getAllCountries,
  getListOfCities,
} from '../utils/api';
import loggedInUser from '../js/userdetails';
import toastr from 'toastr';
import moment from 'moment';
import userDetails from '../js/user_details';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../store/actions/auth';

const ProfilePage = (props) => {
  const [mail, setMail] = useState('');
  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gotram, setGotram] = useState('');
  // const [phonenumber, setPhonenumber] = useState();
  const [birthDate, setBirthDate] = useState('');
  const [marriageDate, setMarriageDate] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [cityList, setCityList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [gender, setGender] = useState('');
  const [marriageStatus, setMarriageStatus] = useState('');
  const [list, setList] = useState([]);
  const [familyPurohith, setFamilyPurohith] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const profilePictureRef = React.createRef();
  const [imageUrl, setimageUrl] = useState("");
  const [showimage, setshowimage] = useState(false);
  const [uploadButton, setUploadButton] = useState(false);
  const [invalidSize, setInvalidSize] = useState(false);
  const [invalidType, setInvalidType] = useState(false);
  const [imageErrorMessage, setImageErrorMessage] = useState('');
  const [countryName, setCountryName] = useState('');
  const [stateName, setStateName] = useState('');
  const [cityName, setCityName] = useState('');
  const [changePasswordPopup, setChangePasswordPopup] = useState(false);
  const dispatch = useDispatch();

  const changePassword = () => {
    setChangePasswordPopup(!changePasswordPopup);
  }
  const userData = useSelector((state => state && state.auth && state.auth.userDetails));
  useEffect(() => {
    f7.preloader.show();
    if (userData && userData._id) {
      setUserId(userData.userId);
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setMail(userData.email);
      setGotram(userData.gotram);
      setBirthDate(userData.dob);
      setMarriageStatus(userData.marriageStatus);
      setMarriageDate(userData.marriageDay);
      setAddress(userData.address);
      setFamilyPurohith(userData.family_purohith);
      setCountry(userData.country ? userData.country :"");
      setState(userData.state);
      setName(userData.name);
      setCity(userData.city);
      f7.preloader.hide();
    }
  }, [userData && userData._id]);

  useEffect(() => {
    if (userData && userData._id) {
      if (userData.role === 'devotee') {
        setimageUrl(userData.imageUrl);
      }
      else {
        setimageUrl(userData.imageUrl[0].url);
      }
    }
  }, [userData && userData._id]);


  //image upload
  const onChangePicture = (event) => {
    event.preventDefault();
    let files = event.target.files;
    let file = files && files[0];
    if (file) {
      if (!checkFileType(file.type)) {
        setInvalidType(true);
        setImageErrorMessage("Only the JPEG, JPG and PNG formats are supported.");
        setUploadButton(false);
        return;
      }
      else {
        setInvalidType(false);

      }
      if (!checkFileSize(file.size)) {
        setInvalidSize(true);
        setImageErrorMessage(" The image size must be less than 1MB.");
        return;
      }
      else {
        setInvalidSize(false);
        setImageErrorMessage('');
        setUploadButton(true);
      }

    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setimageUrl(reader.result);
      if (!invalidSize && !invalidType) {
        // setImageErrorMessage('');
        setUploadButton(true);
      }
    }
    setshowimage(true);
  };

  const checkFileSize = (size) => {
    // file size should be less 1MB
    if (size / 1024 / 1024 < 1) {
      return true;
    }
    return false;
  }

  const checkFileType = (type) => {
    // only jpeg, jpg and png are supported
    const VALID_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
    if (VALID_FILE_TYPES.indexOf(type) !== -1) {
      return true;
    }
    return false;
  }
  const uploadProfilePicture = (event) => {
    event.preventDefault();
    if (imageUrl && imageUrl !== "") {
      let image = {};
      image.url = imageUrl;
      updateProfilePictures(userData._id, userData.role, image)
        .then((resp) => {
          if (resp) {
            toastr.success("Profile picture updated succesfully");
            dispatch(getUserDetails(userData.userId))
            //props.f7router.navigate('/home/');
            setshowimage(false);
            setUploadButton(false);
          }
        })
        .catch((err) => {
          toastr.error(err.message);
        })
    }
  }

  const forward = () => {
    f7.dialog.alert('Forward');
  };

  useEffect(() => {
    getAllCountries()
      .then(countries => {
        countries.forEach((country) => {
          if (country._id === userData.country) {
            setCountryName(country.name);
          }
        })
        setCountryList(countries);
      })
      .catch(error => {
        throw new Error(error);
      });
  }, [userData.country]);
   
  useEffect(() => {
    if (country && country !=="select") {
      getListOfStates(country)
        .then(states => {
          states.forEach((state) => {
            if (state._id === userData.state) {
              setStateName(state.name);
            }
          })
          setStateList(states);
        })
        .catch(error => {
          throw new Error(error);
        });
    }

  }, [country, userData.state]);
  useEffect(() => {
    if (state && state !=='select' && userData.role !== "devotee") {
      getListOfCities(state)
        .then((cities) => {
          cities.forEach((city) => {
            if (userData.city === city._id) {
              setCityName(city.name);
            }
            setCityList(cities);
          });
        })
        .catch(error => {
          throw new Error(error);
        });
    }
    else {
      setCity(userData.city);
    }
  }, [state]);
  useEffect(() => {
    getpurohitnames().then((resp) => {
      setList(resp);
    });
  }, []);

  const handleSubmit = () => {
    var obj = {}
    obj.userId = userId;
    obj.gotram = gotram;
    obj.dob = birthDate;
    obj.address = address;
    obj.marriageStatus = marriageStatus;
    obj.family_purohith = familyPurohith;
    obj.country = country;
    obj.state = state;
    obj.city = city;
    if (userData.role !== "temple") {
      obj.firstName = firstName;
      obj.lastName = lastName;
    }
    else {
      obj.name = name;
    }
    if (marriageStatus === "Single") {
      obj.marriageDay = "";
    } else {
      obj.marriageDay = marriageDate;
    }
    if(country ===""|| country ==="select"){
      setErrorMessage("Please select country");
      return;
    }
    if(state ==="select"){
      setErrorMessage("Please select state");
      return;
    }
    if(city==="select"){
      setErrorMessage("Please select city");
      return;
    }
    if ((firstName !== "" && lastName !== "") || (name !== "") && country !== "") {
      setErrorMessage("");
      updateUserDetails(userId, userData.role, obj)
        .then((resp) => {
          if (resp) {
            toastr.success("User details saved successfully");
            dispatch(getUserDetails(userData.userId));
            //props.f7router.navigate('/home/');
          }
        })
        .catch((error) => {
          toastr.error(error.message)
        });
    }
    else {
      toastr.error("Please fill all the details");
    }
  }

  return (
    <Page name="profile" className="color-deeporange custom-bg padding-top">
      <div>
        <Navbar className="header-bg navbar-position">
          <NavLeft>
            <span onClick={()=>{props.f7router.back()}} style={{cursor:'pointer'}}>
                <Icon f7="arrow_left" color="black" style={{ fontWeight: '600', fontSize: '20px', paddingRight: '8px' }} ></Icon> 
                </span>
          </NavLeft>
          <NavTitle style={{ color: 'white' }}>Profile</NavTitle>
        </Navbar>
      </div>
      {/* sidenavbar */}
      <SideBar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div>
          <img style={{ width: "144px", height: "144px", padding: "10px", borderRadius: "50%", }} src={imageUrl ? imageUrl : Avatar} />
        </div>
        {userData && userData.role && userData.role === 'devotee' ? <label style={{ fontWeight: "500", color: "#AB4AA9", cursor: "pointer", display: "inline-block", padding: "0px 8px" }}>Change Profile Picture
          <input type='file' style={{ display: "none" }} name="imageurl" onChange={onChangePicture} multiple />
        </label> : null}

        {imageErrorMessage ? (
          <Block className="display-flex justify-content-center" style={{ color: 'red' }}>
            {imageErrorMessage}
          </Block>) : null
        }
        {uploadButton && uploadButton === true ? <Button onClick={uploadProfilePicture}>upload</Button> : null}
      </div>
      <List noHairlines form onSubmit={(e) => handleSubmit()}>
        {(userData && userData.role && userData.role === "temple")
          ?
          <ListInput
            outline
            floatingLabel
            label="Name"
            type="text"
            requiredTxt
            value={name}
            onInput={(e) => {
              setName(e.target.value);
            }}
          ></ListInput>
          :
          <List>
            <ListInput
              outline
              floatingLabel
              label="FirstName"
              type="text"
              requiredTxt
              value={firstName}
              onInput={(e) => {
                setFirstName(e.target.value);
              }}
            ></ListInput>

            <ListInput
              outline
              floatingLabel
              label="LastName"
              type="text"
              value={lastName}
              onInput={(e) => {
                setLastName(e.target.value);
              }}
            ></ListInput>
          </List>
        }
        <ListInput
          outline
          floatingLabel
          label="E-mail"
          type="email"
          value={mail}
          disabled
        ></ListInput>
        {/* <ListInput
          outline
          label="Password"
          type="password"
          placeholder="Password"
        ></ListInput> */}
        {/* <ListInput
          outline
          label="Phone"
          type="tel"
          placeholder="Phone"
          onInput={(e) => {
            setPhonenumber(e.target.value);
          }}
        ></ListInput> */}
        {userData.role == "devotee" && (<ListInput
          outline
          floatingLabel
          label="Gothram"
          type="text"
          value={gotram}
          onInput={(e) => {
            setGotram(e.target.value);
          }}
        ></ListInput>)}

        {/* <ListInput
          outline
          label="Gender"
          type="select"
          onInput={(e) => {
            setGender(e.target.value);
          }}
        >
          <option>Select</option>
          <option>Male</option>
          <option>Female</option>
        </ListInput> */}
        {userData.role == "devotee" && (<ListInput
          outline
          floatingLabel
          label="Birth date"
          type="date"
          placeholder="Birth day"
          value={birthDate}
          onInput={(e) => {
            setBirthDate(e.target.value);
          }}
        ></ListInput>
        )}

        {userData.role == "devotee" && (<ListInput
          outline
          floatingLabel
          label="Marital Status "
          type="select"
          value={marriageStatus}
          onInput={(e) => {
            setMarriageStatus(e.target.value);
          }}
        >
          <option>Select</option>
          <option>Single</option>
          <option>Married</option>
        </ListInput>)}

        {marriageStatus && marriageStatus == 'Married' ?
          <ListInput
            outline
            floatingLabel
            label="Marriage date"
            type="date"
            placeholder="Marriage day"
            value={marriageDate}
            onInput={(e) => {
              setMarriageDate(e.target.value);
            }}
          >

          </ListInput>
          : null
        }

        <ListInput
          outline
          floatingLabel
          type="textarea"
          label="Address"
          resizable
          defaultValue={address}
          onInput={(e) => {
            setAddress(e.target.value);
          }}
        ></ListInput>
        <ListInput
          outline
          floatingLabel
          label="Country*"
          type="select"
          value={country}
          onChange={(e) => {
            setErrorMessage('')
            setCountry(e.target.value);
          }}
        > <option value="select">Select</option>
          {countryList.map((item, i) => (
            <option value={item._id}>{item.name}</option>
          ))}
        </ListInput>
        <ListInput
          outline
          floatingLabel
          label="State*"
          type="select"
          value={state}
          onInput={(e) => {
            setErrorMessage('');
            setState(e.target.value);
          }}

        > 
          

        
          <option value="select">Select</option>

          {stateList.map((item, i) => (
            
            <option value={item._id}>{item.name}</option>
          ))}
           
        </ListInput>
       
          
        {
          (userData && userData.role && userData.role !== "devotee") ? <ListInput
            outline
            floatingLabel
            label="City*"
            type="select"
            value={city}
            onInput={(e) => {
              setErrorMessage('');
              setCity(e.target.value);
            }}
          >  <option value="select">Select</option>
            {cityList.map((item, i) => (
              <option value={item._id}>{item.name}</option>
            ))}
          </ListInput>
            :
            <ListInput
              outline
              floatingLabel
              label="City*"
              type="text"
              floatingLabel
              defaultValue={city}
              onInput={(e) => {
                setCity(e.target.value);
              }}
            ></ListInput>
        }
        {userData.role == "devotee" && (<ListInput
          outline
          floatingLabel
          label="Family Purohith"
          type="select"
          value={familyPurohith}
          onInput={(e) => {
            setFamilyPurohith(e.target.value);

          }}
        >
          {/* <option>Select fam </option> */}
          <option value="None">None</option>
          {
            list.map((item, i) => (
              <option>
                {item.firstName} {item.lastName}, {item.address ? item.address + ", " : ""}{item.city.name ? item.city.name + ", " : ""}{item.state.name ? item.state.name + ", " : ""}{item.country.name ? item.country.name : ""}</option>
            ))}
        </ListInput>
        )}


        {/* <div class="row no-gap">
          <div class="col">
            <List>
              <ListInput
                outline
                type="text"
                label="Event Name"
                placeholder="Enter your event name"
              ></ListInput>
              <ListInput
                outline
                label="Event date"
                type="date"
                placeholder="Event Date"
                defaultValue="2014-04-30"
              ></ListInput>
            </List>
          </div>
          <div class="col">
            <List>
              <ListInput
                outline
                type="text"
                label="Event Name"
                placeholder="Enter your event name"
              ></ListInput>
              <ListInput
                outline
                label="Event date"
                type="date"
                placeholder="Event Date"
                defaultValue="2014-04-30"
              ></ListInput>
            </List>
          </div>
          <div class="col">
            <List>
              <ListInput
                outline
                type="text"
                label="Event Name"
                placeholder="Enter your event name"
              ></ListInput>
              <ListInput
                outline
                label="Event date"
                type="date"
                placeholder="Event Date"
                defaultValue="2014-04-30"
              ></ListInput>
            </List>
          </div>
        </div> */}
        {errorMessage ? (
          <Block className="display-flex justify-content-center" style={{ color: 'red' }}>
            {errorMessage}
          </Block>) : null
        }
        <Block style={{ 'display': 'flex', 'justifyContent': 'center' }}>
          <Button fill raised style={{ 'width': '400px' }} onClick={handleSubmit}>Save Details</Button>
        </Block>

        <Block style={{ 'display': 'flex', 'justifyContent': 'center' }}>
          <Button style={{ width: '400px', border: '1px solid' }} onClick={changePassword}>Change Password</Button>
        </Block>
      </List>
      {changePasswordPopup && <ChangepPasswordPage handleClose={changePassword} />}

    </Page >
  );
};
export default ProfilePage;