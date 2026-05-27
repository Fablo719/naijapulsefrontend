import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setMessage(
        "❌ No reset token found. Please request a new password reset."
      );
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("❌ Invalid reset token");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("❌ Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "https://naijapulse.vercel.app/api/v1/users/reset-password",
        {
          token,
          newPassword,
        }
      );

      if (response.data.success) {
        setMessage(
          "✅ Password reset successful! Redirecting to login..."
        );

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setMessage(`❌ ${response.data.message}`);
      }
    } catch (error) {
      console.error("Reset error:", error);

      setMessage(
        `❌ ${
          error.response?.data?.message ||
          "Failed to reset password"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "10px",
          padding: "40px",
          width: "100%",
          maxWidth: "450px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
          Reset Password
        </h2>

        <p
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#666",
          }}
        >
          Enter your new password below
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background:
                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              borderRadius: "5px",
              textAlign: "center",
              backgroundColor: message.includes("✅")
                ? "#d4edda"
                : "#f8d7da",
              color: message.includes("✅")
                ? "#155724"
                : "#721c24",
            }}
          >
            {message}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link
            to="/login"
            style={{
              color: "#667eea",
              textDecoration: "none",
            }}
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;