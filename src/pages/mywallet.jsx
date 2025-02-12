import React, { useState, useEffect, useContext } from 'react';
import logo from '../assets/img/logo.png';
import coin from '../assets/img/coin.png';
import Avatar from "../assets/img/avatar.jpg";
import moment from "moment";
import SideBar from "./sidenav";
import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile,
    ConsoleView
} from "react-device-detect";
import {
    f7,
    Page,
    Navbar,
    NavTitle,
    Block,
    Button, NavLeft,
    NavRight,
    Icon,
    List,
    ListItem,
    ListInput,
    Link,
    Row,
    Card,
    CardContent,
    CardHeader,
    Searchbar,
    Accordion,
    AccordionItem,
    AccordionContent,
    AccordionToggle,
    AccordionList,
} from "framework7-react";
import Paypal from "../pages/Payment/paypal";
import Razorpay from "../pages/Payment/razorpay/razorpay";
import UseTokens from '../assets/img/UseToken.png';
import AddTokens from '../assets/img/AddToken.png';
import {
    getLoggedinUserDetails,
    getCountry,
    getPurohitTransactions
} from '../utils/api';
import { appContext } from '../components/app';
import loggedInUser from '../js/userdetails.js';
import { user } from '../firebase/firebase';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux'
import { compose } from 'redux';
import { updateTransaction } from '../store/actions/transaction';

