import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { useStoreContext } from "../utils/GlobalState";
import {
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  ADD_TO_CART,
  UPDATE_PRODUCTS,
} from "../utils/actions";

import Cart from "../components/Cart";

import { QUERY_PRODUCTS } from "../utils/queries";
import spinner from "../assets/spinner.gif";

function Detail() {
  // const { id } = useParams();

  // const [currentProduct, setCurrentProduct] = useState({})

  // const { loading, data } = useQuery(QUERY_PRODUCTS);

  // const products = data?.products || [];

  // useEffect(() => {
  //   if (products.length) {
  //     setCurrentProduct(products.find(product => product._id === id));
  //   }
  // }, [products, id]);

  const [state, dispatch] = useStoreContext();
  const { id } = useParams();

  // we are saving the current product locally, because we will only use that data here
  // so it doesnt need to be stored globally, its similar reason we do that for login and signup
  const [currentProduct, setCurrentProduct] = useState({});

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  const { products } = state;

  useEffect(() => {
    //check if there's data in the global state products array
    //and use it to figure out which product it is using the id and display it
    if (products.length) {
      setCurrentProduct(products.find((product) => product._id === id));
      // if we dont have data, we use the data from the useQuery to set the data to global state
    } else if (data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products,
      });
    }
  }, [products, data, dispatch, id]); //This is known as the dependency array.

  const addToCart = () => {
    dispatch({
      type: ADD_TO_CART,
      product: { ...currentProduct, purchaseQuantity: 1 },
    });
  };

  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{" "}
            <button onClick={addToCart}>Add to Cart</button>
            <button>Remove from Cart</button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail;
