import "./Hero.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

// import { faGoogle, faGmail } from "@fortawesome/free-brands-svg-icons";
import documenticon from "../Assets/documents.png";
const Hero = () => {
  const navigate = useNavigate();


 
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
