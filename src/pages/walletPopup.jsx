import React, { useState, useEffect, useContext } from 'react';
import {
    f7,
    Page,
    Block,
    Button,
    List,
    ListInput,
    Row
} from "framework7-react";
import Paypal from "./Payment/paypal";
import Razorpay from "./Payment/razorpay/razorpay";
import {
    getLoggedinUserDetails,
    getCountry
} from '../utils/api';
import loggedInUser from '../js/userdetails.js';
import { useSelector } from 'react-redux';

const Popup = props => {
    const [country, setCountry] = useState([]);
    const [balancePopup, setBalancePopup] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [paypal, setPaypal] = useState(false);
    const [razorpay, setRazorpay] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [balance, setBalance] = useState("");
    const [errors, setErrors] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [errorMessage, setErrorMessage]=useState(false);

    const userData = useSelector((state => state && state.auth && state.auth.userDetails));
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
        f7.preloader.show();
        setIsOpen(false);
        f7.preloader.hide();
    };

    const handlePayNow = () => {
        if (userData && country && country === "United States") {
            setPaypal(true);
        } else {
            setRazorpay(true);
        }
    };
    const modalClose = () => {
        setRazorpay(!razorpay);
    }
    const handleNextStep = () => {
        let finalBalance =Number(balance);
        if( country === "") {
            setErrorMessage(true);
        } else if(finalBalance<=0 ) {
            setErrors(true);
        }
        else {
            setShowPayment(true);
        }
    };
    const payload = {};
    payload.tokens = userData && userData.tokens + Number(balance);
    payload.tokenQuantity = Number(balance);
    payload.amount =
        Number(balance) *
        (userData && country && country === "United States" ? 0.1 : 5);
    //(userData && country && country === "India" ? 95 : 1.6);
    payload.userId = userData && userData.userId;
    payload._id = userData && userData._id;

    return (
        <div>
            {isOpen ? (
                <div name="services" className="color-deeporange custom-bg popup-box">
                    <div className="box">
                        <div className="close-icon" style={{ 'float': "right" }}>
                            <span style={{ cursor: 'pointer' }} onClick={props.handleClose}><i class="f7-icons size-22 color-orange" style={{ 'color': 'orange', 'fontSize': '22px' }}>xmark_circle</i></span>
                        </div>
                        {!showPayment ? (
                            <Block style={{ 'background-color': '#FFFFFF', 'margin': '20px !important' }}>
                                {/* <h2 id="addbalance" style={{ textAlign: "center" }}>
                                Add Balance
                                </h2> */}
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
                                                setBalance(e.target.value);
                                            }}
                                            style={{ color: 'orange' }
                                            }
                                        />
                                        {errors ? 
                                                <p className="error-text" style={{ color: "red", textAlign: "center" }}>Please enter number of tokens to be added</p>
                                            : ''}
                                        {errorMessage ?
                                            <Block className="display-flex justify-content-center" style={{ color: 'red' }}>
                                            <p onClick={()=>{f7.views.main.router.navigate('/profile/');setIsOpen(!isOpen);setErrorMessage(false)}} style={{ textDecoration: 'underline', fontWeight: " 700", margin: '0px', cursor: 'pointer' }}>Please add a country in your profile to add tokens</p>
                                        </Block> : null}
                                    </List>
                                </form>
                                {balance  && (country != "") && (
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
                                                ? " 0.1"
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
                            </Block>
                        ) : (
                            <Block style={{ 'background-color': '#FFFFFF', padding: "25px 0px 0px 15px", }}>
                                <h2 id="addbalance" style={{ textAlign: "center" }}>
                                    Payment
                                </h2>
                                <p style={{ borderBottom: "1px solid #eee", padding: "10px 0", }}>
                                    <span style={{ display: "inline-block", width: "48%" }}>
                                        Total Tokens
                                    </span>{" "}
                                    :{" "}
                                    <span style={{
                                        display: "inline-block",
                                        width: "48%",
                                        textAlign: "center",
                                    }}>
                                        {balance}
                                    </span>
                                </p>
                                <p style={{ borderBottom: "1px solid #eee", padding: "10px 0", }}>
                                    <span style={{ display: "inline-block", width: "48%" }}>
                                        Total Price
                                    </span>{" "}
                                    :{" "}
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: "48%",
                                            textAlign: "center",
                                        }}>
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
                                {/*  <p style={{
                                        borderBottom: "1px solid #eee",
                                        padding: "10px 0",
                                    }}>
                                    <span style={{ display: "inline-block", width: "48%" }}>
                                        Processing Charges
                                    </span>{" "}
                                    :{" "}
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: "48%",
                                            textAlign: "center",
                                        }}>
                                        {userData && country && country === "India" ? (
                                            <span>&#x20B9; 95</span>
                                        ) : (
                                            "$1.36"
                                        )}
                                    </span>
                                </p> */}
                                <p style={{
                                    borderBottom: "1px solid #eee",
                                    padding: "10px 0",
                                }}>
                                    <span style={{ display: "inline-block", width: "48%" }}>
                                        Total Cost
                                    </span>{" "}
                                    :{" "}
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: "48%",
                                            textAlign: "center",
                                        }}>
                                        {userData && country && country === "United States" ? (
                                            "$"
                                        ) : (
                                            <span>&#x20B9;</span>
                                        )}{" "}
                                        {balance *
                                            (userData && country && country === "United States"
                                                ? 0.1
                                                : 5)}
                                        {/*   (userData && country && country === "India"
                                                ? 95
                                                : 1.36) */ }
                                    </span>
                                </p>
                                <Button style={{
                                    width: "200px",
                                    margin: "0 auto",
                                    marginBottom: 30,
                                }}
                                    outline
                                    color="blue"
                                    onClick={handlePayNow}>Pay Now
                                </Button>
                                {/*  {paypal && <Paypal payload={payload} onClose={onClose} />}
                                {razorpay && (
                                    <Razorpay payload={payload} onClose={onClose} />
                                )} */}
                            </Block>
                        )}
                        {balance == "" || (paypal && <Paypal payload={payload} onClose={onClose} />)}
                        {razorpay && (
                            <Razorpay payload={payload} modalClose={modalClose} onClose={onClose} />
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    )
};
export default Popup;