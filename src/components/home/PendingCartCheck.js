import {useEffect, useState} from "react";
import {
    addCartItemQuantityPending,
    clearCart,
    fetchPendingCart,
    updateCartBilling,
    updateTrialCartBilling
} from "../../actions/cart";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setCartOpen} from "./Header";

var fetchPendingCall

const PendingCartCheck=props=>{


    const dispatch = useDispatch()

    const billingCookie = useSelector(state => state.billing)

    const [pendingCart,setPendingCart]=useState(null)
    const [pendingCartDialog,setPendingCartDialog]=useState(false)
    const [btnLoading,setBtnLoading]=useState(false)

    fetchPendingCall=async ()=>{
        var res=await fetchPendingCart()
        if(res){
            setPendingCart(res)
            //console.log(res)
            addCartItemQuantityPending(res.items,dispatch)
            updateTrialCartBilling(res.billing.billing_name,res.billing.billing_phone,res.billing.billing_address,'Dhaka',res.billing.location,res.billing.billing_email,billingCookie,dispatch)
            setPendingCartDialog(true)
        }
    }

    useEffect(()=>{
        fetchPendingCall()
        //console.log('hi')
    },[])

    const checkoutPendingClick=()=>{
        setPendingCartDialog(false)
        setCartOpen(true)
    }

    return(
        <div>
            <Dialog open={pendingCartDialog}>
                <DialogTitle>
                    Checkout pending cart
                </DialogTitle>
                <DialogContent>
                    Our rider has forwarded the trial home cart for you to checkout.
                </DialogContent>
                <DialogActions>
                    <Button
                        color={'error'}
                        onClick={()=>{setPendingCartDialog(false)}}
                        disabled={btnLoading}
                    >
                        Close
                    </Button>
                    <Button
                        color={'success'}
                        disabled={btnLoading}
                        onClick={checkoutPendingClick}
                    >
                        Checkout
                    </Button>

                </DialogActions>
            </Dialog>
        </div>
    )

}

export default PendingCartCheck

export {fetchPendingCall}
