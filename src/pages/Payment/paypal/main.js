import React, { useContext, useEffect, useState } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { appContext } from "../../../components/app.jsx";

const PayPalBtn = (props) => {
  const { amount, onSuccess, currency } = props;
  const { region } = useContext(appContext);

  return (
    <div>
      <PayPalButton
        style={{
          layout: "vertical",
          color: "blue",
          shape: "pill",
          label: "paypal",
        }}
        amount={amount}
        currency={currency}
        onSuccess={(details, data) => onSuccess(details, data)}
        options={{
          clientId: region && region.paypalKey,
          disableFunding: "card",
        }}
      />
    </div>
  );
};

export default PayPalBtn;
