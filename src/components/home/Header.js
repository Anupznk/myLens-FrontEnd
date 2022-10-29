import React, {useEffect, useRef, useState} from 'react'
import {Grid} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import '../../assets/css/header.css'
import logo_new from '../../assets/images/production/logo_new.svg'
import icon2 from '../../assets/images/production/logo-v2.svg'
import cartIcon from '../../assets/images/production/cart-icon-home.svg'
import {useNavigate} from "react-router-dom";
import CartSlider from "../cart/cartSlider";
import {useSelector} from "react-redux";
import CartSliderTakeHome from "../cart/cartSliderTakeHome";
import LoginPrompt from "../auth/LoginPrompt";
import {checkAuth, logout} from "../../actions/auth";
import {removeCartItem} from "../../actions/cart";
import desktopCross from "../../assets/images/production/cart-cross-desktop.svg";
import {pushEvent} from "../../actions/analytics";
import {eventTable} from "../../index";


var setCartOpen,setLoginPrompt,authState, setHomeCartOpen

const Header=props=>{

    var navigate=useNavigate()

    var [menu,setMenu]=useState(false)

    const [isCartDrawerOpen, setIsCartDrawerOpen] = React.useState(false);

    setCartOpen=setIsCartDrawerOpen

    const [isHomeCartDrawerOpen, setIsHomeCartDrawerOpen] = React.useState(false);
    setHomeCartOpen = setIsHomeCartDrawerOpen

    const cartItems=useSelector(state=>state.cart)
    const homeCartItems=useSelector(state=>state.homeCart)

    const [isLoginPromptOpen, setLoginPromptOpen] = React.useState(false);



    var height=55


    const [auth,setAuth]=useState(null)

    authState=auth
    setLoginPrompt=setLoginPromptOpen


    const authClick=()=>{
        if(auth){
            setAuth(null)
            pushEvent(eventTable.logout)
            setTimeout( function() {
                logout()
                setAuth(checkAuth())
            }, 1000);

        }else{
            pushEvent(eventTable.loginDialog)
            setLoginPromptOpen(true)
        }
        setMenu(false)
    }

    useEffect(()=>{
        setAuth(checkAuth())
    },[])

    const [mobile, setMobile] = useState(false)

    function handleResize() {
        if (window.innerWidth <= 1020) setMobile(true)
        else setMobile(false)
    }

    useEffect(() => {
        if (window.innerWidth <= 1020) setMobile(true)
        else setMobile(false)
        window.addEventListener('resize', handleResize)
    }, [])



    return(
        <div>
            <div className={'header-container'}>

                <CartSlider drawerState={[isCartDrawerOpen, setIsCartDrawerOpen]}/>
                <CartSliderTakeHome drawerState={[isHomeCartDrawerOpen, setIsHomeCartDrawerOpen]}/>
                <LoginPrompt setAuth={setAuth} loginPromptState={[isLoginPromptOpen, setLoginPromptOpen]}/>
                <div className={'header-desktop'}>
                    <Grid container style={{backgroundColor:props.bg,height:`${height}px`,color:'#ffffff'}}>
                        <Grid item xs={4}>
                            <div style={{height:`${height}px`,display:'flex',alignItems:'center'}}>
                                <div className={'header-menu-container'}>
                                    <div style={{cursor:'pointer'}} onMouseEnter={()=>{setMenu(true)}} >
                                        {
                                            'home' in props?(
                                                <font color={props.navIconColor}> SHOP</font>
                                            ):(
                                                <div>SHOP</div>
                                            )
                                        }

                                    </div>

                                    <div onClick={()=>{
                                        setIsHomeCartDrawerOpen(true);
                                        pushEvent(eventTable.trialHomeHeaderClick);
                                    }} className={'header-trial-container'}>
                                        <div>
                                            {
                                                'home' in props?(
                                                    <font color={props.navIconColor}>TRIAL HOME</font>
                                                ):(
                                                    <div>TRIAL HOME</div>
                                                )
                                            }

                                        </div>
                                        {
                                            homeCartItems.length===0?(
                                                <div/>
                                            ):(
                                                <div className={'header-badge homeBadge'}>
                                                    {homeCartItems.length}
                                                </div>
                                            )
                                        }

                                    </div>
                                    <div className={'menu-filler'}>

                                    </div>
                                </div>
                            </div>
                        </Grid>

                        <Grid item xs={4}>
                            <center style={{height:`${height}px`,display:'flex',alignItems:'center'}}>
                                <div onClick={()=>{navigate('/')}} className={'header-icon-container'}>
                                    {
                                        'home' in props?(
                                            <img src={logo_new} className={'header-icon'} alt="mylens-logo" aria-label='home button'/>
                                        ):(
                                            <img src={logo_new} className={'header-icon'} alt="mylens-logo" aria-label='home button'/>
                                        )
                                    }
                                </div>
                            </center>
                        </Grid>

                        <Grid item xs={4} >
                            <div className={'header-right-wrapper'}>
                                <div className={'header-right-container'}>
                                    <div className={'header-register-container'}>
                                        <button onClick={authClick}>
                                            {
                                                auth===null?(
                                                    <div>
                                                        Loading...
                                                    </div>
                                                ):(
                                                    auth?(
                                                        <div>
                                                            Logout
                                                        </div>
                                                    ):(
                                                        <div>
                                                            Login
                                                        </div>
                                                    )
                                                )
                                            }
                                        </button>
                                    </div>

                                    <div onClick={()=>{
                                        setIsCartDrawerOpen(true);
                                        pushEvent(eventTable.cartHeaderClick);
                                    }} className={'header-cart-container'}>
                                        <img className="cart-color" src={cartIcon} alt='cart-icon' aria-label='cart button'/>
                                        <div>
                                            {cartItems.length>0?(
                                                <div className={'header-badge'}>
                                                    {cartItems.length}
                                                </div>
                                            ):(
                                                <div/>
                                            )}
                                        </div>
                                    </div>




                                </div>
                            </div>
                        </Grid>

                    </Grid>
                </div>
                <div className={'header-mobile'} style={{backgroundColor:props.bg}}>

                    <div onClick={()=>{setMenu(!menu)}} className={'header-menu-container-mobile'}>
                        <MenuIcon style={{color:'var(--text_color)'}}/>
                    </div>

                    <div onClick={()=>{navigate('/')}} className={'header-icon-container'}>
                        {
                            'home' in props?(
                                <img src={logo_new} className={'header-icon'} alt="mylens-logo" aria-label='home button' />
                            ):(
                                <img src={logo_new} className={'header-icon'} alt="mylens-logo" aria-label='home button'/>
                            )
                        }
                    </div>
                    {/*<MenuIcon className={'header-ham-icon'}/>*/}
                    <div className={'header-right-container'}>


                        <div onClick={()=>{
                            setIsCartDrawerOpen(true);
                            pushEvent(eventTable.cartHeaderClick);
                        }} className={'header-cart-container'}>
                            <img src={cartIcon} alt='cart-icon'/>
                            <div>
                                {cartItems.length>0?(
                                    <div className={'header-badge'}>
                                        {cartItems.length}
                                    </div>
                                ):(
                                    <div/>
                                )}
                            </div>
                        </div>

                        <div onClick={()=>{
                            setIsHomeCartDrawerOpen(true);
                            pushEvent(eventTable.trialHomeHeaderClick);
                        }} className={'header-trial-container header-trial-container-mobile'}>
                            <div>
                                {
                                    'home' in props?(
                                        <font color={props.navIconColor}> Trial Home</font>
                                    ):(
                                        <div>Trial Home</div>
                                    )
                                }

                            </div>
                            {
                                homeCartItems.length===0?(
                                    <div/>
                                ):(
                                    <div className={'header-badge homeBadge'}>
                                        {homeCartItems.length}
                                    </div>
                                )
                            }

                        </div>


                    </div>
                </div>
            </div>
            {
                menu?(
                    <div onMouseLeave={()=>{setMenu(false)}} className={'header-hover-container'}>
                        <div onClick={()=>{setMenu(false)}} className={'header-hover-cross'}>
                            <img src={desktopCross} alt='remove button'/>
                        </div>
                        <div className={'header-hover-flex-container'}>
                            {/*<div className={'header-hover-single-container'}>*/}
                            {/*    <div className={'header-hover-single-title'}>*/}
                            {/*        My Account*/}
                            {/*    </div>*/}
                            {/*    <div  onClick={authClick} className={'header-hover-single-option'}>*/}
                            {/*        {*/}
                            {/*            auth===null?(*/}
                            {/*                <div>*/}
                            {/*                    Loading...*/}
                            {/*                </div>*/}
                            {/*            ):(*/}
                            {/*                auth?(*/}
                            {/*                    <div>*/}
                            {/*                        Logout*/}
                            {/*                    </div>*/}
                            {/*                ):(*/}
                            {/*                    <div>*/}
                            {/*                        Login*/}
                            {/*                    </div>*/}
                            {/*                )*/}
                            {/*            )*/}
                            {/*        }*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            {/*<div className={'header-hover-single-divider'}/>*/}

                            <div className={'header-hover-single-container'}>
                                <div onClick={()=>{
                                    navigate('/shop/both/eyeglass');
                                    pushEvent(eventTable.eyeGlassBothFilter);
                                }} className={'header-hover-single-title'}>
                                    EyeGlasses
                                </div>
                                <div onClick={()=>{
                                    navigate('/shop/men/eyeglass');
                                    pushEvent(eventTable.eyeGlassMenFilter);
                                }} className={'header-hover-single-option'}>
                                    For Him
                                </div>
                                <div onClick={()=>{
                                    navigate('/shop/women/eyeglass');
                                    pushEvent(eventTable.eyeGlassWomenFilter);
                                }} className={'header-hover-single-option'}>
                                    For Her
                                </div>
                            </div>
                            <div className={'header-hover-single-divider'}/>
                            <div className={'header-hover-single-container'}>
                                <div  onClick={()=>{
                                    navigate('/shop/both/sunglass');
                                    pushEvent(eventTable.suneGlassBothFilter);
                                }} className={'header-hover-single-title'}>
                                    Sun Glasses
                                </div>
                                <div  onClick={()=>{
                                    navigate('/shop/men/sunglass');
                                    pushEvent(eventTable.sunGlassMenFilter);
                                }} className={'header-hover-single-option'}>
                                    For Him
                                </div>
                                <div  onClick={()=>{
                                    navigate('/shop/women/sunglass');
                                    pushEvent(eventTable.sunGlassWomenFilter);
                                }} className={'header-hover-single-option'}>
                                    For Her
                                </div>
                            </div>
                            {/*<div className={'header-hover-single-divider'}/>*/}
                            {/*<div className={'header-hover-single-container'}>*/}
                            {/*    <div className={'header-hover-single-title'}>*/}
                            {/*        Contact Lens*/}
                            {/*    </div>*/}

                            {/*</div>*/}
                            <div className={'header-hover-single-divider'}/>
                            <div className={'header-hover-single-container'}>
                                <div  onClick={()=>{
                                    navigate('/shop/both/all');
                                    pushEvent(eventTable.allGlassFilter);
                                }} className={'header-hover-single-title'}>
                                    View All
                                </div>

                            </div>

                            {mobile? <center> <div className={'header-register-container'}>
                                <button onClick={authClick}>
                                    {
                                        auth===null?(
                                            <div>
                                                Loading...
                                            </div>
                                        ):(
                                            auth?(
                                                <div>
                                                    Logout
                                                </div>
                                            ):(
                                                <div>
                                                    Login
                                                </div>
                                            )
                                        )
                                    }
                                </button>
                            </div> </center> : <div/>
                            }
                            {/*<div className={'header-hover-single-divider'}/>*/}
                            {/*<div className={'header-hover-single-container'}>*/}
                            {/*    <div  onClick={() => {*/}
                            {/*        navigate('/contact-us')*/}
                            {/*    }} className={'header-hover-single-title'}>*/}
                            {/*        Contact Us*/}
                            {/*    </div>*/}
                            {/*    <div className={'header-hover-single-option'}>*/}
                            {/*        01777706719*/}
                            {/*    </div>*/}
                            {/*    <div className={'header-hover-single-option'}>*/}
                            {/*        info@mylens.com.bd*/}
                            {/*    </div>*/}
                            {/*    <div className={'header-hover-single-option'}>*/}
                            {/*        114, Motijheel C/A,<br/>Level-18, Dhaka-1000*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            {/*<div className={'header-hover-single-divider'}/>*/}
                            {/*<div className={'header-hover-single-container'}>*/}
                            {/*    <div onClick={() => {*/}
                            {/*        navigate('/about-us')*/}
                            {/*    }} className={'header-hover-single-title'}>*/}
                            {/*        About Us*/}
                            {/*    </div>*/}
                            {/*    <div onClick={() => {*/}
                            {/*        navigate('/privacy-policy')*/}
                            {/*    }} className={'header-hover-single-option'}>*/}
                            {/*        Privacy Policy*/}
                            {/*    </div>*/}
                            {/*    <div onClick={() => {*/}
                            {/*        navigate('/terms-and-conditions')*/}
                            {/*    }} className={'header-hover-single-option'}>*/}
                            {/*        Terms & Condition*/}
                            {/*    </div>*/}
                            {/*    <div onClick={() => {*/}
                            {/*        navigate('/return-and-refund')*/}
                            {/*    }} className={'header-hover-single-option'}>*/}
                            {/*        Return & Refund<br/>*/}
                            {/*        Policy*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                ):(
                    <div/>
                )
            }
        </div>
    )
}

export default Header

export {setCartOpen,authState,setLoginPrompt, setHomeCartOpen}
