import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logo.png';
import coin from '../../assets/img/coin.png';
import logogrey from '../../assets/img/logogrey.png';
import Avatar from "../../assets/img/avatar.jpg";
import donation from '../../assets/img/donationwhite.png'
import toastr from 'toastr';
import SideBar from '../sidenav.jsx';
import {
    f7,
    Icon,
    Page,
    NavLeft,
    Swiper,
    SwiperSlide,
    NavTitle,
    Navbar,
    Block,
    Button,
    Link,
    Row,
    Radio,
    NavRight,
    List,
    ListInput,
    ListItem,
} from "framework7-react";
import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";
import {
    getTempleServices,
    getLoggedinUserDetails,
    getServicesList,
    getCountry,
    initCountry,
    getBookedTimeSlot,
    readFavourite,
    removeFavourite,
    makeFavourite,
    getTimeSlot
} from '../../utils/api';
import moment from 'moment-timezone';
import ct from 'countries-and-timezones';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { array } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { createFavourites, deleteFavouites, readFavourites } from '../../store/actions/favourite';


const ServicesPage = (props) => {
    // create a dummy item to populate ALL as an option
    const all_option_item = {
        // name: "ALL"
    }
    const [country, setCountry] = useState([]);
    const [serviceData, setServiceData] = useState(props.details ? props.details : {});
    const selectedService = (props && props.details && props.details.defaultService) ? props.details.defaultService : '';
    const [servicesSelected, setServiceSelected] = useState([])
    const [service, setService] = useState([all_option_item]);
    const [fee, setFee] = useState("");
    const [defaultfee, setDefaultFee] = useState("");
    const [seemore, setSeeMore] = useState(false);
    const [seeMoreButton, setSeeMoreButton] = useState('See More');
    //const [seeless, SetSeeLess] = useState(true);
    const [serviceId, setServiceId] = useState("");
    const [serviceName, setServiceName] = useState("");
    // const [defaultService, setDefaultService] = useState(selectedService);
    const [duration, setServiceDuration] = useState("");
    const [note, setNote] = useState("");
    const [zone, setZone] = useState('');
    const [countryTimeZone, setCountryTimeZone] = useState('');
    const [timeslot, setTimeSlot] = useState('');
    const [date, setDate] = useState(null);
    const [slot, setSlots] = useState([]);
    const [option, setOption] = useState('');
    const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
    const [timezone, setTimezone] = useState('');
    const [disabledDate, setDisabledDate] = useState(new Date());
    const [errorMessage, setErrorMessage] = useState();
    const [emailSend, setEmailSend] = useState();
    const [specialStartDate, setSpecialStartDate] = useState();
    const [favourite, setFavourite] = useState(false);
    const [favouriteId, setFavouriteId] = useState('');
    const dispatch = useDispatch();

    const userData = useSelector((state => state && state.auth && state.auth.userDetails));


    const handleChangeDate = (event, serviceSent, setDuration) => {
        let a = serviceName ? serviceName : selectedService;
        if (serviceSent && typeof serviceSent == 'string') {
            a = serviceSent;
            setServiceDuration(setDuration);
        }
        let filterService = service.filter(x => x.name == a);
        let eventDate = moment(event).format("DD-MMM-YYYY");
        let specialEventDate = moment(event).format("YYYY-MM-DD");
        let eventDay = moment(event).day();
        let bookedDate = moment(event).format('MMMM DD YYYY');
        let currentDate = moment(new Date()).format("DD-MMM-YYYY");
        let current_time = moment().format('HH:mm');
        let timezone = serviceData.Timings.timezone ? serviceData.Timings.timezone : serviceData.Timings.Timezone;
        setTimezone(timezone);
        setEmailSend(filterService[0].approval_needed)
        setDate(event);
        let slots = [];
        let bookedslots = [];
        if (!a) {
            setErrorMessage('Please select a service')
        } else {
            getTimeSlot(userData._id, serviceData._id, bookedDate).then((resp) => {
                let timeslotsBooked = resp;
                timeslotsBooked && timeslotsBooked.length > 0 ?
                    timeslotsBooked.map((item, i) => (
                        bookedslots.push(item.timeSlot.split(" ")[0])
                    )) : null
                if (filterService[0].active_yn && filterService[0].daily && filterService[0].event_times) {
                    if (filterService[0].event_times.timings.includes(",")) {
                        let eventTime = filterService[0].event_times.timings.split(",");
                        if (eventDate == currentDate) {
                            eventTime.forEach((x, index) => {
                                if ((current_time.split(":")[0] == eventTime[index].split("-")[0].split(":")[0] && current_time.split(":")[1] < eventTime[index].split("-")[0].split(":")[1]) ||
                                    (current_time.split(":")[0] < eventTime[index].split("-")[0].split(":")[0])) {
                                    slots.push(eventTime[index])
                                }
                            })
                            if (timeslotsBooked) {
                                removebookedSlots(slots, bookedslots);
                            }
                        } else {
                            eventTime.forEach((x, index) => {
                                slots.push(eventTime[index])
                            })
                            if (timeslotsBooked) {
                                removebookedSlots(slots, bookedslots);
                            }
                        }
                    } else {
                        if (eventDate == currentDate) {
                            if ((current_time.split(":")[0] == filterService[0].event_times.timings.split("-")[0].split(":")[0] && current_time.split(":")[1] < filterService[0].event_times.timings.split("-")[0].split(":")[1]) ||
                                (current_time.split(":")[0] < filterService[0].event_times.timings.split("-")[0].split(":")[0])) {
                                slots.push(filterService[0].event_times.timings)
                            }
                            if (timeslotsBooked) {
                                removebookedSlots(slots, bookedslots);
                            }
                        } else {
                            slots.push(filterService[0].event_times.timings);
                            if (timeslotsBooked) {
                                removebookedSlots(slots, bookedslots);
                            }
                        }
                    }
                } else if (filterService[0].active_yn && filterService[0].weekly && filterService[0].event_times) {
                    if (filterService[0].event_times.timings.includes(",") && filterService[0].event_times.day_of_week == eventDay) {
                        let eventTime = filterService[0].event_times.timings.split(",");
                        if (eventDate == currentDate) {
                            eventTime.forEach((x, index) => {
                                if ((current_time.split(":")[0] == eventTime[index].split("-")[0].split(":")[0] && current_time.split(":")[1] < eventTime[index].split("-")[0].split(":")[1]) ||
                                    (current_time.split(":")[0] == eventTime[index].split("-")[0].split(":")[0])) {
                                    slots.push(eventTime[index])
                                }
                            })
                            if (timeslotsBooked) {
                                removebookedSlots(slots, bookedslots);
                            }
                        } else {
                            eventTime.forEach((x, index) => {
                                slots.push(eventTime[index])
                            })
                            if (timeslotsBooked) {
                                removebookedSlots(slots, bookedslots);
                            }
                        }
                    } else if (filterService[0].event_times.day_of_week == eventDay) {
                        if (eventDate == currentDate) {
                            if ((current_time.split(":")[0] == filterService[0].event_times.timings.split("-")[0].split(":")[0] && current_time.split(":")[1] < filterService[0].event_times.timings.split("-")[0].split(":")[1]) ||
                                (current_time.split(":")[0] < filterService[0].event_times.timings.split("-")[0].split(":")[0])) {
                                slots.push(filterService[0].event_times.timings)
                            }
                            if (timeslotsBooked) {
                                removebookedSlots(slots, bookedslots);
                            }
                        } else {
                            slots.push(filterService[0].event_times.timings);
                            if (timeslotsBooked) {
                                removebookedSlots(slots, bookedslots);
                            }
                        }
                    } else {
                        slots = [];
                        if (timeslotsBooked) {
                            removebookedSlots(slots, bookedslots);
                        }
                    }

                } else if (filterService[0].special && filterService[0].event_times) {
                    if (filterService[0].event_times.timings.includes(",") && specialEventDate == filterService[0].event_times.date) {
                        let eventTime = filterService[0].event_times.timings.split(",");
                        if (eventDate == currentDate) {
                            eventTime.forEach((x, index) => {
                                if ((current_time.split(":")[0] == eventTime[index].split("-")[0].split(":")[0] && current_time.split(":")[1] < eventTime[index].split("-")[0].split(":")[1]) ||
                                    (current_time.split(":")[0] == eventTime[index].split("-")[0].split(":")[0])) {
                                    slots.push(eventTime[index])
                                }
                            })
                            if (timeslotsBooked) {
                                removebookedSlots(slots, bookedslots);
                            }
                        } else {
                            eventTime.forEach((x, index) => {
                                slots.push(eventTime[index])
                            })
                            if (timeslotsBooked) {
                                removebookedSlots(slots, bookedslots);
                            }
                        }
                    } else if (filterService[0].special && specialEventDate == filterService[0].event_times.date) {
                        if (eventDate == currentDate) {
                            if ((current_time.split(":")[0] == filterService[0].event_times.timings.split("-")[0].split(":")[0] && current_time.split(":")[1] < filterService[0].event_times.timings.split("-")[0].split(":")[1]) ||
                                (current_time.split(":")[0] < filterService[0].event_times.timings.split("-")[0].split(":")[0])) {
                                slots.push(filterService[0].event_times.timings)
                            }
                            if (timeslotsBooked) {
                                removebookedSlots(slots, bookedslots);
                            }
                        } else {
                            slots.push(filterService[0].event_times.timings);
                            if (timeslotsBooked) {
                                removebookedSlots(slots, bookedslots);
                            }
                        }
                    } else {
                        slots = [];
                        if (timeslotsBooked) {
                            removebookedSlots(slots, bookedslots);
                        }
                    }
                } else {
                    setErrorMessage('');
                    setDate(event);
                    let startTime = "";
                    let endTime = "";
                    let day = moment(event).format('ddd');

                    if (day == 'Sat') {
                        startTime = serviceData.Timings.saturday.start;
                        endTime = serviceData.Timings.saturday.end;
                    } else if (day == 'Sun') {
                        startTime = serviceData.Timings.sunday.start;
                        endTime = serviceData.Timings.sunday.end;
                    } else {
                        startTime = serviceData.Timings.daily.start;
                        endTime = serviceData.Timings.daily.end;
                    }
                    let endHour = Number(endTime.split(":")[0]);
                    let endMinute = Number(endTime.split(":")[1]);
                    let startHour = Number(startTime.split(":")[0]);
                    let startMinute = Number(startTime.split(":")[1]);
                    let beginningTime = startHour * 3600000 + startMinute * 60000 - 5 * 3600000 - 30 * 60000
                    let endingTime = endHour * 3600000 + endMinute * 60000 - 5 * 3600000 - 30 * 60000
                    let flag = moment(beginningTime).isBefore(endingTime)
                    let setDurationTime = '';
                    let current_time = moment().format('HH:mm');
                    let currentTimeinSec = current_time.split(":")[0] * 3600000 + current_time.split(':')[1] * 60000 - 5 * 3600000 - 30 * 60000;
                    if (setDuration && typeof setDuration == 'string') {
                        setDurationTime = setDuration;
                    } else {
                        setDurationTime = duration;
                    }
                    while (beginningTime < endingTime) {
                        if (eventDate == currentDate) {
                            if (currentTimeinSec < beginningTime) {
                                slots.push(moment(beginningTime).format('HH:mm') + "-" + moment(beginningTime).add(Number(setDurationTime), 'minutes').format('HH:mm'))
                            }
                        } else {
                            slots.push(moment(beginningTime).format('HH:mm') + "-" + moment(beginningTime).add(Number(setDurationTime), 'minutes').format('HH:mm'))
                        }
                        beginningTime = beginningTime + (setDurationTime * 60000)
                    }

                    if (serviceData.requestType == 'PurohithService' && serviceData.is_public_calendar) {
                        getBookedTimeSlot(serviceData._id, serviceData.requestType, bookedDate).then((resp) => {
                            setBookedTimeSlots(resp);
                            const timeslotsBooked = resp;
                            let bookedslots = [];
                            timeslotsBooked && timeslotsBooked.length > 0 ?
                                timeslotsBooked.map((item, i) => (
                                    bookedslots.push(item.timeSlot.split(" ")[0])
                                )) : null
                            slots = remove(slots, bookedslots)
                            setSlots(slots);
                        })
                    } else {
                        if (timeslotsBooked) {
                            removebookedSlots(slots, bookedslots);
                        }
                    }
                }
            })

        }
    }

    function removebookedSlots(slots, bookedslots) {
        slots.map((i, index) => (
            bookedslots.map(x => {
                if (x.split(" ")[0] == i) {
                    slots.splice(index, 1);
                }
            })
        ));
        setSlots(slots);
    }
    function remove(slots, bookedslots) {
        return bookedslots.reduce((r, s) => {
            var [sStart, sEnd] = s.split('-');
            return r.filter(f => {
                var [fStart, fEnd] = f.split('-');
                return (fStart < sStart || fEnd > sEnd) && (fStart > sStart || fEnd <= sStart) && (fStart >= sEnd || fEnd < sEnd);
            });
        }, slots);
    }

    const handleChange = (e) => {
        setTimeSlot(e.target.value);
    }



    useEffect(() => {
        if (userData) {
            initCountry()
                .then((resp) => {
                    if (resp) {
                        setZone(resp);
                    }
                    else {
                        console.warn("No time zone found");
                    }
                })
                .catch((error) => {
                    throw new Error(error);
                });
        }
    }, [userData]);

    useEffect(() => {
        if (zone) {
            if (zone && zone.countryCode) {
                let time = ct.getCountry(zone.countryCode);
                setCountryTimeZone(time.timezones[0]);
            }
        }
    }, [zone]);

    // useEffect(() => {
    //     if (userData) {
    //         getCountry(userData.userId, userData.role)
    //             .then((countryData) => {
    //                 setCountry(countryData.data);
    //             })
    //             .catch(error => {
    //                 throw new Error(error);
    //             })
    //     } else {
    //         console.warn("No user details found.");
    //     }
    // }, [userData]);

    useEffect(() => {
        if (serviceData.requestType === "TempleService") {
            getTempleServices(serviceData._id).then((resp) => {
                let activeServices = resp.data.templeservices.filter(x => x.active_yn == true);
                setService(activeServices);
                let serviceSelected = []
                resp.data.templeservices && resp.data.templeservices.length > 0 ?
                    resp.data.templeservices.map((item, i) => (item.name === selectedService ? serviceSelected.push(item) : null))
                    : null
                setServiceSelected(serviceSelected);
                serviceSelected ?
                    serviceSelected.map((i, j) => (
                        setServiceId(i._id),
                        setDefaultFee(i.token_fee_std),
                        setServiceDuration(i.Duration)
                    )) : null
            })
        }
        else if (serviceData.requestType === "PurohithService") {
            getServicesList(serviceData._id).then((resp) => {
                setService(resp);
            })
        }

    }, [serviceData]);


    useEffect(() => {
        setSeeMore(false);
        if (fee.split(",")[3] != undefined) {
            setServiceDuration(fee.split(",")[3]);
        }
        if (fee.split(",")[2] != undefined) {
            setServiceName(fee.split(",")[2]);
        }
        if (fee.split(",")[1] != undefined) {
            setServiceId(fee.split(",")[1]);
        }
        setFee(fee.split(",")[0]);
    }, [fee]);

    const handleOption = (event) => {
        event.preventDefault();
        setOption(event.target.value);
    }

    let data = {};
    if (serviceData && serviceData.requestType && serviceData.requestType === "TempleService") {
        data = {
            requestType: serviceData.requestType,
            templeId: serviceData._id,
            templeServiceId: serviceId,
            tokens: fee ? fee : defaultfee,
            name: serviceData.name ? serviceData.name : serviceData.firstName + " " + serviceData.lastName,
            address: serviceData.Address ? serviceData.Address : serviceData.address,
            city: serviceData.city.name,
            state: serviceData.state.name,
            country: serviceData.country.name,
            serviceName: serviceName ? serviceName : selectedService,
            note: note,
            image: serviceData.Image_URL[0].url,
            templeEmail: serviceData.email
        }
    }
    else if (serviceData && serviceData.requestType && serviceData.requestType === "PurohithService") {
        data = {
            requestType: serviceData.requestType,
            purohitId: serviceData._id,
            purohitServiceId: serviceId,
            tokens: fee,
            name: serviceData.name ? serviceData.name : serviceData.firstName + " " + serviceData.lastName,
            address: serviceData.Address ? serviceData.Address : serviceData.address,
            city: serviceData.city.name,
            state: serviceData.state.name,
            country: serviceData.country.name,
            serviceName: serviceName,
            note: note,
            image: serviceData.Image_URL[0] ? serviceData.Image_URL[0].url : logogrey,
            purohithEmail: serviceData.email
        }
    }
    const showbooking = () => {
        //let a = serviceName ? serviceName : selectedService;

        if (serviceData.service !== 'home' && !serviceName && !timeslot && !date) {
            setErrorMessage("Please select a service");
        }
        else if (!date) {
            setErrorMessage("Please select a Date");
        }
        else if (!timeslot && slot.length > 0) {
            setErrorMessage("Please select a slot for service");
        }
        else if (slot.length === 0) {
            setErrorMessage("No slots are available for this service");
        }
        else if (userData.firstName && userData.lastName) {
            let obj = {
                devoteeId: userData._id,
                type: serviceData.requestType,
                id: serviceData._id,
                timeSlot: timeslot,
                serviceName: serviceName ? serviceName : selectedService,
                bookingDate: moment(date).format("MMMM DD YYYY"),
            }
            data.bookingSlot = parseInt(moment(date).format("x"));
            data.timeslot = timeslot;
            data.approval_needed = emailSend;
            props.f7router.navigate('/booking/' + serviceData._id, { props: { bookingData: data, details: props.details, timeslotData: obj } });
        }
        else {
            setErrorMessage("Please fill all the profile details to book a service");
        }
    };
    const handleDonation = (requestType, request) => {
        let data = serviceData;
        if (requestType == "callToAction") {
            data.requestType = "callToAction";
            data.request = request;
        }
        props.f7router.navigate('/donation/', { props: { donate: data, details: props.details } });
    }
    const clearSlotData = (data) => {
        setSlots([]);
        let filterService = service.filter(x => x.name == data.split(",")[2]);
        if (filterService.length) {
            if (filterService[0].special) {
                let splitFilterDate = filterService[0].event_times.date.split("-");
                setSpecialStartDate(new Date(splitFilterDate[0], splitFilterDate[1] - 1, splitFilterDate[2]));
            }
            else {
                setSpecialStartDate('');
            }
        }
        if (data) {
            setFee(data.split(",")[0]);
            if (data.split(",")[3] != undefined) {
                setServiceDuration(data.split(",")[3]);
                if (data.split(",")[2] != undefined) {
                    setServiceName(data.split(",")[2]);
                    if (data.split(",")[1] != undefined) {
                        setServiceId(data.split(",")[1]);
                        if (date && data) {
                            handleChangeDate(date, data.split(",")[2], data.split(",")[3]);
                        }
                    }
                }
            }
        } else {
            setFee('');
            setServiceDuration('');
            setServiceName('');
            setServiceId('')
        }
    }

    const readmore = () => {
        //setSeeMore(true);
        if (seemore == false) {
            setSeeMoreButton("See Less");
            setSeeMore(true);
        } else if (seemore == true) {
            setSeeMoreButton("See More");
            setSeeMore(false);
        }
    };
    const favourites = useSelector((state => state && state.favourite && state.favourite.favourites));
    useEffect(() => {
        if (favourites && favourites.length > 0) {
            favourites.map((favourite) => {
                if (favourite.favouriteId === serviceData._id) {
                    setFavourite(true);
                    setFavouriteId(favourite._id);
                }
            });
        }
    }, [favourites]);
    //readfavourite
    useEffect(() => {
        if (userData && userData._id) {
            dispatch(readFavourites(userData._id));
        }
    }, [userData && userData._id]);

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
    const deleteFavourite = (favouriteId, e) => {
        e.stopPropagation();
        setFavourite(false);
        if (favouriteId) {
            dispatch(deleteFavouites(favouriteId));
            let name = serviceData.name ? serviceData.name : (serviceData.firstName + " " + serviceData.lastName);
            toastr.success('Removed' + ' ' + name + ' ' + 'from Favourite List');
        }
    }

    // Back to list 
    const goBack = () => {
        if (props.details) {
            if (data.requestType == "TempleService") {
                props.f7router.navigate('/temples/');
            }
            else {
                props.f7router.navigate('/purohits/');
            }
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
                        {/* {/* <a href="/home/" slot="left" className="link back"><Icon f7="arrow_left" backLink="Back" color="black" style={{ fontWeight: '400', fontSize: '20px', paddingRight: '8px' }}></Icon></a> */}
                        {/* <Link href='/home/'>
                            <img className="logoimage" style={{ marginLeft: '-20px' }} src={logo} width="60"></img>
                        </Link> */}
                    </NavLeft>
                </Navbar>
            </div>
            <SideBar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />
            <div>
                <Swiper scrollbar autoplay={{ delay: 3000 }} className="home-swiper"  >
                    {serviceData.Image_URL && serviceData.Image_URL.length > 0 ? serviceData.Image_URL.map((i, j) =>
                        <SwiperSlide className="home-slider" >
                            <img
                                src={i.url}
                                width="100%"
                                height="100%"
                            />
                        </SwiperSlide>
                    ) :
                        <SwiperSlide className="home-slider" >
                            <img
                                src={logogrey}
                                width="100%"
                                height="100px"
                            />
                        </SwiperSlide>
                    }
                </Swiper>

                {/* <div className="justify-content-center display-flex">
                    {(serviceData && serviceData.requestType === "TempleService")
                        ?
                        <button className="col button button-small button-round button-fill" round raised style={{ 'width': '100px', 'height': '30px', 'top': '8px', }} onClick={() => { handleDonation("callToAction", "Donate") }}>Donate</button>
                        :
                        <button className="col button button-small button-round button-fill" round raised style={{ 'width': '100px', 'height': '30px', 'top': '8px', }} onClick={() => { handleDonation("callToAction", "Dakshina") }} >Dakshina</button>
                    }
                </div> */}
                <div>
                    <h2 className="serviceData"
                        style={{ color: '#ff9500', 'textAlign': 'left', ' marginTop': 'auto', 'paddingTop': '10px', 'marginLeft': '10px' }}>
                        <Row className="justify-content-flex-start align-items-center">
                            <span>
                                {(serviceData.name && serviceData.name !== undefined ? serviceData.name : "") || (serviceData.firstName && serviceData.firstName !== undefined ? serviceData.firstName : "") + "  " + ((serviceData.lastName && serviceData.lastName !== undefined) ? serviceData.lastName : "")}
                                {(serviceData && serviceData.requestType === "TempleService") &&
                                    <button className="col button button-small button-round button-fill" round raised style={{ 'width': '112px', 'height': '40px', 'position': 'fixed', zIndex: '100', bottom: '12px', right: 20 }} onClick={() => { handleDonation("callToAction", "donate") }}><img src={donation} width="30" height="30" style={{ padding: '0px 5px' }}></img>Donate</button>
                                }
                                {(serviceData && serviceData.requestType === "PurohithService") &&
                                    <button className="col button button-small button-round button-fill" round raised style={{ 'width': '112px', 'height': '40px', 'position': 'fixed', zIndex: '100', bottom: '12px', right: 20 }} onClick={() => { handleDonation("callToAction", "dakshina") }}>Dakshina</button>
                                }
                            </span>
                            <span style={{ paddingLeft: "10px" }}>
                                {favourite ?
                                    <div onClick={(event) => deleteFavourite(favouriteId, event)} style={{ 'float': "right", padding: '0px 7px 5px 7px', backgroundColor: '#f5f5ef', borderRadius: '50%' }}>
                                        <span style={{ cursor: 'pointer' }}>
                                            <Icon style={{ 'color': 'red', 'fontSize': '22px' }} material="favorite"></Icon></span>
                                    </div>
                                    :
                                    <div onClick={(event) => updateFavourite(serviceData, event)} style={{ 'float': "right", padding: '0px 7px 5px 7px', backgroundColor: '#f5f5ef', borderRadius: '50%' }}>
                                        <span style={{ cursor: 'pointer' }}>
                                            <Icon style={{ 'color': 'red', 'fontSize': '22px' }} material="favorite_border"></Icon></span>
                                    </div>
                                }
                            </span>
                        </Row>
                        <div style={{ 'color': '#ae499d', 'marginLeft': 'auto', ' marginTop': 'auto', 'fontSize': '15px' }}>
                            <a class='link external' target="_system" href={'https://maps.google.com/?q=' + (serviceData.name && serviceData.name !== undefined ? serviceData.name : "") + "," + (serviceData.Address ? (serviceData.Address ? serviceData.Address + "," : "") : (serviceData.address ? serviceData.address + "," : "")) + (serviceData && serviceData.city && serviceData.city.name ? serviceData.city.name : "") + ", " + (serviceData && serviceData.state && serviceData.state.name ? serviceData.state.name : " ") + ", " + (serviceData && serviceData.country && serviceData.country.name ? serviceData.country.name : '')}>
                                {(serviceData.Address ? (serviceData.Address ? serviceData.Address + "," : "") : (serviceData.address ? serviceData.address + "," : ""))} {(serviceData && serviceData.city && serviceData.city.name ? serviceData.city.name : "") + ", " + (serviceData && serviceData.state && serviceData.state.name ? serviceData.state.name : "") + ", " + (serviceData && serviceData.country && serviceData.country.name ? serviceData.country.name : '')}
                            </a>
                        </div>
                        {/* <a class='link external' target="_system" href={'https://maps.google.com/?q=' + (serviceData.name && serviceData.name !== undefined ? serviceData.name : "") + (serviceData.Address ? (serviceData.Address ? serviceData.Address + "," : "") : (serviceData.address ? serviceData.address + "," : "")) + (serviceData.city.name ? serviceData.city.name : "") + ", " + (serviceData.state.name ? serviceData.state.name : " ") + ", " + serviceData.country.name}>asdfghjklpoiuytrewqzxcvbnm</a> */}
                    </h2>
                    <div>
                        <p style={{ 'margin': '5px 0em 0px 1em', 'marginTop': '-12px', }} >A Hindu temple or mandir or Devasthana is a symbolic house, seat and body of divinity for Hindus. It is a structure designed to bring human beings and gods. <a onClick={() => readmore()}>{seeMoreButton}</a></p>
                        {seemore ?
                            <div>
                                {serviceData.Timings ?
                                    country.country == 'India' ?
                                        serviceData.Timings == 'IST' ?
                                            <div className="timings" style={{ color: '#555', marginLeft: '10px', fontSize: '15px', width: '500px' }}>
                                                <Row className="justify-content-start display-flex" >
                                                    <p className="timings-alignment wid-140"  >Monday to Friday</p><p className="timings-alignment" style={{}}>:</p><p className="timings-alignment" style={{}}>{serviceData.Timings.daily ? (serviceData.Timings.daily.start + "-" + serviceData.Timings.daily.end) : "Not Available"}</p>
                                                    <p className="timings-alignment">{(serviceData.Timings.timezone ? serviceData.Timings.timezone : serviceData.Timings.Timezone)}</p>
                                                </Row>
                                                <Row className="justify-content-start display-flex">
                                                    <p className="timings-alignment wid-140">Saturday</p><p className="timings-alignment">:</p><p className="timings-alignment">{serviceData.Timings.saturday ? (serviceData.Timings.saturday.start + "-" + serviceData.Timings.saturday.end) : "Not Available"}</p>
                                                    <p className="timings-alignment">{(serviceData.Timings.timezone ? serviceData.Timings.timezone : serviceData.Timings.Timezone)}</p>
                                                </Row>
                                                <Row className="justify-content-start display-flex">
                                                    <p className="timings-alignment wid-140">Sunday</p> <p className="timings-alignment">:</p><p className="timings-alignment">{serviceData.Timings.sunday ? (serviceData.Timings.sunday.start + "-" + serviceData.Timings.sunday.end) : "Not Available"}</p>
                                                    <p className="timings-alignment">{(serviceData.Timings.timezone ? serviceData.Timings.timezone : serviceData.Timings.Timezone)}</p>
                                                </Row>
                                                {/* <Row className="justify-content-start display-flex">
                                                    <p className="timings-alignment wid-140">Timezone</p> <p className="timings-alignment">:</p><p className="timings-alignment">{(serviceData.Timings.timezone ? serviceData.Timings.timezone : serviceData.Timings.Timezone)}</p>
                                                </Row> */}
                                            </div>
                                            :
                                            <div style={{ color: '#555', marginLeft: '10px', fontSize: '15px', width: '500px' }}>
                                                <Row className="justify-content-start display-flex">
                                                    <p className="timings-alignment wid-140" >Monday to Friday</p><p className="timings-alignment">:</p><p className="timings-alignment">{serviceData.Timings.daily ? (serviceData.Timings.daily.start + "-" + serviceData.Timings.daily.end) : "Not Available"}</p>
                                                    <p className="timings-alignment">{(serviceData.Timings.timezone ? serviceData.Timings.timezone : serviceData.Timings.Timezone)}</p>
                                                </Row>
                                                <Row className="justify-content-start display-flex">
                                                    <p className="timings-alignment wid-140">Saturday</p><p className="timings-alignment">:</p><p className="timings-alignment">{serviceData.Timings.saturday ? (serviceData.Timings.saturday.start + "-" + serviceData.Timings.saturday.end) : "Not Available"}</p>
                                                    <p className="timings-alignment">{(serviceData.Timings.timezone ? serviceData.Timings.timezone : serviceData.Timings.Timezone)}</p>
                                                </Row>
                                                <Row className="justify-content-start display-flex">
                                                    <p className="timings-alignment wid-140">Sunday</p> <p className="timings-alignment">:</p><p className="timings-alignment">{serviceData.Timings.sunday ? (serviceData.Timings.sunday.start + "-" + serviceData.Timings.sunday.end) : "Not Available"}</p>
                                                    <p className="timings-alignment">{(serviceData.Timings.timezone ? serviceData.Timings.timezone : serviceData.Timings.Timezone)}</p>
                                                </Row>
                                                {/* <Row className="justify-content-start display-flex">
                                                    <p className="timings-alignment wid-140">Timezone</p> <p className="timings-alignment">:</p><p className="timings-alignment">{(serviceData.Timings.timezone ? serviceData.Timings.timezone : serviceData.Timings.Timezone)}</p>
                                                </Row> */}
                                            </div>
                                        :
                                        <div style={{ color: '#555', marginLeft: '10px', fontSize: '15px', width: '500px' }}>
                                            <Row className="justify-content-start display-flex">
                                                <p className="timings-alignment wid-140" >Monday to Friday</p><p className="timings-alignment">:</p><p className="timings-alignment">{serviceData.Timings.daily ? (serviceData.Timings.daily.start + "-" + serviceData.Timings.daily.end) : "Not Available"}</p>
                                                <p className="timings-alignment">{(serviceData.Timings.timezone ? serviceData.Timings.timezone : serviceData.Timings.Timezone)}</p>
                                            </Row>
                                            <Row className="justify-content-start display-flex">
                                                <p className="timings-alignment wid-140">Saturday</p><p className="timings-alignment">:</p><p className="timings-alignment">{serviceData.Timings.saturday ? (serviceData.Timings.saturday.start + "-" + serviceData.Timings.saturday.end) : "Not Available"}</p>
                                                <p className="timings-alignment">{(serviceData.Timings.timezone ? serviceData.Timings.timezone : serviceData.Timings.Timezone)}</p>
                                            </Row>
                                            <Row className="justify-content-start display-flex">
                                                <p className="timings-alignment wid-140">Sunday</p> <p className="timings-alignment">:</p><p className="timings-alignment">{serviceData.Timings.sunday ? (serviceData.Timings.sunday.start + "-" + serviceData.Timings.sunday.end) : "Not Available"}</p>
                                                <p className="timings-alignment">{(serviceData.Timings.timezone ? serviceData.Timings.timezone : serviceData.Timings.Timezone)}</p>
                                            </Row>
                                            {/* <Row className="justify-content-start display-flex">
                                                <p className="timings-alignment wid-140">Timezone</p> <p className="timings-alignment">:</p><p className="timings-alignment">{(serviceData.Timings.timezone ? serviceData.Timings.timezone : serviceData.Timings.Timezone)}</p>
                                            </Row> */}
                                        </div>
                                    : null}
                            </div>
                            : null}
                    </div>
                </div>
            </div>

            <List noHairlines disabled={props && props.details && props.details.service === "home" ? true : false}>
                {/* <h4 style={{ color: 'orange', marginLeft: '10px',paddingTop:'-55px !important' }}>Select Service</h4> */}
                <ListInput
                    type="select"
                    style={{
                        color: 'orange',
                        margin: "10px 20px",
                        border: "0.5px solid orange",
                        marginTop: '-15px',
                    }}
                    onInput={(e) => {
                        setFee(e.target.value);
                        clearSlotData(e.target.value);
                    }}
                    placeholder="Please choose..."
                >
                    {
                        props && props.details && props.details.service === "home" ?
                            <>
                                {servicesSelected.map((item, i) => (
                                    <option value={item.token_fee_std + "," + item._id + "," + item.name + "," + item.Duration} style={{ border: "3px solid orange", margin: '10px 20px' }}>{item.name}</option >
                                ))}
                            </>
                            :
                            <>
                                <option value="" >Select Service</option>
                                {
                                    service &&
                                    service.length > 0 &&
                                    service.map((item, i) => (
                                        <option value={item.token_fee_std + "," + item._id + "," + item.name + "," + item.Duration} >
                                            {item.name}
                                            {item.special ? " ( Special Event )" : null}
                                        </option>
                                    ))}
                            </>
                    }
                </ListInput>
                {props && props.details && props.details.service === 'home' ?
                    <div>
                        <h4 style={{ color: 'orange', 'marginTop': '2px', ' marginLeft': '10px', 'marginBottom': '10px', 'textAlign': 'center' }}>Select available dates</h4>
                        <div className="justify-content-center display-flex" >
                            <Calendar
                                minDate={moment().toDate()}
                                name="Date"
                                value={date}
                                onChange={handleChangeDate}
                            />
                        </div>
                        {date ? (
                            slot.length > 0 ? (
                                <List mediaList className="slot-list" className="justify-content-start display-flex" style={{ flexWrap: "wrap", marginTop: '-15px!important', }}>
                                    {slot && slot.length > 0 ? (
                                        slot.map((item, i) => (
                                            <div onChange={handleChange} style={{ margin: " 0px 20px", }}>
                                                <List>
                                                    <input type="radio" name='timeslot' value={item + " " + timezone} />{item + " " + timezone}
                                                </List>
                                            </div>
                                        ))) : null}
                                </List>
                            ) : <Block style={{ fontSize: "15px" }}>
                                No slots available to book a service
                            </Block>
                        ) : null}
                    </div>
                    :
                    serviceName ?
                        <div>
                            <h4 style={{ color: 'orange', 'marginTop': '2px', ' marginLeft': '10px', 'marginBottom': '10px', 'textAlign': 'center' }}>Select available dates</h4>
                            <div className="justify-content-center display-flex" >
                                <Calendar
                                    minDate={specialStartDate ? specialStartDate : moment().toDate()}
                                    maxDate={specialStartDate ? specialStartDate : null}
                                    activeStartDate={specialStartDate ? specialStartDate : moment().toDate()}
                                    name="Date"
                                    value={date}
                                    onChange={handleChangeDate}
                                />
                            </div>
                            {date ? (
                                slot.length > 0 ? (
                                    <List mediaList className="slot-list" className="justify-content-start display-flex" style={{ flexWrap: "wrap", marginTop: '-15px!important', }}>
                                        {slot && slot.length > 0 ? (
                                            slot.map((item, i) => (
                                                <div onChange={handleChange} style={{ margin: " 0px 20px", }}>
                                                    <List>
                                                        <input type="radio" name='timeslot' value={item + " " + timezone} />{item + " " + timezone}
                                                    </List>
                                                </div>
                                            ))) : null}
                                    </List>
                                ) : <Block style={{ fontSize: "15px" }}>
                                    No slots available to book a service
                                </Block>
                            ) : null}
                        </div>
                        : null}
            </List>
            <List noHairlines>
                {fee ? (
                    <ListItem
                        style={{
                            margin: "10px 20px",
                            border: "1px solid orange",
                        }}
                    >
                        <div>
                            Total Tokens: {fee}
                        </div>

                    </ListItem>
                ) : null}
                {props && props.details && props.details.service === 'home' && defaultfee ?
                    <ListItem
                        style={{
                            margin: "10px 20px",
                            border: "1px solid orange",
                        }}
                    >
                        <div>
                            Total Fee: {defaultfee}
                        </div>
                        {/* <div>
                            {(serviceData && serviceData.requestType === "TempleService")
                                ?
                                <button className="col button button-small button-round button-fill" round raised style={{ 'width': '100px', 'height': '30px', }} onClick={() => { handleDonation("callToAction", "Donate") }}>Donate</button>
                                :
                                <button className="col button button-small button-round button-fill" round raised style={{ 'width': '100px', 'height': '30px', }} onClick={() => { handleDonation("callToAction", "Dakshina") }} >Dakshina</button>
                            }
                        </div> */}
                    </ListItem>
                    : null}
                {/* <hr color='#bdc7cb'></hr> */}
                {serviceName ?
                    <Block style={{ padding: '0px', backgroundColor: 'black', border: "1px solid orange", margin: '20px 20px' }}>
                        <textarea placeholder="NOTE" color='red' maxLength='250' style={{ backgroundColor: '#ffffff', paddingLeft: '16px' }}
                            onInput={(e) => {
                                setNote(e.target.value);
                            }}>
                        </textarea>
                    </Block>
                    : null}

                {props && props.details && props.details.service === 'home' ?
                    <Block style={{ padding: '0px', backgroundColor: 'black', border: "1px solid orange", margin: '20px 20px' }}>
                        <textarea placeholder="NOTE" color='red' maxLength='250' style={{ backgroundColor: '#FFFFFF', paddingLeft: '16px' }}
                            onInput={(e) => {
                                setNote(e.target.value);
                            }}>
                        </textarea>
                    </Block>
                    : null}

                {errorMessage ? (
                    <Block className="display-flex justify-content-center" style={{ color: 'red' }}>
                        {errorMessage}
                    </Block>) : null
                }
                <Block style={{ 'display': 'flex', 'justifyContent': 'center' }}>
                    <Block>
                        <Button fill round raised style={{ 'width': '100px', }} onClick={() => showbooking(service, Date)}>Continue</Button>
                    </Block>
                    <Block style={{ 'display': 'flex', 'justifyContent': 'center', fontSize: '20px' }}>
                        <Button className="link col button color-raised border-raised" style={{ border: '2px solid', 'width': '100px', borderRadius: '70px' }} onClick={() => { props.f7router.back() }}>Cancel</Button>
                    </Block>
                </Block>
            </List>
        </Page >
    );
};

export default ServicesPage;