import React, { useState, useEffect } from 'react';

import reqwest from 'reqwest';

import { Row, Col, Input, List, Avatar, Button, Skeleton } from 'antd';
const { Search } = Input;

const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat&noinfo`;

const ProfileFriendsList = () => {
    const [objData, setObjData] = useState({
        initLoading: true,
        loading: false,
        data: [],
        list: [],
    })

    const getData = callback => {
        reqwest({
          url: fakeDataUrl,
          type: 'json',
          method: 'get',
          contentType: 'application/json',
          success: res => {
            callback(res);
          },
        });
      };

    useEffect(()=> {
        getData(res => {
            setObjData({
              initLoading: false,
              data: res.results,
              list: res.results,
            });
          });
    },[]);

    const onLoadMore = () => {
        setObjData({
            ...objData,
            loading: true,
            list: objData.data.concat([...new Array(count)].map(() => ({ loading: true, name: {} }))),
        });
        getData(res => {
          const data = objData.data.concat(res.results);
          setObjData(
            {
                ...objData,
                data,
                list: data,
                loading: false,
            },
            () => {
                window.dispatchEvent(new Event('resize'));
            },
          );
        });
      };

    const { initLoading, loading, list } = objData;
    const loadMore =
    !initLoading && !loading ? (
        <div
        style={{
            textAlign: 'center',
            marginTop: 12,
            height: 32,
            lineHeight: '32px',
        }}
        >
        <Button onClick={onLoadMore}>Hiển thị thêm</Button>
        </div>
    ) : null

    return (
        <div className="profile__friends">
             <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={6}>
                    <div className="wall-col">
                        <p className="label-title">Tìm kiếm Bạn Bè:</p>
                        <Search placeholder="Nhập tên bạn bè" onSearch={value => console.log(value)} enterButton />
                    </div>
                </Col>
                <Col className="gutter-row" span={18}>
                    <div className="wall-col">
                        <List
                            className="demo-loadmore-list"
                            loading={initLoading}
                            itemLayout="horizontal"
                            loadMore={loadMore}
                            dataSource={list}
                            renderItem={item => (
                            <List.Item
                                actions={[<a className="list-loadmore-edit" key="list-loadmore-edit">Nhắn tin</a>, <a className="list-loadmore-more" key="list-loadmore-more">Hủy kết bạn</a>]}
                            >
                                <Skeleton avatar title={false} loading={item.loading} active>
                                <List.Item.Meta
                                    avatar={
                                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                    }
                                    title={<a href="https://ant.design">{item.name.last}</a>}
                                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                />
                                </Skeleton>
                            </List.Item>
                            )}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default ProfileFriendsList;
