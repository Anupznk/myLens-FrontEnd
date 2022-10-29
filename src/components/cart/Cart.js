import React, {useEffect, useRef, useState} from 'react'
import Header from "../home/Header";
import SSLCommerzImage from '../../assets/images/production/ssl_commerz.png'
import '../../assets/css/products.css'
import BreadCrump from "./BreadCrump";
import {
    Button, Checkbox, CircularProgress,
    Divider, FormControl,
    FormControlLabel, FormGroup,
    FormLabel,
    Grid,
    InputAdornment,
    Radio,
    RadioGroup,
    TextField
} from "@mui/material";
import desktopCross from '../../assets/images/production/cart-cross-desktop.svg'
import mobileCross from '../../assets/images/production/mobileCross.svg'
import {useDispatch, useSelector} from "react-redux";
import '../../assets/css/cart.css'
import Cookies from "universal-cookie";
import { Helmet } from "react-helmet";

import {
    checkoutCOD, checkoutSSL,
    clearCart,
    createCart,
    decrementQuantity, getId,
    incrementQuantity,
    removeCartItem, updateCartBilling
} from "../../actions/cart";
import '../../assets/css/slider.css'
// import {Autocomplete} from "@mui/lab";
import {Autocomplete} from '@mui/material'
import {infoPrompt, MERCHANT_CODE, navBgDefault, phonenumber, setCurrentMerchant, showToast} from "../../App";
import {useNavigate} from "react-router-dom";
import {eventTable, lensOptions} from "../../index";
import Footer from "../home/Footer";
import MobileBreadCrump from "./MobileBreadCrump";
import {initPayment} from "../../actions/payment";
import {pushEvent} from "../../actions/analytics";

const cookies = new Cookies();

const COOKIE_AGE=31536000

