import React, { useEffect, useState } from "react";
import Cards from "../../Assets/Cards";
import Dates from "../../Assets/Date";
import logo from "../../Assets/diskominfo.png";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../Components/SideBar/Navbar.css";
import './UserPages.css' // Import file CSS terpisah untuk mengatur layout
import jwt_decode from "jwt-decode";
import axios from "axios";
import { axiosJWTuser } from "../../config/axiosJWT";
import { TabTitle } from "../../TabName";
import { isUnauthorizedError } from "../../config/errorHandling";
import { useLocation, useNavigate } from "react-router-dom";
import load from "../../Assets/Loading_Screen.gif"
import icon from "../../Assets/icon.png"
import "../../Components/SideBar/Navbar.css"

function Tugas() {
  TabTitle("Tugas");
  const [showNav, setShowNav] = useState(true);
  const [cardData, setData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleNavLinkClick = (path) => {
    setActiveLink(path);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ambilid = await axios.get('http://localhost:3000/account/token', {
          headers: {
            'role': "peserta_magang"
          },
        });
        const decoded = jwt_decode(ambilid.data.token);

        const response = await axiosJWTuser.get(
          `http://localhost:3000/user/tugas-list/${decoded.userId}`
        );
        setData(response.data.tugas);
        // console.log(response.data.tugas);
      } catch (error) {
        if (isUnauthorizedError(error)) {
          navigate("/");
        }
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="body-main">
      <div className={`body-area${showNav ? " body-pd" : ""}`}>
      <header className={`header${showNav ? " body-pd" : ""}`}>
          <div className="header_toggle">
            <i
              className={`bi ${showNav ? "bi-x" : "bi-list"}`}
              onClick={() => setShowNav(!showNav)}
            />
          </div>
          <div className="header_img">
            <img
              src={icon}
              alt=""
            />
          </div>
        </header>
        <div className={`l-navbar${showNav ? " show" : ""}`}>
          <nav className="nav">
            <div>
              <a
                href="/user/homepage"
                target="_self"
                className="nav_logo"
              >
                {showNav ? (
                  <img
                    src={logo}
                    alt=""
                    style={{ width: "120px", height: "auto" }}
                  />
                ) : (
                  <i className="bi bi-border-width nav_logo-icon" />
                )}
              </a>
              <div className="nav_list">
              <a href="homepage" target="_self"
                  className={`nav_link ${activeLink === '/user/homepage' ? 'active' : ''}`} 
                  onClick={() => handleNavLinkClick('user/homepage')}>
                  <i className="bi bi-house nav_icon" />
                  <span className="nav_name">Home</span>
                </a>
                <a href="presensi/riwayat" target="_self"
                  className={`nav_link ${activeLink === '/user/presensi/riwayat' ? 'active' : ''}`}
                  onClick={() => handleNavLinkClick('/user/presensi/riwayat')}>
                  <i className="bi bi-card-checklist nav_icon" />
                  <span className="nav_name">History Presensi</span>
                </a>
                <a href="presensi" target="_self"
                  className={`nav_link ${activeLink === '/user/presensi' ? 'active' : ''}`}
                  onClick={() => handleNavLinkClick('/user/presensi')}>
                  <i className="bi bi-camera nav_icon" />
                  <span className="nav_name">Lakukan Presensi</span>
                </a>
                <a href="tugas" target="_self"
                  className={`nav_link ${activeLink === '/user/tugas' ? 'active' : ''}`}
                  onClick={() => handleNavLinkClick('/user/presensi')}>
                  <i className="bi bi-list-task nav_icon" />
                  <span className="nav_name">Penugasan</span>
                </a>
              </div>
            </div>
            <a
              href="/"
              target="_self"
              className="nav_link"
            >
              <i className="bi bi-box-arrow-left nav_icon" />
              <span className="nav_name">SignOut</span>
            </a>
          </nav>
        </div>
        <div className="App">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "end",
            }}
          >
            {" "}
            <Dates />{" "}
          </div>
          <h1 style={{ marginBottom: "16px" }}>Tugas</h1>
          {!cardData ? (
            <img src={load}  alt=""/>
          ) : (
            <div className="card-list">
              {cardData.map((card) => (
                <Cards key={card.id} data={card} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tugas;
