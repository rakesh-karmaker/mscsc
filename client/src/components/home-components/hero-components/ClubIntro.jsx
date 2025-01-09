import { NavLink } from "react-router-dom";

const ClubIntro = () => {
  return (
    <div className="club-intro">
      <h1>
        Where
        <span className="highlighted-text">Science enthusiasts</span> come
        together
      </h1>
      <p className="secondary-text">
        Connect with like-minded individuals and expand your knowledge in math,
        science, biology, astronomy and IT. Let's be the best together.
      </p>
      {/* <div className="btns">
        <NavLink to="/register" className="primary-button">
          Join Us
        </NavLink>
        <NavLink to="/members" className="primary-button">
          See Others
        </NavLink>
      </div> */}
    </div>
  );
};

export default ClubIntro;
