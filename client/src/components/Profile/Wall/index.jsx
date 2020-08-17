import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import * as action from '../../../redux/actions';

import { Row, Col, Input, DatePicker, Popover, Button , message, Popconfirm, Modal, Form } from 'antd';
import { PictureOutlined, BookOutlined, SendOutlined, DashOutlined, LikeTwoTone } from '@ant-design/icons';
const { RangePicker } = DatePicker;
const { Search, TextArea  } = Input;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const WallComponent = ({ userLogin, profile, postList, getPostAPI, likePost, createPostAPI, deletePostAPI, updatePostAPI, handleLikePostAPI, match, getCommentByIdPostAPI, commentList, createCommentByIdPostAPI, deleteCommentByIdPostAPI, updateCommentByIdPostAPI }) => {
    const [loadingStyle, setLoadingStyle] = useState(false);
    
    const [createPost, setCreatePost] = useState({
        img: "",
        hashtag: "",
        content: ""
    });
    const [showComment, setShowComment] = useState({
        id:"",
        isCheck: false
    });
    const [visible, setVisible] = useState(false);
    const hide = () => {
        setVisible(false);
    };
    const handleVisibleChange = visible => {
        setVisible(visible);
    };

    const [visibleHashtag, setVisibleHashtag] = useState(false);
    const hideHashtag = () => {
        setVisibleHashtag(false);
    };
    const handleVisibleChangeHashtag = visible => {
        setVisibleHashtag(visible);
    };

    const popoverPicture = (
        <div>
            <input name="imgURL" placeholder="Nhập link ảnh tại đây" type="text" value={createPost.img} onChange={(e) => {
                setCreatePost({
                    ...createPost,
                    img: e.target.value
                })
            }}></input>
            <button className="ant-btn ant-btn-primary" onClick={hide}>Chọn</button>
        </div>
    );

    const popoverHashtag = (
        <div>
            <input placeholder="Nhập Hashtag tại đây" type="text" value={createPost.hashtag} onChange={(e) => {
                setCreatePost({
                    ...createPost,
                    hashtag: e.target.value
                })
            }}></input>
            <button className="ant-btn ant-btn-primary" onClick={hideHashtag}>Chọn</button>
        </div>
    );
    
    const cancel = (e) => {
        console.log(e);
    };

    const contentUpdatePost = (item) => {
        return <>
            <Popconfirm
                title="Bạn có chắc muốn xóa bài viết này?"
                onConfirm={async() => {
                    await deletePostAPI(JSON.parse(localStorage.getItem('token')).token, item._id);
                    await message.success('Xóa thành công !!!')
                }}
                onCancel={cancel}
                okText="Có"
                cancelText="Không"
            >
                <button className="ant-btn ant-btn-block">Xóa</button>
            </Popconfirm>
            <button className="ant-btn ant-btn-block" onClick={() => showModal(item)}>Chỉnh Sửa</button>
        </>
    }

    // modal update post
    const [form] = Form.useForm();
    
    const [showModalUpdatePost, setShowModalUpdatePost] = useState(false);

    const showModal = async(item) => {
        await form.setFieldsValue({
            idUpdatePost: item._id,
            idUserUpdatePost: item.idUser,
            contentUpdatePost: item.content,
            imgUpdatePost: item.img,
            hashTagUpdatePost: item.hashtag,
            likeUpdatePost: item.like,
            timeUpdatePost: item.time
        })
        await setShowModalUpdatePost(true);
    }
    
    const handleCancel = e => {
        console.log(e);
        setShowModalUpdatePost(false);
        setShowModalUpdateComment(false);
    };

    // modal update comment 
    const [showModalUpdateComment, setShowModalUpdateComment] = useState(false);

    const showModalComment = async(item) => {
        await form.setFieldsValue({
            idUpdateComment: item._id,
            idPostUpdateComment: item.idPost,
            idUserUpdateComment: item.idUser,
            nameUpdateComment: item.name,
            contentUpdateComment: item.content
        })
        await setShowModalUpdateComment(true);
    }
    
    const confirmDeleteComment = async(id) => {
        await deleteCommentByIdPostAPI(JSON.parse(localStorage.getItem('token')).token, id);
        await message.success('Xóa bình luận thành công !!!')
    }

    const contentUpdateComment = (item, idUserPost) => {
        if(item.idUser === userLogin.id || userLogin.id === idUserPost) {
            return <>
                <Popconfirm
                    title="Bạn có chắc muốn xóa bình luận này?"
                    onConfirm={() => confirmDeleteComment(item._id)}
                    onCancel={cancel}
                    okText="Có"
                    cancelText="Không"
                >
                    <button className="ant-btn ant-btn-block">Xóa</button>
                </Popconfirm>
                { item.idUser === userLogin.id ?  
                        <button className="ant-btn ant-btn-block" onClick={() => {
                            showModalComment(item)
                        }}>Chỉnh Sửa</button>
                    :
                        <></>
                }
            </>
        }
    };

    const countComment = (idPost) => {
        return commentList.map((item) => {
            if(item.idPost === idPost) {
                return item;
            }
        }).length;
    }

    const renderCommentPost = (idPost, idUser) => {
        return commentList.map((item,index) => {
            if(item.idPost === idPost) {
                return  <div className="comment__wrapper-item" key={index}>
                            <img src="https://picsum.photos/200" alt=""/>
                            <p>
                                <span>{item.name}: </span>
                                {item.content}
                            </p>
                            { userLogin.id === item.idUser || userLogin.id === idUser ? 
                                    <Popover content={() => contentUpdateComment(item, idUser)} trigger="click">
                                        <Button><DashOutlined /></Button>
                                    </Popover>
                                :
                                    <></>
                            }
                        </div>   
            }
        })
    }

    const renderPost = () => {
        let result = [];
        if(postList.length <= 0) {
            result.push(<div className="wall-col-content-disabled" key={postList.length}>
                        Chưa có bài viết nào
                    </div>
                    );
        } else {
            if(searchText) {
                for(let i = 0; i < postList.length; i++) {
                    if(postList[i].content.toLowerCase().trim().indexOf(searchText.toLowerCase().trim()) !== -1) {
                        for(let j = 0; j < likePost.length; j++) {
                            if(postList[i].like > 0) {
                                    if(postList[i].like > 1 && userLogin.id === likePost[j].idUser) {
                                        result.push(
                                                <div className="wall-col-post" key={postList[i]._id + Math.random()*1000}>
                                                <div className="post__top">
                                                    <div className="post__avatar">
                                                        <img src="https://picsum.photos/200" alt=""/>
                                                    </div>
                                                    <div className="post__user">
                                                        <h3>{profile.name}</h3>
                                                        <p>{postList[i].time}</p>
                                                    </div>
                                                    <div className="post__hashtag">
                                                        {
                                                            postList[i].idUser === userLogin.id ?
                                                                <Popover content={() => contentUpdatePost(postList[i])} trigger="click">
                                                                    <Button><DashOutlined /></Button>
                                                                </Popover>
                                                            :
                                                                <></>
                                                        }
                                                        <p>{postList[i].hashtag}</p>
                                                    </div>
                                                </div>
                                                <div className="post__main">
                                                    <p className="post__main-content">
                                                        {postList[i].content}
                                                    </p>
                                                    { postList[i].img ? 
                                                            <img className="post__main-img" src={postList[i].img} alt=""/>
                                                        :
                                                            <></>
                                                    }
                                                </div>
                                                <div className="post__footer">
                                                    <div className="post__footer-statistic">
                                                        <div className="like">
                                                            <LikeTwoTone />
                                                            Bạn và {postList[i].like - 1} người khác
                                                        </div>
                                                        
                                                        <div className="comment" onClick={async() => {
                                                            await getCommentByIdPostAPI(postList[i]._id)
                                                            await setShowComment({
                                                                id: postList[i]._id,
                                                                isCheck: !showComment.isCheck    
                                                            });
                                                        }}>
                                                            { countComment(postList[i]._id) > 0 && showComment.id === postList[i]._id ? `${countComment(postList[i]._id)} bình luận` : <></>} 
                                                        </div>
                                                    </div>
                                                    <div className="post__footer-comment">
                                                        <button className="ant-btn ant-btn-primary" style={{
                                                            color:'white'
                                                        }} onClick={() => {
                                                            handleLikePost(postList[i]._id, match.params.id)
                                                        }}>Đã thích</button>
                                                        <button className="ant-btn" onClick={async() => {
                                                            await getCommentByIdPostAPI(postList[i]._id)
                                                            await setShowComment({
                                                                id: postList[i]._id,
                                                                isCheck: !showComment.isCheck    
                                                            });
                                                        }}>Bình luận</button>
                                                        { showComment.id === postList[i]._id && showComment.isCheck ? 
                                                            <div className="comment__wrapper">
                                                                <div className="comment__wrapper-author">
                                                                    <img src="https://picsum.photos/200" alt=""/>
                                                                    <Search 
                                                                        placeholder="Viết bình luận của bạn"
                                                                            enterButton
                                                                            onSearch={(value) => {
                                                                                createCommentByIdPostAPI(JSON.parse(localStorage.getItem('token')).token,{
                                                                                    idPost: postList[i]._id,
                                                                                    idUser: userLogin.id,
                                                                                    name: userLogin.name,
                                                                                    content: value
                                                                            })
                                                                        }}    
                                                                    />
                                                                </div>
                                                                { renderCommentPost(postList[i]._id, postList[i].idUser) }

                                                            </div>
                                                        :
                                                            <></>
                                                        }
                                                    </div>
                                                </div>
                                            </div>                              
                                        );
                                        break;
                                        
                                    }
                                    else if(postList[i].like === 1  && userLogin.id === likePost[j].idUser && postList[i]._id === likePost[j].idPost) {
                                        result.push(
                                                <div className="wall-col-post" key={postList[i]._id + Math.random()*1000}>
                                                <div className="post__top">
                                                    <div className="post__avatar">
                                                        <img src="https://picsum.photos/200" alt=""/>
                                                    </div>
                                                    <div className="post__user">
                                                        <h3>{profile.name}</h3>
                                                        <p>{postList[i].time}</p>
                                                    </div>
                                                    <div className="post__hashtag">
                                                        {
                                                            postList[i].idUser === userLogin.id ?
                                                                <Popover content={() => contentUpdatePost(postList[i])} trigger="click">
                                                                    <Button><DashOutlined /></Button>
                                                                </Popover>
                                                            :
                                                                <></>
                                                        }
                                                        <p>{postList[i].hashtag}</p>
                                                    </div>
                                                </div>
                                                <div className="post__main">
                                                    <p className="post__main-content">
                                                        {postList[i].content}
                                                    </p>
                                                    { postList[i].img ? 
                                                            <img className="post__main-img" src={postList[i].img} alt=""/>
                                                        :
                                                            <></>
                                                    }
                                                </div>
                                                <div className="post__footer">
                                                    <div className="post__footer-statistic">
                                                        <div className="like">
                                                            <LikeTwoTone />
                                                            Bạn
                                                        </div>
                                                        
                                                        <div className="comment" onClick={async() => {
                                                            await getCommentByIdPostAPI(postList[i]._id)
                                                            await setShowComment({
                                                                id: postList[i]._id,
                                                                isCheck: !showComment.isCheck    
                                                            });
                                                        }}>
                                                            { countComment(postList[i]._id) > 0 && showComment.id === postList[i]._id ? `${countComment(postList[i]._id)} bình luận` : <></>} 
                                                        </div>
                                                    </div>
                                                    <div className="post__footer-comment">
                                                        <button className="ant-btn ant-btn-primary" style={{
                                                            color:'white'
                                                        }} onClick={() => {
                                                            handleLikePost(postList[i]._id, match.params.id)
                                                        }}>Đã Thích</button>
                                                        <button className="ant-btn" onClick={async() => {
                                                            await getCommentByIdPostAPI(postList[i]._id)
                                                            await setShowComment({
                                                                id: postList[i]._id,
                                                                isCheck: !showComment.isCheck    
                                                            });
                                                        }}>Bình luận</button>
                                                        { showComment.id === postList[i]._id && showComment.isCheck ? 
                                                            <div className="comment__wrapper">
                                                                <div className="comment__wrapper-author">
                                                                    <img src="https://picsum.photos/200" alt=""/>
                                                                    <Search 
                                                                        placeholder="Viết bình luận của bạn"
                                                                        enterButton
                                                                        onSearch={(value) => {
                                                                            createCommentByIdPostAPI(JSON.parse(localStorage.getItem('token')).token,{
                                                                                idPost: postList[i]._id,
                                                                                idUser: userLogin.id,
                                                                                name: userLogin.name,
                                                                                content: value
                                                                        })
                                                                    }}      />
                                                            </div>
                                                                { renderCommentPost(postList[i]._id, postList[i].idUser) }
                                                                {/* <div className="comment__wrapper-item">
                                                                    <img src="https://picsum.photos/200" alt=""/>
                                                                    <p>
                                                                        <span>Nguyễn Thanh Tùng: </span>
                                                                        Tuyệt vời quá !!!
                                                                    </p>
                                                                    <Popover content={contentUpdateComment} trigger="click">
                                                                        <Button><DashOutlined /></Button>
                                                                    </Popover>
                                                                </div>    */}

                                                            </div>
                                                        :
                                                            <></>
                                                        }
                                                    </div>
                                                </div>
                                            </div>                              
                                        )
                                        break;

                                    }
                                    else if(userLogin.id !== likePost[j].idUser && postList[i]._id !== likePost[j].idPost) {
                                        result.push(
                                                <div className="wall-col-post" key={postList[i]._id + Math.random()*1000}>
                                                <div className="post__top">
                                                    <div className="post__avatar">
                                                        <img src="https://picsum.photos/200" alt=""/>
                                                    </div>
                                                    <div className="post__user">
                                                        <h3>{profile.name}</h3>
                                                        <p>{postList[i].time}</p>
                                                    </div>
                                                    <div className="post__hashtag">
                                                        {
                                                            postList[i].idUser === userLogin.id ?
                                                                <Popover content={() => contentUpdatePost(postList[i])} trigger="click">
                                                                    <Button><DashOutlined /></Button>
                                                                </Popover>
                                                            :
                                                                <></>
                                                        }
                                                        <p>{postList[i].hashtag}</p>
                                                    </div>
                                                </div>
                                                <div className="post__main">
                                                    <p className="post__main-content">
                                                        {postList[i].content}
                                                    </p>
                                                    { postList[i].img ? 
                                                            <img className="post__main-img" src={postList[i].img} alt=""/>
                                                        :
                                                            <></>
                                                    }
                                                </div>
                                                <div className="post__footer">
                                                    <div className="post__footer-statistic">
                                                        <div className="like">
                                                            <LikeTwoTone />
                                                            {postList[i].like}
                                                        </div>
                                                        
                                                        <div className="comment" onClick={async() => {
                                                            await getCommentByIdPostAPI(postList[i]._id)
                                                            await setShowComment({
                                                                id: postList[i]._id,
                                                                isCheck: !showComment.isCheck    
                                                            });
                                                        }}>
                                                            { countComment(postList[i]._id) > 0 && showComment.id === postList[i]._id ? `${countComment(postList[i]._id)} bình luận` : <></>} 
                                                        </div>
                                                    </div>
                                                    <div className="post__footer-comment">
                                                        <button className="ant-btn" onClick={() => {
                                                            handleLikePost(postList[i]._id, match.params.id)
                                                        }}>Thích</button>
                                                        <button className="ant-btn" onClick={async() => {
                                                            await getCommentByIdPostAPI(postList[i]._id)
                                                            await setShowComment({
                                                                id: postList[i]._id,
                                                                isCheck: !showComment.isCheck    
                                                            });
                                                        }}>Bình luận</button>
                                                        { showComment.id === postList[i]._id && showComment.isCheck ? 
                                                            <div className="comment__wrapper">
                                                                <div className="comment__wrapper-author">
                                                                    <img src="https://picsum.photos/200" alt=""/>
                                                                    <Search 
                                                                        placeholder="Viết bình luận của bạn"
                                                                        enterButton
                                                                        onSearch={(value) => {
                                                                            createCommentByIdPostAPI(JSON.parse(localStorage.getItem('token')).token,{
                                                                                idPost: postList[i]._id,
                                                                                idUser: userLogin.id,
                                                                                name: userLogin.name,
                                                                                content: value
                                                                        })
                                                                    }}      />
                                                            </div>
                                                                
                                                                { renderCommentPost(postList[i]._id, postList[i].idUser) }

                                                            </div>
                                                        :
                                                            <></>
                                                        }
                                                    </div>
                                                </div>
                                            </div>                              
                                        )
                                        console.log('he')
                                        break;

                                    } 
                            } else {
                                    result.push(
                                        <div className="wall-col-post" key={postList[i]._id + Math.random()*1000}>
                                        <div className="post__top">
                                            <div className="post__avatar">
                                                <img src="https://picsum.photos/200" alt=""/>
                                            </div>
                                            <div className="post__user">
                                                <h3>{profile.name}</h3>
                                                <p>{postList[i].time}</p>
                                            </div>
                                            <div className="post__hashtag">
                                                {
                                                    postList[i].idUser === userLogin.id ?
                                                        <Popover content={() => contentUpdatePost(postList[i])} trigger="click">
                                                            <Button><DashOutlined /></Button>
                                                        </Popover>
                                                    :
                                                        <></>
                                                }
                                                <p>{postList[i].hashtag}</p>
                                            </div>
                                        </div>
                                        <div className="post__main">
                                            <p className="post__main-content">
                                                {postList[i].content}
                                            </p>
                                            { postList[i].img ? 
                                                    <img className="post__main-img" src={postList[i].img} alt=""/>
                                                :
                                                    <></>
                                            }
                                        </div>
                                        <div className="post__footer">
                                            <div className="post__footer-statistic">
                                                <div className="like">
                                                    <LikeTwoTone />
                                                    {postList[i].like}
                                                </div>
                                                
                                                <div className="comment" onClick={async() => {
                                                    await getCommentByIdPostAPI(postList[i]._id)
                                                    await setShowComment({
                                                        id: postList[i]._id,
                                                        isCheck: !showComment.isCheck    
                                                    });
                                                }}>
                                                    { countComment(postList[i]._id) > 0 && showComment.id === postList[i]._id ? `${countComment(postList[i]._id)} bình luận` : <></>} 
                                                </div>
                                            </div>
                                            <div className="post__footer-comment">
                                                <button className="ant-btn" onClick={() => {
                                                    handleLikePost(postList[i]._id, match.params.id)
                                                }}>Thích</button>
                                                <button className="ant-btn" onClick={async() => {
                                                    await getCommentByIdPostAPI(postList[i]._id)
                                                    await setShowComment({
                                                        id: postList[i]._id,
                                                        isCheck: !showComment.isCheck    
                                                    });
                                                }}>Bình luận</button>
                                                { showComment.id === postList[i]._id && showComment.isCheck ? 
                                                    <div className="comment__wrapper">
                                                        <div className="comment__wrapper-author">
                                                            <img src="https://picsum.photos/200" alt=""/>
                                                            <Search 
                                                                placeholder="Viết bình luận của bạn"
                                                                enterButton
                                                                onSearch={(value) => {
                                                                    createCommentByIdPostAPI(JSON.parse(localStorage.getItem('token')).token,{
                                                                        idPost: postList[i]._id,
                                                                        idUser: userLogin.id,
                                                                        name: userLogin.name,
                                                                        content: value
                                                                })
                                                            }}      />
                                                    </div>
                                                        
                                                        { renderCommentPost(postList[i]._id, postList[i].idUser) }

                                                    </div>
                                                :
                                                    <></>
                                                }
                                            </div>
                                        </div>
                                    </div>                              
                                    );
                                    break;
                            }
                        }
                    }
                }
               
            } else if(searchHashtag) {
                for(let i = 0; i < postList.length; i++) {
                    if(postList[i].hashtag.toLowerCase().trim().indexOf(searchHashtag.toLowerCase().trim()) !== -1) {
                        for(let j = 0; j < likePost.length; j++) {
                            if(postList[i].like > 0) {
                                    if(postList[i].like > 1 && userLogin.id === likePost[j].idUser) {
                                        result.push(
                                                <div className="wall-col-post" key={postList[i]._id + Math.random()*1000}>
                                                <div className="post__top">
                                                    <div className="post__avatar">
                                                        <img src="https://picsum.photos/200" alt=""/>
                                                    </div>
                                                    <div className="post__user">
                                                        <h3>{profile.name}</h3>
                                                        <p>{postList[i].time}</p>
                                                    </div>
                                                    <div className="post__hashtag">
                                                        {
                                                            postList[i].idUser === userLogin.id ?
                                                                <Popover content={() => contentUpdatePost(postList[i])} trigger="click">
                                                                    <Button><DashOutlined /></Button>
                                                                </Popover>
                                                            :
                                                                <></>
                                                        }
                                                        <p>{postList[i].hashtag}</p>
                                                    </div>
                                                </div>
                                                <div className="post__main">
                                                    <p className="post__main-content">
                                                        {postList[i].content}
                                                    </p>
                                                    { postList[i].img ? 
                                                            <img className="post__main-img" src={postList[i].img} alt=""/>
                                                        :
                                                            <></>
                                                    }
                                                </div>
                                                <div className="post__footer">
                                                    <div className="post__footer-statistic">
                                                        <div className="like">
                                                            <LikeTwoTone />
                                                            Bạn và {postList[i].like - 1} người khác
                                                        </div>
                                                        
                                                        <div className="comment" onClick={async() => {
                                                            await getCommentByIdPostAPI(postList[i]._id)
                                                            await setShowComment({
                                                                id: postList[i]._id,
                                                                isCheck: !showComment.isCheck    
                                                            });
                                                        }}>
                                                            { countComment(postList[i]._id) > 0 && showComment.id === postList[i]._id ? `${countComment(postList[i]._id)} bình luận` : <></>} 
                                                        </div>
                                                    </div>
                                                    <div className="post__footer-comment">
                                                        <button className="ant-btn ant-btn-primary" style={{
                                                            color:'white'
                                                        }} onClick={() => {
                                                            handleLikePost(postList[i]._id, match.params.id)
                                                        }}>Đã thích</button>
                                                        <button className="ant-btn" onClick={async() => {
                                                    await getCommentByIdPostAPI(postList[i]._id)
                                                    await setShowComment({
                                                        id: postList[i]._id,
                                                        isCheck: !showComment.isCheck    
                                                    });
                                                }}>Bình luận</button>
                                                        { showComment.id === postList[i]._id && showComment.isCheck ? 
                                                            <div className="comment__wrapper">
                                                                <div className="comment__wrapper-author">
                                                                    <img src="https://picsum.photos/200" alt=""/>
                                                                    <Search 
                                                                        placeholder="Viết bình luận của bạn"
                                                                        enterButton
                                                                        onSearch={(value) => {
                                                                            createCommentByIdPostAPI(JSON.parse(localStorage.getItem('token')).token,{
                                                                                idPost: postList[i]._id,
                                                                                idUser: userLogin.id,
                                                                                name: userLogin.name,
                                                                                content: value
                                                                        })
                                                                    }}      />
                                                            </div>
                                                                
                                                                { renderCommentPost(postList[i]._id, postList[i].idUser) }

                                                            </div>
                                                        :
                                                            <></>
                                                        }
                                                    </div>
                                                </div>
                                            </div>                              
                                        );
                                        break;
                                        
                                    }
                                    else if(postList[i].like === 1  && userLogin.id === likePost[j].idUser && postList[i]._id === likePost[j].idPost) {
                                        result.push(
                                                <div className="wall-col-post" key={postList[i]._id + Math.random()*1000}>
                                                <div className="post__top">
                                                    <div className="post__avatar">
                                                        <img src="https://picsum.photos/200" alt=""/>
                                                    </div>
                                                    <div className="post__user">
                                                        <h3>{profile.name}</h3>
                                                        <p>{postList[i].time}</p>
                                                    </div>
                                                    <div className="post__hashtag">
                                                        {
                                                            postList[i].idUser === userLogin.id ?
                                                                <Popover content={() => contentUpdatePost(postList[i])} trigger="click">
                                                                    <Button><DashOutlined /></Button>
                                                                </Popover>
                                                            :
                                                                <></>
                                                        }
                                                        <p>{postList[i].hashtag}</p>
                                                    </div>
                                                </div>
                                                <div className="post__main">
                                                    <p className="post__main-content">
                                                        {postList[i].content}
                                                    </p>
                                                    { postList[i].img ? 
                                                            <img className="post__main-img" src={postList[i].img} alt=""/>
                                                        :
                                                            <></>
                                                    }
                                                </div>
                                                <div className="post__footer">
                                                    <div className="post__footer-statistic">
                                                        <div className="like">
                                                            <LikeTwoTone />
                                                            Bạn
                                                        </div>
                                                        
                                                        <div className="comment" onClick={async() => {
                                                            await getCommentByIdPostAPI(postList[i]._id)
                                                            await setShowComment({
                                                                id: postList[i]._id,
                                                                isCheck: !showComment.isCheck    
                                                            });
                                                        }}>
                                                           { countComment(postList[i]._id) > 0 && showComment.id === postList[i]._id ? `${countComment(postList[i]._id)} bình luận` : <></>} 
                                                        </div>
                                                    </div>
                                                    <div className="post__footer-comment">
                                                        <button className="ant-btn ant-btn-primary" style={{
                                                            color:'white'
                                                        }} onClick={() => {
                                                            handleLikePost(postList[i]._id, match.params.id)
                                                        }}>Đã Thích</button>
                                                        <button className="ant-btn" onClick={async() => {
                                                    await getCommentByIdPostAPI(postList[i]._id)
                                                    await setShowComment({
                                                        id: postList[i]._id,
                                                        isCheck: !showComment.isCheck    
                                                    });
                                                }}>Bình luận</button>
                                                        { showComment.id === postList[i]._id && showComment.isCheck ? 
                                                            <div className="comment__wrapper">
                                                                <div className="comment__wrapper-author">
                                                                    <img src="https://picsum.photos/200" alt=""/>
                                                                    <Search 
                                                                        placeholder="Viết bình luận của bạn"
                                                                        enterButton
                                                                        onSearch={(value) => {
                                                                            createCommentByIdPostAPI(JSON.parse(localStorage.getItem('token')).token,{
                                                                                idPost: postList[i]._id,
                                                                                idUser: userLogin.id,
                                                                                name: userLogin.name,
                                                                                content: value
                                                                        })
                                                                    }}      />
                                                            </div>
                                                                
                                                                { renderCommentPost(postList[i]._id, postList[i].idUser) }

                                                            </div>
                                                        :
                                                            <></>
                                                        }
                                                    </div>
                                                </div>
                                            </div>                              
                                        )
                                        break;

                                    }
                                    else if(userLogin.id !== likePost[j].idUser && postList[i]._id !== likePost[j].idPost) {
                                        result.push(
                                                <div className="wall-col-post" key={postList[i]._id + Math.random()*1000}>
                                                <div className="post__top">
                                                    <div className="post__avatar">
                                                        <img src="https://picsum.photos/200" alt=""/>
                                                    </div>
                                                    <div className="post__user">
                                                        <h3>{profile.name}</h3>
                                                        <p>{postList[i].time}</p>
                                                    </div>
                                                    <div className="post__hashtag">
                                                        {
                                                            postList[i].idUser === userLogin.id ?
                                                                <Popover content={() => contentUpdatePost(postList[i])} trigger="click">
                                                                    <Button><DashOutlined /></Button>
                                                                </Popover>
                                                            :
                                                                <></>
                                                        }
                                                        <p>{postList[i].hashtag}</p>
                                                    </div>
                                                </div>
                                                <div className="post__main">
                                                    <p className="post__main-content">
                                                        {postList[i].content}
                                                    </p>
                                                    { postList[i].img ? 
                                                            <img className="post__main-img" src={postList[i].img} alt=""/>
                                                        :
                                                            <></>
                                                    }
                                                </div>
                                                <div className="post__footer">
                                                    <div className="post__footer-statistic">
                                                        <div className="like">
                                                            <LikeTwoTone />
                                                            {postList[i].like}
                                                        </div>
                                                        
                                                        <div className="comment" onClick={async() => {
                                                            await getCommentByIdPostAPI(postList[i]._id)
                                                            await setShowComment({
                                                                id: postList[i]._id,
                                                                isCheck: !showComment.isCheck    
                                                            });
                                                        }}>
                                                            { countComment(postList[i]._id) > 0 && showComment.id === postList[i]._id ? `${countComment(postList[i]._id)} bình luận` : <></>} 
                                                        </div>
                                                    </div>
                                                    <div className="post__footer-comment">
                                                        <button className="ant-btn" onClick={() => {
                                                            handleLikePost(postList[i]._id, match.params.id)
                                                        }}>Thích</button>
                                                        <button className="ant-btn" onClick={async() => {
                                                    await getCommentByIdPostAPI(postList[i]._id)
                                                    await setShowComment({
                                                        id: postList[i]._id,
                                                        isCheck: !showComment.isCheck    
                                                    });
                                                }}>Bình luận</button>
                                                        { showComment.id === postList[i]._id && showComment.isCheck ? 
                                                            <div className="comment__wrapper">
                                                                <div className="comment__wrapper-author">
                                                                    <img src="https://picsum.photos/200" alt=""/>
                                                                    <Search 
                                                                        placeholder="Viết bình luận của bạn"
                                                                        enterButton
                                                                        onSearch={(value) => {
                                                                            createCommentByIdPostAPI(JSON.parse(localStorage.getItem('token')).token,{
                                                                                idPost: postList[i]._id,
                                                                                idUser: userLogin.id,
                                                                                name: userLogin.name,
                                                                                content: value
                                                                        })
                                                                    }}      />
                                                            </div>
                                                                
                                                                { renderCommentPost(postList[i]._id, postList[i].idUser) }

                                                            </div>
                                                        :
                                                            <></>
                                                        }
                                                    </div>
                                                </div>
                                            </div>                              
                                        )
                                        console.log('he')
                                        break;

                                    } 
                            } else {
                                    result.push(
                                        <div className="wall-col-post" key={postList[i]._id + Math.random()*1000}>
                                        <div className="post__top">
                                            <div className="post__avatar">
                                                <img src="https://picsum.photos/200" alt=""/>
                                            </div>
                                            <div className="post__user">
                                                <h3>{profile.name}</h3>
                                                <p>{postList[i].time}</p>
                                            </div>
                                            <div className="post__hashtag">
                                                {
                                                    postList[i].idUser === userLogin.id ?
                                                        <Popover content={() => contentUpdatePost(postList[i])} trigger="click">
                                                            <Button><DashOutlined /></Button>
                                                        </Popover>
                                                    :
                                                        <></>
                                                }
                                                <p>{postList[i].hashtag}</p>
                                            </div>
                                        </div>
                                        <div className="post__main">
                                            <p className="post__main-content">
                                                {postList[i].content}
                                            </p>
                                            { postList[i].img ? 
                                                    <img className="post__main-img" src={postList[i].img} alt=""/>
                                                :
                                                    <></>
                                            }
                                        </div>
                                        <div className="post__footer">
                                            <div className="post__footer-statistic">
                                                <div className="like">
                                                    <LikeTwoTone />
                                                    {postList[i].like}
                                                </div>
                                                
                                                <div className="comment" onClick={async() => {
                                                    await getCommentByIdPostAPI(postList[i]._id)
                                                    await setShowComment({
                                                        id: postList[i]._id,
                                                        isCheck: !showComment.isCheck    
                                                    });
                                                }}>
                                                    { countComment(postList[i]._id) > 0 && showComment.id === postList[i]._id ? `${countComment(postList[i]._id)} bình luận` : <></>} 
                                                </div>
                                            </div>
                                            <div className="post__footer-comment">
                                                <button className="ant-btn" onClick={() => {
                                                    handleLikePost(postList[i]._id, match.params.id)
                                                }}>Thích</button>
                                                <button className="ant-btn" onClick={async() => {
                                                    await getCommentByIdPostAPI(postList[i]._id)
                                                    await setShowComment({
                                                        id: postList[i]._id,
                                                        isCheck: !showComment.isCheck    
                                                    });
                                                }}>Bình luận</button>
                                                { showComment.id === postList[i]._id && showComment.isCheck ? 
                                                    <div className="comment__wrapper">
                                                        <div className="comment__wrapper-author">
                                                            <img src="https://picsum.photos/200" alt=""/>
                                                            <Search 
                                                                placeholder="Viết bình luận của bạn"
                                                                enterButton
                                                                onSearch={(value) => {
                                                                    createCommentByIdPostAPI(JSON.parse(localStorage.getItem('token')).token,{
                                                                        idPost: postList[i]._id,
                                                                        idUser: userLogin.id,
                                                                        name: userLogin.name,
                                                                        content: value
                                                                })
                                                            }}      />
                                                    </div>
                                                        
                                                        { renderCommentPost(postList[i]._id, postList[i].idUser) }

                                                    </div>
                                                :
                                                    <></>
                                                }
                                            </div>
                                        </div>
                                    </div>                              
                                    );
                                    break;
                            }
                        }
                    }
                }
            } else {           
                for(let i = 0; i < postList.length; i++) {
                    for(let j = 0; j < likePost.length; j++) {
                        if(postList[i].like > 0) {
                            if(postList[i].like > 1 && userLogin.id === likePost[j].idUser) {
                                result.push(
                                        <div className="wall-col-post" key={postList[i]._id + Math.random()*1000}>
                                        <div className="post__top">
                                            <div className="post__avatar">
                                                <img src="https://picsum.photos/200" alt=""/>
                                            </div>
                                            <div className="post__user">
                                                <h3>{profile.name}</h3>
                                                <p>{postList[i].time}</p>
                                            </div>
                                            <div className="post__hashtag">
                                                {
                                                    postList[i].idUser === userLogin.id ?
                                                        <Popover content={() => contentUpdatePost(postList[i])} trigger="click">
                                                            <Button><DashOutlined /></Button>
                                                        </Popover>
                                                    :
                                                        <></>
                                                }
                                                <p>{postList[i].hashtag}</p>
                                            </div>
                                        </div>
                                        <div className="post__main">
                                            <p className="post__main-content">
                                                {postList[i].content}
                                            </p>
                                            { postList[i].img ? 
                                                    <img className="post__main-img" src={postList[i].img} alt=""/>
                                                :
                                                    <></>
                                            }
                                        </div>
                                        <div className="post__footer">
                                            <div className="post__footer-statistic">
                                                <div className="like">
                                                    <LikeTwoTone />
                                                    Bạn và {postList[i].like - 1} người khác
                                                </div>
                                                
                                                <div className="comment" onClick={async() => {
                                                    await getCommentByIdPostAPI(postList[i]._id)
                                                    await setShowComment({
                                                        id: postList[i]._id,
                                                        isCheck: !showComment.isCheck    
                                                    });
                                                }}>
                                                    { countComment(postList[i]._id) > 0 && showComment.id === postList[i]._id ? `${countComment(postList[i]._id)} bình luận` : <></>} 
                                                </div>
                                            </div>
                                            <div className="post__footer-comment">
                                                <button className="ant-btn ant-btn-primary" style={{
                                                    color:'white'
                                                }} onClick={() => {
                                                    handleLikePost(postList[i]._id, match.params.id)
                                                }}>Đã thích</button>
                                                <button className="ant-btn" onClick={async() => {
                                                    await getCommentByIdPostAPI(postList[i]._id)
                                                    await setShowComment({
                                                        id: postList[i]._id,
                                                        isCheck: !showComment.isCheck    
                                                    });
                                                }}>Bình luận</button>
                                                { showComment.id === postList[i]._id && showComment.isCheck ? 
                                                    <div className="comment__wrapper">
                                                        <div className="comment__wrapper-author">
                                                            <img src="https://picsum.photos/200" alt=""/>
                                                            <Search 
                                                                placeholder="Viết bình luận của bạn"
                                                                enterButton
                                                                onSearch={(value) => {
                                                                    createCommentByIdPostAPI(JSON.parse(localStorage.getItem('token')).token,{
                                                                        idPost: postList[i]._id,
                                                                        idUser: userLogin.id,
                                                                        name: userLogin.name,
                                                                        content: value
                                                                })
                                                            }}      />
                                                    </div>
                                                        
                                                        { renderCommentPost(postList[i]._id, postList[i].idUser) }

                                                    </div>
                                                :
                                                    <></>
                                                }
                                            </div>
                                        </div>
                                    </div>                              
                                );
                                break;
                                
                            }
                            else if(postList[i].like === 1  && userLogin.id === likePost[j].idUser && postList[i]._id === likePost[j].idPost) {
                                result.push(
                                        <div className="wall-col-post" key={postList[i]._id + Math.random()*1000}>
                                        <div className="post__top">
                                            <div className="post__avatar">
                                                <img src="https://picsum.photos/200" alt=""/>
                                            </div>
                                            <div className="post__user">
                                                <h3>{profile.name}</h3>
                                                <p>{postList[i].time}</p>
                                            </div>
                                            <div className="post__hashtag">
                                                {
                                                    postList[i].idUser === userLogin.id ?
                                                        <Popover content={() => contentUpdatePost(postList[i])} trigger="click">
                                                            <Button><DashOutlined /></Button>
                                                        </Popover>
                                                    :
                                                        <></>
                                                }
                                                <p>{postList[i].hashtag}</p>
                                            </div>
                                        </div>
                                        <div className="post__main">
                                            <p className="post__main-content">
                                                {postList[i].content}
                                            </p>
                                            { postList[i].img ? 
                                                    <img className="post__main-img" src={postList[i].img} alt=""/>
                                                :
                                                    <></>
                                            }
                                        </div>
                                        <div className="post__footer">
                                            <div className="post__footer-statistic">
                                                <div className="like">
                                                    <LikeTwoTone />
                                                    Bạn
                                                </div>
                                                
                                                <div className="comment" onClick={async() => {
                                                    await getCommentByIdPostAPI(postList[i]._id)
                                                    await setShowComment({
                                                        id: postList[i]._id,
                                                        isCheck: !showComment.isCheck    
                                                    });
                                                }}>
                                                    { countComment(postList[i]._id) > 0 && showComment.id === postList[i]._id ? `${countComment(postList[i]._id)} bình luận` : <></>} 
                                                </div>
                                            </div>
                                            <div className="post__footer-comment">
                                                <button className="ant-btn ant-btn-primary" style={{
                                                    color:'white'
                                                }} onClick={() => {
                                                    handleLikePost(postList[i]._id, match.params.id)
                                                }}>Đã Thích</button>
                                                <button className="ant-btn" onClick={async() => {
                                                    await getCommentByIdPostAPI(postList[i]._id)
                                                    await setShowComment({
                                                        id: postList[i]._id,
                                                        isCheck: !showComment.isCheck    
                                                    });
                                                }}>Bình luận</button>
                                                { showComment.id === postList[i]._id && showComment.isCheck ? 
                                                    <div className="comment__wrapper">
                                                        <div className="comment__wrapper-author">
                                                            <img src="https://picsum.photos/200" alt=""/>
                                                            <Search 
                                                                placeholder="Viết bình luận của bạn"
                                                                enterButton
                                                                onSearch={(value) => {
                                                                    createCommentByIdPostAPI(JSON.parse(localStorage.getItem('token')).token,{
                                                                        idPost: postList[i]._id,
                                                                        idUser: userLogin.id,
                                                                        name: userLogin.name,
                                                                        content: value
                                                                })
                                                            }}      />
                                                    </div>
                                                        
                                                        { renderCommentPost(postList[i]._id, postList[i].idUser) }

                                                    </div>
                                                :
                                                    <></>
                                                }
                                            </div>
                                        </div>
                                    </div>                              
                                )
                                break;

                            }
                            else if(userLogin.id !== likePost[j].idUser && postList[i]._id !== likePost[j].idPost) {
                                result.push(
                                        <div className="wall-col-post" key={postList[i]._id + Math.random()*1000}>
                                        <div className="post__top">
                                            <div className="post__avatar">
                                                <img src="https://picsum.photos/200" alt=""/>
                                            </div>
                                            <div className="post__user">
                                                <h3>{profile.name}</h3>
                                                <p>{postList[i].time}</p>
                                            </div>
                                            <div className="post__hashtag">
                                                {
                                                    postList[i].idUser === userLogin.id ?
                                                        <Popover content={() => contentUpdatePost(postList[i])} trigger="click">
                                                            <Button><DashOutlined /></Button>
                                                        </Popover>
                                                    :
                                                        <></>
                                                }
                                                <p>{postList[i].hashtag}</p>
                                            </div>
                                        </div>
                                        <div className="post__main">
                                            <p className="post__main-content">
                                                {postList[i].content}
                                            </p>
                                            { postList[i].img ? 
                                                    <img className="post__main-img" src={postList[i].img} alt=""/>
                                                :
                                                    <></>
                                            }
                                        </div>
                                        <div className="post__footer">
                                            <div className="post__footer-statistic">
                                                <div className="like">
                                                    <LikeTwoTone />
                                                    {postList[i].like}
                                                </div>
                                                
                                                <div className="comment" onClick={async() => {
                                                    await getCommentByIdPostAPI(postList[i]._id)
                                                    await setShowComment({
                                                        id: postList[i]._id,
                                                        isCheck: !showComment.isCheck    
                                                    });
                                                }}>
                                                    { countComment(postList[i]._id) > 0 && showComment.id === postList[i]._id ? `${countComment(postList[i]._id)} bình luận` : <></>} 
                                                </div>
                                            </div>
                                            <div className="post__footer-comment">
                                                <button className="ant-btn" onClick={() => {
                                                    handleLikePost(postList[i]._id, match.params.id)
                                                }}>Thích</button>
                                                <button className="ant-btn" onClick={async() => {
                                                    await getCommentByIdPostAPI(postList[i]._id)
                                                    await setShowComment({
                                                        id: postList[i]._id,
                                                        isCheck: !showComment.isCheck    
                                                    });
                                                }}>Bình luận</button>
                                                { showComment.id === postList[i]._id && showComment.isCheck ? 
                                                    <div className="comment__wrapper">
                                                        <div className="comment__wrapper-author">
                                                            <img src="https://picsum.photos/200" alt=""/>
                                                            <Search 
                                                                placeholder="Viết bình luận của bạn"
                                                                enterButton
                                                                onSearch={(value) => {
                                                                    createCommentByIdPostAPI(JSON.parse(localStorage.getItem('token')).token,{
                                                                        idPost: postList[i]._id,
                                                                        idUser: userLogin.id,
                                                                        name: userLogin.name,
                                                                        content: value
                                                                })
                                                            }}      />
                                                    </div>
                                                        
                                                        { renderCommentPost(postList[i]._id, postList[i].idUser) }

                                                    </div>
                                                :
                                                    <></>
                                                }
                                            </div>
                                        </div>
                                    </div>                              
                                )
                                console.log('he')
                                break;

                            } 
                        } else {
                            result.push(
                                <div className="wall-col-post" key={postList[i]._id + Math.random()*1000}>
                                <div className="post__top">
                                    <div className="post__avatar">
                                        <img src="https://picsum.photos/200" alt=""/>
                                    </div>
                                    <div className="post__user">
                                        <h3>{profile.name}</h3>
                                        <p>{postList[i].time}</p>
                                    </div>
                                    <div className="post__hashtag">
                                        {
                                            postList[i].idUser === userLogin.id ?
                                                <Popover content={() => contentUpdatePost(postList[i])} trigger="click">
                                                    <Button><DashOutlined /></Button>
                                                </Popover>
                                            :
                                                <></>
                                        }
                                        <p>{postList[i].hashtag}</p>
                                    </div>
                                </div>
                                <div className="post__main">
                                    <p className="post__main-content">
                                        {postList[i].content}
                                    </p>
                                    { postList[i].img ? 
                                            <img className="post__main-img" src={postList[i].img} alt=""/>
                                        :
                                            <></>
                                    }
                                </div>
                                <div className="post__footer">
                                    <div className="post__footer-statistic">
                                        <div className="like">
                                            <LikeTwoTone />
                                            {postList[i].like}
                                        </div>
                                        
                                        <div className="comment" onClick={async() => {
                                            await getCommentByIdPostAPI(postList[i]._id)
                                            await setShowComment({
                                                id: postList[i]._id,
                                                isCheck: !showComment.isCheck    
                                            });
                                        }}>
                                            { countComment(postList[i]._id) > 0 && showComment.id === postList[i]._id ? `${countComment(postList[i]._id)} bình luận` : <></>} 
                                        </div>
                                    </div>
                                    <div className="post__footer-comment">
                                        <button className="ant-btn" onClick={() => {
                                            handleLikePost(postList[i]._id, match.params.id)
                                        }}>Thích</button>
                                        <button className="ant-btn" onClick={async() => {
                                            await getCommentByIdPostAPI(postList[i]._id)
                                            await setShowComment({
                                                id: postList[i]._id,
                                                isCheck: !showComment.isCheck    
                                            });
                                        }}>Bình luận</button>
                                        { showComment.id === postList[i]._id && showComment.isCheck ? 
                                            <div className="comment__wrapper">
                                                <div className="comment__wrapper-author">
                                                    <img src="https://picsum.photos/200" alt=""/>
                                                    <Search 
                                                        placeholder="Viết bình luận của bạn"
                                                        enterButton
                                                        onSearch={(value) => {
                                                            createCommentByIdPostAPI(JSON.parse(localStorage.getItem('token')).token,{
                                                                idPost: postList[i]._id,
                                                                idUser: userLogin.id,
                                                                name: userLogin.name,
                                                                content: value
                                                        })
                                                    }}      />
                                            </div>
                                                
                                                { renderCommentPost(postList[i]._id, postList[i].idUser) }

                                            </div>
                                        :
                                            <></>
                                        }
                                    </div>
                                </div>
                            </div>                              
                            );
                            break;
                        }
                    }
                }
            }
        }
        if(result.length <= 0) {
            result.push(<div className="wall-col-content-disabled" key={postList.length}>
                                Không có kết quả tìm kiếm theo yêu cầu của bạn
                            </div>
            );
        }
        return result;
    }

    useEffect(() => {
        getPostAPI(JSON.parse(localStorage.getItem('token')).token, profile.id);
    },[]);

    // search text and hashtag
    const [searchText, setSearchText] = useState("");
    const [searchHashtag, setSearchHashtag] = useState("");

    // like 
    const handleLikePost = (idPost, idUser) => {
        handleLikePostAPI(JSON.parse(localStorage.getItem('token')).token, idPost, idUser);
    }
    
    return (
        <div className="wall">
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" xs={{span:24}} md={{span:6}}>
                    <div className="wall-col">
                        <p className="label-title">Tìm kiếm bài viết:</p>
                        <Search placeholder="Tìm kiếm theo hashtag" onSearch={value => setSearchHashtag(value)} enterButton />
                        <Search placeholder="Tìm kiếm theo từ" onSearch={value => setSearchText(value)} enterButton />
                        <p className="label-title">Tìm kiếm bài viết theo thời gian:</p>
                        <RangePicker showTime />
                    </div>
                </Col>
                <Col className="gutter-row" style={{paddingLeft: 0}} xs={{span:24}} md={{span:18}}>
                    <div className="wall-col wall-col-post-wrap">
                        { userLogin.id === profile.id ? 
                                <div className="wall-col-create-post">
                            <h3>Tạo bài viết</h3>
                            <TextArea rows={4} placeholder={`${profile.name} ơi, bạn đang nghĩ gì?`} value={createPost.content} onChange={(e) => {
                                setCreatePost({
                                    ...createPost,
                                    content: e.target.value
                                })
                            }}/>
                            <div className="post__controls">
                                <Popover content={popoverPicture} title="Chọn ảnh" trigger="click" visible={visible} onVisibleChange={handleVisibleChange}>
                                    <Button className="ant-btn">
                                        <PictureOutlined />
                                        Chọn ảnh
                                    </Button>
                                </Popover>
                                <Popover content={popoverHashtag} title="Chọn Hashtag" trigger="click" visible={visibleHashtag} onVisibleChange={handleVisibleChangeHashtag}>
                                    <Button className="ant-btn">
                                        <BookOutlined />
                                        Chọn hashtag
                                    </Button>
                                </Popover>
                               
                                <Button className="ant-btn" loading={loadingStyle} onClick={async() => {
                                    await createPostAPI(JSON.parse(localStorage.getItem('token')).token, createPost)
                                    await setCreatePost({
                                        img: "",
                                        hashtag: "",
                                        content: ""
                                    })
                                    setLoadingStyle(true);
                                    setTimeout(() => {
                                        setLoadingStyle(false);
                                        message.success('Đăng thành công !!!')
                                    }, 2000);
                                }}>
                                    <SendOutlined />
                                    Đăng
                                </Button>
                            </div>
                        </div>
                            : 
                                <></>
                        }
                        { renderPost() }
                    </div>
                </Col>
            </Row>

            <Modal
                title="Chỉnh sửa bài viết"
                visible={showModalUpdatePost}
                onCancel={handleCancel}
                footer=""
                className="modal__update__post"
            >
                <Form
                    {...layout}
                    form={form}
                    name="form__update__post"
                    onFinish={async(data) => {
                        await updatePostAPI(JSON.parse(localStorage.getItem('token')).token, data);
                        await setShowModalUpdatePost(false);
                        await message.success('Chỉnh sửa thành công !!!');
                    }}
                >
                    <Form.Item
                        name="idUpdatePost"
                        hidden
                    >
                    <Form.Item
                        name="idUserUpdatePost"
                        hidden
                    ></Form.Item>
                    <Form.Item
                        name="timeUpdatePost"
                        hidden
                    ></Form.Item>
                    <Form.Item
                        name="likeUpdatePost"
                        hidden
                    ></Form.Item>
                    </Form.Item>
                    <Form.Item
                        label="Nội dung"
                        name="contentUpdatePost"
                    >
                        <Input placeholder="Nhập nội dung bài viết"/>
                    </Form.Item>       
                    <Form.Item
                        label="Hashtag"
                        name="hashTagUpdatePost"
                    >
                        <Input placeholder="Nhập hashtag bài viết"/>
                    </Form.Item>
                    <Form.Item
                        label="Link ảnh"
                        name="imgUpdatePost"
                    >
                        <Input  placeholder="Nhập link ảnh"/>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Chỉnh sửa
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        
            <Modal
                title="Chỉnh sửa bình luận"
                visible={showModalUpdateComment}
                onCancel={handleCancel}
                footer=""
                className="modal__update__comment"
            >
                <Form
                    {...layout}
                    form={form}
                    name="form__update__comment"
                    onFinish={async(data) => {
                        await updateCommentByIdPostAPI(JSON.parse(localStorage.getItem('token')).token, data);
                        await setShowModalUpdateComment(false);
                        await message.success('Chỉnh sửa thành công !!!');
                    }}
                >
                    <Form.Item
                        name="idUpdateComment"
                        hidden
                    >
                    <Form.Item
                        name="idUserUpdateComment"
                        hidden
                    ></Form.Item>
                    <Form.Item
                        name="idPostUpdateComment"
                        hidden
                    ></Form.Item>
                    <Form.Item
                        name="nameUpdateComment"
                        hidden
                    ></Form.Item>
                    </Form.Item>
                    <Form.Item
                        label="Nội dung"
                        name="contentUpdateComment"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng không để trống !!!'
                            }
                        ]}
                    >
                        <Input placeholder="Nhập nội dung bình luận"/>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Chỉnh sửa
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
      
        </div>
    )
}

const mapStateToProps = state => {
    return {
        userLogin: state.userLogin,
        profile: state.profile,
        postList: state.postStore,
        likePost: state.likeStore,
        commentList: state.commentStore
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        getPostAPI: (token, id) => {
            dispatch(action.getPostAPI(token, id));
        },
        createPostAPI: (token, data) => {
            dispatch(action.createPostAPI(token, data));
        },
        deletePostAPI: (token, id) => {
            dispatch(action.deletePostAPI(token, id));
        },
        updatePostAPI: (token, data) => {
            dispatch(action.updatePostAPI(token, data));
        },
        handleLikePostAPI: (token, idPost, idUser) => {
            dispatch(action.handleLikePostAPI(token, idPost, idUser));
        },
        getCommentByIdPostAPI: (idPost) => {
            dispatch(action.getCommentByIdPostAPI(idPost));
        },
        createCommentByIdPostAPI: (token, data) => {
            dispatch(action.createCommentByIdPostAPI(token, data));
        },
        deleteCommentByIdPostAPI: (token, id) => {
            dispatch(action.deleteCommentByIdPostAPI(token, id));
        },
        updateCommentByIdPostAPI: (token, data) => {
            dispatch(action.updateCommentByIdPostAPI(token, data));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WallComponent);