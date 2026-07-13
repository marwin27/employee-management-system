import react from "react";
import { login } from "../api/authApi";

const Login = () => {

  const [email, setEmail] = react.useState("");
  const [password, setPassword] = react.useState("");
  const [loading, setLoading] = react.useState(false);
  const [error, setError] = react.useState("");
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await login({
        email,
        password,
      });

      console.log(data);

      localStorage.setItem("token", data.token);
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }

  };
  return (
       <form onSubmit={handleLogin}>
    {error && <p>{error}</p>}

    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button type="submit" disabled={loading}>
      {loading ? "Logging in..." : "Login"}
    </button>
  </form>

  );
};

export default Login
