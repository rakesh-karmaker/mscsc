import { useEffect, useRef } from "react";

const RegisterImage = ({ registerForm }) => {
  const registerImg = useRef(null);

  useEffect(() => {
    registerImg.current.style.height = `${registerForm.current.offsetHeight}px`;
  }, []);

  return <div className="reg-img" ref={registerImg}></div>;
};

export default RegisterImage;
