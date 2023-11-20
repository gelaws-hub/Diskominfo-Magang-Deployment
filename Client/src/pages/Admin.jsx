import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../Assets/diskominfo.png';
import './Adminstyle.css';
import { Button, Modal, Form } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { TabTitle } from '../TabName';
import { axiosJWTadmin } from '../config/axiosJWT';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditAdmin from '../Components/Admin/EditAdmin';
import icon from "../Assets/icon.png";
import "../Components/SideBar/Navbar.css"

export const Admin = () => {
    TabTitle('Admin');
    const [admins, setAdmins] = useState([]);
    const [showNav, setShowNav] = useState(true);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [adminsPerPage] = useState(20);
    const maxPageButtons = 5;

    const [editingAdminId, setEditingAdminId] = useState(null);
    const [showEditAdminModal, setShowEditAdminModal] = useState(false);

    const indexOfLastAdmin = currentPage * adminsPerPage;
    const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;

    const location = useLocation();
    const [activeLink, setActiveLink] = useState(location.pathname);

    const handleNavLinkClick = (path) => {
        setActiveLink(path);
    };

    const totalPages = Math.ceil(admins.length / adminsPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const getRenderedPageNumbers = () => {
        if (totalPages <= maxPageButtons) {
            return pageNumbers;
        }

        const halfButtons = Math.floor(maxPageButtons / 2);
        let startPage = Math.max(currentPage - halfButtons, 1);
        let endPage = startPage + maxPageButtons - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(endPage - maxPageButtons + 1, 1);
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    const handleOpenEditAdminModal = (adminId) => {
        setEditingAdminId(adminId);
        setShowEditAdminModal(true);
    };

    const [formData, setFormData] = useState({
        nama: "",
        username: "",
        password: "",
    });

    const handleCloseModal = () => {
        setEditingAdminId(null);
        setShowEditAdminModal(false);
    };

    const showSuccessNotification = (message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
        });
    };

    const showErrorNotification = (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
        });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCloseTaskForm = () => {
        setShowTaskForm(false);
    };

    const handleShowTaskForm = () => {
        setShowTaskForm(true);
    };

    const filteredAdmins = admins.filter(admin =>
        admin.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        getAdmin();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const exportAdmin = async () => {
        try {
            const response = await axiosJWTadmin.get("http://localhost:3000/admin/export-admin", {
                responseType: 'arraybuffer'
            });
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Admins.xlsx';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            navigate('/');
        }
    }

    const getAdmin = async () => {
        try {
            const response = await axiosJWTadmin.get('http://localhost:3000/admin/show-admin');
            setAdmins(response.data.admin);
        } catch (error) {
            navigate('/');
        }
    };

    const updateAdminData = (updatedAdminData) => {
        setAdmins((prevAdmins) =>
            prevAdmins.map((admin) =>
                admin.id === updatedAdminData.id ? updatedAdminData : admin
            )
        );
    };

    const saveAdmin = async (e) => {
        e.preventDefault();
        try {
            await axiosJWTadmin.post("http://localhost:3000/admin/add-admin", formData);
            getAdmin();
            setShowTaskForm(false);
            showSuccessNotification("Pengguna berhasil ditambahkan.");
        } catch (error) {
            navigate("/");
            showErrorNotification("Gagal menambahkan pengguna.");
            console.log(error);
        }
    };

    const displayedAdmins = filteredAdmins.slice(indexOfFirstAdmin, indexOfLastAdmin);

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
                                href="/homepage"
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
                                <a
                                    href="homepage"
                                    target="_self"
                                    className={`nav_link ${activeLink === '/homepage' ? 'active' : ''}`}
                                    onClick={() => handleNavLinkClick('homepage')}
                                >
                                    <i className="bi bi-house nav_icon" />
                                    <span className="nav_name">Home</span>
                                </a>
                                <a
                                    href="admin"
                                    target="_self"
                                    className={`nav_link ${activeLink === '/admin' ? 'active' : ''}`}
                                    onClick={() => handleNavLinkClick('admin')}
                                >
                                    <i className="bi bi-person-check-fill nav_icon" />
                                    <span className="nav_name">Admin</span>
                                </a>
                                <a
                                    href="peserta"
                                    target="_self"
                                    className={`nav_link ${activeLink === '/peserta' ? 'active' : ''}`}
                                    onClick={() => handleNavLinkClick('peserta')}
                                >
                                    <i className="bi bi-person nav_icon" />
                                    <span className="nav_name">Peserta</span>
                                </a>
                                <a
                                    href="presensi"
                                    target="_self"
                                    className={`nav_link ${activeLink === '/presensi' ? 'active' : ''}`}
                                    onClick={() => handleNavLinkClick('presensi')}
                                >
                                    <i className="bi bi-person-check nav_icon" />
                                    <span className="nav_name">Presensi Magang</span>
                                </a>
                                <a
                                    href="penugasan"
                                    target="_self"
                                    className={`nav_link ${activeLink === '/penugasan' ? 'active' : ''}`}
                                    onClick={() => handleNavLinkClick('penugasan')}
                                >
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
                <div className="pb-4">
                    <div className="columns mt-5">
                        <div className="column">
                            <div className="info-admin-magang" style={{ display: "flex", justifyContent: "space-between" }}>
                                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 25, marginBottom: 20 }}>Admin</p>
                                <p className='count-admin' style={{ textAlign: 'center' }}>Jumlah Admin: {searchTerm === "" ? admins.length : filteredAdmins.length} Admin</p>
                            </div>
                            <div className="search-peserta" style={{ display: "flex", justifyContent: "space-between" }}>
                                <button
                                    onClick={handleShowTaskForm}
                                    className="button is-success"
                                >
                                    Tambah Admin
                                </button>
                                <div style={{ position: "relative" }}>
                                    <input
                                        type="text"
                                        placeholder="Cari Admin..."
                                        onChange={handleSearch}
                                        style={{
                                            padding: "10px",
                                            borderRadius: "5px",
                                            border: "1px solid #ccc",
                                            fontSize: "16px",
                                            width: "100%",
                                            maxWidth: "300px",
                                            margin: "10px 0",
                                        }}
                                    />
                                    <i className="bi bi-search" style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)" }}></i>
                                </div>
                            </div>
                            <div className='table-container'>
                                <table className="custom-table">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Nama</th>
                                            <th>Username</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedAdmins.map((admin, index) => (
                                            <tr key={admin.id}>
                                                <td>{index + 1}</td>
                                                <td>{admin.nama}</td>
                                                <td>{admin.username}</td>
                                                <td>
                                                    <button
                                                        className="button is-small is-info"
                                                        onClick={() => handleOpenEditAdminModal(admin.id)}
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <EditAdmin adminId={editingAdminId} handleCloseModal={handleCloseModal} showEditAdminModal={showEditAdminModal} updateAdminData={updateAdminData} />
                            </div>
                            <div className="pagination-admin" style={{ marginTop: 10 }}>
                                <ul className="pagination-list-admin">
                                    <li className="pagination-item">
                                        <button
                                            onClick={() => paginate(currentPage - 1)}
                                            className={`pagination-link ${currentPage === 1 ? 'is-disabled' : ''}`}
                                        >
                                            Previous
                                        </button>
                                    </li>
                                    {getRenderedPageNumbers().map((number) => (
                                        <li key={number} className="pagination-item">
                                            <button
                                                onClick={() => paginate(number)}
                                                className={`pagination-link ${number === currentPage ? 'is-current' : ''}`}
                                            >
                                                {number}
                                            </button>
                                        </li>
                                    ))}
                                    <li className="pagination-item">
                                        <button
                                            onClick={() => paginate(currentPage + 1)}
                                            className={`pagination-link ${currentPage === totalPages ? 'is-disabled' : ''}`}
                                        >
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <button onClick={exportAdmin} className="export-button button is-success">Export to Excel</button>
                        </div>
                    </div>
                </div>
            </div>

            <EditAdmin adminId={editingAdminId} />

            <Modal
                show={showTaskForm}
                onHide={handleCloseTaskForm}
                backdrop="static"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
                dialogClassName="modal-dialog-centered"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Tambah Admin</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={saveAdmin}>
                        <Form.Group controlId="formTaskNama">
                            <Form.Label>Nama</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Masukkan nama"
                                value={formData.nama}
                                onChange={(e) =>
                                    setFormData({ ...formData, nama: e.target.value })
                                }
                            />
                        </Form.Group>

                        <Form.Group controlId="formTaskUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Masukkan username"
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({ ...formData, username: e.target.value })
                                }
                            />
                        </Form.Group>

                        <Form.Group controlId="formTaskPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Masukkan password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseTaskForm}>
                        Batal
                    </Button>
                    <Button variant="primary" onClick={saveAdmin}>
                        Simpan
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Admin;