import React from "react";
import "./Product.css";
import { useStateValue } from "../../context/StateProvider";

const Product = ({ id, title, price, rating, image }) => {
  const [{ basket }, dispatch] = useStateValue();

  const addToBasket = () => {
    // Dispatch the item into the data layer
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id: id,
        title: title,
        image: image,
        price: price,
        rating: rating,
      },
    });
  };

  return (
    <div key={id} className="product">
      <div className="product__info">
        <p>{title}</p>
        <p className="product__price">
          <small>$</small>
          <strong>{price}</strong>
        </p>
        <div className="product__rating">
          {Array(rating)
            .fill()
            .map((_, i) => (
              <p>🌟</p>
            ))}
        </div>
      </div>

      <img src={image} alt={title} />
      <button onClick={addToBasket}>Add to basket</button>
    </div>
  );
};

export default Product;
