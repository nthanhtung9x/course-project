import React, { useEffect, useState } from 'react';


import { Link } from 'react-router-dom';
import { Card, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const { Meta } = Card;

const CourseItem = ({ item }) => {
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (item.image) {
            setLoading(false);
        }
    }, [item.image]);

    return (
        <div className="item">
            {
                isLoading && <div className="overlay__wrapper">
                    <Spin
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%,-50%)'
                        }}
                        tip="Loading..."
                        size="large"
                        indicator={antIcon}
                    >
                    </Spin>
                </div>
            } 
            {
                !isLoading && <Card
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
       
            }
                
        </div>
    )
}

export default CourseItem;