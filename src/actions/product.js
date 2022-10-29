import axios from "axios";
import {base_url} from "../index";

export const fetchProductData=async id=>{
    try{
        var result=await axios.get(`${base_url}/product/get/${id}`)
        return result.data.data[0]
    }catch(err){
        //console.log(err)
        return null
    }
}

export const fetchAvailableDate=async id=>{
    try{
        var result=await axios.get(`${base_url}/product/check/${id}`)
        return result.data.date
    }catch(err){
        //console.log(err)
        return null
    }
}

export const fetchAvailableDateCart=async products=>{
    try{
        var result=await axios.post(`${base_url}/product/checkMultiple`,{
            products:products
        })
        return result.data.date
    }catch(err){
        //console.log(err)
        return null
    }
}
