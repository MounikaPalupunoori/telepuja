import { getPurohitList, getpurohitnames, getTempleNames } from "../../utils/api"
import { PUROHITH_DETAILS, PUROHITH_DETAILS_FAILED, TEMPLE_DETAILS, TEMPLE_DETAILS_FAILED } from "../constants/constants"

export function templeNames() {
    return function (dispatch) {
        getTempleNames()
            .then((resp) => {
                dispatch({ type: TEMPLE_DETAILS, payload: resp });
            })
            .catch((err) => {
                dispatch({ type: TEMPLE_DETAILS_FAILED, error: err });
            });
    }
}

export function purohithNames(){
    return function (dispatch) {
        getpurohitnames()
            .then((resp) => {
                dispatch({ type: PUROHITH_DETAILS, payload: resp });
            })
            .catch((err) => {
                dispatch({ type: PUROHITH_DETAILS_FAILED, error: err });
            });
    }
}