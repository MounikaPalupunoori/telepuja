import React from "react";

const PasswordStrengthIndicator = ({
    validity: { minChar, number, specialChar, upper, lower }
}) => {
    return (
        <div className="password-meter text-left mb-4" style={{padding: '1px', margin:'10px 10px'}}>
            <p className="text-dark" style={{color:'grey', margin:'0px 5px'}}>Password must contain:</p>
            <ul className="text-muted" style={{color:"grey", margin:'0px 20px'}}>
                <PasswordStrengthIndicatorItem
                    isValid={minChar}
                    text="* Have atleast 6 characters"
                />
                <PasswordStrengthIndicatorItem
                    isValid={number}
                    text="* Have atleast 1 numeric character"
                />
                <PasswordStrengthIndicatorItem
                    isValid={specialChar}
                    text="* Have atleast 1 special character"
                />
                <PasswordStrengthIndicatorItem
                    isValid={upper}
                    text="* Have atleast 1 uppercase"
                />
                <PasswordStrengthIndicatorItem
                    isValid={lower}
                    text="* Have atleast 1 lowercase"
                />
            </ul>
        </div>
    );
};

const PasswordStrengthIndicatorItem = ({ isValid, text }) => {
    const highlightClass = isValid ? "text-success"    : isValid !== null   ? "text-danger" : "";
    return <li className={highlightClass}>{text}</li>;
};

export default PasswordStrengthIndicator;
