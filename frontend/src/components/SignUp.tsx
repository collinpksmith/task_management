import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../redux/auth/authSlice";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      window.alert("Password does not match!");
      return;
    }
    dispatch(register({ email, password })).then(() => {
      navigate("/");
    });
  };

  return (
    <div className="max-w-[400px] border rounded-md p-4 w-full absolute top-1/2 -translate-y-1/2 flex flex-col items-center">
      <p className="text-2xl font-medium mb-4 w-full">Signup</p>
      <form onSubmit={handleSignup} className="w-full">
        <div className="flex flex-col gap-1 mb-2">
          <p>Email</p>
          <input
            type="email"
            className="border rounded-md w-full pl-2 py-1"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1 mb-4">
          <p>Password</p>
          <input
            type="password"
            className="border rounded-md w-full pl-2 py-1"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1 mb-4">
          <p>Confirm Password</p>
          <input
            type="password"
            className="border rounded-md w-full pl-2 py-1"
            placeholder="Enter confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-400 rounded-md py-1 text-white"
        >
          Sign Up
        </button>
      </form>
      <div className="flex gap-1 text-sm mt-4">
        <p>Do you already have an account?</p>
        <Link to="/" className="text-blue-400 underline">
          Login here
        </Link>
      </div>
    </div>
  );
};

export default Signup;
