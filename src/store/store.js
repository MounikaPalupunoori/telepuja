import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import app_reducers from './reducers/app_reducer';

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const loggerMiddleware = createLogger();

const store = createStore(
    app_reducers,
    storeEnhancers(applyMiddleware(
        loggerMiddleware,
        thunkMiddleware
    )));

export default store;