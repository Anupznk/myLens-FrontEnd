import React, {useEffect, useState} from "react";
import '../../assets/css/bread.css'

const BreadCrump=props=>{

    const [step,setStep]=useState(props.step)

    useEffect(()=>{
        setStep(props.step)
    },[props.step])

    if(props.type===0){
        return(
            <div className={'bread-container'}>
                <div onClick={()=>{
                    props.updateStep(0);
                    setStep(0)
                }} className={`bread-item ${step===0?'step-current':'step-regular'}`}>
                    Shopping Cart
                </div>
                <div className={'bread-divider'}>
                    >
                </div>

                <div className={'bread-divider'}>
                    >
                </div>
                <div  className={`bread-item ${step===2?'step-current':'step-regular'}`}>
                    Order Complete
                </div>
            </div>
        )
    }else{
        return(
            <div className={'bread-container'}>
                <div onClick={()=>{
                    props.updateStep(0);
                    setStep(0)
                }} className={`bread-item ${step===0?'step-current':'step-regular'}`}>
                    Take Home Cart
                </div>
                <div className={'bread-divider'}>
                    >
                </div>
                <div  onClick={()=>{
                    props.updateStep(1)
                    setStep(1)
                }}  className={`bread-item ${step===1?'step-current':'step-regular'}`}>
                    Checkout Details
                </div>
            </div>
        )
    }
}

export default BreadCrump
