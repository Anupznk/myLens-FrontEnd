import React, {useEffect, useRef, useState} from 'react'
import Header, {authState, setLoginPrompt} from "../home/Header";
import BreadCrump from "./BreadCrump";
import '../../assets/css/products.css'
import {
    Button, CircularProgress,
    Divider,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid, InputAdornment,
    Radio,
    RadioGroup,
    TextField
} from "@mui/material";
import desktopCross from '../../assets/images/production/cart-cross-desktop.svg'
import {useDispatch, useSelector} from "react-redux";
import '../../assets/css/cart.css'
import {
    clearCart,
    createCart,
    decrementQuantity,
    incrementQuantity,
    removeCartItem,
    updateTrialCartBilling
} from "../../actions/cart";
import '../../assets/css/slider.css'
import {Autocomplete} from "@mui/lab";
import {changeFormate, infoPrompt, navBgDefault, phonenumber, showToast} from "../../App";
import {useNavigate} from "react-router-dom";
import {clearHomeCart, createHomeCart, removeHomeCartItem} from "../../actions/homeCart";
import Footer from "../home/Footer";
import DelayComponent, {show} from "./DelayComponent";
import {
    CubeSpinner,
    GuardSpinner,
    HoopSpinner,
    StageSpinner,
    SwapSpinner,
    SwishSpinner,
    WhisperSpinner
} from "react-spinners-kit";
import {homeCartReducer} from "../../reducers/homeCartRedicer";
import {fetchAvailableDateCart} from "../../actions/product";
import {pushEvent} from "../../actions/analytics";
import {eventTable} from "../../index";
import { Helmet } from "react-helmet";

