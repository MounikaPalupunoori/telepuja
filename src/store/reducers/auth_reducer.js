import { USER_DETAILS, USER_DETAILS_FAILED } from "../constants/constants";

const initialState = {
    userDetails:{},
    error:''
}
export function AUTH_REDUCER(state = initialState, action) {
    switch (action.type) {
        case USER_DETAILS: {
            return {
                ...state,
                userDetails: action.payload
            }
        }
        case USER_DETAILS_FAILED: {
            return {
                ...state,
                error: action.error
            }
        }
        default: {
            return state
        }
    }
}