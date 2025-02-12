import { combineReducers } from 'redux';
import { TRANSACTION_REDUCER } from './transaction_reducer';
import {AUTH_REDUCER} from './auth_reducer';
import { FAVOURITE_REDUCER } from './favourite_reducer';
import { HELPER_REDUCER } from './helper_reducer';

const app_reducers = combineReducers({
    transaction: TRANSACTION_REDUCER,
    favourite:FAVOURITE_REDUCER,
    auth:AUTH_REDUCER,
    helpers:HELPER_REDUCER
});

export default app_reducers;