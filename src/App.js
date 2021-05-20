import { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Checkout, Home, Payment, Signin } from "./pages";
import { auth } from "./firebase";
import { Header } from "./component";
import { useStateValue } from "./context/StateProvider";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const promise = loadStripe(`${process.env.REACT_APP_STRIPE}`);

function App() {
  const [{ basket, user }, dispatch] = useStateValue();

  useEffect(() => {
    // will run once when the app component loads
    auth.onAuthStateChanged((authUser) => {
      console.log("The user is >>>>>>", authUser);

      if (authUser) {
        // the user just logged in / the user was logged in
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        // the user is logged out
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, [dispatch]);

  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/signin">
            <Signin />
          </Route>
          <Route path="/checkout">
            <Header />
            <Checkout />
          </Route>
          <Route path="/payment">
            <Header />
            <Elements stripe={promise}>
              <Payment />
            </Elements>
          </Route>
          <Route path="/">
            <Header />
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
