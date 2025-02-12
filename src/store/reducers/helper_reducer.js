import { PUROHITH_DETAILS, PUROHITH_DETAILS_FAILED, TEMPLE_DETAILS, TEMPLE_DETAILS_FAILED } from "../constants/constants";

const initialState = {
    temples: [],
    purohiths: [],
    error: {}
}
export function HELPER_REDUCER(state = initialState, action) {
    switch (action.type) {
        case TEMPLE_DETAILS: {
            return {
                ...state,
                temples: action.payload
            }
        }
        case TEMPLE_DETAILS_FAILED: {
            return {
                ...state,
                error: action.error
            }
        }
        case PUROHITH_DETAILS: {
            return {
                ...state,
                purohiths: action.payload
            }
        }
        case PUROHITH_DETAILS_FAILED: {
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