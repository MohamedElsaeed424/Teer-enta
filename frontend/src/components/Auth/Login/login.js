import React, { useState, useEffect } from "react";
import "./login.css";
import { images } from "./loadImage.js";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Example icons from react-icons
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { set } from "date-fns";
import {
  login,
  toggleFirstLoginAndUpdatePrefrences,
} from "../../../api/auth.ts";
import LoadingCircle from "../../shared/LoadingCircle/LoadingCircle.js";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo/logo2.jpg";
import backgroundImage from "../../../assets/LoginImage/download.jpeg";
import SelectPrefrences from "../../shared/SelectPrefrences.jsx";
import { Button } from "antd";
import WavingHand from "../../../assets/svgs/hand-shake-svgrepo-com.svg";
import { checkPermission, requestForToken } from "../../../services/firebase";
import { saveFCMTokenToServer } from "../../../api/notifications.ts";
import { getMessaging, onMessage } from 'firebase/messaging';
import { toast } from 'react-toastify';

function Login({ setFlag, flag }) {
  if (!flag) {
    setFlag(true);
  }
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showPrefernceSelection, setShowPrefernceSelection] = useState(false);
  const [user, setUser] = useState({});
  const [accessToken, setAccessToken] = useState({});
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // State to track if the slideshow is paused
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [images.length, isPaused]);

  // Function to handle mouse down (click and hold)
  const handleMouseDown = () => {
    setIsPaused(true); // Pause the slider when mouse is down
  };

  // Function to handle mouse up (release click)
  const handleMouseUp = () => {
    setIsPaused(false); // Resume the slider when mouse is up
  };

  const handleImageClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images?.length);
  };

  const handleLoginSubmission = async (e) => {
    e.preventDefault();
    if (!isValid()) return false;
    var user;
    var accessToken;
    try {
      setIsLoading(true);
      const response = await login(details);
      setIsLoading(false);
      user = response?.data.user;
      accessToken = response?.data.accessToken;

      if (user.userRole === "Tourist" && user.firstLogin) {
        setShowPrefernceSelection(true);
        setUser(user);
        setAccessToken(accessToken);
        return false;
      }
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      // Initialize notifications after storing credentials
      setMessage(response?.data.message);
      if(user && user.userRole === "Tourist") {
        navigate("/");
      }else{
        navigate("/reports");
      }
      // window.reload();
      setFlag(false);
    } catch (error) {
      setIsLoading(false);
      setMessage(error.response?.data.message || "Login failed");
      return false;
    }
  };


  function isValid() {
    if (username === "" || password === "") {
      return false;
    }
    return true;
  }

  const details = {
    username: username,
    password: password,
  };

  return (
    <div className="flex justify-center "
      >
      {isLoading && <LoadingCircle />}

      

      {showPrefernceSelection ? (
        <div className="flex flex-col w-1/2 m-5 justify-center content-center items-center">
          <span className="ml-8 text-lg leading-7">
            <div className="cursor-pointer w-fit border border-transparent hover:border-white p-2 rounded-md transition-all duration-300 hover:scale-105">
              <Link to="/" className="ring-0">
                <img
                  src={logo}
                  alt="Logo"
                  width={120}
                  className="rounded-full hover:rotate-6 transition-all duration-500"
                />
              </Link>
            </div>
          </span>
          <SelectPrefrences
            selectedCategories={selectedCategories}
            selectedTags={selectedTags}
            onCategoriesChange={setSelectedCategories}
            onTagsChange={setSelectedTags}
          />
          <Button
            type="danger"
            className="mt-4 bg-first hover:bg-black text-white w-full"
            loading={isLoading}
            onClick={async () => {
              try {
                setIsLoading(true);
                await toggleFirstLoginAndUpdatePrefrences({
                  prefrences: {
                    activityCategories: selectedCategories,
                    preferenceTags: selectedTags,
                  },
                  accessToken,
                });
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("accessToken", accessToken);
                setMessage("Preferences updated successfully");
                navigate("/");
              } catch (error) {
                console.log(error);
                setMessage("Failed to update preferences");
              } finally {
                setIsLoading(false);
              }
            }}
          >
            Done
          </Button>
        </div>
      ) : (
        <div className="w-1/2 flex flex-col justify-center items-center">
          <span className="ml-8 text-lg leading-7">
            <div className="cursor-pointer w-fit border border-transparent hover:border-white p-2 rounded-md transition-all duration-300 hover:scale-105">
              <Link to="/" className="ring-0">
                <img
                  src={logo}
                  alt="Logo"
                  width={120}
                  className="rounded-full hover:rotate-6 transition-all duration-500"
                />
              </Link>
            </div>
          </span>
          <form className="formlogin mt-2 bg-white block p-4 max-w-[500px] rounded-lg shadow-xl">
            <p className="text-4xl text-first font-bold my-4">Login now</p>
            <div className="flex gap-2">
              <p className="my-2">Hi, Welcome back</p>
              <img src={WavingHand} alt="Waving Hand" width={40} />
            </div>  

            <div className="flex items-center pt-4 pl-3 pr-3 text-sm leading-5 text-gray-400 mb-4">
              <div className="h-px flex-1 bg-gray-400 text-gray-800"></div>
              <p className="pl-3 pr-3 text-sm leading-5 text-gray-400">
                Login with Username & Password
              </p>
              <div className="h-px flex-1 bg-gray-400 text-gray-800"></div>
            </div>

            <h6 className="text-sm font-medium text-gray-700">Username</h6>
            <div className="input-containerlogin relative">
              <input
                className="inputlogin"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>

            <h6 className="text-sm font-medium text-gray-700">Password</h6>
            <div className="input-containerlogin relative">
              <input
                className="inputlogin"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ paddingRight: "40px" }}
              />
              <span
                onClick={togglePasswordVisibility}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showPassword ? (
                  <FaEyeSlash color="gray" />
                ) : (
                  <FaEye color="gray" />
                )}
              </span>
            </div>
            <div className="flex justify-between mt-1 mb-4">
              <span className="text-red-500 text-xs ml-4">{message}</span>
              <Link
              to="/forgot-password"
              className="hover:underline text-[#474bca] text-xs"
            >
              Forgot password?
            </Link>
            </div>
            <button
              type="submit"
              className="buttonlogin bg-first hover:bg-black block pt-3 pb-3 pl-5 pr-5 text-white text-sm leading-5 font-medium w-full rounded-lg uppercase"
              onClick={handleLoginSubmission}
            >
              Login
            </button>

            <p className="text-xs text-center">
              No account?
              <a href="/signup" className="text-[#474bca] hover:underline">
                Sign up
              </a>
            </p>
          </form>
          
        </div>
      )}
    </div>
  );
}

export default Login;
