import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const slideImages = [
    'assets/images/slideshow/laptops_crop.jpg',
    'assets/images/slideshow/rtx3080.jpg',
    'assets/images/slideshow/studio.jpg'
];

const Slideshow = () => {
    return (
        <div>
            <Slide easing="ease">
                <div className="each-slide">
                    <div style={{'backgroundImage': `url(${slideImages[0]})`}}>
                    </div>
                </div>
                <div className="each-slide">
                    <div style={{'backgroundImage': `url(${slideImages[1]})`}}>
                    </div>
                </div>
                <div className="each-slide">
                    <div style={{'backgroundImage': `url(${slideImages[2]})`}}>
                    </div>
                </div>
            </Slide>
        </div>
    )
};

export default Slideshow;