import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFacebook,
  faGithub,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import {
  faCalendar,
  faCalendarDays,
  faEnvelope,
  faEye,
  faEyeSlash,
  faFaceFrownOpen,
} from "@fortawesome/free-regular-svg-icons";
import {
  faAngleDown,
  faArrowRight,
  faArrowRightLong,
  faBars,
  faCertificate,
  faChalkboardUser,
  faChevronLeft,
  faChevronRight,
  faHouse,
  faNewspaper,
  faPencil,
  faPhone,
  faProjectDiagram,
  faReply,
  faSearch,
  faSquareEnvelope,
  faTimes,
  faTrophy,
  faUpload,
  faUsers,
  faUserTie,
  faXmark,
  faUser,
  faX,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faFacebook,
  faInstagram,
  faEnvelope,
  faPhone,
  faGithub,
  faLinkedin,
  faCalendarDays,
  faCalendar,
  faUsers,
  faUserTie,
  faReply,
  faArrowRight,
  faArrowRightLong,
  faAngleDown,
  faPencil,
  faChalkboardUser,
  faNewspaper,
  faTrophy,
  faProjectDiagram,
  faCertificate,
  faFaceFrownOpen,
  faUpload,
  faEye,
  faEyeSlash,
  faChevronRight,
  faChevronLeft,
  faSearch,
  faXmark,
  faBars,
  faTimes,
  faHouse,
  faUser,
  faSquareEnvelope,
  faX
);

function App() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <HelmetProvider>
        <Outlet />
      </HelmetProvider>
    </>
  );
}

export default App;
