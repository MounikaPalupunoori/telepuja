import React, { useState, useEffect } from "react";
import Axios from "axios";
import toastr from "toastr";
import { paypalDetails, getLoggedinUserDetails, } from "../../../utils/api";
import razorpay from "../../../assets/img/razorpay.png";
import { f7 } from "framework7-react";
import { useDispatch } from "react-redux";
import { getUserDetails } from "../../../store/actions/auth";
//import "./razorpay.scss";

const RazorPanel = (props) => {
  const user = JSON.parse(localStorage.getItem("current_user"));
  const [orderID, setOrderID] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  
 

  useEffect(() => {
    if (refresh) {
        props.onClose();
    }
  }, [refresh]);

  useEffect(() => {
    let amntTxt = Number(props.payload.amount + "00");
    var payload = {};
    payload.devoteeId = props.payload._id;
    payload.tokens = props.payload.tokens;
    payload.tokenQuantity = props.payload.tokenQuantity;
    payload.amount = props.payload.amount;
    
    Axios.post(
      "https://api-server-dot-telepuja-dev.uc.r.appspot.com/api/v1/razorpay/payment",
      {
        amount: amntTxt,
        receipt: "Telepuja",
      }
    ).then((response) => {
      setOrderID(response.data.data.id);
      var options = {
        key: "rzp_test_nOWJ35XZLAYu0R",
        key_secret: "VI7qd1twQsjJTwEJcrer2kgDs",
        amount: amntTxt,
        currency: "INR",
        name: "Telepuja",
        order_id: orderID,
        handler: function (response) {
          if (response) {
            props.onClose();
            paypalDetails(payload).then(
              (resp) => {
              setRefresh(!refresh);
              toastr.success("Payment successfull"); 
              dispatch(getUserDetails(user.uid));
            });
          }
        },
        
        notes: {
          address: "note value",
        },
        theme: {
          color: "#F27d0d",
        },
        "modal": {
          "ondismiss": function(){
            props.modalClose();
          }
      }
      };
      var rzp1 = new window.Razorpay(options);
      rzp1.open();
      
    });
  }, []);

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      {/* <button
        style={{ width: "250px" }}
        id="rzp-button1"
        className="pay-button"
        onClick={RequestOrderPayment}
      >
        <img src={razorpay} alt="razorpay" width="200px" />
      </button> */}
    </div>
  );
};
export default RazorPanel;