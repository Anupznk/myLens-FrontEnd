import React from 'react'
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Dialog, DialogTitle} from "@mui/material";

import '../../assets/css/loginDialog.css'
import fb_icon from '../../assets/images/production/ic_fb.svg'
import GoogleLogin from "react-google-login";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import {googleAuth} from "../../actions/auth";
import {showToast} from "../../App";
import {pushEvent} from "../../actions/analytics";
import {eventTable} from "../../index";

const LoginPrompt= props=>{

    var navigate=useNavigate()

    const loginPrompt=useSelector(state=>state.loginPrompt)
    const dispatch=useDispatch()

    const [isLoginPromptOpen, setLoginPromptOpen] = props.loginPromptState

    const googleAuthComplete=async res=>{
        //console.log(res)
        if(res.accessToken!=undefined) {
            props.setAuth(null)
            setLoginPromptOpen(false)
            var result=await googleAuth({access_token: res.accessToken})
            props.setAuth(result)
            if(result) {
                pushEvent(eventTable.loginSuccess)
                showToast('Logged in successfully')
            }
            else {
                showToast('Login failed')
                pushEvent(eventTable.loginFailure)
            }
        }else{
            pushEvent(eventTable.loginFailure)
        }
    }

    const handleClickOpen = () => {
        setLoginPromptOpen(true);
    };

    const handleClose = (value) => {
        setLoginPromptOpen(false);

    };

    const responseFacebook = async res => {
      //console.log(res)
    }

    return(
        <div className="login-dialog">
            <Dialog onClose={handleClose} open={isLoginPromptOpen}>
                <DialogTitle> <center> Please Log in to continue </center></DialogTitle>
                <br/>


                <GoogleLogin
                    clientId="384400786106-ep0igg2mrvq1f3vkvavpdlt7pkcp3d34.apps.googleusercontent.com"
                    render={renderProps => (
                        <div  onClick={renderProps.onClick} disabled={renderProps.disabled} className="google-btn">
                            <div className="google-icon-wrapper">
                                <img className="google-icon"
                                     src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt='google-icon'/>
                            </div>
                            <p className="btn-text"> Continue with Google </p>
                        </div>
                    )}
                    buttonText="Login"
                    onSuccess={googleAuthComplete}
                    onFailure={googleAuthComplete}
                    cookiePolicy={'single_host_origin'}
                />

            </Dialog>
        </div>
    )
}

export default LoginPrompt
