import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CurrencyFormat from "react-currency-format";

import "./Payment.css";
import { CheckoutProduct } from "../../component";
import { useStateValue } from "../../context/StateProvider";
import { getBasketTotal } from "../../context/reducer";
import axios from "../../config";

const Payment = () => {
  const history = useHistory();
  const [{ basket, user }, dispatch] = useStateValue();

  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);

  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState("");
  const [clientSecret, setClientSecret] = useState(true);

  const elements = useElements();
  const stripe = useStripe();

  useEffect(() => {
    //generate stripe secret which allows to charge a costumer
    const getClientSecret = async () => {
      const response = await axios({
        method: "post",
        // stripr expects the total in a currencies subunit
        url: `/payments/create/total=${getBasketTotal(basket)}`,
      });
      setClientSecret(response.data.clientSecret);
    };
    getClientSecret();
  }, [basket]);

  const handleSubmit = async (e) => {
    // do all stripe
    e.preventDefault();
    setProcessing(true);

    const payload = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })
      .then(({ paymentIntent }) => {
        // paymentIntent = payment confirmation intent
        setSucceeded(true);
        setError(null);
        setProcessing(false);

        history.replaceState("/orders");
      });
  };

  const handleChange = (e) => {
    // do all stripe
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
  };

  return (
    <div className="payment">
      <div className="payment__container">
        {/* Payment section - delivery address */}
        <h1>
          Checkout (<Link to="/checkout">{basket?.length} items</Link>)
        </h1>
      </div>
      <div className="payment__section">
        <div className="payment__title">
          <h3>Delivery Address</h3>
        </div>
        <div className="payment__address">
          <p>{user?.email}</p>
          <p>123 React Lane</p>
          <p>Los Angeles, CA</p>
        </div>
      </div>
      {/* Payment section - Review Items */}
      <div className="payment__section">
        <div className="payment__title">
          <h3>Review items and Delivery</h3>
        </div>
        <div className="payment__items">
          {basket.map((item) => (
            <CheckoutProduct
              id={item.id}
              title={item.title}
              image={item.image}
              price={item.price}
              rating={item.rating}
            />
          ))}
        </div>
      </div>
      {/* Payment section - Payment method */}
      <div className="payment__section">
        <div className="payment__title">
          <h3>Payment Methods</h3>
        </div>
        <div className="payment__details">
          {/* Stripe */}
          <form onClick={handleSubmit}>
            <CardElement onChange={handleChange} />
            <div className="payment__priceContainer">
              <CurrencyFormat
                renderText={(value) => (
                  <>
                    <h3>
                      Order Total: <strong>{value}</strong>
                    </h3>
                  </>
                )}
                decimalScale={2}
                value={getBasketTotal(basket)}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"$"}
              />
              <button disabled={processing || disabled || succeeded}>
                <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
              </button>
            </div>
            {/* error */}
            {error && <div>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
