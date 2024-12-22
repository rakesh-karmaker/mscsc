import { useEffect, useRef } from "react";

const RegisterImage = ({ registerFormContainer }) => {
  const registerImg = useRef(null);

  useEffect(() => {
    registerImg.current.style.height = `${registerFormContainer.current.offsetHeight}px`;
  }, []);

  return <div className="reg-img" ref={registerImg}></div>;
};

export default RegisterImage;
