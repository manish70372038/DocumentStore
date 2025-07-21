import React from "react";
import { useAuthState } from "../Context/Authcontext";
import { useAppState } from "../Context/AppStateContext";

import "./Hero.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

import { faGoogle, faGmail } from "@fortawesome/free-brands-svg-icons";
import { auth, googleProvider } from "../configs/firebaseconfig";
import { signInWithPopup, signOut } from "firebase/auth";
import documenticon from "../Assets/documents.png";
import { FaEnvelope } from "react-icons/fa";
const Hero = () => {
  const {showToast} = useAppState();
  const {
    loginWithEmail, 
    signUpWithEmail, 
    continueWithGoogle, 
    currentUser, 
    credentials, 
    logout, }  = useAuthState();
  const navigate = useNavigate();
  const handleGoogleLogin = async () => {
    try {
      const data = await continueWithGoogle();
      console.log(data);
      showToast.success("Sign in successfully !");
      console.log("user is ",currentUser);

    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Successfully logged out!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-heading">Securely Store & Share Your Documents</h1>
        <p className="hero-description">
          Experience a safe, efficient, and hassle-free way to manage your
          important documents digitally. Access them anytime, anywhere, with
          Aadhaar-linked security.
        </p>
        <div className="hero-buttons">
          <button onClick={() => navigate("/signin")} className="btn btn-primary">
              {/* style={{ padding: "0px 10px", color: "green" }} */}
            Access Your Acoount
          </button>
          <button
            onClick={() => navigate("/signupWithEmail")}
            className="btn btn-secondary"
          >
            <FontAwesomeIcon
              style={{ padding: "0px 10px", color: "black" }}
              icon={faEnvelope}
            />
            Continue with Email
          </button>
        </div>
      </div>
      <div className="hero-image-wrapper">
        <img
          src={documenticon}
          alt="Document Management Illustration"
          className="hero-image"
        />
      </div>
    </section>
  );
};

export default Hero;
