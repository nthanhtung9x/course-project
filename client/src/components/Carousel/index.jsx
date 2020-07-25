import React, { useState } from 'react';
import Slider from "react-slick";

import Slide1 from '../../images/slide1.png';
import Slide2 from '../../images/slide2.png';
import Slide3 from '../../images/slide3.png';
import "../../../node_modules/slick-carousel/slick/slick-theme.css";
import "../../../node_modules/slick-carousel/slick/slick.css";

import {connect} from 'react-redux';
import { Select } from 'antd';
import { useHistory } from 'react-router-dom';
const { Option } = Select;


const CarouselComponent = ({ courses }) => {
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
    
    const [searchText, setSearchText] = useState("");
      
    const onSearch = (val) => {
        setSearchText(val);
    };

    const renderSearch = (searchText) => {
        return courses.map((item, index) => {
            if(item.name.toLowerCase().trim().indexOf(searchText.toLowerCase().trim()) !== -1) {
                return <Option value={item._id} key={index}>{item.name}</Option>
            }
        });
    };

    const history = useHistory();
    const handleChange = (value) => {
        return history.push(`/course/detail/${value}`);
    };

    

    return (
        <div>
            <div className="carousel__banner">
                <div className="carousel__text">
                    <h1>Tìm kiếm khóa học</h1>
                    <p>Sale ends today! Count on courses as low as $10.99.</p>
                    <div className="carousel__form">
                    <Select
                        showSearch
                        placeholder="Nhập tên khóa học cần tìm"
                        optionFilterProp="children"
                        onChange={handleChange}
                        onSearch={onSearch}
                        filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {renderSearch(searchText)}
                    </Select>
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
};

const mapStateToProps = state => {
    return {
        courses: state.courses
    }
}

export default connect(mapStateToProps)(CarouselComponent);
