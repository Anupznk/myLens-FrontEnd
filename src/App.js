import { Routes, Route } from "react-router-dom";
import ProductsList from "./components/products/ProductsList";
import Home from "./components/home/Home";
import Cart from "./components/cart/Cart";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import ContactUs from "./components/footer/ContactUs";
import AboutUs from "./components/footer/AboutUs";
import PrivacyPolicy from "./components/footer/PrivacyPolicy";
import TermsConditions from "./components/footer/TermsConditions";
import ReturnRefund from "./components/footer/ReturnRefund";
import TakeHomeCart from "./components/cart/TakeHomeCart";
import ProductProfile from "./components/productProfile/ProductProfile";
import React, { useEffect, useRef, useState } from "react";

import Cookies from "universal-cookie";
import uuid from "react-uuid";
import { clearCart, fetchPendingCart } from "./actions/cart";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useDispatch } from "react-redux";
import PendingCartCheck from "./components/home/PendingCartCheck";
import { pushEvent } from "./actions/analytics";
import { eventTable } from "./index";
import { Helmet } from "react-helmet";
import Footer from "./components/home/Footer";

var showToast;

var navBgDefault = "#c3d3e3",
  setnavBgDefault;
var btnDefault, setBtnDefault;

var infoPrompt;

const MERCHANT_CODE = {
  NONE: -1,
  JEWEL: 41,
  FASHION: 28,
};
var currentMerchant, setCurrentMerchant;
const cookies = new Cookies();

function App() {
  const [formDialog, setFormDialog] = useState(false);

  const [isCart, setIsCart] = useState(false);

  infoPrompt = (cart) => {
    setIsCart(cart);
    setFormDialog(true);
  };

  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    //console.log('agreed status', event.target.checked)
  };

  const [footerHeight, updateHeight] = (useState(0)[
    (navBgDefault, setnavBgDefault)
  ] = useState("#c3d3e3"));
  [btnDefault, setBtnDefault] = useState("#1f3042");

  var cartCache = [];
  var currMerchantCode = MERCHANT_CODE.NONE;

  const footerRef = useRef();

  if (!(cookies.get("cart") == undefined || cookies.get("cart") == null))
    cartCache = cookies.get("cart");
  if (cartCache.length > 0) {
    currMerchantCode = cartCache[0].merchant_id;
    //console.log('merchant code', currMerchantCode)
  }

  [currentMerchant, setCurrentMerchant] = useState(currMerchantCode);

  showToast = (message) => {
    toast.dark(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  useEffect(() => {
    pushEvent(eventTable.visit);
  }, []);
  const imageUrl = `${window.location.href}logo_new.svg`;
  const description = `Here at MyLens, we are promised to deliver the most high-end customer satisfaction service by selling them “high-quality + low cost” eyeglassses, sunglasses and lens....
For most formal to the most sporty events, for the most stylish to the most nerdy one, we’ve got something for you! We’re importing the most trendy latest collection from the most reliable sources, photograph them by our own hand and make it ready for you!`;

  //console.log(imageUrl);

  return (
    <div>
      <Helmet>
        <title>Home - MyLens</title>

        <meta name="title" content="MyLens" />
        <meta name="description" content={description} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content="MyLens" />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:description" content={description} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.href} />
        <meta property="twitter:title" content="MyLens" />
        <meta property="twitter:image" content={imageUrl} />
        <meta property="twitter:description" content={description} />
      </Helmet>

      <Dialog open={formDialog}>
        <DialogTitle>Your Info</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} padding={1}>
            <Grid item xs={12}>
              <TextField fullWidth variant={"outlined"} label={"Your Name"} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">+88</InputAdornment>
                  ),
                }}
                type={"number"}
                variant={"outlined"}
                label={"Your Phone"}
              />
            </Grid>
            {isCart ? (
              <Grid item xs={12}>
                <FormGroup className={"terms-checkbox"}>
                  <FormControlLabel
                    className={"terms-checkbox-label"}
                    control={<Checkbox defaultChecked />}
                    onChange={handleChange}
                    label={
                      <div>
                        I agree to have read the{" "}
                        <a
                          target="_blank"
                          href="https://mylens.com.bd/terms-and-conditions"
                        >
                          terms and conditions
                        </a>
                        ,{" "}
                        <a
                          target="_blank"
                          href="https://mylens.com.bd/return-and-refund"
                        >
                          return, refund
                        </a>{" "}
                        and{" "}
                        <a
                          target="_blank"
                          href="https://mylens.com.bd/privacy-policy"
                        >
                          privacy policy
                        </a>{" "}
                        of this website"
                      </div>
                    }
                  />
                </FormGroup>
              </Grid>
            ) : (
              <div />
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setFormDialog(false);
            }}
            color={"error"}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setFormDialog(false);
            }}
            color={"primary"}
            disabled={isCart && !checked}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <PendingCartCheck />
      <div style={{ minHeight: `70vh` }}>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/shop/:gender/:type" exact element={<ProductsList />} />
          <Route path="/cart" exact element={<Cart key={1} />} />
          <Route path="/cart/fail" exact element={<Cart key={1} failed />} />
          <Route
            path="/cart/success"
            exact
            element={<Cart key={1} success />}
          />
          <Route path="/cart" exact element={<Cart key={1} />} />
          <Route path="/contact-us" exact element={<ContactUs />} />
          <Route path="/about-us" exact element={<AboutUs />} />
          <Route path="/privacy-policy" exact element={<PrivacyPolicy />} />
          <Route
            path="/terms-and-conditions"
            exact
            element={<TermsConditions />}
          />
          <Route path="/return-and-refund" exact element={<ReturnRefund />} />
          <Route path="/take-home" exact element={<TakeHomeCart key={2} />} />
          <Route path="/product/:id" exact element={<ProductProfile />} />
        </Routes>
      </div>
      <Footer updateHeight={updateHeight} />
    </div>
  );
}

export default App;
export {
  showToast,
  infoPrompt,
  navBgDefault,
  setnavBgDefault,
  btnDefault,
  setBtnDefault,
  currentMerchant,
  setCurrentMerchant,
  MERCHANT_CODE,
};

export function phonenumber(inputtxt) {
  var phoneno = /^\d{11}$/;
  if (inputtxt.match(phoneno)) {
    return true;
  } else {
    return false;
  }
}

export function changeFormate(date) {
  return (
    date.getDate() +
    "-" +
    date.toString().substr(4, 3).toUpperCase() +
    "-" +
    date.getFullYear()
  );
}