const MyWalletPage = (props) => {
    const [country, setCountry] = useState([]);
    const [balancePopup, setBalancePopup] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [paypal, setPaypal] = useState(false);
    const [razorpay, setRazorpay] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [balance, setBalance] = useState("");
    const [errors, setErrors] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [lastTransaction, setlastTransaction] = useState([]);
    const [transactionPage, setTransactionPage] = useState(false);
    const [walletPage, setWalletPage] = useState(true);
    const [filterList, setFilterList] = useState([]);
    const [errorMessage, setErrorMessage]=useState(false);
    

    // get the updated token from the from redux store using the hook useSelector
    const userData = useSelector((state => state && state.auth && state.auth.userDetails));
    console.log(userData)
    useEffect(() => {
        if (userData && userData._id) {
            if (userData.tokens) {
                userData.tokens = (Number(userData.tokens)).toFixed(2);
            }
        }
    }, [userData._id && userData.tokens]);

    useEffect(() => {
        if (userData && userData.role === "devotee") {
            getCountry(userData.userId)
                .then((countryData) => {
                    if(countryData.statusCode===200){
                        setCountry(countryData.data)
                    }  
                })
                .catch(error => {
                    setCountry('');
                })
        } else {
            console.warn("No user details found.");
        }
    }, [userData.role]);
    const onClose = () => {
        setRefresh(!refresh);
        setShowPayment(false);
        setBalance("");
        setBalancePopup(false);
    };
    const modalClose = () => {
        setRazorpay(!razorpay);
    }
    const handlePayNow = () => {
        if (userData && country && country === "United States") {
            setPaypal(!paypal);
        } else {
            setRazorpay(!razorpay);
        }
    };
    const handleNextStep = () => {
        let finalBalance =Number(balance);
        if(country === "") {
            setErrorMessage(true);
        }
        else if(finalBalance<=0){
            setErrors(true);
        }
        else if(finalBalance>=0 && country !== ""){
            setShowPayment(true);
        }
    };
    useEffect(() => {
        f7.preloader.show();
        if (userData && userData.role) {
            let role;
            if (userData.role == 'purohit') {
                role = "purohit";
                getPurohitTransactions(userData._id, role).then((resp) => {
                    setTransactions(resp);
                    setFilterList(resp);
                    f7.preloader.hide();
                });
            }
            else if (userData.role == 'temple') {
                role = "temple";
                getPurohitTransactions(userData._id, role).then((resp) => {
                    setTransactions(resp);
                    setFilterList(resp);
                    f7.preloader.hide();
                });
            }
            else
                getTransactionList();
        }
    }, [userData.role]);

    const walletPages = () => {
        setWalletPage(true);
        setTransactionPage(false);
        setShowPayment(false);
        setBalance("");
    }

    const transactionPages = () => {
        setWalletPage(false);
        setTransactionPage(true);
    }

    const getTransactionList = () => {
        let transactionUpdates = [];
        getPurohitTransactions(userData._id).then((resp) => {
            setTransactions(resp);
            setFilterList(resp);
            resp.forEach((x) => {
                if (x.amount && x.type == 'Credit') {
                    transactionUpdates.push(x);
                }
            })
            transactionUpdates.sort(function (a, b) { return moment(b.createdAt).format('x') - moment(a.createdAt).format('x') });
            transactionUpdates.forEach((x, index) => {
                if (index == 0)
                    lastTransaction.push(x);
                return;
            })
            f7.preloader.hide();
        })
    }


    const payload = {};
    payload.tokens = userData && userData.tokens + Number(balance);
    payload.tokenQuantity = Number(balance);
    payload.amount =
        Number(balance) *
        (userData && country && country === "United States" ? 0.1 : 5);
    // +
    //     (userData && country && country === "India" ? 95 : 1.6);
    payload.userId = userData && userData.userId;
    payload._id = userData && userData._id;

    //transaction filter
    const filterTransactions = (event) => {
        let newList = filterList;
        let transaction = newList.map(x => {
            if (x.tokenQuantity.toString().indexOf(event.target.value.toLowerCase()) > -1
                // x.customerName.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1 || 
                //  x.requestId.serviceName.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1 
            ) {
                return x;
            } else {
                return;
            }
        }).filter(x => x);
        if (transaction.length == 0) {
            setTransactions([]);
        } else {
            setTransactions(transaction);
        }
    }
    //let updatedTransaction = useSelector(state => state && state.data);
    useEffect(() => {
        if (userData.role === 'purohit' || userData.role === "temple") {
            setTransactionPage(true);
            setWalletPage(false);
        }
    }, [userData.role]);

    return (
        <Page name="services" className="color-deeporange custom-bg padding-top" style={{ overflowY: 'hidden' }}>
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
                    <NavTitle style={{ color: 'white' }}>Wallet</NavTitle>
                </Navbar>
            </div>
            <SideBar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />

            <Block className="justify-content-start" style={{ padding: '0px', margin: '0px', overflowY: 'hidden' }}>
                <Card>
                    <CardContent style={{ padding: '10px' }}>
                        <Row className="justify-content-center">
                            {userData.role === 'devotee' ?
                                <h3 onClick={walletPages} style={{
                                    cursor: "pointer", margin: '0px', padding: '0px 10px',
                                    color: walletPage == true ? 'orange' : '',
                                    borderBottom: walletPage == true ? '1px solid' : ''
                                }}>Wallet</h3>
                                : null}
                            <h3 onClick={transactionPages} style={{
                                cursor: "pointer", margin: '0px', padding: '0px 10px',
                                color: transactionPage == true ? 'orange' : '',
                                borderBottom: transactionPage == true ? '1px solid' : ''
                            }}>Transaction History</h3>
                        </Row>
                    </CardContent>
                </Card>

                <Card style={{ minHeight: '74vh', maxHeight: '74vh', overflowY: 'auto' }}>
                    <CardHeader style={{ padding: '10px 0px' }}>
                        <Block style={{ padding: '0px 13px', width: '100%' }}>
                            <p className="strong trans-mg-bt">Total Current Tokens</p>
                            <p style={{ 'fontSize': '15px', 'margin': '0px 0px 10px 5px', 'display': 'flex', alignItems: 'center' }}>
                                <img style={{ width: '40px' }} src={coin}></img><span style={{ fontSize: '30px' }}>{userData.tokens}</span></p>
                            {/* {!transactionPage && userData.role === 'devotee' && (
                                <Row className="justify-content-start">
                                    <p style={{ 'fontSize': '15px', 'margin': "0px 0px 10px 0px", }}>Last purchase </p>
                                    <p style={{ 'fontSize': '15px', 'margin': '0px 0px 10px 5px', 'display': 'flex', alignItems: 'center' }}>

                                        {lastTransaction.map((item) => (
                                            <p style={{ margin: '0px', display: 'flex', alignItems: 'center' }}>
                                                <img style={{ width: '20px', marginRight: '2px' }} src={coin}></img>{item.tokenQuantity} tokens on
                                                {moment(item.timestamp).format(" ddd DD-MMM-YY")}
                                            </p>
                                        ))}</p>
                                </Row>)}  */}
                            {/* {transactionPage && (
                                <Searchbar
                                    clearButton={true}
                                    placeholder="Search Transactions"
                                    onChange={(event) => filterTransactions(event)}
                                ></Searchbar>

                            )} */}
                        </Block>
                    </CardHeader>
                    {walletPage && userData.role === 'devotee' ? (
                        <CardContent style={{ paddingBottom: "0px" }}>
                            {!showPayment ? (
                                <Block style={{ 'background-color': '#FFFFFF', 'padding': '25px' }}>
                                    <form>
                                        <List noHairlines>
                                            <ListInput
                                                type="number"
                                                outline
                                                validate pattern="[0-9]*"
                                                label="Add Tokens"
                                                value={balance}
                                                onInput={(e) => {
                                                    setErrors(false);
                                                    setErrorMessage(false);
                                                    setBalance(e.target.value);
                                                }}
                                                style={{ color: 'orange' }}
                                            />
                                           
                                            {errors ? 
                                                <p className="error-text" style={{ color: "red", textAlign: "center" }}>Please enter number of tokens to be added</p>
                                            : ''}
                                             {errorMessage ? 
                                                <p className="error-text" style={{ color: "red", textAlign: "center" }}>Please add a country in your profile to add tokens</p>
                                            : ''}
                                           </List> 
                                          </form> 
                                        
                                    {balance  && (country != "") &&(
                                        <p>
                                            <p style={{ textAlign: "center" }}>Token Value: </p>
                                            <p style={{ textAlign: "center" }}>
                                                <b>{balance}</b> *{" "}
                                                {userData && country && country === "United States" ? (
                                                    "$"
                                                ) : (
                                                    <span>&#x20B9;</span>
                                                )}{" "}
                                                {userData && country && country === "United States"
                                                    ? "0.1"
                                                    : "5"}{" "}
                                                   ={" "}
                                                <b>
                                                    {" "}
                                                    {balance *
                                                        (userData && country && country === "United States"
                                                            ? 0.1
                                                            : 5)}
                                                </b>{" "}
                                            </p>
                                        </p>
                                    )}
                                    <Block className="justify-content-center display-flex">
                                        <Button
                                            fill
                                            className="submit-btn"
                                            onClick={handleNextStep}
                                        >Proceed to pay
                                        </Button>
                                    </Block>
                                    {/* <Block className="justify-content-center display-flex">
                                            <Link href='/transactions/'>
                                                <h3 style={{ textDecoration: 'underline' }}>Click here to view Transaction History</h3>
                                            </Link>
                                        </Block> */}
                                </Block>
                            ) : (
                                <Block style={{ 'background-color': '#FFFFFF', padding: "25px", paddingBottom: "0px" }}>
                                    <h2 id="addbalance" style={{ textAlign: "center", margin: '0px' }}>
                                        Payment
                                        </h2>
                                    <p
                                        style={{
                                            borderBottom: "1px solid #eee",
                                            padding: "10px 0",
                                        }}
                                    >
                                        <span style={{ display: "inline-block", width: "48%" }}>
                                            Total Tokens
                                            </span>{" "}
                                               :{" "}
                                        <span
                                            style={{
                                                display: "inline-block",
                                                width: "48%",
                                                textAlign: "center",
                                            }}
                                        >
                                            {balance}
                                        </span>
                                    </p>
                                    <p
                                        style={{
                                            borderBottom: "1px solid #eee",
                                            padding: "10px 0",
                                        }}
                                    >
                                        <span style={{ display: "inline-block", width: "48%" }}>
                                            Total Price
                                            </span>{" "}
                                             :{" "}
                                        <span
                                            style={{
                                                display: "inline-block",
                                                width: "48%",
                                                textAlign: "center",
                                            }}
                                        >
                                            {userData && country && country === "United States" ? (
                                                "$"
                                            ) : (
                                                <span>&#x20B9;</span>
                                            )}{" "}
                                            {balance *
                                                (userData && country && country === "United States"
                                                    ? 0.1
                                                    : 5)}
                                        </span>
                                    </p>
                                    {/* <p
                                            style={{
                                                borderBottom: "1px solid #eee",
                                                padding: "10px 0",
                                            }}
                                        >
                                            <span style={{ display: "inline-block", width: "48%" }}>
                                                Processing Charges
                                            </span>{" "}
                                              :{" "}
                                            <span
                                                style={{
                                                    width: "200px",
                                                }}
                                                onClick={handlePayNow}
                                            >
                                                {userData && country && country === "India" ? (
                                                    <span>&#x20B9; 95</span>
                                                ) : (
                                                    "$1.36"
                                                )}
                                            </span>
                                        </p> */}
                                    <p
                                        style={{
                                            borderBottom: "1px solid #eee",
                                            padding: "10px 0",
                                        }}
                                    >
                                        <span style={{ display: "inline-block", width: "48%" }}>
                                            Total Cost
                                             </span>{" "}
                                             :{" "}
                                        <span
                                            style={{
                                                display: "inline-block",
                                                width: "48%",
                                                textAlign: "center",
                                            }}
                                        >
                                            {userData && country && country === "United States" ? (
                                                "$"
                                            ) : (
                                                <span>&#x20B9;</span>
                                            )}{" "}
                                            {balance *
                                                (userData && country && country === "United States"
                                                    ? 0.1
                                                    : 5)}
                                            {/* +
                                                    (userData && country && country === "India"
                                                        ? 95
                                                        : 1.36) */}
                                        </span>
                                    </p>
                                    <Button
                                        style={{
                                            width: "200px",
                                            margin: "0 auto",
                                            marginBottom: 30,
                                        }}
                                        outline
                                        color="blue"
                                        onClick={handlePayNow}
                                    >
                                        Pay Now
                                        </Button>
                                   {/*  {paypal && <Paypal payload={payload} onClose={onClose} />}
                                    {razorpay && (
                                        <Razorpay payload={payload} setUserData={setUserData} onClose={onClose} />
                                    )} */}
                                    
                                </Block>
                            )}
                            {balance == "" || (paypal && <Paypal payload={payload} onClose={onClose} />)}
                            {razorpay && (
                                <Razorpay payload={payload} modalClose={modalClose} onClose={onClose} />
                            )}
                        </CardContent>
                    ) : (
                        <CardContent>
                            <div className="list accordion-list">
                                {transactionPage && transactions && transactions.length > 0 ? (
                                    transactions.sort((a, b) => {
                                        return (
                                            new Date(b.timestamp) -
                                            new Date(a.timestamp)
                                        );
                                    }).map((item) => (
                                        // <div class="accordion-item">
                                        //     <a href="" class="item-link item-content">
                                        //         <div class="item-inner">
                                        //             <div class="item-title">Item 1</div>
                                        //         </div>
                                        //     </a>
                                        //     <div class="accordion-item-content">Item 1 content ...</div>
                                        // </div>

                                        <AccordionItem>
                                            <a href="" class="item-link item-content">
                                                <div class="item-inner">
                                                    <div>
                                                        {item.requestId ?
                                                            <p style={{ 'margin': '5px 0px', 'fontSize': '16px' }}>{item.requestId.serviceName}</p>
                                                            : <p style={{ 'margin': '5px 0px', 'fontSize': '16px' }}>{item.customerName}</p>}
                                                        {item.amount && item.type == "Credit" ? "TokensPurchased" : ""}
                                                        <p style={{ margin: '5px 0px', color: 'grey', fontSize: '14px' }}>{moment(item.timestamp).format(" ddd DD-MMM-YY")} {moment(item.timestamp).format("hh:mm a")}
                                                        </p>
                                                    </div>
                                                    <div style={{ color: item.type === "Debit" ? "red" : "green", }}>
                                                        {item.type == "Debit"
                                                            ? "-"
                                                            : "+"}
                                                        {item.transactionType == "Wallet Transaction"
                                                            ? item.tokenQuantity
                                                            : item.tokenQuantity}
                                                    </div>
                                                </div>
                                            </a>
                                            <AccordionContent style={{ paddingLeft: '40px' }}>
                                                <Row className="justify-content-start">
                                                    <h3 className="strong" style={{ 'marginBottom': "10px", 'fontWeight': '500', 'fontSize': '15px' }}>TRXN ID:</h3>
                                                    <p style={{ 'marginBottom': '10px', 'marginLeft': '5px', 'fontSize': '15px' }}>{item._id}</p>
                                                </Row>
                                            </AccordionContent>
                                            {item.customerName && !item.requestId && (
                                                <AccordionContent className="accordion-pad-lt">
                                                    <Row className="justify-content-start">
                                                        {userData.role !== 'devotee' ?
                                                            <h3 className="strong trans-mg-bt">Donated by:</h3>
                                                            : <h3 className="strong trans-mg-bt">Donated To:</h3>}
                                                        <p className="trans-mg-bl">{item.customerName}</p>
                                                    </Row></AccordionContent>
                                            )}
                                            {item.requestId ?
                                                <AccordionContent className="accordion-pad-lt">
                                                    <Row className="justify-content-start">
                                                        <p className="strong trans-mg-bt">Service Booked on </p>
                                                        <p className="trans-mg-bl" style={{ 'fontWeight': '500' }}>{moment(item.requestId.requestedDate).format("ddd DD-MMM-YY")}</p>
                                                    </Row></AccordionContent> : null}
                                            {item.requestId ?
                                                <AccordionContent className="accordion-pad-lt">
                                                    <Row className="justify-content-start">
                                                        <p className="strong trans-mg-bt color-grey">Service BID: </p>
                                                        <p className="trans-mg-bl color-grey">{item.requestId._id}</p>
                                                    </Row> </AccordionContent>
                                                : null}
                                            {item.requestId && userData.role === 'devotee' && item.type === "Debit" ?
                                                <AccordionContent className="accordion-pad-lt">
                                                    <Row className="justify-content-start">
                                                        <p className="strong trans-mg-bt">Paid To: </p>
                                                        <p className="trans-mg-bl">{item.requestId.purohithName}</p>
                                                    </Row></AccordionContent> : null
                                            }
                                            {item.requestId && userData.role !== 'devotee' && item.type === "Debit" ?
                                                <AccordionContent className="accordion-pad-lt">
                                                    <Row className="justify-content-start">
                                                        <p className="strong trans-mg-bt">Paid To: </p>
                                                        <p className="trans-mg-bl">{item.requestId.userName}</p>
                                                    </Row></AccordionContent> : null
                                            }
                                            {item.requestId && userData.role === 'devotee' && item.type === "Credit" ?
                                                <AccordionContent className="accordion-pad-lt">
                                                    <Row className="justify-content-start">
                                                        <p className="strong trans-mg-bt">Received From: </p>
                                                        <p className="trans-mg-bl">{item.requestId.purohithName}</p>
                                                    </Row></AccordionContent> : null
                                            }

                                            {item.requestId && userData.role !== 'devotee' && item.type === "Credit" ?
                                                <AccordionContent className="accordion-pad-lt">
                                                    <Row className="justify-content-start">
                                                        <p className="strong trans-mg-bt">Received From: </p>
                                                        <p className="trans-mg-bl">{item.requestId.userName}</p>
                                                    </Row></AccordionContent> : null
                                            }
                                            {item.requestId && item.requestId.status ?
                                                <AccordionContent className="accordion-pad-lt">
                                                    <Row className="justify-content-start">
                                                        <p className="strong trans-mg-bt" style={{ marginTop: '0px' }}>Booking Status: </p>
                                                        {item.requestId.status == "Completed" ? <p className="trans-mg-bl puja-status" style={{ 'backgroundColor': '#77B300', }}>{item.requestId.status}</p> : null}
                                                        {item.requestId.status == "Requested" ? <p className="trans-mg-bl puja-status" style={{ 'backgroundColor': '#FF9900', }}>{item.requestId.status}</p> : null}
                                                        {item.requestId.status == "Accepted" ? <p className="trans-mg-bl puja-status" style={{ 'backgroundColor': '#ffc107', }}>{item.requestId.status}</p> : null}
                                                        {item.requestId.status == "Rejected" ? <p className="trans-mg-bl  puja-status" style={{ 'backgroundColor': '#FF1A1A', }}>{item.requestId.status}</p> : null}
                                                        {item.requestId.status == "Cancelled" ? <p className="trans-mg-bl puja-status" style={{ 'backgroundColor': 'red', }}>{item.requestId.status}</p> : null}
                                                    </Row> </AccordionContent>
                                                : null}
                                        </AccordionItem>

                                    ))
                                ) : (
                                    <div style={{ textAlign: "center", color: 'orange' }}>
                                        <i>No transactions available</i>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    )}
                </Card>
            </Block>
        </Page >
    );
};
export default MyWalletPage;