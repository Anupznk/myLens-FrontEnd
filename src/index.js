import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createStore } from 'redux'
import allReducers from './reducers'
import { Provider } from 'react-redux'
import {BrowserRouter} from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

const store = createStore(allReducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

export const base_url='https://api.mylens.com.bd/api/v1.0'
//export const base_url='http://localhost:8080/api/v1.0'
export const analytics_base_url='https://mylens-analytics.herokuapp.com/api/v1.0'
export const analyticsToken='dea3274539727e88b30c32d234373ae9b81c87fb03ed47ffac6f'

export const eventTable={
    visit:'VISIT',
    loginDialog:'LOGIN_DIALOG_OPEN',
    loginSuccess:'LOGIN_SUCCESS',
    loginFailure:'LOGIN_FAILURE',
    logout:'LOGOUT',
    productPageOpen:'PRODUCT_PAGE_OPEN',
    trialHomeHeaderClick:'TRIAL_HOME_HEADER_CLICK',
    cartHeaderClick:'CART_HEADER_CLICK',
    eyeGlassBothFilter:'EYEGLASS_BOTH_FILTER',
    sunglassBothFilter:'SUNGLASS_BOTH_FILTER',
    eyeGlassMenFilter:'EYEGLASS_MEN_FILTER',
    eyeGlassWomenFilter:'EYEGLASS_WOMEN_FILTER',
    sunGlassMenFilter:'SUNGLASS_MEN_FILTER',
    sunGlassWomenFilter:'SUNGLASS_WOMEN_FILTER',
    allGlassFilter:'BOTH_FILTER',
    exploreClick:'EXPLORE_CLICK',
    forHimClick:'FOR_HIM_CLICK',
    forHerClick:'FOR_HER_CLICK',
    productCardTrialHomeClick:'PRODUCT_CARD_TRIAL_HOME_CLICK',
    productCardAddToCartClick:'PRODUCT_CARD_CART_ADD_CLICK',
    scheduleDialogBackClick:'SCHEDULE_DIALOG_BACK_CLICK',
    scheduleDialogAddClick:'SCHEDULE_DIALOG_ADD_CLICK',
    productPageTrialHomeClick:'PRODUCT_PAGE_TRIAL_HOME_CLICK',
    productPageAddToCartClick:'PRODUCT_PAGE_CART_ADD_CLICK',
    addedToCart:'CART_ADDED',
    failedToCart:'CART_FAILED',
    failedToCartPrescription:'CART_FAILED_PRESCRIPTION',
    failedToCartSingleMerchant:'CART_FAILED_MERCHANT',
    cartPageOpen:'CART_PAGE_OPEN',
    trialHomePageOpen:'TRIAL_HOME_PAGE_OPEN',
    cartProceedClick:'CART_PROCEED_CLICK',
    cartCheckoutClick:'CART_CHECKOUT_CLICK',
    cartCheckoutFailed:'CART_CHECKOUT_FAILED',
    trialHomeProceedClick:'TRIAL_HOME_PROCEED_CLICK',
    trialHomeCheckoutClick:'TRIAL_HOME_CHECKOUT_CLICK',
    trialHomeCheckoutFailed:'TRIAL_HOME_CHECKOUT_FAILED'
}

export const lensOptions={
    'Without Power':{
        'Standard':{
            'Uncoat Lens +120 Tk':120,
            'Multi Coated Lens +150 Tk':150,
            'Blue Cut (Anti Blue Ray Protection) +300 Tk':300
        },
        'Eye Con(With 3 months scratch warranty)':{
            'Gorilla Coating +500 Tk':500,
            'Blue Cut with AR Gorilla Coat +800 Tk':800
        }
    },
    'With Power':{
        'Standard':{
            'Uncoat Lens +200 Tk':200,
            'Multi Coated Lens +220 Tk':220,
            'Blue Cut (Anti Blue Ray Protection) +350 Tk':350
        },
        'Eye Con(With 3 months scratch warranty)':{
            'Gorilla Coating +550 Tk':550,
            'Blue Cut with AR Gorilla Coat +800 Tk':800
        }
    }
}

export const lensOptionsFashion={
    'Without Power':{
        'Stock Lens + 0 Tk': 0,
        'Mr. Blue (Anti Blue Ray Protection) + 2500 Tk': 2500,
    },
    'With Power':{
        'Ego-Free form + 900 Tk': 900,
        'Mr. Blue (Anti Blue Ray Protection) + 2500 Tk': 2500,
    }
}



ReactDOM.render(

  <Provider store={ store }>
      <BrowserRouter>
          <ScrollToTop/>
            <App />
      </BrowserRouter>
  </Provider>
,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
