import Cookies from "universal-cookie";

const cookies = new Cookies();

var cartCache=[]

if(!(cookies.get('cart')==undefined || cookies.get('cart')==null))
    cartCache=cookies.get('cart')

const cartReducer=(state=cartCache,action)=>{




    switch(action.type){
        case 'CART_UPDATE':
            return action.data;
        default:
            return state;
    }
}

export {cartReducer}
