import React from 'react';

import { Row, Col, Input, DatePicker } from 'antd';
const { RangePicker } = DatePicker;
const { Search } = Input;

const WallComponent = () => {
    return (
        <div className="wall">
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={6}>
                    <div className="wall-col">
                        <p className="label-title">Tìm kiếm bài viết:</p>
                        <Search placeholder="Tìm kiếm theo hashtag" onSearch={value => console.log(value)} enterButton />
                        <Search placeholder="Tìm kiếm theo từ" onSearch={value => console.log(value)} enterButton />
                        <p className="label-title">Tìm kiếm bài viết theo thời gian:</p>
                        <RangePicker showTime />
                    </div>
                </Col>
                <Col className="gutter-row" span={18}>
                    <div className="wall-col">
                        <div className="wall-col-content-disabled">
                            Chưa có bài viết nào
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default WallComponent;