import axios from "axios";
import {base_url} from "../index";

export const initPayment=async data=>{
    try{
        var result=await axios.post(`${base_url}/payment/init`,data)
        return result.data.data.GatewayPageURL
    }catch(err){
        //console.log(err)
        return null
    }
}
