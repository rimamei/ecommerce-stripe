import React, { useState } from "react";
import "./Signin.css";
import { Link, useHistory } from "react-router-dom";
import { auth } from "../../firebase";

const Signin = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = (e) => {
    e.preventDefault();

    // firebase login
    auth
      .signInWithEmailAndPassword(email, password)
      .then((auth) => {
        history.push("/");
      })
      .catch((err) => alert(err.message));
  };
  const register = (e) => {
    e.preventDefault();

    // firebase register
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((auth) => {
        // it succesfully created a new user email and password
        if (auth) {
          history.push("/");
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className="signin">
      <Link to="/">
        <img
          className="signin__logo"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png"
          alt=""
        />
      </Link>

      <div className="signin__container">
        <h1>Sign-in</h1>

        <form action="">
          <h5>Email</h5>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <h5>Password</h5>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="signin__button" type="submit" onClick={signIn}>
            Sign In
          </button>
        </form>

        <p>
          By signing-in, you agree to Amazon clone's Conditions of Use and
          Privacy Notice.
        </p>

        <button className="signin__signupButton" onClick={register}>
          Create your Amazon Account
        </button>
      </div>
    </div>
  );
};

export default Signin;
