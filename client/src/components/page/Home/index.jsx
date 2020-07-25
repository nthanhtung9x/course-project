import React, { useEffect, useState } from 'react';

import WOW from 'wow.js';
import Slider from "react-slick";

import Contact from '../../../images/contact.png';

import {connect} from 'react-redux';
import { Select, message } from 'antd';
import { useHistory } from 'react-router-dom';
const { Option } = Select;

const HomeComponent = ({ courses }) => {
    
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3
    };

    useEffect(() => {
        new WOW({
            live: false
        }).init();
    },[]);



    const history = useHistory();
    // const handleChange = (value) => {
    //     return history.push(`/course/detail/${value}`);
    // };
    const [type, setType] = useState("");
    const [searchText, setSearchText] = useState("");
    const renderName = (type) => {
        if(type) {
            return courses.map((item, index) => {
                if(item.type.toLowerCase().trim().indexOf(type.toLowerCase().trim()) !== -1) {
                    return <Option value={item._id} key={index}>{item.name}</Option>
                }
            })
        }
    };

    const handleChangeType = (value) => {
        setType(value);
    };

    const handleChangeName = (value) => {
        setSearchText(value);
    };

    const handleFindCourse = (e,id) => {
        e.preventDefault();
        if(searchText && type) {
            return history.push(`/course/detail/${id}`)
        }
        return message.error('Vui lòng chọn đầy đủ!');
    };

    return (
        <div className="home">
            <div className="welcome">
                <div className="welcome-left wow fadeInLeft">
                    <h1>CHÀO MỪNG ĐẾN VỚI TCREATION</h1>
                    <p>
                        TCREATION cung cấp các khóa học về lập trình với hệ thống hiện đại, hỗ trợ học viên 24/7.Chương trình giảng dạy năng đông, linh hoạt phù hợp với thời đại 4.0 hiện nay.Đặc biệt kết nối học viên với các doanh nghiệp tuyển dụng.
                    </p>
                </div>
                <div className="welcome-right wow fadeInRight">
                    <form onSubmit={(e) => handleFindCourse(e,searchText)}>
                        <h4>Tìm kiếm khóa học</h4>
                        <label htmlFor="">Thể Loại</label>
                        <Select placeholder="Chọn loại khóa học" onChange={handleChangeType}>
                            <Option value="FE">Front-End</Option>
                            <Option value="BE">Back-End</Option>
                            <Option value="Program">Lập trình nhúng</Option>
                            <Option value="Thinking">Lập trình tư duy</Option>
                        </Select>
                        <label htmlFor="">Môn học</label>
                        <Select placeholder="Chọn khóa học" onChange={handleChangeName}>
                            {renderName(type)}
                        </Select>
                        <button type="submit">Tìm Kiếm</button>
                    </form>
                </div>
            </div>
            <div className="special">
                <div className="special-bg wow zoomIn">
                    <h1>Điểm nổi bật của TCREATION</h1>
                    <div className="special__row">
                        <div className="special__col">
                            <div className="special__wrap">
                                <span>
                                    <i className="fa fa-thumbs-up"></i>
                                </span>
                                <h4>Học có lộ trình, định hướng cụ thể</h4>
                                <p>TCREATION sẽ định hướng và đưa ra các lộ trình học lập trình nhằm phát triển năng lực và niềm đam mê lập trình của bạn.</p>
                            </div>
                        </div>
                        <div className="special__col">
                            <div className="special__wrap">
                                <span>
                                <i className="fab fa-accusoft"></i>
                                </span>
                                <h4>Nền tảng, tư duy, cốt lõi trong lập trình</h4>
                                <p>TCREATION cung cấp những nền tảng, giá trị tư duy cốt lõi nhất trong lập trình. Bạn sẽ tự tin trước sự thay đổi của công nghệ và môi trường làm việc.</p>
                            </div>
                        </div>
                        <div className="special__col">
                            <div className="special__wrap">
                                <span>
                                    <i className="fa fa-external-link-alt"></i>
                                </span>
                                <h4>Trao tay chìa khóa thành công toàn diện</h4>
                                <p>Hướng dẫn viết CV, phỏng vấn. Kết nối doanh nghiệp, gặp gỡ doanh nghiệp, phỏng vấn cùng doanh nghiệp ngay sau khi tốt nghiệp.</p>
                            </div>
                        </div>
                        <div className="special__col">
                            <div className="special__wrap">
                                <span>
                                    <i className="fa fa-expand-arrows-alt"></i>
                                </span>
                                <h4>Mài giũa bạn qua kinh nghiệm, dự án thực tế</h4>
                                <p>Đội ngũ Giảng viên và các Mentor là những người dày dạn kinh nghiệm qua các dự án thực tế tại các công ty lớn sẽ truyền đạt những kinh nghiệm "máu lửa" cho bạn.</p>
                            </div>
                        </div>
                        <div className="special__col">
                            <div className="special__wrap">
                                <span>
                                    <i className="fa fa-users"></i>
                                </span>
                                <h4>Teamwork, Scrum - Agile. Mentor tận tâm</h4>
                                <p>Bạn sẽ được giao dự án và làm theo Teamwork ngay từ ngày đầu tiên. Đóng vai trò một thành viên trong qui trình Scrum, Agile. Được Mentor hỗ trợ tân tâm, nhiệt tình.</p>
                            </div>
                        </div>
                        <div className="special__col">
                            <div className="special__wrap">
                                <span>
                                    <i className="fa fa-asterisk"></i>
                                </span>
                                <h4>Công nghệ mới, chuyên sâu, thực tế</h4>
                                <p>Bạn được học và trải nghiệm các công nghệ lập trình mới nhất, chuyên sâu, bám sát nhu cầu tuyển dụng thực tế từ doanh nghiệp.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="about">
                <div className="about__wrapper">
                    <h1>GIỚI THIỆU VỀ TCREATION</h1>
                    <div className="about__row wow slideInUp">
                        <div className="about__col">
                            <img src="https://scontent.fsgn2-1.fna.fbcdn.net/v/t1.0-9/81466641_1544934908997251_7312469481169616896_o.jpg?_nc_cat=105&_nc_sid=dd9801&_nc_oc=AQlgUtEuIOVBEQtafXTC8cXhlps-JGmrCqYaExmDDa1lIdDYyASuUrGOTHqb_kgyqR04Cih4QsJCvUo_cudp7J7p&_nc_ht=scontent.fsgn2-1.fna&oh=d5953b2c4d5f74a628b38098044ceeed&oe=5F2CA20D" alt=""/>
                        </div>
                        <div className="about__col">
                            <h4>
                                <span>KHƠI DẬY</span>
                                đam mê lập trình
                            </h4>
                            <p>Hệ thống khóa học được trau chuốt kĩ lưỡng với phương pháp giảng dạy dễ hiểu, xúc tích giúp học viên tiếp thu nhanh chóng.</p> 
                        </div>
                    </div>

                    <div className="about__row wow slideInUp">
                        <div className="about__col">
                            <h4>
                                <span>SỨ MỆNH</span>
                                đào tạo chuyên gia lập trình
                            </h4>
                            <p>Hệ thống khóa học được trau chuốt kĩ lưỡng với phương pháp giảng dạy dễ hiểu, xúc tích giúp học viên tiếp thu nhanh chóng.</p> 
                        </div>
                        <div className="about__col">
                            <img src="https://cybersoft.edu.vn/wp-content/uploads/2019/02/cybersoft-lap-trinh-.jpg" alt=""/>
                        </div>
                    </div>    
                </div>
            </div>
            <div className="customer ">
                <div className="customer__wrapper wow slideInUp">
                    <h1>Cảm nhận học viên</h1>
                    <Slider {...settings}>
                    <div className="item">
                        <img src="https://scontent.fsgn2-3.fna.fbcdn.net/v/t1.0-9/106265144_948046725655679_5143631993035164012_n.jpg?_nc_cat=108&_nc_sid=85a577&_nc_oc=AQl7T7YYT7dV7_HqSouivZQ46-L5IDGw9YKtHGPJzWPXdSW2EHR7ly0a68SKB_7X69caNOb5Y0v_9zwjaUwMSUb6&_nc_ht=scontent.fsgn2-3.fna&oh=81bc9fe7cf4a2d7b1c5186259f992cfb&oe=5F2DD44E" alt=""/>
                        <h4>Trương Minh Tiến</h4>
                        <p>"Hệ thống support linh hoạt, hỗ trợ, phản hồi thắc mắc học viên nhanh chóng."</p>
                    </div>
                    <div className="item">
                        <img src="https://scontent.fsgn2-3.fna.fbcdn.net/v/t1.0-9/84324918_1324934517690272_2715086206349082624_n.jpg?_nc_cat=108&_nc_sid=85a577&_nc_oc=AQkArQPCDDiWc-ubHgu6oy99UiVn29D879305uGXLyWeDHLUrxVoWEp6CJ7Ic2lJyPWktpje4e_TXOdtr4HS0De_&_nc_ht=scontent.fsgn2-3.fna&oh=588584efad5b8e36cf67f865ee91ab1b&oe=5F2C937A" alt=""/>
                        <h4>Nguyễn Thế Vương</h4>
                        <p>"Các khóa học dễ hiểu, phù hợp với các nhu cầu tuyển dụng ngày nay."</p>
                    </div>
                    <div className="item">
                        <img src="https://scontent.fsgn2-5.fna.fbcdn.net/v/t1.0-9/p720x720/107496691_2727043327532783_2639331551042149083_o.jpg?_nc_cat=106&_nc_sid=85a577&_nc_oc=AQntZiHpoJABfKs-A_fY_BehvCTTgqP-K86NPYjuHcsHBPjL4yM_tJvGA0c02GAB2WWlba7w3iNOuYDQ6YESvaFY&_nc_ht=scontent.fsgn2-5.fna&_nc_tp=6&oh=017726c16dc0fc0c9a09c4c9666f4520&oe=5F2C3DD7" alt=""/>
                        <h4>Trần Quang Vinh</h4>
                        <p>"Nhờ các khóa học mà em bổ sung được nhiều kiến thức phù hợp xu hướng hiện nay."</p>
                    </div>
                    <div className="item">
                        <img src="https://scontent.fsgn2-5.fna.fbcdn.net/v/t1.0-9/p720x720/107496691_2727043327532783_2639331551042149083_o.jpg?_nc_cat=106&_nc_sid=85a577&_nc_oc=AQntZiHpoJABfKs-A_fY_BehvCTTgqP-K86NPYjuHcsHBPjL4yM_tJvGA0c02GAB2WWlba7w3iNOuYDQ6YESvaFY&_nc_ht=scontent.fsgn2-5.fna&_nc_tp=6&oh=017726c16dc0fc0c9a09c4c9666f4520&oe=5F2C3DD7" alt=""/>
                        <h4>Trần Quang Vinh</h4>
                        <p>"Nhờ các khóa học mà em bổ sung được nhiều kiến thức phù hợp xu hướng hiện nay."</p>
                    </div>
                </Slider>
                </div>
            </div>  
            <div className="contact">
                <div className="contact__wrapper">
                    <div className="contact__wrapper-left wow rotateInUpLeft">
                        <img src={Contact} alt=""/>
                    </div>
                    <div className="contact__wrapper-right wow rotateInUpRight">
                        <form>
                            <h1>LIÊN HỆ TƯ VẤN</h1>
                            <hr/>
                            <div className="form-group">
                                <span>
                                    <i className="fa fa-user-alt"></i>
                                </span>
                                <input type="text" placeholder="Họ và tên *"></input>
                            </div>
                            <div className="form-group">
                                <span>
                                    <i className="fa fa-envelope"></i>
                                </span>
                                <input type="text" placeholder="Email liên hệ *"></input>
                            </div>
                            <div className="form-group">
                                <span>
                                    <i className="fa fa-phone"></i>
                                </span>
                                <input type="text" placeholder="Điện thoại liên hệ *"></input>
                            </div>
                            <div className="form-group">
                                <textarea rows="10" placeholder="Bạn cần tư vấn thêm về chương trình, vui lòng để lại tin nhắn tại đây..."></textarea>
                            </div>
                            <button type="submit">ĐĂNG KÝ TƯ VẤN</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
};

const mapStateToProps = state => {
    return {
        courses: state.courses
    }
}

export default connect(mapStateToProps)(HomeComponent);
