import React, {useEffect} from 'react';

import Logo from "../../images/logo.jpg";
import { Link } from 'react-router-dom';

import WOW from 'wow.js';

export const FooterComponent = () => {

    useEffect(() => {
        new WOW({
            live: false
        }).init();
    },[]);

    return (
        <div className="footer">
            <div className="footer__wrapper">
                <div className="footer__row">
                    <div className="footer__col">
                        <div className="footer__col__item wow flipInX">
                            <Link to="/">
                                <img src={Logo} alt=""/>
                            </Link>
                            <p>Hệ thống đào tạo lập trình phi lợi nhuận, hoàn toàn miễn phí.</p>
                        </div>
                    </div>
                    <div className="footer__col">
                        <div className="footer__col__item wow flipInX">
                            <h1>Danh mục khóa học</h1>
                            <Link to="/course/detail/5f13c51edd95c08d5212ad81">Lập trình ReactJS</Link>
                            <Link to="/course/detail/5f17f5e929b4f01184ca74dc">Lập trình C++</Link>
                            <Link to="/course/detail/5f17f52f29b4f01184ca74db">Lập trình Python</Link>
                            <Link to="/course/detail/5f17f2fd29b4f01184ca74da">Lập trình NodeJS</Link>
                        </div>
                    </div>
                    <div className="footer__col">
                        <div className="footer__col__item wow flipInX">
                            <h1>Nhận tin tức sự kiện & khuyến mãi</h1>
                            <input type="email" placeholder="example@gmail.com"></input>
                            <button>Đăng ký</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};
