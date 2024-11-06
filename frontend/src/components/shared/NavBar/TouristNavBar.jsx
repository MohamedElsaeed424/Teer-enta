import { MenuOutlined } from "@ant-design/icons";
import AccountButton from "./AccountButton";
import useMediaQuery from "use-media-antd-query";
import { Drawer } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi"; // Importing a logout icon from react-icons
import logo from "../../../assets/logo/logo.jpeg";
import ConfirmationModal from "../ConfirmationModal";
import { on } from "events";
import { set } from "date-fns";

const SideBar = ({ children, classNames }) => {
  const size = useMediaQuery();
  const [open, setOpen] = useState(false);

  if (["xs", "sm", "md"].includes(size)) {
    return (
      <div>
        <MenuOutlined onClick={() => setOpen(true)} />
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          classNames={classNames}
        >
          {children}
        </Drawer>
      </div>
    );
  }
  return children;
};

const TouristNavBar = ({ setModalOpen, isNavigate, setIsNavigate }) => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const onAccountClick = () => {
    if (
      user &&
      (user.userRole === "Admin" || user.userRole === "TourismGovernor")
    ) {
      navigate("/changePassword");
    }else if(user && user.userRole === "Tourist"){
      navigate("/newProfile");
    }else {
      navigate(user ? "/profile" : "/login");
    }
  };

  useEffect(() => {
    if (isNavigate) {
      navigate("/");
      setIsNavigate(false);
    }
  }, [isNavigate]);

  return (
    <div className="w-full flex flex-row justify-between items-center bg-gradient-to-b from-green-600 to-teal-700% shadow-2xl p-6 z-10 h-20 text-white font-bold space-x-8">
      {/* Logo Section */}
      <span className="ml-8 text-lg leading-7">
        <div className="cursor-pointer w-fit border border-transparent hover:border-white p-2 rounded-md transition-all duration-300 hover:scale-105">
          {/* Logo Link */}
          <Link to={"/"} className="ring-0">
            <img
              src={logo}
              alt="Logo"
              width={120}
              className="rounded-full shadow-lg hover:rotate-6 transition-all duration-500"
            />
          </Link>
        </div>
      </span>

      {/* Navigation Links */}
      <div className="flex flex-row gap-10 items-center">
        {["Equipment", "About Us", "Blog"].map((item, index) => (
          <span
            key={index}
            className="text-lg leading-5 cursor-pointer relative group hover:text-yellow-300 transition duration-300 ease-in-out"
          >
            {item}
            {/* Fancy Underline Animation */}
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
          </span>
        ))}
      </div>

      {/* Sidebar Section */}
      <SideBar
        classNames={{
          body: "bg-[#075B4C] text-white flex flex-col items-center p-4 rounded-lg shadow-lg",
          header: "bg-[#075B4C] text-white font-bold text-lg p-4",
        }}
      >
        <div className="flex justify-end items-center lg:flex-1 mt-4">
            <AccountButton
            extra_tw="bg-green-600 hover:bg-green-700 transition duration-300 p-2 rounded-lg shadow-lg flex items-center justify-center transform hover:scale-110"
            onClick={onAccountClick}
          />
        </div>

        {user && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center mt-4 p-2 bg-red-600 hover:bg-red-700 rounded-full transition duration-300 shadow-lg transform hover:scale-110 focus:outline-none"
            aria-label="Logout"
          >
            <FiLogOut className="w-6 h-6" />
          </button>
        )}
      </SideBar>
    </div>
  );
};

export default TouristNavBar;
