import React, {useEffect, useState} from "react";
import '../../assets/css/bread.css'
import {Step, StepLabel, Stepper} from "@mui/material";

const MobileBreadCrump=props=>{

    const [step,setStep]=useState(props.step)

    useEffect(()=>{
        setStep(props.step)
    },[props.step])

    return(
        <div className={'mobile-bread-container'}>
            <Stepper activeStep={step} orientation="vertical">
                <Step  onClick={()=>{
                    props.updateStep(0);
                    setStep(0)
                }}  key={0}>
                    <StepLabel
                    >
                        Shopping Cart
                    </StepLabel>
                </Step>
                <Step key={2}>
                    <StepLabel
                    >
                        Order Complete
                    </StepLabel>
                </Step>
            </Stepper>
        </div>
    )

}

export default MobileBreadCrump
