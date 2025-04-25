import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/AdminLogin.css";

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotForm, setShowForgotForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    try {
      const result = await adminLogin(trimmedUsername, trimmedPassword);
      // result should contain token
      if (result && result.token) {
        // Store JWT token
        if (rememberMe) {
          localStorage.setItem("jwtToken", result.token);
          localStorage.setItem(
            "rememberedCredentials",
            JSON.stringify({ username: trimmedUsername, rememberMe: true })
          );
        } else {
          sessionStorage.setItem("jwtToken", result.token);
          localStorage.removeItem("rememberedCredentials");
        }
        toast.success("Login successful! Welcome back.", {
          position: "top-right",
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate("/admin");
        }, 1000);
      } else {
        toast.error("Login failed: No token received.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(
        error.message || "Invalid credentials. Please check your username and password.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (resetEmail === "suprajsth8@gmail.com") {
      toast.success("Password reset link has been sent to your email!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        setShowForgotForm(false);
        setResetEmail("");
      }, 3000);
    } else {
      toast.error("Email not found. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleBackToMain = () => {
    toast.info("Redirecting to main page...", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div className="admin-login-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="deer-background">
        <div className="login-modal">
          <button className="close-button">×</button>
          <h2>Login</h2>
          {!showForgotForm ? (
            <>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                  />
                  <span className="input-icon">👤</span>
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                  <span className="input-icon">🔒</span>
                </div>
                <div className="form-options">
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="forgot-password-link"
                    onClick={() => setShowForgotForm(true)}
                  >
                    Forgot Password?
                  </button>
                </div>
                <button type="submit" className="login-button">
                  Login
                </button>
              </form>
              <button
                onClick={handleBackToMain}
                className="back-to-main-button"
              >
                Back to Main Page
              </button>
            </>
          ) : (
            <form onSubmit={handleForgotPassword} className="forgot-form">
              <div className="form-group">
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
                <span className="input-icon">✉</span>
              </div>
              {resetMessage && (
                <div
                  className={`reset-message ${
                    resetMessage.includes("sent") ? "success" : "error"
                  }`}
                >
                  {resetMessage}
                </div>
              )}
              <button type="submit" className="login-button">
                Reset Password
              </button>
              <button
                type="button"
                className="back-to-login"
                onClick={() => setShowForgotForm(false)}
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
