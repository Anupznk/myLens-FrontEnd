import Cookies from "universal-cookie";

const cookies = new Cookies();

var cartCache=[]

if(!(cookies.get('home_cart')==undefined || cookies.get('home_cart')==null))
    cartCache=cookies.get('home_cart')

const homeCartReducer=(state=cartCache,action)=>{
    switch(action.type){
        case 'HOME_CART_UPDATE':
            return action.data;
        default:
            return state;
    }
}

export {homeCartReducer}
