import React, { useState } from "react";
import { motion } from "framer-motion";
import "../../styles/login.scss";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerError, setRegisterError] = useState(false);

  const handleRegister = () => {
    if (email.trim() === "" || password.trim() === "" || username.trim() === "") {
      setRegisterError(true);
    } else {
      setRegisterError(false);

      // Make the POST request to the server
      fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          username: username,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // If user is successfully registered

          window.location.href = "/";

        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <section className="login">
      <motion.div initial={{ y: "-100vh" }} animate={{ y: 0 }}>
        <div className="auth-container">
          <div className="auth-box login-box">
            <h2>Register</h2>
            {registerError && (
              <p className="auth-error-message">
                Please fill in all fields correctly.
              </p>
            )}
            <input
              className="auth-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="auth-button" onClick={handleRegister}>
              Register
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Register;