import React from "react";
import '../../assets/css/partners.css'


import jewelIcon from '../../assets/images/production/partner-jewel.svg'
import partner3Icon from '../../assets/images/production/partner-3.svg'


const Partners=props=>{
    return(
        <div className={'partners-container'}>
            <div className={'partners-pre-title'}>
                Who are we working with
            </div>
            <div className={'partners-title'}>
                Our Partners
            </div>
            <div className={'logos-wrapper'}>
                <div className={'logos-container'}>
                    <div className={'logo-single-container'}>
                        <img src={jewelIcon} className={'partner-icon'} alt='jewel-optics-logo'/>
                    </div>
                    <div className={'logo-single-container'}>
                        <img src={partner3Icon} className={'partner-icon'} alt='fashion-optics-logo'/>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Partners
