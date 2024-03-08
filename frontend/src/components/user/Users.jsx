import React, { useState } from "react";
import defaultImage from "../../assets/DefaulImge.png";

const Users = () => {
  const [userData, setUserData] = useState([]);
  const [password, setPassword] = useState(""); // State to hold the password
  const [error, setError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState({});

  const fetchAdminData = async () => {
    try {
      // Check if the IP address has exceeded the maximum failed attempts
      const ip = getClientIP(); // Assuming you have a function to get the client IP
      const attempts = failedAttempts[ip] || 0;
      if (attempts >= 3) {
        setError("Too many failed attempts. Please try again later.");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/api/users/admin/${password}` // Pass only password in the URL
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setUserData(data);
          setError("");
        } else {
          setError("No admin users found for the given password.");
          setUserData([]);
        }
      } else {
        // Increment failed attempts for the IP address
        setFailedAttempts({ ...failedAttempts, [ip]: attempts + 1 });

        setError("No admin users found for the given password.");
        setUserData([]);
      }
    } catch (error) {
      setError("Error fetching admin data. Please try again later.");
      setUserData([]);
    }
  };

  // Function to get client IP (You need to implement this)
  const getClientIP = () => {
    // Implement the logic to get the client's IP address
    return "127.0.0.1"; // Placeholder, replace with actual implementation
  };

  return (
    <section className="tableClass">
      <main>
        {/* Remove the username input field */}
        {/* <label htmlFor="username">Enter Admin Username:</label>
        <input
          type="text"
          id="username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        /> */}
        
        {/* Add input field for password */}
        <label htmlFor="password">Enter Admin Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={fetchAdminData}>Find </button>

        {error && <p className="error">{error}</p>}

        {userData.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>User Id</th>
                <th>Name</th>
                <th>Role</th>
                <th>Since</th>
                <th>Photo</th>
              </tr>
            </thead>

            <tbody>
              {userData.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <img src={defaultImage} alt="User" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </section>
  );
};

export default Users;
