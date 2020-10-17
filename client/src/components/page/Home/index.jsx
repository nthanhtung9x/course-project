import React, { useEffect, useState } from "react";

import WOW from "wow.js";
import Slider from "react-slick";

import Contact from "../../../images/contact.png";

import { connect } from "react-redux";
import { Select, message } from "antd";
import { useHistory } from "react-router-dom";
const { Option } = Select;

const HomeComponent = ({ courses }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    useEffect(() => {
        new WOW({
            live: false,
        }).init();
    }, []);

    const history = useHistory();
    // const handleChange = (value) => {
    //     return history.push(`/course/detail/${value}`);
    // };
    const [type, setType] = useState("");
    const [searchText, setSearchText] = useState("");
    const renderName = (type) => {
        if (type) {
            return courses.map((item, index) => {
                if (
                    item.type.toLowerCase().trim().indexOf(type.toLowerCase().trim()) !==
                    -1
                ) {
                    return (
                        <Option value={item._id} key={index}>
                            {item.name}
                        </Option>
                    );
                }
            });
        }
    };

    const handleChangeType = (value) => {
        setType(value);
    };

    const handleChangeName = (value) => {
        setSearchText(value);
    };

    const handleFindCourse = (e, id) => {
        e.preventDefault();
        if (searchText && type) {
            return history.push(`/course/detail/${id}`);
        }
        return message.error("Vui lòng chọn đầy đủ!");
    };

    // contact
    const [contact, setContact] = useState({
        hoTen: "",
        Email: "",
        soDT: "",
        content: "",
    });

    const handleChange = (e) => {
        let { name, value } = e.target;
        setContact({
            ...contact,
            [name]: value,
        });
    };

    const handleSubmitContact = (e) => {
        e.preventDefault();
        let valid = true;
        for (let key in contact) {
            if (contact[key] === "") {
                valid = false;
                break;
            }
        }

        if (!valid) {
            return message.error("Vui lòng nhập đầy đủ thông tin");
        }
        let subject = `Khách hàng ${contact.hoTen} cần tư vấn qua số điện thoại ${contact.soDT}`;
        let body = `Nội dung: ${contact.content}`;
        window.location.href = `mailto:tcreation.work@gmail.com?subject=${subject}&body=${body}`;
        setContact({
            hoTen: "",
            Email: "",
            soDT: "",
            content: "",
        });
    };

    return (
        <div className="home">
            <div className="welcome">
                <div className="welcome-left wow fadeInLeft">
                    <h1>CHÀO MỪNG ĐẾN VỚI TCREATION</h1>
                    <p>
                        TCREATION cung cấp các khóa học về lập trình với hệ thống hiện đại,
                        hỗ trợ học viên 24/7.Chương trình giảng dạy năng đông, linh hoạt phù
                        hợp với thời đại 4.0 hiện nay.Đặc biệt kết nối học viên với các
                        doanh nghiệp tuyển dụng.
          </p>
                </div>
                <div className="welcome-right wow fadeInRight">
                    <form onSubmit={(e) => handleFindCourse(e, searchText)}>
                        <h4>Tìm kiếm khóa học</h4>
                        <label htmlFor="">Thể Loại</label>
                        <Select
                            placeholder="Chọn loại khóa học"
                            onChange={handleChangeType}
                            notFoundContent="HIỆN CHƯA CÓ KHÓA HỌC"
                        >
                            <Option value="FE">Front-End</Option>
                            <Option value="BE">Back-End</Option>
                            <Option value="Program">Lập trình nhúng</Option>
                            <Option value="Thinking">Lập trình tư duy</Option>
                        </Select>
                        <label htmlFor="">Môn học</label>
                        <Select
                            placeholder="Chọn khóa học"
                            onChange={handleChangeName}
                            notFoundContent="VUI LÒNG CHỌN THỂ LOẠI"
                        >
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
                                <p>
                                    TCREATION sẽ định hướng và đưa ra các lộ trình học lập trình
                                    nhằm phát triển năng lực và niềm đam mê lập trình của bạn.
                </p>
                            </div>
                        </div>
                        <div className="special__col">
                            <div className="special__wrap">
                                <span>
                                    <i className="fab fa-accusoft"></i>
                                </span>
                                <h4>Nền tảng, tư duy, cốt lõi trong lập trình</h4>
                                <p>
                                    TCREATION cung cấp những nền tảng, giá trị tư duy cốt lõi nhất
                                    trong lập trình. Bạn sẽ tự tin trước sự thay đổi của công nghệ
                                    và môi trường làm việc.
                </p>
                            </div>
                        </div>
                        <div className="special__col">
                            <div className="special__wrap">
                                <span>
                                    <i className="fa fa-external-link-alt"></i>
                                </span>
                                <h4>Trao tay chìa khóa thành công toàn diện</h4>
                                <p>
                                    Hướng dẫn viết CV, phỏng vấn. Kết nối doanh nghiệp, gặp gỡ
                                    doanh nghiệp, phỏng vấn cùng doanh nghiệp ngay sau khi tốt
                                    nghiệp.
                </p>
                            </div>
                        </div>
                        <div className="special__col">
                            <div className="special__wrap">
                                <span>
                                    <i className="fa fa-expand-arrows-alt"></i>
                                </span>
                                <h4>Mài giũa bạn qua kinh nghiệm, dự án thực tế</h4>
                                <p>
                                    Đội ngũ Giảng viên và các Mentor là những người dày dạn kinh
                                    nghiệm qua các dự án thực tế tại các công ty lớn sẽ truyền đạt
                                    những kinh nghiệm "máu lửa" cho bạn.
                </p>
                            </div>
                        </div>
                        <div className="special__col">
                            <div className="special__wrap">
                                <span>
                                    <i className="fa fa-users"></i>
                                </span>
                                <h4>Teamwork, Scrum - Agile. Mentor tận tâm</h4>
                                <p>
                                    Bạn sẽ được giao dự án và làm theo Teamwork ngay từ ngày đầu
                                    tiên. Đóng vai trò một thành viên trong qui trình Scrum,
                                    Agile. Được Mentor hỗ trợ tân tâm, nhiệt tình.
                </p>
                            </div>
                        </div>
                        <div className="special__col">
                            <div className="special__wrap">
                                <span>
                                    <i className="fa fa-asterisk"></i>
                                </span>
                                <h4>Công nghệ mới, chuyên sâu, thực tế</h4>
                                <p>
                                    Bạn được học và trải nghiệm các công nghệ lập trình mới nhất,
                                    chuyên sâu, bám sát nhu cầu tuyển dụng thực tế từ doanh
                                    nghiệp.
                </p>
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
                            <img
                                src="https://cybersoft.edu.vn/wp-content/uploads/2019/01/IMG_1410-new.jpg"
                                alt=""
                            />
                        </div>
                        <div className="about__col">
                            <h4>
                                <span>KHƠI DẬY </span>
                đam mê lập trình
              </h4>
                            <p>
                                Hệ thống khóa học được trau chuốt kĩ lưỡng với phương pháp giảng
                                dạy dễ hiểu, xúc tích giúp học viên tiếp thu nhanh chóng.
              </p>
                        </div>
                    </div>

                    <div className="about__row wow slideInUp">
                        <div className="about__col">
                            <h4>
                                <span>SỨ MỆNH </span>
                đào tạo chuyên gia lập trình
              </h4>
                            <p>
                                Hệ thống khóa học được trau chuốt kĩ lưỡng với phương pháp giảng
                                dạy dễ hiểu, xúc tích giúp học viên tiếp thu nhanh chóng.
              </p>
                        </div>
                        <div className="about__col">
                            <img
                                src="https://cybersoft.edu.vn/wp-content/uploads/2019/02/cybersoft-lap-trinh-.jpg"
                                alt=""
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="customer ">
                <div className="customer__wrapper wow slideInUp">
                    <h1>Cảm nhận học viên</h1>
                    <Slider {...settings}>
                        <div className="item">
                            <img
                                src="https://lh3.googleusercontent.com/bENSrjyn3L8aZTNnLeg-21xj3vvPrUXrrxNtSGoD5IPSQaehjO0F7p1z9DJpJfrR0TS6z_s2adnSaqaKuy6cTz6VK87-YlSE_PZrC08lyhuTx3M7o49W3gSzc8gTfwfNRBwXDuOFv-ZiCOQYbM4BKaRmtGPv01bcwwdmmAks-GZYZwFb9etlwVCXxUBwBwoMQiIkcyKqQKAcv0vQJCPE3FdmHTU0vI8PQ6YNwYkt6r483mrVgawjqmiuXT8Wnk5wfBs_ACXirMRh5I3vHKNbWTCmvIRG8ShSZXxlHHO3a5UB4RsOsQ35gI9a1HaN81x76IONsmDt8J1xI40YTioCbCQ_etD7zAzrbKqRJhD3O1FqJ5MByK1RlEY1JfR4I799vQvvJenkWV8Kceo-P-9omfhrVDFwDncyOE8n2iD-EhYV5797Hl1sYSqO3Fh-Y2uLNSkK2OamaO6TlxSr3qZnp0jm3Ws3y8qsOjmiRpTtvIlq0zVPSeQHMn5RHHIGZuvxGSn-OW8x7m2MPSEdogdWZJybZddnCbWxfN2hJZO42H6e6SMKP7g8K02nHnNZrknUlpQIA68oXWkONpsVhbJv1QET4w3s4kMJo1H6W4t3n2x-q81M_Ahj_djmw_E0Ve_I5o5GHp6duqgk-5_6bnkfXgb5nEssC5abAw_ksUOeXrtPyCDmCZ-4ec1v38cx=w899-h903-no?authuser=2"
                                alt=""
                            />
                            <h4>Trương Minh Tiến</h4>
                            <p>
                                "Hệ thống support linh hoạt, hỗ trợ, phản hồi thắc mắc học viên
                                nhanh chóng."
              </p>
                        </div>
                        <div className="item">
                            <img
                                src="https://lh3.googleusercontent.com/FWs8S2TGGjhaHUo2OXmdrVTs3TAQs-yTnyRtCbKrxgSRLG925I-MXCnp_mYHgk-EbwhCIrqVDI7Dn-fQtY0dc4PoDeqOIqIo-maHep9AMBUrbjU9erSSjNPVwBEk462k0VMM2SJTca1q3UIDMhRgOCRzKW5RB2I75m8cChT_x1Wo-CMkCtO3t2p4UyjzJnf-6zj5weiwaeOQw6XuKMErOFlpLgIUmCDaTlUlbnMK3Jb7LkRUTZKez9BddS5GyI5ZrdwxrHRBgT-_56xRg0uVXjKANgz4moDppkkVA6BJfE9f0bBMr06Bxc5r8NwXs6gYfv-lnqAQbStY9QRR_en4yIGflWJAGS1gDBVM0iqJ5M3K4eVR2fPVDWeds9VnLFyz63MPDkUSmEOohxDnOQMC64i6eQnlCyueZrptDGjdy-BHa6O-usMK9IkMxJUWpBVxdLLiVyln-RHWU8BdOUlBkwg43o07Z16cUVF_Z5LsLVQCkc5yTgHUUJaCO5hALAPAumuKZhcgBKzXXRucLujvqlyeRmrWlcRFitIapTbQOax860hvu2US8SmsfK8DWTpyAYigGvnmAV4h7uFjsGcL3gziW4JsWDsc_ZEXaAOdkbB0KBG6xUMCRfFrpKktkEdsmdHYWimBzlOn2wuFPmXN6D8kLETF5v7QfwEVrLqhseK7zecUIUnP0nWtZox5=s903-no?authuser=2"
                                alt=""
                            />
                            <h4>Lương Triều Vỹ</h4>
                            <p>
                                "Các khóa học dễ hiểu, phù hợp với các nhu cầu tuyển dụng ngày
                                nay."
              </p>
                        </div>
                        <div className="item">
                            <img
                                src="https://lh3.googleusercontent.com/5zR1mcvMlw-mbC5V47hjQMytEKnHpGAesf7Ev_hNr3sEZh0AK2s03ub_VOhkmcOuN3IM7hGkbd_HVFwnsO7e6qQq5_HcKMMv9b2lhb4XhhZHGgDvta0JGEMo7PFO12jBHLY94IOYRRJHAPKqzWz2s7vCoiOItl9PD-HkRQ8wANf4fYvWfsrJSDgXTWL-1-22KIM1IeW0vcKT_t23OQZCqZiIxVaL6pI9VSjEGtL7mcbateceQpoxXtqob382VXazRrt1l3_BRRSR7AaEwiUl2i4ng9nIdmek4JVZxUX3_A6JOrI0KmV9-UUXV3g3mg6uNVuXNTV6wJnce2zyCLzmhNehkpANpfUWGDBcjhhNtf-im28idmd-RvOEZfbObUrV-8pd5iZ5ZNO5PqY2pBxuvzGP0ydS_luwDzrl6B3zGipnE3KfJw6To5oqkB4Z8Gb0vbN3Pnov5VjA5jcQ1OXjkoMjR0fqKyt0peUAtjC-u87BPY_73mWM4LVMiWOVbI2tGRsVyTeWHI9Q-43jV-h9_RS5bGxO6Qr_u5dUsbfbOXxpXR-GzgB4Vn7IPuk0zIbIM59cCZ3vOePFMGy0VQHH5xCDk-YqZwmIVP9wKFLzBU0fyQQ9uPmiZ2blSel-RoBvhkTw1yrp3-3Vi2grTeOqA1iSrxoM_B1ihuuLphQ3tsAEYXBSZqvt7gNlwTLu=w1030-h903-no?authuser=2"
                                alt=""
                            />
                            <h4>Lê Minh Toàn</h4>
                            <p>
                                "Nhờ các khóa học mà em bổ sung được nhiều kiến thức phù hợp xu
                                hướng hiện nay."
              </p>
                        </div>
                        <div className="item">
                            <img
                                src="https://lh3.googleusercontent.com/pw/ACtC-3e_C59KurjEU5UC9EvRUJ1D_6IOEHAgeIlB6hjnbMxHO4IdhNoCMI8PARM58YJSs5hDfVqmu3UMCPc0YHjHc3Z6irhYPyDhPft9-XF7a0Z5zB29IMAMI2oBdnmTVByCQb7VXI3q0P9O5LvRKNnXy5E=w778-h903-no?authuser=0"
                                alt=""
                            />
                            <h4>Trần Đại Chí</h4>
                            <p>
                                "Nhờ các khóa học mà em bổ sung được nhiều kiến thức phù hợp xu
                                hướng hiện nay."
              </p>
                        </div>
                    </Slider>
                </div>
            </div>
            <div className="contact">
                <div className="contact__wrapper">
                    <div className="contact__wrapper-left wow rotateInUpLeft">
                        <img src={Contact} alt="" />
                    </div>
                    <div className="contact__wrapper-right wow rotateInUpRight">
                        <form onSubmit={handleSubmitContact}>
                            <h1>LIÊN HỆ TƯ VẤN</h1>
                            <hr />
                            <div className="form-group">
                                <span>
                                    <i className="fa fa-user-alt"></i>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Họ và tên *"
                                    name="hoTen"
                                    value={contact.hoTen}
                                    onChange={handleChange}
                                ></input>
                            </div>
                            <div className="form-group">
                                <span>
                                    <i className="fa fa-envelope"></i>
                                </span>
                                <input
                                    type="email"
                                    placeholder="Email liên hệ *"
                                    name="Email"
                                    value={contact.Email}
                                    onChange={handleChange}
                                ></input>
                            </div>
                            <div className="form-group">
                                <span>
                                    <i className="fa fa-phone"></i>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Điện thoại liên hệ *"
                                    name="soDT"
                                    value={contact.soDT}
                                    onChange={handleChange}
                                ></input>
                            </div>
                            <div className="form-group">
                                <textarea
                                    rows="10"
                                    placeholder="Bạn cần tư vấn thêm về chương trình, vui lòng để lại tin nhắn tại đây..."
                                    name="content"
                                    value={contact.content}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                            <button type="submit">ĐĂNG KÝ TƯ VẤN</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        courses: state.courses,
    };
};

export default connect(mapStateToProps)(HomeComponent);
