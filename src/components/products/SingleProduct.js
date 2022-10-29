import React, {useEffect, useState} from 'react'
import StorefrontIcon from "@mui/icons-material/Storefront";

import {
    Button,
    Card,
    CardContent,
    CardMedia, Chip, CircularProgress,
    Dialog, DialogTitle,
    Grid, Paper, TextField,
    Typography
} from "@mui/material";
import "./../../assets/css/products.css";

import {useDispatch, useSelector} from "react-redux";
import {addCartItem} from "../../actions/cart";

import {addHomeCartItem} from "../../actions/homeCart";

import {useNavigate} from "react-router-dom";
import {changeFormate, currentMerchant, MERCHANT_CODE, setCurrentMerchant, showToast} from "../../App";
import {fetchAvailableDate} from "../../actions/product";
import {pushEvent} from "../../actions/analytics";
import {eventTable} from "../../index";
import { Helmet } from 'react-helmet';


const SingleProduct = (props) => {
    const cartItems = useSelector(state => state.cart)
    const homeCartItems = useSelector(state => state.homeCart)
    const dispatch = useDispatch()

    var navigate = useNavigate()

    function updateCartList(newProd) {
        ////console.log('prod', newProd)
        if (currentMerchant === MERCHANT_CODE.NONE) {
            setCurrentMerchant(newProd.merchant_id)
        }

        if (currentMerchant === MERCHANT_CODE.NONE || currentMerchant === newProd.merchant_id) {

            addCartItem(newProd, cartItems, dispatch)
            props.openSlider(true)
        } else {
            showToast('Cannot add items from more than one Merchant')
        }
    }

    function updateHomeCartList(newProd) {
        addHomeCartItem(newProd, homeCartItems, dispatch)
        props.openHomeSlider(true)
    }

    useEffect(()=>{
        ////console.log(props.product.id)
    },[])

    const [isDatePromptOpen, setDatePromptOpen] = useState(false)


    const handleClose = (value) => {
        setDatePromptOpen(false);

    };

    const [trialLoading,setTrialLoading]=useState(false)
    const [trialDate,setTrialDate]=useState(['','',''])

    async function showCalendarPopup() {
        setTrialLoading(true)
        setDatePromptOpen(true);
        var res=await fetchAvailableDate(props.product.id)
        if(res===null){
            setDatePromptOpen(false)
            showToast('Error occurred')
        }else {
            var date=new Date(res)
            var yesterDay=new Date()
            var prevDay=new Date()
            yesterDay.setDate(date.getDate() - 1)
            prevDay.setDate(date.getDate() - 2)
            setTrialDate([changeFormate(prevDay),changeFormate(yesterDay),changeFormate(date)])
        }
        setTrialLoading(false)
    }


    

    return (

        <Grid container spacing={1} padding={1}>
          

            <Dialog sx={{borderRadius: "4em"}} onClose={handleClose} open={isDatePromptOpen}>
                <div className="dialog-header">
                    <div className="dialog-title"> Earliest Trial Date</div>
                    <div>for this product</div>
                </div>

                <div className="date-prompt-container">
                    {
                        trialLoading?(
                            <center style={{marginBottom:'20px'}}>
                                <CircularProgress/>
                            </center>
                        ):(
                            <center>
                                <div className="date-text-disabled"><s>{trialDate[0]}</s></div>
                                <div className="date-text-disabled"><s>{trialDate[1]}</s></div>
                                <div className="date-text">{trialDate[2]}</div>
                            </center>
                        )
                    }
                    <center>

                        <Grid container padding={1} spacing={1}>
                            <Grid item xs={6}>
                                <button className="outlinedBtn"
                                        onClick={()=>{
                                            handleClose();
                                            pushEvent(eventTable.scheduleDialogBackClick,props.product.id);
                                        }}>
                                    Back
                                </button>
                            </Grid>

                            <Grid item xs={6}>
                                <button className="filledBtn"
                                        disabled={trialLoading}
                                        onClick={()=> {
                                            updateHomeCartList(props.product);
                                            pushEvent(eventTable.scheduleDialogAddClick,props.product.id);
                                            handleClose();
                                        }}>
                                    Add to Trial
                                </button>
                            </Grid>


                        </Grid>


                    </center>
                </div>


            </Dialog>

            <Grid item xs={12}>

                <div className="prodCard">
                    <Card onClick={() => {
                        navigate(`/product/${props.product.id}`)
                    }} className="swap-on-hover"
                          sx={{borderRadius: "1em", margin: ".75em", boxShadow: "0 0 20px 0 rgb(0 0 0 / 0%)"}}
                          elevation={4}>

                        <CardMedia className="swap-on-hover__front-image"
                                   id="cardImg"
                                   component="img"
                                   image={props.product.image1}
                                   alt="img"
                        />

                        <CardMedia className="swap-on-hover__back-image"
                                   component="img"
                                   image={props.product.image2}
                                   alt="img"
                        />

                    </Card>
                    <Chip className="merchant-tag" icon={<StorefrontIcon />} label={props.product.merchant_id === MERCHANT_CODE.FASHION ? (
                        <div >Fashion</div>
                    ) : (
                        <div >Jewel</div>
                    )} />

                    <Grid container>
                        <Grid item xs={12} md={7}>
                            <CardContent>
                                <div className="titleText">
                                    {props.product.title}
                                </div>

                                {/*<Chip className="chip-container" label={props.product.code} variant="outlined"/>*/}
                                <div className="text-price">
                                    ৳ {props.product.price}
                                </div>

                                <Grid container>

                                    <Grid item xs={8} md={8}>
                                        {props.product.quantity > 0 ? <div className="availabilityText">In Stock</div> :
                                            <div className="unAvailabilityText">Out of Stock</div>}

                                    </Grid>
                                </Grid>


                            </CardContent>
                        </Grid>

                        <Grid item xs={12} md={5}>
                            <Grid container spacing={1} padding={1}>
                                <Grid item xs={12} md={12}>
                                    {props.product.quantity > 0 ? <button className="filledBtn" onClick={() => {
                                            updateHomeCartList(props.product);
                                            pushEvent(eventTable.scheduleDialogAddClick,props.product.id);
                                            //showCalendarPopup();
                                            //pushEvent(eventTable.productCardTrialHomeClick,props.product.id);
                                        }} >
                                            Trial Home
                                        </button> :
                                        <Button style={{
                                            borderRadius: ".75em",
                                            padding: ".75em",
                                            fontSize: "0.8em",
                                            fontFamily: "Poppins",
                                            textTransform: "none",

                                        }} disabled fullWidth variant="contained"
                                                disableElevation>
                                            Trial Home
                                        </Button>
                                    }

                                </Grid>
                                <Grid item xs={12} md={12}>

                                    {props.product.quantity > 0 ? <button  className="outlinedBtn"
                                                                           onClick={() => {
                                                                               if (props.product.has_lens) {
                                                                                   navigate(`/product/${props.product.id}`);
                                                                                   pushEvent(eventTable.productCardAddToCartClick,props.product.id);
                                                                               } else {

                                                                                   pushEvent(eventTable.productCardAddToCartClick,props.product.id);
                                                                                   updateCartList(props.product)
                                                                               }

                                                                           }} >
                                            {
                                                props.product.has_lens ? 'Add to cart' : 'Add to cart'
                                            }
                                        </button> :
                                        <Button style={{
                                            borderRadius: ".75em",
                                            padding: ".75em",
                                            fontFamily: "Poppins",
                                            borderWidth: "2px",
                                            fontSize: "0.8em",
                                            textTransform: "none",


                                        }}
                                                onClick={() => {

                                                }}
                                                fullWidth disabled size="small" variant="outlined">
                                            {
                                                props.product.has_lens ? 'Add to cart' : 'Add to cart'
                                            }
                                        </Button>}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>

            </Grid>

        </Grid>

    )
}
export default SingleProduct
