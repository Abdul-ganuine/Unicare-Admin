import { useEffect, useState } from "react";
import axios from "axios";
import "./Doctors.css";
import DataTable from "react-data-table-component";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertSlice";

function Counsellors() {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  function handleDelete(id) {
    const confrim = window.confirm(
      "Are you sure you want to permanently delete this record?"
    );
    if (confrim) {
      dispatch(showLoading());
      axios
        .delete("http://localhost:3000/panel/deleteCounsellor/" + id)
        .then((response) => {
          dispatch(hideLoading());
          if (response.status === 200) {
            setData((prevDoctors) =>
              prevDoctors.filter((doctor) => doctor._id !== id)
            );
          }
        })
        .catch((error) => console.error("Error deleting doctor:", error));
    }
  }

  useEffect(() => {
    dispatch(showLoading());
    axios
      .get("http://localhost:3000/panel/getCounsellors")
      .then((res) => {
        setData(res.data);
        dispatch(hideLoading());
      })
      .catch((err) => dispatch(hideLoading()));
  }, [dispatch]);

  const column = [
    {
      name: "ID",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "First Name",
      selector: (row) => row.first_name,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.last_name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Phone Number",
      selector: (row) => row.number,
    },
    {
      name: "Specialization",
      selector: (row) => row.specialization,
    },
    {
      name: "Picture",
      selector: (row) => (
        <img
          src={`http://localhost:3000/profImages/${row.img}`}
          alt=""
          width={50}
          height={50}
          style={{ objectFit: "cover" }}
          className="row-image"
        />
      ),
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="btn-container">
          <button className="delete" onClick={() => handleDelete(row._id)}>
            Delete
          </button>
        </div>
      ),
    },
  ];
  const formattedData = data.reverse();

  return (
    <div className="doctors">
      <div className="doctors-container">
        <div className="table-container">
          <div className="search-container">
            <input
              type="search"
              placeholder="Search🔎"
              className="table-search"
            />
          </div>
          <DataTable
            columns={column}
            data={formattedData}
            title="Available Counsellors"
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 15, 20, 25]}
            pointerOnHover
            highlightOnHover
            fixedHeader
            fixedHeaderScrollHeight="400px"
            // actions={
            //   <button className="add-btn" onClick={() => showAddDoctorForm()}>
            //     Add Counsellor
            //   </button>
            // }
          ></DataTable>
          {/* {modalOpen && (
            <CounsellorsModal closeModal={() => setModalOpen(false)} />
          )}
          {editModalOpen && (
            <CounsellorEditModal
              closeModal={() => setEditModalOpen(false)}
              editRowID={editRowID}
            />
          )} */}
        </div>
      </div>
    </div>
  );
}

export default Counsellors;
