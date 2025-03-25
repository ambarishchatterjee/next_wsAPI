import React, { ReactNode } from "react";
import Header from "../header/header";


interface props {
  children: ReactNode;
}
const Wrapper: React.FC<props> = ({ children }) => {
  return (
    <>
      <Header/>
      {children}
    </>
  );
};

export default Wrapper;
