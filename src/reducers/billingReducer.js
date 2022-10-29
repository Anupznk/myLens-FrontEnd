import Cookies from "universal-cookie";

const cookies = new Cookies();

var billingCache={}

if(!(cookies.get('billing')==undefined || cookies.get('billing')==null))
    billingCache=cookies.get('billing')

const billingReducer=(state=billingCache,action)=>{

    switch(action.type){
        case 'BILLING_UPDATE':
            return action.data;
        default:
            return state;
    }
}

export {billingReducer}
