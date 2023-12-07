import React from 'react'
import logo from "../Image/logo.jpeg";
import gp from "../Image/gp.png";
import ap from "../Image/apimg.png";

 const Footer = () => {
  return (
    <>
    <div className="footer" id="footer-id">
              <div className="container">
                      <div className="row">
                              <div className="footer-col-1">
                                      <h3>Tải ứng dụng</h3>
                                       <p>Tải ứng dụng cho Android và IOS Mobile Phone.</p>
                                       <div className={logo}>
                                        <img src={gp} alt="" style={{width:"150px"}}/>
                                        <img src={ap} alt=""  style={{width:"150px"}}/>
                                </div>      
                              </div>
                 
                <div className="footer-col-3">
                                <h3>Các liên kết</h3>
                                <ul>
                                        <li>Coupons</li>
                                        <li>Blog Post</li>
                                        <li>Return Policy</li>
                                        <li>Join Affiliates</li>
                                </ul>
                        </div>
                <div className="footer-col-4">
                                        <h3>Về chúng tôi</h3>
                                        <ul>
                                                <li>Facebook</li>
                                                <li>Twitter</li>
                                                <li>Instagram</li>
                                                <li>YouTube</li>
                                        </ul>
                        
                                </div>            
                     
              </div>
              <hr/>
              <p className="copyright">&#169; Copyright 2023- Nothing group</p>
      </div>
      </div>
    </>
  )
}
export default Footer;