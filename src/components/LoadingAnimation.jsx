import {Typography} from "@mui/material";
import React from "react";
// import logo from '../icons'
import './LoadingAnimation.css'

const LoadingAnimation = () => {

    return (
        <div className={'loading-animation'}>
            <img src={'/loadingAnimationLooped.gif'} alt={'Loading...'}/>
        </div>
        // <Typography variant="body2" color="text.secondary" style={{ marginTop: '20px' }}>
        //     Loading...
        //     Insert cool loading animation here
        // </Typography>
    );
}

export default LoadingAnimation;
