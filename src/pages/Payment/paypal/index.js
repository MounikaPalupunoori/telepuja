import React, { useContext, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import PayPalBtn from "./main";
import toastr from "toastr";
import { paypalDetails } from "../../../utils/api.js";
import { useDispatch } from 'react-redux';
import { getUserDetails } from "../../../store/actions/auth";

const Paypal = (props) => {
  const user = JSON.parse(localStorage.getItem("current_user"));
  const dispatch = useDispatch();
  var getAmt;
  var donationObj;
  if (props.donationDetails) {
    donationObj = props.donationDetails;
    getAmt = props.donationDetails.amount / 100;
  }

  const paymentHandler = (details, data) => {
    var payload = {};
    payload.tokenQuantity = props.payload.tokenQuantity;
    payload.tokens = props.payload.tokens;
    payload.amount = props.payload.tokenQuantity;
    payload.userId = props.payload.userId;
    payload.devoteeId = props.payload._id;
    paypalDetails(payload).then((resp) => {
      if (resp.status === 200) {
        props.onClose();
        toastr.success("Payment successfull");
        dispatch(getUserDetails(user.uid));
      }
    });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <PayPalBtn
        amount={props.payload.amount}
        // currency={region && region.currency}
        onSuccess={paymentHandler}
      />
    </div>
  );
};

export default Paypal;
