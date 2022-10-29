import Cookies from "universal-cookie";
import axios from "axios";
import {analytics_base_url, analyticsToken, base_url} from "../index";
import uuid from "react-uuid";

const cookies = new Cookies();

const COOKIE_AGE=315360000


export const pushEvent=async (event_name,id_1,id_2,id_3,id_4)=>{
    try{
        var eventObject={
            event_name:event_name
        }
        if(id_1)eventObject['id_1']=id_1
        if(id_2)eventObject['id_2']=id_2
        if(id_3)eventObject['id_3']=id_3
        if(id_4)eventObject['id_4']=id_4
        if(!(cookies.get('token')==undefined || cookies.get('token')==null))eventObject['token']=cookies.get('token')
        if(cookies.get('browser_token')==undefined || cookies.get('browser_token')==null)cookies.set('browser_token',`${uuid()}${Date.now()}`,{ path: '/', maxAge: COOKIE_AGE })
        eventObject['cookie_string']=cookies.get('browser_token')
        await axios.post(`${analytics_base_url}/analytics/store`,eventObject,{headers:{custom_token:analyticsToken}})
    }catch(e){
        //console.log(e)
    }
}