import React from 'react';
import Slider from "react-slick";

import Slide1 from '../../images/slide1.png';
import Slide2 from '../../images/slide2.png';
import Slide3 from '../../images/slide3.png';
import "../../../node_modules/slick-carousel/slick/slick-theme.css";
import "../../../node_modules/slick-carousel/slick/slick.css";


export const CarouselComponent = () => {
    const settings = {
        dots: false,
        fade: true,
        infinite: true,
        speed: 2000,
        autoplay:true,
        autoplaySpeed: 2000,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    
    return (
        <div>
            <div className="carousel__banner">
                <div className="carousel__text">
                    <h1>Tìm kiếm khóa học</h1>
                    <p>Sale ends today! Count on courses as low as $10.99.</p>
                    <div className="carousel__form">
                        <input type="text" placeholder="Nhập thông tin bạn cần tìm?" />
                        <i className="fa fa-search" />
                    </div>
                </div>
                <Slider {...settings} className="carousel__img">
                    <div>
                        <img src={Slide1} alt=""/>
                    </div>
                    <div>
                        <img src={Slide2} alt=""/>
                    </div>
                    <div>
                        <img src={Slide3} alt=""/>
                    </div>
                </Slider>
            </div>

        </div>
    )
}
