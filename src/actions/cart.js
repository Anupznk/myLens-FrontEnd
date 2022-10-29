import axios from "axios";
import {base_url, lensOptions, lensOptionsFashion} from "../index";
import Cookies from "universal-cookie";
import {MERCHANT_CODE, setCurrentMerchant, showToast} from "../App";
import {checkAuth} from "./auth";
import {setCartOpen} from "../components/home/Header";

const cookies = new Cookies();

const COOKIE_AGE=31536000


export const getId=id=>{
    if(typeof id==='number')return id
    return parseInt(id.split(' ')[0])
}


export const incrementQuantity=(item,list,dispatch)=>{

    var arr=[...list]
    for(var i=0;i<arr.length;i++){
        if(arr[i].id===item.id){
            //console.log(item)
            var available=item.available_quantity
            var taken=0
            list.map(l=>{
                if(getId(l.id)===getId(item.id))
                    taken+=l.quantity
            })

            if(taken+1>available){
                showToast('Quantity not available')
                return
            }
            arr[i].quantity+=1
        }
    }
    dispatch(cartDispatch(arr))

}

export const decrementQuantity=(id,list,dispatch)=>{
    var arr=[...list]
    for(var i=0;i<arr.length;i++){
        if(arr[i].id===id && arr[i].quantity>1){
            arr[i].quantity-=1
        }
    }
    dispatch(cartDispatch(arr))

}

export const removeCartItem=(id,list,dispatch)=>{
    var arr=[...list]
    for(var i=0;i<arr.length;i++){
        if(arr[i].id===id){
            arr.splice(i,1)
        }
    }
    dispatch(cartDispatch(arr))

}

export const addCartItem=(item,list,dispatch)=>{

    var available=item.quantity
    var taken=0
    list.map(l=>{
        if(getId(l.id)===getId(item.id))
            taken+=l.quantity
    })

    if(taken+1>available){
        showToast('Quantity not available')
        return
    }

    var arr=[...list]
    var ind=-1
    list.map((l,i)=>{
        if(l.id===item.id)
            ind=i
    })
    if(ind>-1)
        arr[ind].quantity+=1
    else
        arr.push({
            ...item,
            available_quantity:item.quantity,
            id: item.id,
            price: item.price,
            quantity:1,
            imgURL: item.image1,
        })
    dispatch(cartDispatch(arr))
}

export const addCartItemQuantity=(item,quantity,list,dispatch)=>{

    var available=item.quantity
    var taken=0
    list.map(l=>{
        if(getId(l.id)===getId(item.id))
            taken+=l.quantity
    })

    if(taken+quantity>available){
        showToast('Quantity not available')
        return
    }

    var arr=[...list]
    var ind=-1
    list.map((l,i)=>{
        if(l.id===item.id)
            ind=i
    })
    if(ind>-1)
        arr[ind].quantity+=quantity
    else
        arr.push({
            ...item,
            id: item.id,
            available_quantity:item.quantity,
            price: item.price,
            quantity:quantity,
            imgURL: item.image1,
        })
    dispatch(cartDispatch(arr))
}

export const addCartItemQuantityPending=(items,dispatch)=>{

    var arr=[]

    items.map((item,index)=>{
        var id=item.id
        var price=item.price
        var cost=0
        if(item.has_lens){
            id=`${item.id} ${index}`
            if(item.merchant_id===28){
                cost = lensOptionsFashion[Object.keys(lensOptionsFashion)[item.power_type]][Object.keys(lensOptionsFashion[Object.keys(lensOptionsFashion)[item.power_type]])[item.price_type]]
            }else if(item.merchant_id===41){
                cost = lensOptions[Object.keys(lensOptions)[item.power_type]][Object.keys(lensOptions[Object.keys(lensOptions)[item.power_type]])[item.power_option]][Object.keys(lensOptions[Object.keys(lensOptions)[item.power_type]][Object.keys(lensOptions[Object.keys(lensOptions)[item.power_type]])[item.power_option]])[[item.price_type]]]
            }
        }

        arr.push({
            ...item,
            id: item.id,
            available_quantity:item.available_quantity,
            price: price+cost,
            quantity:item.quantity,
            imgURL: item.image1,
        })
    })

    dispatch(cartDispatch(arr))
}

export const clearCart=dispatch=>{
    setCurrentMerchant(MERCHANT_CODE.NONE)
    dispatch(cartDispatch([]))
}

export const createCart=async orderObject=>{
    //console.log('========')
    //console.log(orderObject)
    try{
        var res=await axios.post(`${base_url}/cart/create`,orderObject,{headers:{authorization:'Bearer '+cookies.get('token')}})
        ////console.log(res1)
        return res.data.cart.cart_id
    }catch(e){
        return false
    }
}

export const fetchPendingCart=async ()=>{
    if(checkAuth()) {
        try {
            var res = await axios.get(`${base_url}/user/pending-cart/get`, {headers: {authorization: 'Bearer ' + cookies.get('token')}})
            //console.log(res.data)
            if(res.data.data.length>0){
                await axios.post(`${base_url}/user/pending-cart/discard`,{}, {headers: {authorization: 'Bearer ' + cookies.get('token')}})
                return(
                    {
                        items:res.data.data,
                        billing:res.data.data[0]
                    }
                )
            }


        } catch (e) {
            //console.log(e)
            return false
        }
    }else {
        return false
    }
}

export const checkoutCOD=async cartId=>{
    try{
        var res=await axios.post(`${base_url}/cart/checkout/${cartId}`,{
            "payment_method": "cod"
        })
        ////console.log(res)
        return true
    }catch(e){
        return false
    }
}

export const updateCartBilling=(name,phone,address,district,email,prev,dispatch)=>{
    var billing={...prev}
    billing['name']=name
    billing['phone']=phone
    billing['address']=address
    billing['district']=district
    billing['email']=email
    dispatch(billingDispatch(billing))
}

export const updateTrialCartBilling=(name,phone,address,district,zone,email,prev,dispatch)=>{
    var billing={...prev}
    billing['name']=name
    billing['phone']=phone
    billing['address']=address
    billing['district']=district
    billing['zone']=zone
    billing['email']=email
    dispatch(billingDispatch(billing))
}

export const checkoutSSL=async cartId=>{
    try{
        var res=await axios.post(`${base_url}/cart/checkout/${cartId}`,{
            "payment_method": "online",
            is_paid:true
        })
        ////console.log(res)
        return true
    }catch(e){
        return false
    }
}

const cartDispatch=data=>{
    //console.log(data)
    cookies.set('cart',JSON.stringify(data),{ path: '/', maxAge: COOKIE_AGE })
    return{
        type:'CART_UPDATE',
        data:data
    }
}

const billingDispatch=data=>{
    //console.log(data)
    cookies.set('billing',JSON.stringify(data),{ path: '/', maxAge: COOKIE_AGE })
    return{
        type:'BILLING_UPDATE',
        data:data
    }
}
