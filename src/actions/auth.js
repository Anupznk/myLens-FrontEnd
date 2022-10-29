import axios from "axios";
import Cookies from "universal-cookie";
import {base_url} from "../index";
import {showToast} from "../App";
import {fetchPendingCall} from "../components/home/PendingCartCheck";

const cookies = new Cookies();

const COOKIE_AGE=31536000

export const checkAuth=()=>{
    if(cookies.get('token')==undefined || cookies.get('token')==null)
        return false
    else
        return true
}

export const googleAuth=async (data)=>{
    try{
        //console.log(data)
        var res= await axios.post(`${base_url}/user/auth/googleoauth`,data)
        //console.log(res)
        cookies.set('token',res.data.access_token,{ path: '/', maxAge: COOKIE_AGE })
        fetchPendingCall()
        return true
        // checkAuth(dispatcher)
        // history.push('/lang/en/level/1')
        // setLoading(false)
        // showToast('Logged in successfully')
    }catch(e){
        //console.log('hi2')
        //console.log(e)
        return false
    }

}


// export const login=(data,dispatcher)=>{
//     dispatcher(loadingDispatch())
//     axios.post(api_base_url+'/applicant/auth/login',data).then(res=>{  //dummy URL currently
//         cookies.set('token',res.data.access_token,{ path: '/', maxAge: COOKIE_AGE }) //setting token
//         checkAuth(dispatcher)
//         //console.log(res.data)
//     }).catch(err=>{
//         //console.log(err)
//         switch(err.response.status){
//             case 404:
//                 showToast('No user exists with this email')
//                 break
//             case 401:
//                 showToast('Invalid password')
//                 break
//             case 500:
//                 showToast('Internal server error')
//                 break
//             default:
//                 showToast('Connectvity problem')
//         }
//         checkAuth(dispatcher)
//     })
// }
//
// export const register=(data,dispatcher,successCallback)=> {
//     dispatcher(loadingDispatch())
//     //console.log("########req data########")
//     //console.log(data)
//     axios.post(api_base_url+'/applicant/auth/registration',data).then(res=>{  //dummy URL currently
//         //console.log(res.data)
//         successCallback()
//         checkAuth(dispatcher)
//     }).catch(err=>{
//         switch(err.response.status){
//             case 409:
//                 showToast('User already exists')
//                 break
//             case 500:
//                 showToast('Internal server error')
//                 break
//             default:
//                 showToast('Connectvity problem')
//         }
//         checkAuth(dispatcher)
//     })
// }
//
// export const changePassword=(data,dispatcher)=> {
//     setLoading(true)
//     //console.log(data)
//     axios.put(api_base_url+'/applicant/profile/changepassword',data,{headers:{authorization:'Bearer '+cookies.get('token')}}).then(res=>{  //dummy URL currently
//         logout(dispatcher)
//         setLoading(false)
//         showToast('Password updated successfully, please login with the new password.')
//     }).catch(err=>{
//         setLoading(false)
//         switch(err.response.status){
//             case 401:
//                 showToast('Incorrect old password')
//                 break
//             case 404:
//                 showToast('User not found')
//                 break
//             case 500:
//                 showToast('Internal server error')
//                 break
//             default:
//                 showToast('Connectvity problem')
//         }
//     })
// }
//
// export const verify=(token,successCallback,failureCallback)=>{
//     setLoading(true)
//     axios.post(`${api_base_url}/applicant/auth/verify/${token}`).then(res=>{
//         //console.log(res.data)
//         successCallback()
//         setLoading(false)
//     }).catch(err=>{
//         //console.log(err)
//         //console.log(err.response.status)
//         setLoading(false)
//         failureCallback()
//     })
// }
//


export const logout=()=>{
    cookies.remove('token',{ path: '/' })
    showToast('Logged out successfully')
    return checkAuth()
}



