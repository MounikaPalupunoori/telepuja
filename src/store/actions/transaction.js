import { getPurohitTransactions } from '../../utils/api';
import {START_UPDATE_TRANSACTION,PUROHITH_UPDATE_TRANSACTION,DEVOTEE_UPDATE_TRANSACTION,UPDATE_TRANSACTION_FAILED} from '../constants/constants';

export function updateTransaction(id,role){
    return function(dispatch){
        dispatch({type:START_UPDATE_TRANSACTION});
        if(role ==="purohit" || role ==="temple"){
            return getPurohitTransactions(id,role)
            .then((resp)=>{
                dispatch({type:PUROHITH_UPDATE_TRANSACTION,payload:resp});
            })
            .catch((err)=>{
                dispatch({type:UPDATE_TRANSACTION_FAILED,error:err});
            });
        }
        else{
            return getPurohitTransactions(id)
            .then((resp)=>{
                dispatch({type:DEVOTEE_UPDATE_TRANSACTION,payload:resp});
            })
            .catch((err)=>{
                dispatch({type:UPDATE_TRANSACTION_FAILED,error:err});
            });
        }
    }
}