import React, { useState, useEffect } from 'react';

import * as action from '../../../../redux/actions';

import { Card, InputNumber } from 'antd';
import { Button, Modal, Form, Input, List, message, Avatar, Spin, DatePicker, Popconfirm, Select } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
const { Meta } = Card;




const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';


const CourseItem = ({ item, handleUpdateCourse, handleDeleteCourse }) => {
    // modal register
    const [modalRegisterStyle, setModalRegisterStyle] = useState({
        visibleRegister: false,
    });
    
    const { visibleRegister } = modalRegisterStyle;
    
    const [listUser, setListUser] = useState({
        data: [],
        loading: false,
        hasMore: true,
    })

    // useEffect(() => {
    //     fetchData(res => {
    //         setListUser({
    //             ...listUser,
    //             data: res.results,
    //         });
    //     });
    // },[]);

    const getUserRegisterCourse = (token, id) => {
        return axios({
            url: 'https://courses-project-api.herokuapp.com/registerCoursesList',
            method: 'POST',
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
            data: {
                id
            }
        }).then(res => {
            setListUser({ data: [...res.data.users]});
        }).catch(err => console.log(err));
    };

    const handleRegister = (token, idCourse, idUser) => {
        return axios({
            url: 'https://courses-project-api.herokuapp.com/confirmRegister',
            method: 'POST',
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
            data: {
                idCourse,
                idUser
            }
        }).then(res => {
            getUserRegisterCourse(token,idCourse);
            message.success('Ghi danh thành công');
        }).catch(err => console.log(err));
    }    

    const handleRemoveRegister = (token, idCourse, idUser) => {
        return axios({
            url:'https://courses-project-api.herokuapp.com/removeRegister',
            method:'DELETE',
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
            data: {
                idCourse,
                idUser
            }
        }).then(res => {
            getUserRegisterCourse(token,idCourse);
            message.success('Hủy ghi danh thành công');
        }).catch(err => console.log(err));
    }

    // const handleInfiniteOnLoad = () => {
    //     let { data } = listUser;
    //     setListUser({
    //       loading: true,
    //     });
    //     if (data.length > 14) {
    //       message.warning('Danh sách đã đầy đủ!');
    //       setListUser({
    //         hasMore: false,
    //         loading: false,
    //       });
    //       return;
    //     }
    //     fetchData(res => {
    //       data = data.concat(res.results);
    //       setListUser({
    //         data,
    //         loading: false,
    //       });
    //     });
    // };
    
    const showModalRegister = (item) => {
        getUserRegisterCourse(JSON.parse(localStorage.getItem('token')).token,item._id);
        setModalRegisterStyle({
            ...modalRegisterStyle,
            visibleRegister: true,
        });
    };

    const handleCancel = () => {
        setModalRegisterStyle({
            ...modalRegisterStyle,
            visibleRegister: false,
        });

        setModalListUserStyle({
            ...modalListUserStyle,
            visibleListUser: false,
        });

        setModalStyle({
            ...modalStyle,
            visible: false,
        });

        setModalAddVideoStyle({
            ...modalAddVideoStyle,
            visibleModalAddVideo: false
        });

        setModalUpdateVideoStyle({
            ...modalUpdateVideoStyle,
            visibleModalUpdateVideo: false
        });

        setModalDeleteVideoStyle({
            ...modalDeleteVideoStyle,
            visibleModalDeleteVideo: false
        })
    };

    // end Modal register

    // modal list user registered
    const [modalListUserStyle, setModalListUserStyle] = useState({
        visibleListUser: false,
    });
    
    const { visibleListUser } = modalListUserStyle;
    
    const [listUserRegisted, setlistUserRegisted] = useState({
        data: [],
        loading: false,
        hasMore: true,
    });

    const getUserRegistedCourse = (token, id) => {
        return axios({
            url: 'https://courses-project-api.herokuapp.com/registedCoursesList',
            method: 'POST',
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
            data: {
                id
            }
        }).then(res => {
            setlistUserRegisted({ data: res.data.users});
        }).catch(err => console.log(err));
    }

    const handleCancelRegister = (token, idCourse, idUser) => {
        return axios({
            url:'https://courses-project-api.herokuapp.com/cancelRegister',
            method:'PUT',
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
            data: {
                idCourse,
                idUser
            }
        }).then(res => {
            getUserRegistedCourse(JSON.parse(localStorage.getItem('token')).token, idCourse);
        }).catch(err => console.log(err));
    }

    const showModalListUser = () => {
        getUserRegistedCourse(JSON.parse(localStorage.getItem('token')).token, item._id)
        setModalListUserStyle({
            ...modalListUserStyle,
            visibleListUser:true
        })
    };

    // end modal list user registered

    // modal update course
    const [modalStyle, setModalStyle] = useState({
        visible: false,
        loading: false,
    });
    const { visible, loading } = modalStyle;

    const [teacherList, setTeacherList] = useState([]);
    const dateFormat = 'DD/MM/YYYY';
    const [form] = Form.useForm();

    const getTeacher = (token) => {
        return axios({
            url:'https://courses-project-api.herokuapp.com/getTeacher',
            method:'GET',
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
        }).then(res => {
            setTeacherList([...res.data.teachers]);
        }).catch(err => console.log(err))
    }

    const renderTeacher = () => {
        return teacherList.map((item,index) => {
            return  <Select.Option value={item._id} key={index}>{item.name}</Select.Option>
        })
    };

    const showModalUpdateCourse = async(item) => {
        await getTeacher(JSON.parse(localStorage.getItem('token')).token);
        await form.setFieldsValue({
            idUpdateCourse:item._id,
            nameUpdateCourse:item.name,
            descUpdateCourse: item.description,
            uploadUpdateCourse: item.image,
            // authorUpdateCourse: item.idAuthor,
            dateUpdateCourse: moment(item.timeStart,dateFormat),
            typeUpdateCourse: item.type
        });
        setModalStyle({
            ...modalStyle,
            visible: true,
        });
    };

    const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 17 },
        },
    };

    const onFinish = values => {
        console.log('Received values of form: ', values);
        handleUpdateCourse(JSON.parse(localStorage.getItem('token')).token,{
            id: values.idUpdateCourse,
            name: values.nameUpdateCourse,
            description: values.descUpdateCourse,
            image: values.uploadUpdateCourse,
            timeStart: values['dateUpdateCourse'].format('DD/MM/YYYY'),
            idAuthor: values.authorUpdateCourse,
            type: values.typeUpdateCourse
        });
        setModalStyle({
            ...modalStyle,
            loading: true,
        });
        setTimeout(() => {
            setModalStyle({
                ...modalStyle,
                visible: false,
                loading: false,
            });
        }, 2000);
    };

    // end modal update course
    
    // confirm delete course
    const confirm = (values) => {
        console.log(values._id);
        handleDeleteCourse(JSON.parse(localStorage.getItem('token')).token,values._id);
        message.success('Xóa thành công');
      }
      
    const cancel = (e) => {
        console.log(e);
    }
    // end confirm delete course

    // add video
    const [modalAddVideoStyle, setModalAddVideoStyle] = useState({
        visibleModalAddVideo: false,
        loadingModalAddVideo: false,
    });
    const showModalAddVideo = async() => {
        await form.setFieldsValue({
            idCourseVideo:item._id,
            nameVideoCourse:"",
            serialVideoCourse: null,
            urlVideoCourse: ""
        });
        await setModalAddVideoStyle({
            ...modalAddVideoStyle,
            visibleModalAddVideo: true,
        });
    }

    const { visibleModalAddVideo, loadingModalAddVideo } = modalAddVideoStyle;

    const handleAddVideo = values => {
        console.log(values);
        axios({
            url:"https://courses-project-api.herokuapp.com/addVideo",
            method:"POST",
            headers: {
                'Authorization': JSON.parse(localStorage.getItem('token')).token,
                "Content-Type": "application/json",
            },
            data: {
                idCourse: values.idCourseVideo,
                name: values.nameVideoCourse,
                serial: values.serialVideoCourse,
                url: values.urlVideoCourse
            }
        }).then(res => {
            if(res.data.message === 'success') {
                return message.success('Thêm video thành công');
            }
            return message.error('Thêm video thất bại');
        }).catch(err => console.log(err));
        
        setModalAddVideoStyle({
            ...modalAddVideoStyle,
            loadingModalAddVideo: true,
        });

        setTimeout(() => {
            setModalAddVideoStyle({
                ...modalAddVideoStyle,
                visibleModalAddVideo: false,
                loadingModalAddVideo: false,
            });
        }, 2000);
    }
    // end add video

    // update video
    const [listVideo, setListVideo] = useState([]);

    const getVideo = (id) => {
        axios({
            method:'GET',
            url: `https://courses-project-api.herokuapp.com/getVideo/${id}`,
            headers: {
                'Authorization': JSON.parse(localStorage.getItem('token')).token,
                "Content-Type": "application/json",
            },
        }).then(res => {
            setListVideo([...res.data]);
        }).catch(err => console.log(err));
    };

    const renderVideo = () => {
        return listVideo.map((item, index) => {
            return <Select.Option value={item._id} key={index}>{item.name}</Select.Option>
        })
    }

    const [modalUpdateVideoStyle, setModalUpdateVideoStyle] = useState({
        visibleModalUpdateVideo: false,
        loadingModalUpdateVideo: false,
    });
    const showModalUpdateVideo = async(item) => {
        getVideo(item._id);
        await form.setFieldsValue({
            idUpdateCourseVideo:item._id,
            idUpdateVideo: "",
            nameUpdateVideoCourse: "",
            serialUpdateVideoCourse: null,
            urlUpdateVideoCourse: ""
        });
        await setModalUpdateVideoStyle({
            ...modalUpdateVideoStyle,
            visibleModalUpdateVideo: true,
        });
    }

    const { visibleModalUpdateVideo, loadingModalUpdateVideo } = modalUpdateVideoStyle;

    const handleUpdateVideo = values => {
        axios({
            url:"https://courses-project-api.herokuapp.com/updateVideo",
            method:"PUT",
            headers: {
                'Authorization': JSON.parse(localStorage.getItem('token')).token,
                "Content-Type": "application/json",
            },
            data: {
                idCourse: values.idUpdateCourseVideo,
                name: values.nameUpdateVideoCourse,
                serial: values.serialUpdateVideoCourse,
                url: values.urlUpdateVideoCourse,
                idVideo: values.idUpdateVideo
            }
        }).then(res => {
            if(res.data.message === 'success') {
                return message.success('Cập nhật video thành công');
            }
            return message.error('Cập nhật video thất bại');
        }).catch(err => console.log(err));
        
        setModalUpdateVideoStyle({
            ...modalUpdateVideoStyle,
            loadingModalUpdateVideo: true,
        });

        setTimeout(() => {
            setModalUpdateVideoStyle({
                ...modalUpdateVideoStyle,
                visibleModalUpdateVideo: false,
                loadingModalUpdateVideo: false,
            });
        }, 2000);
    }

    // and update video

    // delete video


    const [modalDeleteVideoStyle, setModalDeleteVideoStyle] = useState({
        visibleModalDeleteVideo: false,
        loadingModalDeleteVideo: false,
    });
    const showModalDeleteVideo = async(item) => {
        getVideo(item._id);
        await form.setFieldsValue({
            idDeleteCourseVideo:item._id,
            idDeleteVideo: ""
        });
        await setModalDeleteVideoStyle({
            ...modalDeleteVideoStyle,
            visibleModalDeleteVideo: true,
        });
    }

    const { visibleModalDeleteVideo, loadingModalDeleteVideo } = modalDeleteVideoStyle;

    const handleDeleteVideo = values => {
        axios({
            url:"https://courses-project-api.herokuapp.com/deleteVideo",
            method:"DELETE",
            headers: {
                'Authorization': JSON.parse(localStorage.getItem('token')).token,
                "Content-Type": "application/json",
            },
            data: {
                idCourse: values.idDeleteCourseVideo,
                idVideo: values.idDeleteVideo
            }
        }).then(res => {
            if(res.data.message === 'success') {
                return message.success('Xóa video thành công');
            }
            return message.error('Xóa video thất bại');
        }).catch(err => console.log(err));
        
        setModalDeleteVideoStyle({
            ...modalDeleteVideoStyle,
            loadingModalDeleteVideo: true,
        });

        setTimeout(() => {
            setModalDeleteVideoStyle({
                ...modalDeleteVideoStyle,
                visibleModalDeleteVideo: false,
                loadingModalDeleteVideo: false,
            });
        }, 2000);
    }
    // and delete video


    return (
        <div className="manager__course-item">
            <Card
                hoverable
                style={{ padding:0 }}
                cover={<img alt={item.image} src={item.image} />}
            >
                <Meta title={item.name} description={item.timeStart} />
            </Card>
            <div className="item-feature">
                <button
                    className="btn-feature" 
                    style={{
                        backgroundColor:'#0050b3',
                        color:'#fff'
                    }}
                    onClick={() => showModalRegister(item)}
                >
                    Ghi Danh
                </button>
                <button 
                    className="btn-feature"
                    className="btn-feature" 
                    style={{
                        backgroundColor:'#eb2f96',
                        color:'#fff'
                    }}    
                    onClick={() => showModalListUser(item)}
                >
                    Học Viên
                </button>
                <button 
                    className="btn-feature"
                    style={{
                        backgroundColor:'#531dab',
                        color:'#fff'
                    }}    
                    onClick={() => showModalUpdateCourse(item)}
                >
                    Chỉnh Sửa
                </button>
                {/* confirm delete course */}
                <Popconfirm
                    title="Bạn chắc chắn muốn xóa khóa học này?"
                    onConfirm={() => confirm(item)}
                    onCancel={cancel}
                    okText="Có"
                    cancelText="Thoát"
                >
                    <button 
                        className="btn-feature"
                        style={{
                            backgroundColor:'#f5222d',
                            color:'#fff'
                        }}    
                    >
                        Xóa
                    </button>
                </Popconfirm>
                <button 
                    className="btn-feature"
                    style={{
                        backgroundColor:'#1890ff',
                        color:'#fff'
                    }}    
                    onClick={() => showModalAddVideo(item)}
                >
                    Thêm Video
                </button>
                <button 
                    className="btn-feature"
                    style={{
                        backgroundColor:'#d4b106',
                        color:'#fff'
                    }}    
                    onClick={() => showModalUpdateVideo(item)}
                >
                    Chỉnh sửa Video
                </button>
                <button 
                    className="btn-feature"
                    style={{
                        backgroundColor:'#faad14',
                        color:'#fff'
                    }}    
                    onClick={() => showModalDeleteVideo(item)}
                >
                    Xóa Video
                </button>
            </div>

            {/* modal register */}
            <Modal
                title="Ghi danh Học viên"
                visible={visibleRegister}
                footer=""
                onCancel={handleCancel}
                className="modal__registerCourse"
            >
                <Input placeholder="Nhập tên học viên" />
                <div className="demo-infinite-container">
                    <List
                        dataSource={listUser.data}
                        renderItem={data => (
                        <List.Item key={data._id}>
                            <List.Item.Meta
                            avatar={
                                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                            }
                            title={<a href="https://ant.design">{data.name}</a>}
                            description={data.username}
                            />
                            <div>
                                <button 
                                    className="ant-btn ant-btn-block ant-btn-primary"
                                    onClick={() => handleRegister(JSON.parse(localStorage.getItem('token')).token,item._id,data._id)}
                                >
                                    Ghi danh
                                </button>
                                <button 
                                    className="ant-btn ant-btn-block ant-btn-danger"
                                    onClick={() => handleRemoveRegister(JSON.parse(localStorage.getItem('token')).token,item._id,data._id)}  
                                >
                                    Hủy duyệt
                                </button>
                            </div>
                        </List.Item>
                        )}
                    >
                        {listUser.loading && listUser.hasMore && (
                        <div className="demo-loading-container">
                            <Spin />
                        </div>
                        )}
                    </List>
                </div>
            </Modal>

            {/* modal list user  */}
            <Modal
                title="Danh sách Học viên"
                visible={visibleListUser}
                footer=""
                onCancel={handleCancel}
                className="modal__listUserCourse"
            >
                <Input placeholder="Nhập tên học viên" />
                <div className="demo-infinite-container">
                    <List
                        dataSource={listUserRegisted.data}
                        renderItem={data => (
                        <List.Item key={data._id}>
                            <List.Item.Meta
                            avatar={
                                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                            }
                            title={<a href="https://ant.design">{data.name}</a>}
                            description={data.username}
                            />
                            <div>
                                <button 
                                    className="ant-btn ant-btn-danger"
                                    onClick={() => handleCancelRegister(JSON.parse(localStorage.getItem('token')).token,item._id,data._id)}
                                >
                                    Hủy ghi danh
                                </button>
                            </div>
                        </List.Item>
                        )}
                    >
                        {listUserRegisted.loading && listUserRegisted.hasMore && (
                        <div className="demo-loading-container">
                            <Spin />
                        </div>
                        )}
                    </List>
                </div>
            </Modal>
            
            {/* modal update course  */}
            <Modal
                title="Cập nhật khóa học"
                visible={visible}
                footer=""
                onCancel={handleCancel}
                className="modal__updateCourse"
                >
                <Form
                    {...formItemLayout}
                    form={form}
                    name="updateCourse"
                    onFinish={onFinish} 
                    scrollToFirstError
                >
                    <Form.Item
                        name="idUpdateCourse"
                        hidden
                    >
                    </Form.Item>
                    <Form.Item
                        name="nameUpdateCourse"
                        label="Tên khóa học"
                        rules={[
                        {
                            type: 'string',
                            message: 'Nhập tên khóa học',
                        },
                        {
                            required: true,
                            message: 'Vui lòng nhập tên khóa học!',
                        },
                        ]}
                    >
                        <Input placeholder="Nhập tên khóa học"/>
                    </Form.Item>
                    <Form.Item
                        name="typeUpdateCourse"
                        label="Loại khóa học"
                        rules={[
                        {
                            type: 'string',
                            message: 'Chọn loại khóa học',
                        },
                        {
                            required: true,
                            message: 'Vui lòng chọn loại khóa học!',
                        },
                        ]}
                    >
                        <Select placeholder="Chọn loại khóa học">
                            <Select.Option value="FE">Front-End</Select.Option>
                            <Select.Option value="BE">Back-End</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item 
                        name="dateUpdateCourse" 
                        label="Thời gian tạo" 
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn thời gian cụ thể!',
                            }
                        ]}
                    >
                        <DatePicker format={dateFormat}/>
                    </Form.Item>
                    <Form.Item name="uploadUpdateCourse" label="Hình ảnh" rules={[
                        {
                            type: 'string',
                            message: 'Chọn hình ảnh',
                        },
                        {
                            required: true,
                            message: 'Vui lòng chọn hình ảnh!',
                        },
                        ]}>
                        <Input placeholder="Nhập link ảnh"/>
                    </Form.Item>
                    <Form.Item name="descUpdateCourse" label="Mô tả" rules={[
                        {
                            type: 'string',
                            message: 'Nhập mô tả khóa học',
                        },
                        {
                            required: true,
                            message: 'Vui lòng nhập mô tả khóa học!',
                        },
                        ]}>
                        <Input placeholder="Nhập mô tả khóa học"/>
                    </Form.Item>
                    <Form.Item name="authorUpdateCourse" label="Giảng viên" rules={[
                        {
                            type: 'string',
                            message: 'Chọn giảng viên',
                        },
                        {
                            required: true,
                            message: 'Vui lòng chọn giảng viên!',
                        },
                        ]}>
                        <Select placeholder="Chọn giảng viên" defaultValue={item.author}>
                            {renderTeacher()}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button key="back" onClick={handleCancel}>
                            Thoát
                        </Button>,
                        <Button htmlType="submit" key="submit" type="primary" loading={loading}>
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            
            {/* modal add video course */}
            <Modal
                title="Thêm Video"
                visible={visibleModalAddVideo}
                footer=""
                onCancel={handleCancel}
                className="modal__addCourse"
                >
                <Form
                    {...formItemLayout}
                    form={form}
                    name="addVideo"
                    onFinish={handleAddVideo} 
                    scrollToFirstError
                >
                    <Form.Item
                        name="idCourseVideo"
                        hidden
                    >
                    </Form.Item>
                    <Form.Item
                        name="nameVideoCourse"
                        label="Tên Video"
                        rules={[
                        {
                            type: 'string',
                            message: 'Nhập tên video',
                        },
                        {
                            required: true,
                            message: 'Vui lòng nhập tên video!',
                        },
                        ]}
                    >
                        <Input placeholder="Nhập tên video"/>
                    </Form.Item>
                    <Form.Item
                        name="serialVideoCourse"
                        label="Bài"
                        rules={[
                        {
                            type: 'number',
                            message: 'Vui lòng nhập số!',
                        },
                        {
                            required: true,
                            message: 'Vui lòng nhập số bài!',
                        },
                        ]}
                    >
                        <InputNumber placeholder="Nhập số bài"/>
                    </Form.Item>
                    <Form.Item
                        name="urlVideoCourse"
                        label="Video URL"
                        rules={[
                        {
                            type: 'string',
                            message: 'Nhập link video',
                        },
                        {
                            required: true,
                            message: 'Vui lòng nhập link video!',
                        },
                        ]}
                    >
                        <Input placeholder="Nhập link video"/>
                    </Form.Item>
                    <Form.Item>
                        <Button key="back" onClick={handleCancel}>
                            Thoát
                        </Button>
                        <Button htmlType="submit" key="submit" type="primary" loading={loadingModalAddVideo}>
                            Thêm
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            
            {/* modal update video course */}
            <Modal
                title="Chỉnh sửa Video"
                visible={visibleModalUpdateVideo}
                footer=""
                onCancel={handleCancel}
                className="modal__addCourse"
                >
                <Form
                    {...formItemLayout}
                    form={form}
                    name="updateVideo"
                    onFinish={handleUpdateVideo} 
                    scrollToFirstError
                >
                    <Form.Item
                        name="idUpdateCourseVideo"
                        hidden
                    >
                    </Form.Item>
                    <Form.Item
                        name="idUpdateVideo"
                        label="Video bài học"
                        rules={[
                        {
                            type: 'string',
                            message: 'Chọn Video bài học',
                        },
                        {
                            required: true,
                            message: 'Vui lòng chọn Video bài học!',
                        },
                        ]}
                    >
                        <Select placeholder="Chọn Video bài học">
                            {renderVideo()}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="nameUpdateVideoCourse"
                        label="Tên Video"
                        rules={[
                        {
                            type: 'string',
                            message: 'Nhập tên video',
                        },
                        {
                            required: true,
                            message: 'Vui lòng nhập tên video!',
                        },
                        ]}
                    >
                        <Input placeholder="Nhập tên video"/>
                    </Form.Item>
                    <Form.Item
                        name="serialUpdateVideoCourse"
                        label="Bài"
                        rules={[
                        {
                            type: 'number',
                            message: 'Vui lòng nhập số!',
                        },
                        {
                            required: true,
                            message: 'Vui lòng nhập số bài!',
                        },
                        ]}
                    >
                        <InputNumber placeholder="Nhập số bài"/>
                    </Form.Item>
                    <Form.Item
                        name="urlUpdateVideoCourse"
                        label="Video URL"
                        rules={[
                        {
                            type: 'string',
                            message: 'Nhập link video',
                        },
                        {
                            required: true,
                            message: 'Vui lòng nhập link video!',
                        },
                        ]}
                    >
                        <Input placeholder="Nhập link video"/>
                    </Form.Item>
                    <Form.Item>
                        <Button key="back" onClick={handleCancel}>
                            Thoát
                        </Button>
                        <Button htmlType="submit" key="submit" type="primary" loading={loadingModalUpdateVideo}>
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            
            {/* // modal delete video course */}
            <Modal
                title="Xóa Video"
                visible={visibleModalDeleteVideo}
                footer=""
                onCancel={handleCancel}
                className="modal__addCourse"
                >
                <Form
                    {...formItemLayout}
                    form={form}
                    name="DeleteVideo"
                    onFinish={handleDeleteVideo} 
                    scrollToFirstError
                >
                    <Form.Item
                        name="idDeleteCourseVideo"
                        hidden
                    >
                    </Form.Item>
                    <Form.Item
                        name="idDeleteVideo"
                        label="Video bài học"
                        rules={[
                        {
                            type: 'string',
                            message: 'Chọn Video bài học',
                        },
                        {
                            required: true,
                            message: 'Vui lòng chọn Video bài học!',
                        },
                        ]}
                    >
                        <Select placeholder="Chọn Video bài học">
                            {renderVideo()}
                        </Select>
                    </Form.Item>
                 
                    <Form.Item>
                        <Button key="back" onClick={handleCancel}>
                            Thoát
                        </Button>
                        <Button htmlType="submit" key="submit" type="primary" loading={loadingModalDeleteVideo}>
                            Xóa
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            
        </div>
    )
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        handleUpdateCourse: (token, data) => {
            dispatch(action.updateCourseAPI(token, data));
        },
        handleDeleteCourse: (token, id) => {
            dispatch(action.deleteCourseAPI(token,id));
        }
    }
}

export default connect(null,mapDispatchToProps)(CourseItem);
