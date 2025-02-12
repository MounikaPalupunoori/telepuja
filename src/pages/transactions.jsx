import React, { useState, useEffect, useContext } from 'react';
import logo from '../assets/img/logo.png';
import coin from '../assets/img/coin.png';
import Avatar from "../assets/img/avatar.jpg";
import {
    Icon,
    Page,
    NavLeft,
    NavTitle,
    Navbar,
    NavRight,
    Button,
    Link,
    f7,
    List,
    ListInput,
    ListItem,
} from "framework7-react";
import {
    getLoggedinUserDetails,
    getPurohitTransactions,
} from '../utils/api';
import moment from "moment";
import toastr from "toastr";
import loggedInUser from '../js/userdetails';
import AddTokens from '../assets/img/AddToken.png';
import UseTokens from '../assets/img/UseToken.png';

const TransactionsPage = (props) => {
    const [userData, setUserData] = useState('');
    const [transactions, setTransactions] = useState([]);
    useEffect(() => {
        f7.preloader.show();
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
        if (userData && userData.role) {
            let role;
            if (userData.role == 'purohit') {
                role = "purohit";
                getPurohitTransactions(userData._id, role).then((resp) => {
                    setTransactions(resp);
                    f7.preloader.hide();
                });
            }
            else if (userData.role == 'temple') {
                role = "temple";
                getPurohitTransactions(userData._id, role).then((resp) => {
                    setTransactions(resp);
                    f7.preloader.hide();
                });
            }
            else {
                getPurohitTransactions(userData._id).then((resp) => {
                    setTransactions(resp);
                    f7.preloader.hide();
                })
               
            }
        }
    }, [userData]);

    const transcationDetails = (item) => {
        props.f7router.navigate('/transactionDetails/', { props: { transactions: item } });
      }
    return (
        <Page name="services" className="color-deeporange custom-bg">
            <Navbar className="header-bg">
                {/* <a href="/home/" slot="left" className="link back"><Icon f7="arrow_left" backLink="Back" color="black" style={{fontWeight:'400',fontSize:'20px',left:'-5px'}}></Icon></a> */}
                <NavLeft>
                    <Link href='/home/'>
                        <img className="logoimage" src={logo} width="60"></img>
                    </Link>
                </NavLeft>
                <div style={{ 'width': '100%', 'display': 'flex', position: 'fixed', 'justifyContent': 'center', alignItems: 'center', color: 'white' }}>
                    Transactions
                </div>
                <NavRight className="header-img">
                    <Link className="tab-link tab-outer bottom-nav-icon" size="44px" panelOpen="right" style={{ 'color': '#fff' }} href="">
                        <Icon material="reorder" style={{ fontSize: '30px' }}></Icon></Link>
                </NavRight>
            </Navbar>
            <List
                simple-list
                className="list-container"
                id="listmobileview">
                {transactions && transactions.length > 0 ? (
                    transactions.sort((a, b) => {
                        return (
                            new Date(b.timestamp) -
                            new Date(a.timestamp)
                        );
                    }).map((item) => (
                        <ListItem id="balancecard" onClick={() => transcationDetails(item)} style={{'cursor':'pointer'}}>
                            <img src={item.type === "Debit" ? UseTokens : AddTokens} />
                            <p
                                style={{
                                     color:
                                        item.type === "Debit" ? "red" : "green",
                                }}
                                id="balancedatemobile"
                                className="balanceDate"
                            >

                                {item.type == "Debit"
                                    ? "Tokens Used"
                                    : "Tokens added"}
                                <br />{" "}
                                {/* <span>
                                    {moment(parseInt(item.timestamp)).format(
                                        "hh:mm A"
                                    )}
                                </span> */}
                            </p>
                            <p className="balance-rounded">
                                <span
                                    className="round"
                                    id="mobileround"
                                    style={{
                                        color:
                                            item.type === "Debit" ? "red" : "green",
                                    }}
                                >
                                    {item.type == "Debit"
                                        ? "-"
                                        : "+"}
                                    {item.transactionType == "Wallet Transaction"
                                        ? item.tokenQuantity
                                        : item.tokenQuantity}
                                </span>{" "}
                                <br />
                            </p>
                        </ListItem>
                    ))
                ) : (
                    <div style={{ textAlign: "center", color: 'orange' }}>
                        <i>No transactions available</i>
                    </div>
                )}
            </List>
        </Page >
    );
};

export default TransactionsPage;