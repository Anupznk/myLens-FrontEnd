import React from 'react'
import '../../assets/css/hero.css'
import {Grid} from "@mui/material";
import {useNavigate} from "react-router-dom";
import HeroSlider from "./HeroSlider";
import {pushEvent} from "../../actions/analytics";
import {eventTable} from "../../index";

const Hero=props=>{

    var navigate=useNavigate()

    return(
        <div className={'hero-container'}>
            <HeroSlider/>
            <div className={'hero-action-container'}>
                <Grid container>
                    <Grid item xs={0} md={1.5}>
                    </Grid>
                    <Grid item xs={12}>
                        <div className={'hero-text' } >
                            Trial <div className='circle-dot'></div> Shop <div className='circle-dot'></div> Repeat
                            {/*Take the Shop <div className='highlighted-text'> Home</div>*/}
                            {/*<img className={'bottom-stroke'} src={stroke}/>*/}
                        </div>
                        <div onClick={()=>{
                            navigate('/shop/both/all');
                            pushEvent(eventTable.exploreClick);
                        }} className={'hero-button'}>
                            <button>
                                EXPLORE SHOP
                            </button>
                        </div>
                    </Grid>
                </Grid>

            </div>
            {/*<div className={'hero-more-container'}>*/}
            {/*    <MoreHorizIcon className={'hero-more-icon'}/>*/}
            {/*</div>*/}
        </div>
    )
}

export default Hero
