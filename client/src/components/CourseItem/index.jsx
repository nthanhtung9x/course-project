import React from 'react';


import { Link } from 'react-router-dom';
import { Card } from 'antd';
const { Meta } = Card;

const CourseItem = ({ item }) => {
    return (
        <div className="item">
            <Card
                hoverable
                cover={<img alt={item.image} src={item.image} />}
            >
                <Meta title={item.name} description={item.description} />
                {/* <p className="price">
                    {item.price.toLocaleString()} VNĐ
                    <span> 150.000 VNĐ</span>
                </p> */}
                <p className="rating">
                    Đánh giá:  
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star-half-alt"></i>
                </p>
                <Link to={`/course/detail/${item._id}`} className="detail">
                    Chi tiết
                </Link>
            </Card>
        </div>
    )
}

export default CourseItem;