const Cart = props => {

    var navigate = useNavigate()

    var districts = ['Bagerhat', 'Bandarban', 'Barguna', 'Barisal', 'Bhola', 'Bogra', 'Brahmanbaria', 'Chandpur', 'Chapainawabganj', 'Chittagong', 'Chuadanga', 'Comilla', "Cox's Bazar", 'Dhaka', 'Dinajpur', 'Faridpur', 'Feni', 'Gaibandha', 'Gazipur', 'Gopalganj', 'Habiganj', 'Jamalpur', 'Jessore', 'Jhalokati', 'Jhenaidah', 'Joypurhat', 'Khagrachhari', 'Khulna', 'Kishoreganj', 'Kurigram', 'Kushtia', 'Lakshmipur', 'Lalmonirhat', 'Madaripur', 'Magura', 'Manikganj', 'Meherpur', 'Moulvibazar', 'Munshiganj', 'Mymensingh', 'Naogaon', 'Narail', 'Narayanganj', 'Narsingdi', 'Natore', 'Netrakona', 'Nilphamari', 'Noakhali', 'Pabna', 'Panchagarh', 'Patuakhali', 'Pirojpur', 'Rajbari', 'Rajshahi', 'Rangamati', 'Rangpur', 'Satkhira', 'Shariatpur', 'Sherpur', 'Sirajganj', 'Sunamganj', 'Sylhet', 'Tangail', 'Thakurgaon']


    const cartItems = useSelector(state => state.cart)
    const billingCookie = useSelector(state => state.billing)

    const dispatch = useDispatch()


    const [district, setDistrict] = useState('district' in billingCookie?billingCookie.district:'')

    const [shipping, setShipping] = useState(60)

    const [step, setStep] = useState(0)

    const [subtotal, setSubtotal] = useState(0)

    const [shipData, setShipData] = useState(null)

    const [loading, setLoading] = useState(false)

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

    const [mobile, setMobile] = useState(false)
    useEffect(()=>{
        pushEvent(eventTable.cartPageOpen)

        if('failed' in props){
            showToast('Payment Error')
            setStep(1)
        }else if('success' in props){
            clearCart(dispatch)
            showToast('Payment Successful')
            var shipTemp
            if(!(cookies.get('ship')==undefined || cookies.get('ship')==null)){
                shipTemp=JSON.parse(atob(cookies.get('ship')))
                setShipData(shipTemp)
            }
            if('cod' in shipTemp)setPaymentMethod(1)
            checkoutSSL(shipTemp.cartId).then(res=>{
                if(res){
                    showToast('Cart submitted successfully')
                }
            })

            setStep(2)
        }
    },[])

    function handleResize() {
        if (window.innerWidth <= 1020) setMobile(true)
        else setMobile(false)
    }

    useEffect(() => {
        if (window.innerWidth <= 1020) setMobile(true)
        else setMobile(false)
        window.addEventListener('resize', handleResize)
    }, [])


    const [paymentMethod,setPaymentMethod]=useState(0)




    const handlePaymentMethodChange=event=>{
        setPaymentMethod(event.target.value)
    }





    const placeOrder=async ()=>{
        // todo: call api to check if this much items are available
        pushEvent(eventTable.cartCheckoutClick)
        if (!loading) {

            var name = nameRef.current.value.trim()
            var address = addressRef.current.value.trim()
            var phone = phoneRef.current.value.trim()
            var email = emailRef.current.value.trim()

            if (cartItems.length === 0) {
                showToast('Your cart is empty')
                pushEvent(eventTable.cartCheckoutFailed)
            }
            else if (name.length === 0) {
                showToast('Enter your name')
                pushEvent(eventTable.cartCheckoutFailed)
            }
            else if (address.length === 0) {
                showToast('Enter your address')
                pushEvent(eventTable.cartCheckoutFailed)
            }
            else if (district.length === 0) {
                showToast('Select your district')
                pushEvent(eventTable.cartCheckoutFailed)
            }
            else if (phone.length === 0) {
                showToast('Enter your phone')
                pushEvent(eventTable.cartCheckoutFailed)
            }
            else if(!phonenumber(phone)) {
                showToast('Enter correct phone number')
                pushEvent(eventTable.cartCheckoutFailed)
            }
            else {
                setLoading(true)
                updateCartBilling(name,phone,address,district,email,billingCookie,dispatch)
                var products = cartItems.map(c => {
                    if (c.has_lens) {
                        return {
                            "productId": getId(c.id),
                            "quantity": c.quantity,
                            "power_type": c.power_type,
                            "power_option": c.power_option,
                            "price_type": c.price_type,
                            prescription:c.prescription

                        }
                    } else {
                        return {
                            "productId": c.id,
                            "quantity": c.quantity
                        }
                    }
                })

                var orderObject={
                    "is_anonymous": true,
                    "name": name,
                    "phone": phone,
                    "billing_address": address,
                    "district": district,
                    "email": email,
                    "products": products
                }
                var isSuccessful=await createCart(orderObject)

                if(isSuccessful){
                    if(parseInt(paymentMethod)===0) {
                        var isSuccessfulTemp=await checkoutCOD(isSuccessful)
                        if(isSuccessfulTemp){
                            showToast('Order placed successfully')
                            clearCart(dispatch)
                            setShipData({
                                ...orderObject,
                                subtotal: subtotal,
                                shipping: shipping,
                                items: cartItems
                            })
                            setStep(2)
                        }else{
                            showToast('Error occurred')
                        }
                    }else{
                        var paymentData={
                                "total_amount": shipping+subtotal,
                                "success_url": "https://mylens.com.bd/cart/success",
                                "fail_url": "https://mylens.com.bd/cart/fail",
                                "cancel_url": "https://mylens.com.bd/cart/fail",
                                "cus_name": name,
                                "cus_email": 'customer@email.com',
                                "cus_add1": address,
                                "cus_city": district,
                                "cus_postcode": "1000",
                                "cus_phone": phone,
                                "ship_name": name,
                                "ship_add1": address,
                                "ship_city": district,
                                "ship_postcode": "13424"
                            }

                            ////console.log(paymentData)

                            var paymentPayload=await initPayment(paymentData)
                            if(paymentPayload){
                                cookies.set('ship',btoa(JSON.stringify({
                                    ...orderObject,
                                    subtotal: subtotal,
                                    shipping: shipping,
                                    items: cartItems,
                                    cartId:isSuccessful,
                                    cod:true
                                })),{ path: '/', maxAge: COOKIE_AGE })
                                window.location=paymentPayload
                            }
                    }
                }else{
                    showToast('Error occurred')
                }
                setLoading(false)
            }
        }
    }


    const [checked, setChecked] = React.useState(false);

    const handleChange = (event) => {
        setChecked(event.target.checked);
        //console.log('agreed status', event.target.checked)
    };

    if (mobile)
        return (
            <div>
                <Helmet>
                    <title>Shopping Cart - MyLens</title>      
                </Helmet>

                <div className={'mobile-cart-container'}>
                    <Header bg={navBgDefault}/>
                    <MobileBreadCrump updateStep={setStep} step={step}/>
                    {
                        step === 0 ? (
                            <div className={'cart-mobile-body-container'}>
                                <div className={'cart-right-title'}>
                                    Cart Totals
                                </div>
                                <div className={'cart-checkout-container'}>
                                    <div className={'cart-checkout-header-container'}>
                                        <div className={'cart-checkout-header'}>
                                            Products
                                        </div>
                                        <div className={'cart-checkout-header'}>
                                            Subtotal
                                        </div>
                                    </div>
                                </div>
                                <Divider style={{marginLeft: '20px'}}/>
                                {
                                    cartItems.map(c => {
                                        return (
                                            <div className={'cart-checkout-item-container'}>
                                                <Grid container>
                                                    <Grid item xs={4.5}>
                                                        <div className={'cart-checkout-item-title'}>
                                                            {c.title}
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <div className={'cart-checkout-item-quantity'}>
                                                            x{c.quantity}
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={4.5}>
                                                        <div className={'cart-checkout-item-total'}>
                                                            <div>

                                                            </div>
                                                            <div>
                                                                ৳ {c.price * c.quantity}
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                                <Divider style={{marginTop: '10px'}}/>
                                            </div>
                                        )
                                    })
                                }
                                <div className={'cart-right-subtotal-container'}>
                                    <div className={'cart-right-subtotal-label'}>
                                        Subtotal
                                    </div>
                                    <div className={'cart-right-subtotal-amount'}>
                                        ৳ {subtotal}
                                    </div>
                                </div>
                                <div className={'cart-mobile-btn-container'}>
                                    <button
                                        onClick={() => {
                                            // setStep(1);
                                            infoPrompt(true)
                                            pushEvent(eventTable.cartProceedClick)
                                        }}
                                        className={'filledBtn cartCheckoutBtn'}>
                                        Proceed To Checkout
                                    </button>
                                </div>

                                <div style={{marginBottom: '50px'}}>
                                    <div className={'cart-row-container-mobile'}>
                                        <Grid container>
                                            <Grid item xs={3}>
                                                <div className={'cart-row-header'}>
                                                    Product
                                                </div>
                                            </Grid>
                                            <Grid item xs={4.5}>
                                                <div className={'cart-row-header'}>
                                                    Price
                                                </div>
                                            </Grid>
                                            <Grid item xs={4.5}>
                                                <div className={'cart-row-header'}>
                                                    Total
                                                </div>
                                            </Grid>

                                        </Grid>
                                    </div>
                                    {
                                        cartItems.map(d => {
                                            return (
                                                <div className={'cart-row-container-mobile'}>
                                                    <Grid container>
                                                        <Grid item xs={3}>
                                                            <div className={'cart-row-image-container'}>
                                                                <img className={'cart-row-image'} src={d.imgURL} alt={'cart-image'}/>

                                                            </div>
                                                        </Grid>
                                                        <Grid item xs={4.5}>
                                                            <div className={'cart-single-title'}>
                                                                <div className={'cart-row-price'}>
                                                                    ৳ {d.price}
                                                                </div>
                                                                <div className={'cart-row-quantity-container'}>
                                                                    <div className={'cart-quantity-box'}>
                                                                        <div onClick={() => {
                                                                            decrementQuantity(d.id, cartItems, dispatch)
                                                                        }} className={'cart-quantity-sign'}>
                                                                            -
                                                                        </div>
                                                                        <div className={'cart-quantity-number'}>
                                                                            {d.quantity}
                                                                        </div>
                                                                        <div onClick={() => {
                                                                            incrementQuantity(d, cartItems, dispatch)
                                                                        }} className={'cart-quantity-sign'}>
                                                                            +
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Grid>
                                                        <Grid item xs={4.5}>
                                                            <div className={'cart-single-title'}>
                                                                <div className={'cart-row-total'}>
                                                                    ৳ {d.price * d.quantity}
                                                                </div>
                                                                <div className={'cart-mobile-delete-container'}>
                                                                    <img onClick={() => {
                                                                        //console.log('cartLen', cartItems.length)
                                                                        if (cartItems.length === 1)
                                                                            setCurrentMerchant(MERCHANT_CODE.NONE)
                                                                        removeCartItem(d.id, cartItems, dispatch)

                                                                    }} src={desktopCross}/>
                                                                </div>
                                                            </div>

                                                        </Grid>

                                                    </Grid>
                                                    <Divider height={3} style={{marginTop: '10px'}}/>
                                                </div>
                                            )
                                        })
                                    }
                                </div>


                            </div>

                        ) : (
                            step === 1 ? (
                                <div className={'mobile-billing-container'}>
                                    <div className={'cart-left-title'}>
                                        Billing and Shipping
                                    </div>
                                    <div className={'cart-left-label'}>
                                        Name
                                    </div>
                                    <input ref={nameRef} defaultValue={'name' in billingCookie?billingCookie.name:''} placeholder="Name" className="input-text" type="text" id="fname" name="fname"></input>

                                    {/*<TextField*/}
                                    {/*    defaultValue={'name' in billingCookie?billingCookie.name:''}*/}
                                    {/*    inputRef={nameRef}*/}
                                    {/*    variant={'outlined'}*/}
                                    {/*    fullWidth*/}
                                    {/*/>*/}
                                    <div className={'cart-left-label'}>
                                        Address
                                    </div>
                                    <input ref={addressRef} defaultValue={'address' in billingCookie?billingCookie.address:''} placeholder="Address" className="input-text" type="text" id="fname" name="fname"></input>

                                    {/*<TextField*/}
                                    {/*    defaultValue={'address' in billingCookie?billingCookie.address:''}*/}
                                    {/*    inputRef={addressRef}*/}
                                    {/*    variant={'outlined'}*/}
                                    {/*    fullWidth*/}
                                    {/*/>*/}
                                    <div className={'cart-left-label'}>
                                        District
                                    </div>
                                    <Autocomplete
                                        disablePortal
                                        options={districts}
                                        fullWidth
                                        defaultValue={'district' in billingCookie?billingCookie.district:''}
                                        onChange={(e, v) => {
                                            setShipping(60)
                                            setDistrict(v)
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                    <div className={'cart-left-label'}>
                                        Phone
                                    </div>
                                    {/*<TextField*/}
                                    {/*    defaultValue={'phone' in billingCookie?billingCookie.phone:''}*/}
                                    {/*    inputRef={phoneRef}*/}
                                    {/*    variant={'outlined'}*/}
                                    {/*    fullWidth*/}
                                    {/*    InputProps={{*/}
                                    {/*        startAdornment: <InputAdornment position="start">+88</InputAdornment>,*/}
                                    {/*    }}*/}
                                    {/*/>*/}
                                    <input ref={phoneRef} defaultValue={'phone' in billingCookie?billingCookie.phone:''} placeholder="Phone (01XXXXXXXXX)" className="input-text" type="text" id="fname" name="fname"></input>

                                    <div className={'cart-left-label'}>
                                        Email Address (Optional)
                                    </div>
                                    {/*<TextField*/}
                                    {/*    defaultValue={'email' in billingCookie?billingCookie.email:''}*/}
                                    {/*    inputRef={emailRef}*/}
                                    {/*    variant={'outlined'}*/}
                                    {/*    fullWidth*/}
                                    {/*/>*/}
                                    <input ref={emailRef} defaultValue={'email' in billingCookie?billingCookie.email:''} placeholder="Email (Optional))" className="input-text" type="text" id="fname" name="fname"></input>

                                    <div className={'ship-bottom-mobile'}>
                                        <div className={'cart-right-title-ship'}>
                                            Your Order
                                        </div>
                                        <div className={'cart-checkout-container'}>
                                            <div className={'cart-checkout-header-container'}>
                                                <div className={'cart-checkout-header'}>
                                                    Products
                                                </div>
                                                <div className={'cart-checkout-header'}>
                                                    Subtotal
                                                </div>
                                            </div>
                                        </div>
                                        <Divider style={{marginLeft: '20px'}}/>
                                        {
                                            cartItems.map(c => {
                                                return (
                                                    <div className={'cart-checkout-item-container'}>
                                                        <Grid container>
                                                            <Grid item xs={4.5}>
                                                                <div className={'cart-checkout-item-title'}>
                                                                    {c.title}
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={3}>
                                                                <div className={'cart-checkout-item-quantity'}>
                                                                    x{c.quantity}
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={4.5}>
                                                                <div className={'cart-checkout-item-total'}>
                                                                    <div>

                                                                    </div>
                                                                    <div>
                                                                        ৳ {c.price * c.quantity}
                                                                    </div>
                                                                </div>
                                                            </Grid>
                                                        </Grid>
                                                        <Divider style={{marginTop: '10px'}}/>
                                                    </div>
                                                )
                                            })
                                        }
                                        <div className={'cart-checkout-container'}>
                                            <div className={'cart-checkout-header-container'}>
                                                <div className={'cart-checkout-header'}>
                                                    Subtotal
                                                </div>
                                                <div className={'cart-checkout-header'}>
                                                    ৳ {subtotal}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={'cart-checkout-container'}>
                                            <div className={'cart-checkout-header-container'}>
                                                <div className={'cart-checkout-header'}>
                                                    Shipping
                                                </div>
                                                <div className={'cart-checkout-header'}>
                                                    ৳ {shipping}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={'cart-checkout-container'}>
                                            <div className={'cart-checkout-header-container'}>
                                                <div className={'cart-checkout-header'}>
                                                    Total
                                                </div>
                                                <div className={'cart-checkout-header-total'}>
                                                    ৳ {shipping + subtotal}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        step===1?(
                                            <div>
                                                <FormControl style={{marginTop:'14px',marginLeft:'20px'}}>
                                                    <FormLabel id="demo-radio-buttons-group-label">Payment Method</FormLabel>
                                                    <RadioGroup
                                                        onChange={handlePaymentMethodChange}
                                                        aria-labelledby="demo-radio-buttons-group-label"
                                                        defaultValue={0}
                                                        name="radio-buttons-group"
                                                    >
                                                        <FormControlLabel value={0} control={<Radio />} label="Cash On Delivery" />
                                                        {
                                                            parseInt(paymentMethod)===1?(
                                                                <div className={'cart-payment-container'}>
                                                                    <img src={SSLCommerzImage} alt='SSLCommerz-Image' />
                                                                </div>
                                                            ):(
                                                                <div/>
                                                            )
                                                        }
                                                        <FormControlLabel value={1} control={<Radio />} label="Online Payment" />
                                                    </RadioGroup>
                                                </FormControl>
                                                <div style={{marginLeft:'-5px'}}>
                                                    <FormGroup className={'terms-checkbox'}>
                                                        <FormControlLabel className={'terms-checkbox-label'} control={<Checkbox/>}
                                                                          onChange={handleChange}
                                                                          label={
                                                                            <div>
                                                                                I agree to have read the <a target="_blank" href="https://mylens.com.bd/terms-and-conditions">terms and conditions</a>, <a  target="_blank" href="https://mylens.com.bd/return-and-refund">return, refund</a> and <a target="_blank" href="https://mylens.com.bd/privacy-policy">privacy policy</a> of this website"
                                                                            </div>
                                                                          }/>

                                                    </FormGroup>

                                                    <div style={{marginRight:'12px'}}>
                                                        <center>
                                                            {checked ?
                                                                <button onClick={placeOrder}
                                                                        className={'filledBtn cartCheckoutBtn'}>
                                                                    {
                                                                        loading ? <CircularProgress/> : 'Place Order'
                                                                    }
                                                                </button> : <button

                                                                    className={'disabledBtn cartCheckoutBtn'}>
                                                                    Place Order
                                                                </button>
                                                            }
                                                        </center>
                                                    </div>
                                                </div>

                                            </div>
                                        ):(
                                            <div/>
                                        )
                                    }

                                </div>
                            ) : (
                                <div className={'mobile-billing-container'}>
                                    <div className={'cart-left-title'}>
                                        Order Placed Successfully
                                    </div>
                                    <div className={'cart-left-label'}>
                                        Name:
                                    </div>
                                    <div className={'cart-left-value'}>
                                        {shipData.name}
                                    </div>
                                    <div className={'cart-left-label'}>
                                        Address:
                                    </div>
                                    <div className={'cart-left-value'}>
                                        {shipData.billing_address}
                                    </div>
                                    <div className={'cart-left-label'}>
                                        District:
                                    </div>
                                    <div className={'cart-left-value'}>
                                        {shipData.district}
                                    </div>
                                    <div className={'cart-left-label'}>
                                        Phone:
                                    </div>
                                    <div className={'cart-left-value'}>
                                        {shipData.phone}
                                    </div>
                                    <div className={'cart-left-label'}>
                                        Email Address (Optional):
                                    </div>
                                    <div className={'cart-left-value'}>
                                        {shipData.email}
                                    </div>
                                    <div className={'ship-bottom-mobile'}>
                                        <div className={'cart-right-title-ship'}>
                                            Your Order
                                        </div>
                                        <div className={'cart-checkout-container'}>
                                            <div className={'cart-checkout-header-container'}>
                                                <div className={'cart-checkout-header'}>
                                                    Products
                                                </div>
                                                <div className={'cart-checkout-header'}>
                                                    Subtotal
                                                </div>
                                            </div>
                                        </div>
                                        <Divider style={{marginLeft: '20px'}}/>
                                        {
                                            shipData.items.map(c => {
                                                return (
                                                    <div className={'cart-checkout-item-container'}>
                                                        <Grid container>
                                                            <Grid item xs={4.5}>
                                                                <div className={'cart-checkout-item-title'}>
                                                                    {c.title}
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={3}>
                                                                <div className={'cart-checkout-item-quantity'}>
                                                                    x{c.quantity}
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={4.5}>
                                                                <div className={'cart-checkout-item-total'}>
                                                                    <div>

                                                                    </div>
                                                                    <div>
                                                                        ৳ {c.price * c.quantity}
                                                                    </div>
                                                                </div>
                                                            </Grid>
                                                        </Grid>
                                                        <Divider style={{marginTop: '10px'}}/>
                                                    </div>
                                                )
                                            })
                                        }
                                        <div className={'cart-checkout-container'}>
                                            <div className={'cart-checkout-header-container'}>
                                                <div className={'cart-checkout-header'}>
                                                    Subtotal
                                                </div>
                                                <div className={'cart-checkout-header'}>
                                                    ৳ {shipData.subtotal}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={'cart-checkout-container'}>
                                            <div className={'cart-checkout-header-container'}>
                                                <div className={'cart-checkout-header'}>
                                                    Shipping
                                                </div>
                                                <div className={'cart-checkout-header'}>
                                                    ৳ {shipData.shipping}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={'cart-checkout-container'}>
                                            <div className={'cart-checkout-header-container'}>
                                                <div className={'cart-checkout-header'}>
                                                    Total
                                                </div>
                                                <div className={'cart-checkout-header-total'}>
                                                    ৳ {shipData.shipping + shipData.subtotal}
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            step===1?(
                                                <div>
                                                    <FormControl style={{marginTop: '14px', marginLeft: '20px'}}>
                                                        <FormLabel id="demo-radio-buttons-group-label">Payment Method</FormLabel>
                                                        <RadioGroup
                                                            onChange={handlePaymentMethodChange}
                                                            aria-labelledby="demo-radio-buttons-group-label"
                                                            defaultValue={0}
                                                            name="radio-buttons-group"
                                                        >
                                                            <FormControlLabel value={0} control={<Radio/>}
                                                                              label="Cash On Delivery"/>
                                                            {
                                                                parseInt(paymentMethod) === 1 ? (
                                                                    <div className={'cart-payment-container'}>
                                                                        <img src={SSLCommerzImage} alt='SSLCommerz-Image'/>
                                                                    </div>
                                                                ) : (
                                                                    <div/>
                                                                )
                                                            }
                                                            <FormControlLabel value={1} control={<Radio/>} label="Online Payment"/>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <div style={{marginRight:'15px'}}>
                                                        <center>
                                                            <button
                                                                onClick={() => {
                                                                    navigate('/shop/both/all')
                                                                }}
                                                                className={'filledBtn cartCheckoutBtn'}>
                                                                Continue Shopping
                                                            </button>
                                                        </center>
                                                    </div>
                                                </div>
                                            ):(
                                                <div/>
                                            )
                                        }
                                    </div>
                                    <FormControl style={{marginTop:'14px',marginLeft:'20px'}}>
                                        <FormLabel id="demo-radio-buttons-group-label">Payment Method</FormLabel>
                                        <RadioGroup
                                            onChange={handlePaymentMethodChange}
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            defaultValue={paymentMethod}
                                            name="radio-buttons-group"
                                        >
                                            <FormControlLabel value={0} control={<Radio disabled />} label="Cash On Delivery" />
                                            {
                                                parseInt(paymentMethod)===1?(
                                                    <div className={'cart-payment-container'}>
                                                        <img src={SSLCommerzImage} alt='SSLCommerz-Image'/>
                                                    </div>
                                                ):(
                                                    <div/>
                                                )
                                            }
                                            <FormControlLabel value={1} control={<Radio disabled/>} label="Online Payment" />
                                        </RadioGroup>
                                    </FormControl>
                                    <div style={{marginRight:'15px'}}>
                                        <center>
                                            <button
                                                onClick={()=>{navigate('/shop/both/all')}}
                                                className={'filledBtn cartCheckoutBtn'}>
                                                Continue Shopping
                                            </button>
                                        </center>
                                    </div>

                                </div>
                            )
                        )
                    }
                </div>

                
            </div>
        )
    else
        return (
            <div>
                <Helmet>
                    <title>Shopping Cart - MyLens</title>      
                </Helmet>
                <Header bg={navBgDefault}/>

                <div className={'cart-main-container page-wrapper'}>
                    <div className={'cart-left'}>
                        <BreadCrump updateStep={setStep} type={0} step={step}/>
                        {
                            step === 0 ? (
                                <div>
                                    <div className={'cart-row-container'}>
                                        <Grid container>
                                            <Grid item md={2}>
                                                <div className={'cart-row-header'}>
                                                    Product
                                                </div>
                                            </Grid>
                                            <Grid item md={4}>

                                            </Grid>
                                            <Grid item md={2}>
                                                <div className={'cart-row-header'}>
                                                    Price
                                                </div>
                                            </Grid>
                                            <Grid item md={2}>
                                                <div className={'cart-row-header'}>
                                                    Quantity
                                                </div>
                                            </Grid>
                                            <Grid item md={2}>
                                                <div className={'cart-row-header'}>
                                                    Total
                                                </div>
                                            </Grid>

                                        </Grid>
                                    </div>
                                    {
                                        cartItems.map(d => {
                                            return (
                                                <div className={'cart-row-container'}>
                                                    <Grid container>
                                                        <Grid item md={2}>
                                                            <div className={'cart-row-image-container'}>
                                                                <img className={'cart-row-image'} src={d.imgURL} alt='cart-image'/>
                                                                <img onClick={() => {
                                                                    if (cartItems.length === 1)
                                                                        setCurrentMerchant(MERCHANT_CODE.NONE)
                                                                    removeCartItem(d.id, cartItems, dispatch)
                                                                }} className={'cart-row-cross-desktop'}
                                                                     src={desktopCross}/>
                                                            </div>
                                                        </Grid>
                                                        <Grid item md={4}>
                                                            <div className={'cart-single-title'}>
                                                                <div>
                                                                    {d.title} {
                                                                    d.has_lens ? (
                                                                        <span><br/>{Object.keys(lensOptions)[d.power_type]}
                                                                            <br/>{Object.keys(lensOptions[Object.keys(lensOptions)[d.power_type]])[d.power_option].split('(')[0]}
                                                                            <br/>{Object.keys(lensOptions[Object.keys(lensOptions)[d.power_type]][Object.keys(lensOptions[Object.keys(lensOptions)[d.power_type]])[d.power_option]])[d.price_type].split('+')[0]}
                                                                            </span>
                                                                    ) : (
                                                                        <div/>
                                                                    )
                                                                }
                                                                </div>
                                                            </div>
                                                        </Grid>
                                                        <Grid item md={2}>
                                                            <div className={'cart-row-price'}>
                                                                ৳ {d.price}
                                                            </div>
                                                        </Grid>
                                                        <Grid item md={2}>
                                                            <div className={'cart-row-quantity-container'}>
                                                                <div className={'cart-quantity-box'}>
                                                                    <div onClick={() => {
                                                                        decrementQuantity(d.id, cartItems, dispatch)
                                                                    }} className={'cart-quantity-sign'}>
                                                                        -
                                                                    </div>
                                                                    <div className={'cart-quantity-number'}>
                                                                        {d.quantity}
                                                                    </div>
                                                                    <div onClick={() => {
                                                                        incrementQuantity(d, cartItems, dispatch)
                                                                    }} className={'cart-quantity-sign'}>
                                                                        +
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Grid>
                                                        <Grid item md={2}>
                                                            <div className={'cart-row-total'}>
                                                                ৳ {d.price * d.quantity}
                                                            </div>
                                                        </Grid>

                                                    </Grid>
                                                    <Divider height={3} style={{marginTop: '10px'}}/>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            ) : (
                                step === 1 ? (
                                    <div>
                                        <div className={'cart-left-title'}>
                                            Billing and Shipping
                                        </div>
                                        <div className={'cart-left-label'}>
                                            Name
                                        </div>
                                        {/*<TextField*/}
                                        {/*    defaultValue={'name' in billingCookie?billingCookie.name:''}*/}
                                        {/*    inputRef={nameRef}*/}
                                        {/*    variant={'outlined'}*/}
                                        {/*    fullWidth*/}
                                        {/*/>*/}
                                        <input ref={nameRef} defaultValue={'name' in billingCookie?billingCookie.name:''} placeholder="Name" className="input-text" type="text" id="fname" name="fname"></input>

                                        <div className={'cart-left-label'}>
                                            Address
                                        </div>
                                        {/*<TextField*/}
                                        {/*    defaultValue={'address' in billingCookie?billingCookie.address:''}*/}
                                        {/*    inputRef={addressRef}*/}
                                        {/*    variant={'outlined'}*/}
                                        {/*    fullWidth*/}
                                        {/*/>*/}
                                        <input ref={addressRef} defaultValue={'address' in billingCookie?billingCookie.address:''} placeholder="Address" className="input-text" type="text" id="fname" name="fname"></input>


                                        <div className={'cart-left-label'}>
                                            District
                                        </div>
                                        <Autocomplete
                                            disablePortal
                                            options={districts}
                                            fullWidth
                                            defaultValue={'district' in billingCookie?billingCookie.district:''}
                                            onChange={(e, v) => {
                                                if (v === 'Dhaka')
                                                    setShipping(60)
                                                else if (v.length > 0) {
                                                    setShipping(60)
                                                } else
                                                    setShipping(60)
                                                setDistrict(v)
                                            }}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                        <div className={'cart-left-label'}>
                                            Phone
                                        </div>
                                        {/*<TextField*/}
                                        {/*    defaultValue={'phone' in billingCookie?billingCookie.phone:''}*/}
                                        {/*    inputRef={phoneRef}*/}
                                        {/*    variant={'outlined'}*/}
                                        {/*    fullWidth*/}
                                        {/*    InputProps={{*/}
                                        {/*        startAdornment: <InputAdornment position="start">+88</InputAdornment>,*/}
                                        {/*    }}*/}
                                        {/*/>*/}
                                        <input ref={phoneRef} defaultValue={'phone' in billingCookie?billingCookie.phone:''} placeholder="Phone (01XXXXXXXXX)" className="input-text" type="text" id="fname" name="fname"></input>

                                        <div className={'cart-left-label'}>
                                            Email Address (Optional)
                                        </div>
                                        {/*<TextField*/}
                                        {/*    defaultValue={'email' in billingCookie?billingCookie.email:''}*/}
                                        {/*    inputRef={emailRef}*/}
                                        {/*    variant={'outlined'}*/}
                                        {/*    fullWidth*/}
                                        {/*/>*/}
                                        <input ref={emailRef} defaultValue={'email' in billingCookie?billingCookie.email:''} placeholder="Email (Optional))" className="input-text" type="text" id="fname" name="fname"></input>

                                    </div>
                                ) : (
                                    <div>
                                        <div className={'cart-left-title'}>
                                            Order Placed Successfully
                                        </div>
                                        <div className={'cart-left-label'}>
                                            Name:
                                        </div>
                                        <div className={'cart-left-value'}>
                                            {shipData.name}
                                        </div>
                                        <div className={'cart-left-label'}>
                                            Address:
                                        </div>
                                        <div className={'cart-left-value'}>
                                            {shipData.billing_address}
                                        </div>
                                        <div className={'cart-left-label'}>
                                            District:
                                        </div>
                                        <div className={'cart-left-value'}>
                                            {shipData.district}
                                        </div>
                                        <div className={'cart-left-label'}>
                                            Phone:
                                        </div>
                                        <div className={'cart-left-value'}>
                                            {shipData.phone}
                                        </div>
                                        <div className={'cart-left-label'}>
                                            Email Address (Optional):
                                        </div>
                                        <div className={'cart-left-value'}>
                                            {shipData.email}
                                        </div>
                                    </div>
                                )
                            )
                        }
                    </div>
                    <div className={'cart-divider'}></div>
                    <div className={'cart-right'}>
                        {
                            step === 0 ? (
                                <div>
                                    <div className={'cart-right-title'}>
                                        Cart Totals
                                    </div>
                                    <div className={'cart-checkout-container'}>
                                        <div className={'cart-checkout-header-container'}>
                                            <div className={'cart-checkout-header'}>
                                                Products
                                            </div>
                                            <div className={'cart-checkout-header'}>
                                                Subtotal
                                            </div>
                                        </div>
                                    </div>
                                    <Divider style={{marginLeft: '20px'}}/>
                                    {
                                        cartItems.map(c => {
                                            return (
                                                <div className={'cart-checkout-item-container'}>
                                                    <Grid container>
                                                        <Grid item xs={4.5}>
                                                            <div className={'cart-checkout-item-title'}>
                                                                {c.title}
                                                            </div>
                                                        </Grid>
                                                        <Grid item xs={3}>
                                                            <div className={'cart-checkout-item-quantity'}>
                                                                x{c.quantity}
                                                            </div>
                                                        </Grid>
                                                        <Grid item xs={4.5}>
                                                            <div className={'cart-checkout-item-total'}>
                                                                <div>

                                                                </div>
                                                                <div>
                                                                    ৳ {c.price * c.quantity}
                                                                </div>
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                    <Divider style={{marginTop: '10px'}}/>
                                                </div>
                                            )
                                        })
                                    }
                                    <div className={'cart-right-subtotal-container'}>
                                        <div className={'cart-right-subtotal-label'}>
                                            Subtotal
                                        </div>
                                        <div className={'cart-right-subtotal-amount'}>
                                            ৳ {subtotal}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            //setStep(1);
                                            infoPrompt(true)
                                            pushEvent(eventTable.cartProceedClick);
                                        }}
                                        className={'filledBtn cartCheckoutBtn'}>
                                        Proceed To Checkout
                                    </button>

                                </div>
                            ) : (
                                step === 1 ? (
                                    <div>
                                        <div className={'cart-right-title-ship'}>
                                            Your Order
                                        </div>
                                        <div className={'cart-checkout-container'}>
                                            <div className={'cart-checkout-header-container'}>
                                                <div className={'cart-checkout-header'}>
                                                    Products
                                                </div>
                                                <div className={'cart-checkout-header'}>
                                                    Subtotal
                                                </div>
                                            </div>
                                        </div>
                                        <Divider style={{marginLeft: '20px'}}/>
                                        {
                                            cartItems.map(c => {
                                                return (
                                                    <div className={'cart-checkout-item-container'}>
                                                        <Grid container>
                                                            <Grid item xs={4.5}>
                                                                <div className={'cart-checkout-item-title'}>
                                                                    {c.title}
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={3}>
                                                                <div className={'cart-checkout-item-quantity'}>
                                                                    x{c.quantity}
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={4.5}>
                                                                <div className={'cart-checkout-item-total'}>
                                                                    <div>

                                                                    </div>
                                                                    <div>
                                                                        ৳ {c.price * c.quantity}
                                                                    </div>
                                                                </div>
                                                            </Grid>
                                                        </Grid>
                                                        <Divider style={{marginTop: '10px'}}/>
                                                    </div>
                                                )
                                            })
                                        }
                                        <div className={'cart-checkout-container'}>
                                            <div className={'cart-checkout-header-container'}>
                                                <div className={'cart-checkout-header'}>
                                                    Subtotal
                                                </div>
                                                <div className={'cart-checkout-header'}>
                                                    ৳ {subtotal}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={'cart-checkout-container'}>
                                            <div className={'cart-checkout-header-container'}>
                                                <div className={'cart-checkout-header'}>
                                                    Shipping
                                                </div>
                                                <div className={'cart-checkout-header'}>
                                                    ৳ {shipping}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={'cart-checkout-container'}>
                                            <div className={'cart-checkout-header-container'}>
                                                <div className={'cart-checkout-header'}>
                                                    Total
                                                </div>
                                                <div className={'cart-checkout-header-total'}>
                                                    ৳ {shipping + subtotal}
                                                </div>
                                            </div>
                                        </div>
                                        <FormControl style={{marginTop: '14px', marginLeft: '20px'}}>
                                            <FormLabel id="demo-radio-buttons-group-label">Payment Method</FormLabel>
                                            <RadioGroup
                                                onChange={handlePaymentMethodChange}
                                                aria-labelledby="demo-radio-buttons-group-label"
                                                defaultValue={0}
                                                name="radio-buttons-group"
                                            >
                                                <FormControlLabel value={0} control={<Radio/>}
                                                                  label="Cash On Delivery"/>
                                                {
                                                    parseInt(paymentMethod) === 1 ? (
                                                        <div className={'cart-payment-container'}>
                                                            <img src={SSLCommerzImage} alt='SSLCommerz-Image'/>
                                                        </div>
                                                    ) : (
                                                        <div/>
                                                    )
                                                }
                                                <FormControlLabel value={1} control={<Radio/>} label="Online Payment"/>
                                            </RadioGroup>
                                        </FormControl>

                                        <FormGroup className={'terms-checkbox'}>
                                            <FormControlLabel sx={{fontSize: '.15em'}}
                                                              className={'terms-checkbox-label'} control={<Checkbox/>}
                                                              onChange={handleChange}
                                                              label={
                                                                <div>
                                                                    I agree to have read the <a target="_blank" href="https://mylens.com.bd/terms-and-conditions">terms and conditions</a>, <a  target="_blank" href="https://mylens.com.bd/return-and-refund">return, refund</a> and <a target="_blank" href="https://mylens.com.bd/privacy-policy">privacy policy</a> of this website"
                                                                </div>
                                                              }/>

                                        </FormGroup>

                                        <center>
                                            {checked ?
                                                <button onClick={placeOrder}
                                                        className={'filledBtn cartCheckoutBtn'}>
                                                    {
                                                        loading ? <CircularProgress/> : 'Place Order'
                                                    }
                                                </button> : <button

                                                    className={'disabledBtn cartCheckoutBtn'}>
                                                    Place Order
                                                </button>
                                            }
                                        </center>
                                    </div>
                                ) : (
                                    <div>
                                        <div className={'cart-right-title-ship'}>
                                            Your Order
                                        </div>
                                        <div className={'cart-checkout-container'}>
                                            <div className={'cart-checkout-header-container'}>
                                                <div className={'cart-checkout-header'}>
                                                    Products
                                                </div>
                                                <div className={'cart-checkout-header'}>
                                                    Subtotal
                                                </div>
                                            </div>
                                        </div>
                                        <Divider style={{marginLeft: '20px'}}/>
                                        {
                                            shipData.items.map(c => {
                                                return (
                                                    <div className={'cart-checkout-item-container'}>
                                                        <Grid container>
                                                            <Grid item xs={4.5}>
                                                                <div className={'cart-checkout-item-title'}>
                                                                    {c.title}
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={3}>
                                                                <div className={'cart-checkout-item-quantity'}>
                                                                    x{c.quantity}
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={4.5}>
                                                                <div className={'cart-checkout-item-total'}>
                                                                    <div>

                                                                    </div>
                                                                    <div>
                                                                        ৳ {c.price * c.quantity}
                                                                    </div>
                                                                </div>
                                                            </Grid>
                                                        </Grid>
                                                        <Divider style={{marginTop: '10px'}}/>
                                                    </div>
                                                )
                                            })
                                        }
                                        <div className={'cart-checkout-container'}>
                                            <div className={'cart-checkout-header-container'}>
                                                <div className={'cart-checkout-header'}>
                                                    Subtotal
                                                </div>
                                                <div className={'cart-checkout-header'}>
                                                    ৳ {shipData.subtotal}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={'cart-checkout-container'}>
                                            <div className={'cart-checkout-header-container'}>
                                                <div className={'cart-checkout-header'}>
                                                    Shipping
                                                </div>
                                                <div className={'cart-checkout-header'}>
                                                    ৳ {shipData.shipping}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={'cart-checkout-container'}>
                                            <div className={'cart-checkout-header-container'}>
                                                <div className={'cart-checkout-header'}>
                                                    Total
                                                </div>
                                                <div className={'cart-checkout-header-total'}>
                                                    ৳ {shipData.shipping + shipData.subtotal}
                                                </div>
                                            </div>
                                        </div>
                                        <center>
                                            <button
                                                onClick={() => {
                                                    navigate('/shop/both/all')
                                                }}
                                                className={'filledBtn cartCheckoutBtn'}>
                                                Continue Shopping
                                            </button>
                                        </center>
                                    </div>
                                )
                            )
                        }

                    </div>
                </div>

                <br/><br/>
                

            </div>
        )
}

export default Cart
