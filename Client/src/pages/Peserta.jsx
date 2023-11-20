import { axiosJWTadmin } from "../config/axiosJWT";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import logo from "../Assets/diskominfo.png";
import "./Peserta.css";
import { Button, Modal, Form, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../Components/SideBar/Navbar.css"
import { TabTitle } from "../TabName";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditUser from "../Components/Admin/EditUser";
import icon from "../Assets/icon.png"

export const Peserta = () => {
  TabTitle("Peserta");
  const [users, setUsers] = useState([]);
  const [showNav, setShowNav] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20);
  const maxPageButtons = 5;
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const [presensiData, setPresensiData] = useState([]);
  const [showPresensiModal, setShowPresensiModal] = useState(false);
  const [selectedPesertaId, setSelectedPesertaId] = useState(null);
  const [selectedPesertaName, setSelectedPesertaName] = useState("");
  const [showEditUserModal, setShowEditUserModal] = useState(false);

  const [editingUserId, setEditingUserId] = useState(null);

  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleNavLinkClick = (path) => {
    setActiveLink(path);
  };

  const handleOpenEditUserModal = (userId) => {
    setEditingUserId(userId);
    setShowEditUserModal(true);
  };

  const handleCloseUserModal = () => {
    setShowEditUserModal(false);
  };

  const getPresensiPeserta = async (id) => {
    try {
      const pesertaResponse = await axiosJWTadmin.get(
        `http://localhost:3000/admin/peserta/${id}`
      );
      const pesertaName = pesertaResponse.data.peserta_magang.nama;
      setSelectedPesertaName(pesertaName);
      const presensiResponse = await axiosJWTadmin.get(
        `http://localhost:3000/admin/peserta/${id}/presensi`
      );
      setPresensiData(presensiResponse.data.presensi);
    } catch (error) {
      navigate("/");
      console.error(error);
    }
  };

  const handleShowPresensiModal = (id) => {
    setSelectedPesertaId(id);
    getPresensiPeserta(id);
    setShowPresensiModal(true);
  };

  const handleClosePresensiModal = () => {
    setShowPresensiModal(false);
  };

  const updateUser = (updatedUser) => {
    const updatedUsers = users.map((user) => {
      if (user.id === updatedUser.id) {
        return updatedUser;
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const totalPages = Math.ceil(users.length / usersPerPage);
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

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const [formData, setFormData] = useState({
    nama: "",
    asal_univ: "",
    asal_jurusan: "",
    tanggal_mulai: null,
    tanggal_selesai: null,
    status_aktif: true,
    username: "",
    password: "",
  });

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

  const getUsers = async (category) => {
    try {
      let endpoint;
      switch (category) {
        case "aktif":
          endpoint = "peserta-aktif";
          break;
        case "alumni":
          endpoint = "peserta-alumni";
          break;
        case "calon":
          endpoint = "peserta-calon";
          break;
        default:
          endpoint = "peserta";
      }

      const response = await axiosJWTadmin.get(
        `http://localhost:3000/admin/${endpoint}`
      );

      setUsers(response.data.peserta_magang);
      setActiveCategory(category);
    } catch (error) {
      navigate("/");
      console.log(error);
    }
  };

  const exportPeserta = async () => {
    try {
      const response = await axiosJWTadmin.get(
        "http://localhost:3000/admin/export-peserta",
        {
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Peserta.xlsx";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      navigate("/");
    }
  };

  const exportPesertaAktif = async () => {
    try {
      const response = await axiosJWTadmin.get(
        "http://localhost:3000/admin/export-peserta-aktif",
        {
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Peserta Aktif.xlsx";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      navigate("/");
    }
  };

  const exportPesertaAlumni = async () => {
    try {
      const response = await axiosJWTadmin.get(
        "http://localhost:3000/admin/export-peserta-alumni",
        {
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Alumni.xlsx";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      navigate("/");
    }
  };

  const exportPesertaCalon = async () => {
    try {
      const response = await axiosJWTadmin.get(
        "http://localhost:3000/admin/export-peserta-calon",
        {
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Alumni.xlsx";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      navigate("/");
    }
  };

  const exportPresensiPerPeserta = async (id) => {
    try {
      const response = await axiosJWTadmin.get(
        `http://localhost:3000/admin/export-presensi-peserta/${id}`,
        {
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Presensi Peserta.xlsx";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      navigate("/");
    }
  };

  const filteredUsers = users.filter((admin) =>
    admin.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setIsLoading(true);
    getUsers(activeCategory)
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);


  const deleteUser = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      try {
        await axiosJWTadmin.delete(
          `http://localhost:3000/admin/peserta/${id}/delete`
        );
        getUsers();
        showSuccessNotification("Pengguna berhasil dihapus.");
      } catch (error) {
        navigate("/");
        showErrorNotification("Gagal menghapus pengguna.");
        console.log(error);
      }
    }
  };

  const saveUser = async (e) => {
    e.preventDefault();
    try {
      await axiosJWTadmin.post("http://localhost:3000/admin/peserta/add", formData);
      getUsers();
      setShowTaskForm(false);
      showSuccessNotification("Pengguna berhasil ditambahkan.");
    } catch (error) {
      navigate("/");
      showErrorNotification("Gagal menambahkan pengguna.");
      console.log(error);
    }
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

  const formatDateTime = (dateTime) => {
    if (!dateTime) {
      return "-";
    }

    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateTime).toLocaleDateString("en-US", options);

    const timeOptions = { hour: "2-digit", minute: "2-digit" };
    const time = new Date(dateTime).toLocaleTimeString("en-US", timeOptions);

    return `${date} ${time}`;
  };

  const renderedPageNumbers = getRenderedPageNumbers();

  const displayedUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

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
            <img src={icon} alt="" />
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
              <div
                className="info-peserta-magang"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 25,
                    marginBottom: 20,
                  }}
                >
                  Peserta
                </p>
                <p className="count-peserta" style={{ textAlign: "center" }}>
                  Jumlah Peserta:{" "}
                  {searchTerm === "" ? users.length : filteredUsers.length}{" "}
                  Peserta
                </p>
              </div>
              <div
                className="search-peserta"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <button
                  onClick={handleShowTaskForm}
                  className="button is-success"
                  style={{ marginTop: 18 }}
                >
                  Tambah Peserta
                </button>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="Cari Peserta..."
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
                  <i
                    className="bi bi-search"
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  ></i>
                </div>
              </div>
              <div className="category-buttons">
                <button
                  onClick={() => getUsers("all")}
                  className={`button is-danger ${activeCategory === "all" ? "active" : ""}`}
                >
                  Semua Peserta
                </button>
                <button
                  onClick={() => getUsers("aktif")}
                  className={`button is-danger ${activeCategory === "aktif" ? "active" : ""}`}
                >
                  Peserta Aktif
                </button>
                <button
                  onClick={() => getUsers("alumni")}
                  className={`button is-danger ${activeCategory === "alumni" ? "active" : ""}`}
                >
                  Peserta Alumni
                </button>
                <button
                  onClick={() => getUsers("calon")}
                  className={`button is-danger ${activeCategory === "calon" ? "active" : ""}`}
                >
                  Peserta Calon
                </button>
              </div>
              <div className="table-container-peserta">
                <table className="custom-table-peserta">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama</th>
                      <th>Universitas</th>
                      <th>Jurusan</th>
                      <th>Tanggal Mulai</th>
                      <th>Tanggal Selesai</th>
                      <th>Status Aktif</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan="8">Loading...</td>
                      </tr>
                    ) : (
                      displayedUsers.map((user, index) => (
                        <tr key={user.id}>
                          <td>{index + 1}</td>
                          <td>
                            <span
                              style={{ cursor: "pointer", color: "blue" }}
                              onClick={() => handleShowPresensiModal(user.id)}
                            >
                              {user.nama}
                            </span>
                          </td>
                          <td>{user.asal_univ}</td>
                          <td>{user.asal_jurusan}</td>
                          <td>{user.tanggal_mulai}</td>
                          <td>{user.tanggal_selesai}</td>
                          <td>{user.status_aktif ? "Aktif" : "Tidak Aktif"}</td>
                          <td>
                            <button
                              className="button is-small is-info"
                              style={{ minWidth: "60px" }}
                              onClick={() => handleOpenEditUserModal(user.id)}
                            >
                              Edit
                            </button>
                            <button
                              style={{ minWidth: "60px" }}
                              onClick={() => deleteUser(user.id)}
                              className="button is-small is-danger"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <EditUser
                  userId={editingUserId}
                  handleCloseModal={() => handleCloseUserModal()}
                  showEditUserModal={showEditUserModal}
                  updateUserData={updateUser}
                />
              </div>
              <div className="pagination-peserta">
                <ul className="pagination-list-peserta">
                  <li className="pagination-item">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      className={`pagination-link ${currentPage === 1 ? "is-disabled" : ""
                        }`}
                    >
                      Previous
                    </button>
                  </li>
                  {renderedPageNumbers.map((number) => (
                    <li key={number} className="pagination-item">
                      <button
                        onClick={() => paginate(number)}
                        className={`pagination-link ${number === currentPage ? "is-current" : ""
                          }`}
                      >
                        {number}
                      </button>
                    </li>
                  ))}
                  <li className="pagination-item">
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      className={`pagination-link ${currentPage === totalPages ? "is-disabled" : ""
                        }`}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </div>
              <div className="peserta-container-bottom">
                <button
                  onClick={exportPeserta}
                  className="export-button button is-success"
                >
                  Export Semua Peserta
                </button>
                <button
                  onClick={exportPesertaAktif}
                  className="export-button button is-success"
                >
                  Export Peserta Aktif
                </button>
              </div>
              <div className="peserta-container-bottom">
                <button
                  onClick={exportPesertaAlumni}
                  className="export-button button is-success"
                >
                  Export Alumni
                </button>
                <button
                  onClick={exportPesertaCalon}
                  className="export-button button is-success"
                >
                  Export Calon
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={showPresensiModal}
        onHide={handleClosePresensiModal}
        backdrop="static"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
        dialogClassName="modal-dialog-centered"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedPesertaName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Jam Masuk</th>
                <th>Jam Keluar</th>
              </tr>
            </thead>
            <tbody>
              {presensiData ? (
                presensiData.map((presensi, index) => (
                  <tr key={index}>
                    <td>{formatDateTime(presensi.tanggal)}</td>
                    <td>{formatDateTime(presensi.check_in)}</td>
                    <td>{formatDateTime(presensi.check_out)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No presensi data available.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePresensiModal}>
            Tutup
          </Button>
          {presensiData ? (
            <Button
              variant="success"
              onClick={() => exportPresensiPerPeserta(selectedPesertaId)}
            >
              Export Presensi
            </Button>
          ) : null}
        </Modal.Footer>
      </Modal>

      <Modal
        show={showTaskForm}
        onHide={handleCloseTaskForm}
        backdrop="static"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
        dialogClassName="modal-dialog-centered"
      >
        <Modal.Header closeButton>
          <Modal.Title>Tambah Peserta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={saveUser}>
            <Form.Group controlId="formTaskTitle">
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
            <Form.Group controlId="formTaskDescription">
              <Form.Label>Universitas</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan universitas"
                value={formData.asal_univ}
                onChange={(e) =>
                  setFormData({ ...formData, asal_univ: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formTaskDeadline">
              <Form.Label>Jurusan</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan jurusan"
                value={formData.asal_jurusan}
                onChange={(e) =>
                  setFormData({ ...formData, asal_jurusan: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formTaskDeadline">
              <Form.Label>Tanggal Mulai</Form.Label>
              <Form.Control
                type="date"
                value={formData.tanggal_mulai}
                onChange={(e) =>
                  setFormData({ ...formData, tanggal_mulai: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formTaskDeadline">
              <Form.Label>Tanggal Selesai</Form.Label>
              <Form.Control
                type="date"
                value={formData.tanggal_selesai}
                onChange={(e) =>
                  setFormData({ ...formData, tanggal_selesai: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formTaskStatus">
              <Form.Label>Status Aktif</Form.Label>
              <Form.Control
                as="select"
                value={formData.status_aktif.toString()}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status_aktif: e.target.value === "true",
                  })
                }
              >
                <option value="true">Aktif</option>
                <option value="false">Tidak Aktif</option>
              </Form.Control>
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
          <Button variant="primary" onClick={saveUser}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Peserta;
