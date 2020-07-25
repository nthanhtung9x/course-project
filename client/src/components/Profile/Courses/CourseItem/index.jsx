import React from 'react';

import { Link } from 'react-router-dom';
import { Card } from 'antd';
const { Meta } = Card;

const ProfileCourseItem = ({ item }) => {
    return (
        <div className="item">
            <Card
                hoverable
                cover={<img alt={item.name} src={item.image} />}
            >
                <Meta title={item.name} description={item.description} />
                <p className="timeStart">{item.timeStart}</p>
                <p className="rating">
                    Đánh giá:  
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star-half-alt"></i>
                </p>
                <Link to={`/profile/course/${item._id}`} className="accept">
                    Truy cập
                </Link>
            </Card>
        </div>
    )
}

export default ProfileCourseItem;