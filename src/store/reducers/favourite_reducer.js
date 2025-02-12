import { MAKE_FAVOURITE, MAKE_FAVOURITE_FAILED, READ_FAVOURITE, READ_FAVOURITE_FAILED, REMOVE_ALL_FAVOURITE, REMOVE_ALL_FAVOURITE_FAILED, REMOVE_FAVOURITE, REMOVE_FAVOURITE_FAILED } from "../constants/constants";

const initialState = {
    favourites: [],
    error: {},
    data: {}
}
export function FAVOURITE_REDUCER(state = initialState, action) {
    switch (action.type) {
        case READ_FAVOURITE: {
            return {
                ...state,
                favourites: action.payload
            }
        }
        case READ_FAVOURITE_FAILED: {
            return {
                ...state,
                error: action.error
            }
        }
        case MAKE_FAVOURITE: {
            return {
                ...state,
                favourites: [...state.favourites, action.payload]
            }
        }
        case MAKE_FAVOURITE_FAILED: {
            return {
                ...state,
                error: action.error
            }
        }
        case REMOVE_FAVOURITE: {
            return {
                ...state,
                favourites: state.favourites.filter(item => item._id !== action.payload._id)
            }
        }
        case REMOVE_FAVOURITE_FAILED: {
            return {
                ...state,
                error: action.error
            }
        }
        case REMOVE_ALL_FAVOURITE: {
            return {
                ...state,
                favourites: []
            }
        }
        case REMOVE_ALL_FAVOURITE_FAILED: {
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