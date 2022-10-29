import Cookies from "universal-cookie";
import axios from "axios";
import {base_url} from "../index";

const cookies = new Cookies();

const COOKIE_AGE=31536000

export const removeHomeCartItem=(id,list,dispatch)=>{
    var arr=[...list]
    for(var i=0;i<arr.length;i++){
        if(arr[i].id===id){
            arr.splice(i,1)
        }
    }
    dispatch(cartDispatch(arr))

}

export const addHomeCartItem=(item,list,dispatch)=>{
    var arr=[...list]
    var ind=-1
    list.map((l,i)=>{
        if(l.id===item.id)
            ind=i
    })
    if(ind==-1)
        arr.push({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity:1,
            imgURL: item.image1
        })
    dispatch(cartDispatch(arr))
}


export const createHomeCart=async orderObject=>{
    try{
        //console.log(orderObject)
        var res=await axios.post(`${base_url}/cart/home/create`,orderObject,{headers:{authorization:'Bearer '+cookies.get('token')}},orderObject)
        //console.log(res)
        return res.data.cart.cart_id
    }catch(e){
        return false
    }
}

export const clearHomeCart=dispatch=>{
    dispatch(cartDispatch([]))
}


const cartDispatch=data=>{
    cookies.set('home_cart',JSON.stringify(data),{ path: '/', maxAge: COOKIE_AGE })

    return{
        type:'HOME_CART_UPDATE',
        data:data
    }
}
