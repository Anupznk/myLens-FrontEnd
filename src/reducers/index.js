import {combineReducers} from 'redux'
import {cartReducer} from "./cartReducer";
import {homeCartReducer} from "./homeCartRedicer";
import {billingReducer} from "./billingReducer";

const allReducers=combineReducers({
    cart:cartReducer,
    homeCart:homeCartReducer,
    billing:billingReducer
})

export default allReducers