const TakeHomeCart = props => {

    var navigate = useNavigate()

    var metropolitons=[
        'Adabor','Aftabnagar','Agargaon','Ashkona','Azimpur','Badda','Bakshi Bazar','Balurghat','Banani','Banani DOHS','Banasree','Bangshal','Baridhara Diplomatic Zone','Baridhara DOHS','Baridhara J Block','Bashabo','Bashundhara','Bawnia','Beraid','Boro Moghbazar','Central Road','Chawkbazar','Dakshinkhan','Demra','Dhaka Cantonment','Dhaka University','Dhanmondi','Dholpur','DIT Road','DOHS','Elephant Road','Eskaton Road','Faidabad','Faridabad','Farmgate','Gandaria','Gopibag','Goran','Green Road','Gulisthan','Gulshan 1','Gulshan 2','Hatirpool','Hazaribag','Islampur','Jatrabari','Jigatola','Jurain','Kadamtoli','Kafrul','Kalabagan','Kallyanpur','Kamlapur','Kamranggirchar','Kathalbagan','kathalbagan','Kawla','Kawranbazar','Khilgaon','Khilkhet','Kuril','Lakshmibazar','Lalbag','Malibag','Manda','manikdi','Maniknogor','matikata','Matuail','Mirpur 1','MIRPUR 10','Mirpur 10','MIRPUR 12','Mirpur 13','Mirpur 14','Mirpur 2','MIRPUR 6','Mogbazar','Mohakhali','Mohakhali DOHS','Mohammadpur','MONIPUR','Motijheel','Mugda','Nadda','Nakhalpara','Narinda','New Elephant Road','Newmarket','Niketan','Nikunja 1','Nikunja 2','nilkhet','Pallabi','Paltan','Panthapath','PIRERBAG','Rampura','Rayerbag','RUPNAGOR','Sadarghat','Sector 1','Sector 10','Sector 11','Sector 12','Sector 13','Sector 14','Sector 3','Sector 4','Sector 5','Sector 6','Sector 7','Sector 8','Sector 9','Shahbagh','Shahid Nagar','Shahjadpur','Shajahanpur','shampur','Shanir Akhra','Shantinagar','Shegunbagicha','SHEWRAPARA','Shiddeshwari','Shyamoli','South Banasree','Suttrapur','Tejgaon','Turag','Uttarkhan','Vatara','Wari'
    ]

    const cartItems = useSelector(state => state.homeCart)
    const billingCookie = useSelector(state => state.billing)
    const dispatch = useDispatch()
    const [district, setDistrict] = useState('zone' in billingCookie?billingCookie.zone:'')

    const [shipping, setShipping] = useState(100)

    const [step, setStep] = useState(0)

    const [subtotal, setSubtotal] = useState(0)

    const [shipData, setShipData] = useState(null)

    const [loading, setLoading] = useState(false)

    const TRIAL_LOADING_STRING='Fetching...'

    const [trialDate,setTrialDate]=useState(TRIAL_LOADING_STRING)


    const fetchTrialDate=async ()=>{
        var productIds=cartItems.map(c=>c.id)
        var date=await fetchAvailableDateCart(productIds)
        setTrialDate(changeFormate(new Date(date)))
    }

    useEffect(()=>{
        pushEvent(eventTable.trialHomePageOpen)
        fetchTrialDate()
    },[])


    var nameRef = useRef()
    var addressRef = useRef()
    var phoneRef = useRef()
    var emailRef = useRef()

    const updateSubtotal = () => {
        var total = 0;
        cartItems.map(i => {
            total += i.quantity * i.price
        })
        setSubtotal(total)
    }

    useEffect(() => {
        updateSubtotal()
    }, [cartItems])

    const placeOrder = async () => {

        pushEvent(eventTable.trialHomeCheckoutClick)

        if (!loading) {

            var name = nameRef.current.value.trim()
            var address = addressRef.current.value.trim()
            var phone = phoneRef.current.value.trim()
            var email = emailRef.current.value.trim()

            if (cartItems.length === 0) {
                showToast('Your cart is empty')
                pushEvent(eventTable.trialHomeCheckoutFailed)
            }
            else if (name.length === 0) {
                showToast('Enter your name')
                pushEvent(eventTable.trialHomeCheckoutFailed)
            }
            else if (address.length === 0) {
                showToast('Enter your address')
                pushEvent(eventTable.trialHomeCheckoutFailed)
            }
            else if (district.length === 0) {
                showToast('Select your area')
                pushEvent(eventTable.trialHomeCheckoutFailed)
            }
            else if (phone.length === 0) {
                showToast('Enter your phone')
                pushEvent(eventTable.trialHomeCheckoutFailed)
            }
            else if(!phonenumber(phone)) {
                showToast('Enter correct phone number')
                pushEvent(eventTable.trialHomeCheckoutFailed)
            }
            else {
                setLoading(true)

                updateTrialCartBilling(name,phone,address,'Dhaka',district,email,billingCookie,dispatch)

                var productIds=cartItems.map(c=>c.id)
                var date=await fetchAvailableDateCart(productIds)
                showToast(date)

                var orderObject = {

                    "preferred_time": 1,
                    "preferred_date": date,
                    "name": name,
                    "phone": phone,
                    "billing_address": address,
                    "district": district,
                    "email": email,
                    "products": cartItems.map(c => {
                        return {
                            "productId": c.id,
                            "quantity": 1
                        }
                    })
                }

                var isSuccessful = await createHomeCart(orderObject)
                setLoading(false)
                if (isSuccessful) {
                    showToast('Trial Home Requested Successfully')
                    clearHomeCart(dispatch)
                    navigate('/shop/both/all')
                } else {
                    showToast('Error occurred')
                }

            }
        }
    }

    const [show, setShow] = useState(true)

    const timeOut = 4000

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            setShow(false)
        }, timeOut)

        return () => clearTimeout(timeout)

    }, [show])

    React.useEffect(() => {
        setShow(true)
    }, [step])

    return (
        <div>
            <Helmet>
                    <title>Trial Home Cart - MyLens</title>      
                </Helmet>
            <Header bg={navBgDefault}/>

            <div className={'cart-main-container'}>

                <div className={'cart-left'}>
                    {/*<BreadCrump updateStep={setStep} type={1} step={step}/>*/}
                    <h2 style={{marginTop:'-20px',marginBottom:'20px'}}>
                        Trial Home Products
                    </h2>
                    {
                        step === 0 ? (
                            <div>
                                <div className={'cart-row-container'}>
                                    <Grid container>
                                        <Grid item md={2}>

                                        </Grid>
                                        <Grid item md={5}>
                                            <div className={'cart-row-header mobile-hide'}>
                                                Title
                                            </div>
                                        </Grid>
                                        <Grid item md={5}>
                                            <div className={'cart-row-header mobile-hide'}>
                                                Change
                                            </div>
                                        </Grid>

                                    </Grid>
                                </div>
                                {
                                    cartItems.map(d => {
                                        return (
                                            <div className={'cart-row-container'}>
                                                <Grid container>
                                                    <Grid item md={2} xs={3}>
                                                        <div className={'cart-row-image-container'}>
                                                            <img className={'cart-row-image'} src={d.imgURL} alt="cart-image"/>
                                                            <img onClick={() => {
                                                                removeHomeCartItem(d.id, cartItems, dispatch)
                                                            }} className={'cart-row-cross-desktop mobile-hide'}
                                                                 src={desktopCross} alt='remove-button'/>
                                                        </div>
                                                    </Grid>
                                                    <Grid item md={5} xs={3.6}>
                                                        <div className={'cart-single-title'}>
                                                            <center style={{width: '100%'}}>
                                                                {d.title}
                                                            </center>
                                                        </div>
                                                    </Grid>
                                                    <Grid item md={5} xs={5.4}>
                                                        <div className={'cart-choose-button'}>
                                                            <button
                                                                onClick={() => {
                                                                    removeHomeCartItem(d.id, cartItems, dispatch);
                                                                    navigate('/shop/both/all');
                                                                }}
                                                                className={'filledBtn cartCheckoutBtn'}>
                                                                Choose Another
                                                            </button>
                                                        </div>
                                                    </Grid>

                                                </Grid>
                                                <Divider height={3} style={{marginTop: '10px'}}/>
                                            </div>
                                        )
                                    })
                                }
                                {show ? <div className={'trial-date-container'}>

                                        <center>
                                            <CubeSpinner />
                                            <br/>
                                            Generating the best possible trial date...
                                        </center>
                                    </div> :

                                    <div className={'trial-date-container'}>
                                        <div className={'trial-date-header'}>
                                            Trial Date
                                        </div>
                                        <div className={'trial-date-date'}>
                                            {trialDate}
                                        </div>
                                    </div>
                                }
                            </div>
                        ) : (
                            <div className={'take-home-address-mobile'}>
                                <div className={'cart-left-title'}>
                                    Shipping Info
                                </div>
                                <div className={'cart-left-label'}>
                                    Name
                                </div>


                                <input ref={nameRef} defaultValue={'name' in billingCookie?billingCookie.name:''} placeholder="Name" className="input-text" type="text" id="fname" name="fname"></input>
                                {/*<TextField*/}
                                {/*    inputRef={nameRef}*/}
                                {/*    variant={'outlined'}*/}
                                {/*    fullWidth*/}
                                {/*    defaultValue={'name' in billingCookie?billingCookie.name:''}*/}
                                {/*/>*/}
                                <div className={'cart-left-label'}>
                                    Address
                                </div>
                                <input ref={addressRef} defaultValue={'address' in billingCookie?billingCookie.address:''} placeholder="Address" className="input-text" type="text" id="fname" name="fname"></input>

                                {/*<TextField*/}
                                {/*    inputRef={addressRef}*/}
                                {/*    variant={'outlined'}*/}
                                {/*    fullWidth*/}
                                {/*    defaultValue={'address' in billingCookie?billingCookie.address:''}*/}
                                {/*/>*/}
                                <div className={'cart-left-label'}>
                                    Area (Inside Dhaka Metropoliton)
                                </div>
                                <Autocomplete
                                    disablePortal
                                    options={metropolitons}
                                    fullWidth
                                    defaultValue={'zone' in billingCookie?billingCookie.zone:''}
                                    onChange={(e, v) => {
                                        if (v === 'Dhaka')
                                            setShipping(60)
                                        else {
                                            setShipping(60)
                                        }
                                        setDistrict(v)
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                <div className={'cart-left-label'}>
                                    Phone
                                </div>
                                <input ref={phoneRef} defaultValue={'phone' in billingCookie?billingCookie.phone:''} placeholder="Phone (01XXXXXXXXX)" className="input-text" type="text" id="fname" name="fname"></input>

                                {/*<TextField*/}
                                {/*    defaultValue={'phone' in billingCookie?billingCookie.phone:''}*/}
                                {/*    inputRef={phoneRef}*/}
                                {/*    variant={'outlined'}*/}
                                {/*    fullWidth*/}
                                {/*    InputProps={{*/}
                                {/*        startAdornment: <InputAdornment position="start">+88</InputAdornment>,*/}
                                {/*    }}*/}
                                {/*/>*/}
                                <div className={'cart-left-label'}>
                                    Email Address (Optional)
                                </div>
                                <input ref={emailRef} defaultValue={'email' in billingCookie?billingCookie.email:''} placeholder="Email (Optional))" className="input-text" type="text" id="fname" name="fname"></input>

                                {/*<TextField*/}
                                {/*    defaultValue={'email' in billingCookie?billingCookie.email:''}*/}
                                {/*    inputRef={emailRef}*/}
                                {/*    variant={'outlined'}*/}
                                {/*    fullWidth*/}
                                {/*/>*/}

                                {show ? <div>
                                        <br/><br/>
                                        <center>
                                            <CubeSpinner />
                                            <br/>
                                            Generating the best possible trial date...
                                        </center>
                                    </div> :

                                    <div className={'trial-date-container'}>
                                        <div className={'trial-date-header'}>
                                            Trial Date
                                        </div>
                                        <div className={'trial-date-date'}>
                                            {trialDate}
                                        </div>
                                    </div>
                                }
                            </div>

                        )
                    }
                </div>
                <div className={'cart-divider'}></div>
                <div className={'cart-right'}>
                    {
                        step === 0 ? (
                            <div>
                                <div className={'cart-right-title'}>
                                    Your Order
                                </div>
                                <div className={'cart-checkout-container'}>
                                    <div className={'cart-checkout-header-container'}>
                                        <div className={'cart-checkout-header'}>
                                            Product
                                        </div>
                                        <div className={'cart-checkout-header'}>

                                        </div>
                                    </div>
                                </div>
                                <Divider style={{marginLeft: '20px'}}/>
                                {
                                    cartItems.map(c => {
                                        return (
                                            <div className={'cart-checkout-item-container'}>
                                                <Grid container>
                                                    <Grid item xs={12}>
                                                        <div className={'cart-checkout-item-title'}>
                                                            {c.title}
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                                <Divider style={{marginTop: '10px'}}/>
                                            </div>
                                        )
                                    })
                                }
                                <div className={'cart-checkout-item-container'}>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <div className={'cart-checkout-item-title'}>
                                                <b style={{fontSize:'1.5em'}}>No need to buy in case of Trial. Just Trial fee of 90 BDT</b>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>
                                {/*<div className={'trial-date-container'}>*/}
                                {/*    {show ? <div>*/}
                                {/*            <br/><br/>*/}
                                {/*            <center>*/}
                                {/*                <CubeSpinner />*/}
                                {/*                <br/>*/}
                                {/*                Generating the best possible trial date...*/}
                                {/*            </center>*/}
                                {/*        </div> :*/}

                                {/*        <div className={'trial-date-container'}>*/}
                                {/*            <div className={'trial-date-header'}>*/}
                                {/*                Trial Date*/}
                                {/*            </div>*/}
                                {/*            <div className={'trial-date-date'}>*/}
                                {/*                {trialDate}*/}
                                {/*            </div>*/}
                                {/*        </div>*/}
                                {/*    }*/}
                                {/*</div>*/}
                                <center>
                                    <button
                                        onClick={() => {
                                            pushEvent(eventTable.trialHomeProceedClick)
                                            // if (authState)
                                            //     setStep(1)
                                            // else {
                                            //     setLoginPrompt(true)
                                            // }
                                            infoPrompt(false)
                                        }}
                                        className={'filledBtn cartCheckoutBtn'}
                                    >
                                        Confirm
                                    </button>
                                </center>
                            </div>
                        ) : (
                            <div>
                                <div className={'cart-right-title'}>
                                    Your Order
                                </div>
                                <div className={'cart-checkout-container'}>
                                    <div className={'cart-checkout-header-container'}>
                                        <div className={'cart-checkout-header'}>
                                            Product
                                        </div>
                                        <div className={'cart-checkout-header'}>

                                        </div>
                                    </div>
                                </div>
                                <Divider style={{marginLeft: '20px'}}/>
                                {
                                    cartItems.map(c => {
                                        return (
                                            <div className={'cart-checkout-item-container'}>
                                                <Grid container>
                                                    <Grid item xs={12}>
                                                        <div className={'cart-checkout-item-title'}>
                                                            {c.title}
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                                <Divider style={{marginTop: '10px'}}/>
                                            </div>
                                        )
                                    })
                                }
                                {/*<div className={'trial-date-container'}>*/}
                                {/*    {show ? <div>*/}
                                {/*            <br/><br/>*/}
                                {/*            <center>*/}
                                {/*                <CubeSpinner />*/}
                                {/*                <br/>*/}
                                {/*                Generating the best possible trial date...*/}
                                {/*            </center>*/}
                                {/*        </div> :*/}

                                {/*        <div className={'trial-date-container'}>*/}
                                {/*            <div className={'trial-date-header'}>*/}
                                {/*                Trial Date*/}
                                {/*            </div>*/}
                                {/*            <div className={'trial-date-date'}>*/}
                                {/*                {trialDate}*/}
                                {/*            </div>*/}
                                {/*        </div>*/}
                                {/*    }*/}
                                {/*</div>*/}
                                <div className={'cart-checkout-item-container'}>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <div className={'cart-checkout-item-title'}>
                                                <b style={{fontSize:'1.5em'}}>No need to buy in case of Trial. Just Trial fee of 90 BDT</b>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>

                                <center>
                                    <button
                                        onClick={placeOrder}
                                        className={'filledBtn trialBtn'}>
                                        {
                                            loading ? <CircularProgress/> : 'Place Order'
                                        }
                                    </button>
                                </center>
                            </div>
                        )
                    }

                </div>
            </div>

            <br/><br/><br/><br/><br/>
            
        </div>
    )
}

export default TakeHomeCart
