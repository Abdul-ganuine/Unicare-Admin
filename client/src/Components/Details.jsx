import "./Details.css";
import profileImg from "../assets/profileImg.jpg";
function Details() {
  return (
    <div className="details">
      <div className="details-container">
        <h3 className="title">Student Details</h3>
        <div className="personal-details">
          <img src={profileImg} alt="" />
          <div className="detail">
            <h3>Personal Details</h3>
            <div className="person-detail">
              <p>Full Name: </p>
              <span>Angel Reese</span>
            </div>
            <div className="person-detail">
              <p>Programme of Study: </p>
              <span>Computer Science</span>
            </div>
            <div className="person-detail">
              <p>Year: </p>
              <span>4</span>
            </div>
          </div>
          <div className="contact">
            <h3>Contact Info</h3>
            <div className="person-detail">
              <p>Email: </p>
              <span>a@gmail.com</span>
            </div>
            <div className="person-detail">
              <p>Phone number: </p>
              <span>0247889975</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
