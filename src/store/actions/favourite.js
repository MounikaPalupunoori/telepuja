import { makeFavourite, readFavourite, removeAllFavourites, removeFavourite } from "../../utils/api";
import { MAKE_FAVOURITE,MAKE_FAVOURITE_FAILED,READ_FAVOURITE,READ_FAVOURITE_FAILED,REMOVE_ALL_FAVOURITE,REMOVE_ALL_FAVOURITE_FAILED,REMOVE_FAVOURITE, REMOVE_FAVOURITE_FAILED } from "../constants/constants"

export function createFavourites(obj) {
    return function (dispatch) {
        makeFavourite(obj)
            .then((resp) => {
                dispatch({ type: MAKE_FAVOURITE, payload: resp });
            })
            .catch((err) => {
                dispatch({ type: MAKE_FAVOURITE_FAILED, error: err });
            });
    }
}
export function readFavourites(id) {
    return function (dispatch) {
        readFavourite(id)
            .then((resp) => {
                dispatch({ type: READ_FAVOURITE, payload: resp });
            })
            .catch((err) => {
                dispatch({ type: READ_FAVOURITE_FAILED, error: err });
            });
    }
}

export function deleteFavouites(favouriteId) {
    return function (dispatch) {
        removeFavourite(favouriteId)
            .then((resp) => {
                dispatch({ type: REMOVE_FAVOURITE, payload: resp });
            })
            .catch((err) => {
                dispatch({ type: REMOVE_FAVOURITE_FAILED, error: err });
            });
    }
}
export function deleteAllFavouites(favouriteId) {
    return function (dispatch) {
        removeAllFavourites(favouriteId)
            .then((resp) => {
                dispatch({ type: REMOVE_ALL_FAVOURITE, payload: resp });
            })
            .catch((err) => {
                dispatch({ type: REMOVE_ALL_FAVOURITE_FAILED, error: err });
            });
    }
}