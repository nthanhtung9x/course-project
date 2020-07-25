import React, { useEffect, useState } from 'react';
import { List, Avatar, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';

const VideoCourse = ({ match }) => {

    const [listVideo, setListVideo] = useState({
        videoCourse: [],
        image: ""
    });

    const [playVideo, setPlayVideo] = useState({
        name:"",
        videoURL:"",
        serial:null
    });

    const getVideoCourse = () => {
        let id = match.params.id;
        axios({
            method:'GET',
            url:`https://courses-project-api.herokuapp.com/getVideoCourse/${id}`,
            headers: {
                'Authorization': JSON.parse(localStorage.getItem('token')).token,
                "Content-Type": "application/json",
            }
        }).then(res => {
            setListVideo({
                videoCourse: res.data.videoCourse,
                image: res.data.image
            });
            setPlayVideo({
                name: res.data.videoCourse[0].name,
                videoURL: res.data.videoCourse[0].videoURL,
                serial: res.data.videoCourse[0].serial
            })
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        getVideoCourse();
    },[]);

    const handleChangeVideo = async(id) => {
        let findVideo = await listVideo.videoCourse.findIndex(item => item._id === id);
        if(findVideo !== -1) {
            setPlayVideo({
                name: listVideo.videoCourse[findVideo].name,
                videoURL: listVideo.videoCourse[findVideo].videoURL,
                serial: listVideo.videoCourse[findVideo].serial
            })
        }
    };
 

    return (
        <div className="profile__courses video__courses">
            <h1>Bài {playVideo.serial}: {playVideo.name}</h1>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={16}>
                    <div className="wall-col">
                        <iframe style={{width:'100%'}} height="500" src={playVideo.videoURL} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>
                </Col>
                <Col className="gutter-row" span={8} >
                    <div className="wall-col">
                        <List
                            itemLayout="horizontal"
                            dataSource={listVideo.videoCourse}
                            renderItem={item => (
                            <List.Item>
                                <button style={{display:'block', width:'100%'}} onClick={() => {
                                    handleChangeVideo(item._id)
                                }}>
                                    <List.Item.Meta
                                    avatar={<Avatar src={listVideo.image} />}
                                    title={`Bài ${item.serial}`}
                                    description={item.name}
                                    />
                                </button>
                            </List.Item>
                            )}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default VideoCourse;
