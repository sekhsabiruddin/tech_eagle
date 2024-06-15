import React from "react";
import { TbLogout2 } from "react-icons/tb";

const Header = () => {
  return (
    <header className="boxshow p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <a
          href=""
          className="text-2xl font-bold text-blue-400 hover:text-blue-300"
        >
          Todo .
        </a>
        <div className="text-2xl cursor-pointer"></div>
      </div>
    </header>
  );
};

export default Header;
