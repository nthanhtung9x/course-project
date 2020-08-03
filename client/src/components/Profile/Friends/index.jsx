import React, { useState, useEffect } from 'react';

import reqwest from 'reqwest';
import axios from 'axios';
import { API } from '../../../API/api';
import { connect} from 'react-redux';

import { Row, Col, Input, List, Avatar, Skeleton, Modal, Button, message } from 'antd';
import { useHistory, Link } from 'react-router-dom';
const { Search } = Input;



const ProfileFriendsList = ({ profile, userLogin }) => {
    // const count = 3;
    const url = `${API}/getFriend/${profile.id}`;

    const [objData, setObjData] = useState({
        initLoading: true,
        loading: false,
        data: [],
        list: [],
    })

    const getData = callback => {
        reqwest({
          url: url,
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
    
    const history = useHistory();
    const handleBack = (id) => {
        history.push('/profile/wall/' + id);
        window.location.reload(true);
    };

    // const onLoadMore = () => {
    //     setObjData({
    //         ...objData,
    //         loading: true,
    //         list: objData.data.concat([...new Array(count)].map(() => ({ loading: true, name: {} }))),
    //     });
    //     getData(res => {
    //       const data = objData.data.concat(res.results);
    //       setObjData(
    //         {
    //             ...objData,
    //             data,
    //             list: data,
    //             loading: false,
    //         },
    //         () => {
    //             window.dispatchEvent(new Event('resize'));
    //         },
    //       );
    //     });
    // };

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
        {/* <Button onClick={onLoadMore}>Hiển thị thêm</Button> */}
        </div>
    ) : null

    // unfriend
    const handleUnfriend = (token, id) => {
        return axios({
            method:'PUT',
            url:`${API}/unfriend/${id}`,
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            }
        }).then(res => {
            setObjData({
                ...objData,
                data: res.data.results,
                list: res.data.results
            })
        }).catch(err => console.log(err));
    }

    // search
    const [searchText, setSearchText] = useState("");

    // send message
    const [visible, setVisible] = useState(false);
    const showModal = (idSend,idReceive) => {
        setTemp({
            ...temp,
            idSend,
            idReceive
        })
        setVisible(true);
    }
    const handleCancel = () => {
        setTemp({
            idSend: "",
            idReceive: "",
            content: ""
        });
        setVisible(false);
    }

    const [temp, setTemp] = useState({
        idSend: "",
        idReceive: "",
        content: ""
    })
    // const contentMessage = (idSend, idReceive) => {
    //     return <div>
            
    //         <Button size="large" className="ant-btn ant-btn-primary" onClick={async() => {
    //             handleSendMessage(JSON.parse(localStorage.getItem('token')).token, idSend, idReceive, contentMess)
    //             await hide();
    //             await setContentMess("");
    //         }}>Gửi</Button>
    //     </div>
    // };
    
    const handleSendMessage = (token, idSend, idReceive, content) => {
        return axios({
            method:'POST',
            url:`${API}/sendMessage`,
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
            data: {
                idSend,
                idReceive,
                content
            }
        }).then(res => {
            if(res.data.message) {
                message.success('Gửi tin nhắn thành công');
            } else {
                message.error('Vui lòng gửi tin nhắn có nội dung');
            }
            setVisible(false);
        }).catch(err => console.log(err));
    }

    return (
        <div className="profile__friends">
             <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" xs={{span:24}} md={{span:6}}>
                    <div className="wall-col">
                        <p className="label-title">Tìm kiếm Bạn Bè:</p>
                        <Search placeholder="Nhập tên bạn bè" onSearch={value => setSearchText(value)} enterButton />
                    </div>
                </Col>
                <Col className="gutter-row" xs={{span:24}} md={{span:18}}>
                    <div className="wall-col">
                        <List
                            className="demo-loadmore-list"
                            loading={initLoading}
                            itemLayout="horizontal"
                            loadMore={loadMore}
                            dataSource={list}
                            renderItem={item => {
                                if(item.name.toLowerCase().trim().indexOf(searchText.toLowerCase().trim()) !== -1) {
                                    return <List.Item
                                        actions={ userLogin.id === profile.id ?
                                                [   
                                                    <Button 
                                                        size="middle" 
                                                        key="list-loadmore-edit"
                                                        className="list-loadmore-edit"
                                                        style={{padding:'0px 16px'}}
                                                        onClick={() => {
                                                            showModal(userLogin.id, item.id)
                                                        }}
                                                    >Nhắn tin</Button>, 
                                                    <a 
                                                        className="list-loadmore-more" 
                                                        key="list-loadmore-more" 
                                                        onClick={() => {
                                                            handleUnfriend(JSON.parse(localStorage.getItem('token')).token, item.id)
                                                        }}
                                                    >Hủy kết bạn</a>]
                                            :
                                                <></>
                                        }
                                    >
                                        <Skeleton avatar title={false} loading={item.loading} active>
                                        <List.Item.Meta
                                            avatar={
                                            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                            }
                                            title={<Link to={`/profile/wall/${item.id}`} style={{backgroundColor:'transparent',border:'none',color:'#1890FF'}}  onClick={() => {
                                                handleBack(item.id)
                                            }}>{item.name}</Link>}
                                            description="Bạn bè"
                                        />
                                        </Skeleton>
                                    </List.Item>       
                                }

                            }}
                        />
                    </div>
                </Col>
            </Row>

            <Modal
                title="Lời nhắn"
                visible={visible}
                okText="Gửi tin nhắn"
                cancelText="Hủy"
                onOk={() => handleSendMessage(JSON.parse(localStorage.getItem('token')).token, temp.idSend, temp.idReceive, temp.content)}
                onCancel={handleCancel}
            >
                <Input 
                    placeholder="Nhập lời nhắn" 
                    name="content"
                    value={temp.content}
                    onChange={(e)=> {
                        setTemp({
                            ...temp,
                            content: e.target.value
                        })
                    }}
                ></Input>
            </Modal>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        profile: state.profile,
        userLogin: state.userLogin
    }
}

export default connect(mapStateToProps)(ProfileFriendsList);
