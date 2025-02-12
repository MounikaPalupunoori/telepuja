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
    CardContent,
    Block,
    Row
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
import userDetails from '../js/user_details';

const TransactionDetailsPage = (props) => {
    const [userData, setUserData] = useState('');
    const transactionDetails = props.transactions;
   
    useEffect(() => {
        f7.preloader.show();
        let user = loggedInUser();
        if (user && user.uid) {
            getLoggedinUserDetails(user.uid).then((result) => {
                if (result) {
                    setUserData(result);
                    f7.preloader.hide();
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
    return (
        <Page name="services" className="color-deeporange custom-bg">
            <Navbar className="header-bg">
                <NavLeft>
                    <Link href='/home/'>
                        <img className="logoimage"  src={logo} width="60"></img>
                    </Link>
                </NavLeft>
                <div style={{ 'width': '100%', 'display': 'flex', position: 'fixed', 'justifyContent': 'center', alignItems: 'center', color: 'white' }}>
                    Transaction Details
                </div>
                <NavRight className="header-img">
                    <Link className="tab-link tab-outer bottom-nav-icon" size="44px" panelOpen="right" style={{ 'color': '#fff' }} href="">
                        <Icon material="reorder" style={{ fontSize: '30px' }}></Icon></Link>
                </NavRight>
            </Navbar>
            <Block className="display-flex justify-content-center background-color" style={{ 'margin': '0px' }}>
                <Block style={{ 'marginTop': '15px' }}>
                    <Row>
                        <p style={{ 'fontWeight': '500', 'fontSize': '18px', 'margin': "0px" }}>Transaction successfull <i class="f7-icons size-25 color-red" style={{'color':'green','fontSize':'20px'}}>checkmark_circle_fill</i>
                            </p></Row>
                    <Row className="justify-content-center">
                        <img  style={{'margin': '-16px -36px'}} src={transactionDetails.type === "Debit" ? UseTokens : AddTokens} />
                        <p  style={{ 'fontWeight': '700', 'margin': '0px', 'fontSize': '35px',  
                        color: transactionDetails.type === "Debit" ? "red" : "green" }}>{transactionDetails.tokenQuantity}</p>
                    </Row>
                    <Row className="justify-content-center">
                        <p style={{ 'margin': '0px' }}>{moment(transactionDetails.timestamp).format(" ddd DD-MMM-YY")} {moment(transactionDetails.timestamp).format("hh:mm a")} </p>
                    </Row>
                </Block>
            </Block>
            <Block style={{ 'marginLeft': '15px', 'border': '2px solid #f27d0d', 'marginRight': '15px', 'borderRadius': '15px' }}>
                 <Row className="justify-content-start">
                <h3 className="strong" style={{ 'marginBottom': "10px",'fontWeight':'500','fontSize':'15px' }}>TRXN ID:</h3> 
                    <p style={{'marginBottom':'10px','marginLeft':'5px','fontSize':'15px'}}>{transactionDetails._id}</p>
                </Row>
                
                {transactionDetails.requestId ?
                <Row className="justify-content-start">
                <p className="strong" style={{ 'margin': "0px 0px 10px 0px",'fontWeight':'500','fontSize':'15px' }}>Paid for:</p> 
                    <p style={{'margin':'0px 0px 10px 5px','fontSize':'15px'}}>{transactionDetails.requestId.serviceName}</p>
                </Row>:null}

                {transactionDetails.requestId ?
                <Row className="justify-content-start">
                <p className="strong" style={{ 'margin': "0px 0px 10px 0px",'fontWeight':'500','fontSize':'15px' }}>Service Booked on </p> 
                    <p style={{'margin':'0px 0px 10px 5px','fontWeight':'500','fontSize':'15px'}}>{moment(transactionDetails.requestId.requestedDate).format("ddd DD-MMM-YY")}</p>
                </Row>:null}

                {transactionDetails.requestId ?
                <Row className="justify-content-start">
                <p className="strong" style={{'fontSize':'15px','margin': "0px 0px 10px 0px",'color':'grey' }}>Service BID: </p> 
                  <p style={{'fontSize':'15px','margin':'0px 0px 10px 5px','color':'grey'}}>{transactionDetails.requestId._id}</p>
                </Row>:null}

                {transactionDetails.requestId && userData.role === 'devotee' && transactionDetails.type === "Credit" ?
                    <Row className="justify-content-start">
                        <p className="strong" style={{ 'fontSize': '15px', 'marginTop': "0px", 'fontWeight': '500' }}>Received From: </p>
                        <p style={{ 'fontSize': '15px', 'margin': '0px 5px' }}>{transactionDetails.requestId.purohithName}</p>
                    </Row> : null
                }

                {transactionDetails.requestId  && userData.role !== 'devotee' && transactionDetails.type === "Credit" ?
                    <Row className="justify-content-start">
                        <p className="strong" style={{ 'fontSize': '15px', 'marginTop': "0px", 'fontWeight': '500' }}>Received From: </p>
                        <p style={{ 'fontSize': '15px', 'margin': '0px 5px' }}>{transactionDetails.requestId.userName}</p>
                    </Row> : null
                }
                {transactionDetails.requestId && transactionDetails.requestId.status ?
                    <Row className="justify-content-start">
                        <p className="strong" style={{ 'fontSize': '15px', 'marginTop': "0px", 'fontWeight': '500' }}>Booking Status: </p>
                        <p style={{ 'fontSize': '15px', 'margin': '0px 5px' }}>{transactionDetails.requestId.status}</p>
                    </Row> : null}
            </Block>
        </Page>
    )
}
export default TransactionDetailsPage;