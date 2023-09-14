import React from "react";
import "../styles/Spinner.css";
import { ImSpinner9 } from "react-icons/im";

const Spinner = () => {
  return <div className="spin">{<ImSpinner9 size={20} />}</div>;
};

export default Spinner;
