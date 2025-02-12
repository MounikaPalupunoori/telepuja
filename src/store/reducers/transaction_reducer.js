import { DEVOTEE_UPDATE_TRANSACTION, PUROHITH_UPDATE_TRANSACTION, UPDATE_TRANSACTION_FAILED } from '../constants/constants';

const initialState = {
    data:{}
}

export function TRANSACTION_REDUCER(state=initialState,action){
    switch(action.type){
        case PUROHITH_UPDATE_TRANSACTION : {
            return {
                ...state,
                data:action.payload
            }
        }
        case DEVOTEE_UPDATE_TRANSACTION : {
            return {
                ...state,
                data:action.payload
            }
        }
        case UPDATE_TRANSACTION_FAILED:{
            return {
                ...state,
                error:action.error
            }
        }
        default:{
            return state;
        }
    }
}