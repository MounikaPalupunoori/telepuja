import { getLoggedinUserDetails } from "../../utils/api"
import { USER_DETAILS, USER_DETAILS_FAILED } from "../constants/constants"

export function getUserDetails(id) {
    return function (dispatch) {
        getLoggedinUserDetails(id)
            .then((resp) => {
                dispatch({ type: USER_DETAILS, payload: resp });
            })
            .catch((err) => {
                dispatch({ type: USER_DETAILS_FAILED, error: err });
            })
    }
}