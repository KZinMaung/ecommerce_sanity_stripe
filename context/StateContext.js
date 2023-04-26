import { createContext, useContext, useState } from "react";

const Context = createContext();

import React from 'react';
import { toast } from "react-hot-toast";

export const StateContext = ({ children }) => {
    const [qty, setQty] = useState(1);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [showCart, setShowCart] = useState(false);

    const incQty = () => {
        setQty((preQty) => preQty + 1);
    }

    const decQty = () => {
        setQty((preQty) => {
            if (preQty - 1 < 1) return 1;

            return preQty - 1;
        })
    }

    const onAdd = (product, quantity) => {
        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
        setTotalQuantities((prevQuantities) => prevQuantities + quantity);

        const checkProductInCart = cartItems.find((item) => item._id === product._id);
        //existing product
        if (checkProductInCart) {
            const updatedCartItems = cartItems.map((cartProduct) => {
                if (cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                }
                else return cartProduct;
            })

            setCartItems(updatedCartItems);
        }
        else {
            //new product
            product.quantity = quantity;
            setCartItems([...cartItems, { ...product }])
        }

        toast.success(`${qty} ${product.name} added to the cart.`);

    }

    const toggleCartItemQuanitity = (product, value) => {
        const filteredCartItems = cartItems.filter((item) => item._id !== product._id);

        if (value === 'inc') {
            setCartItems([...filteredCartItems, { ...product, quantity: product.quantity + 1 }]);
            setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price);
            setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
        }
        else if (value === 'dec') {
            setCartItems([...filteredCartItems, { ...product, quantity: product.quantity - 1 }]);
            setTotalPrice((prevTotalPrice) => prevTotalPrice - product.price);
            setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
        }
    }

    const onRemove = (product) => {
        const filteredCartItems = cartItems.filter((item) => item._id !== product._id);
        setCartItems(filteredCartItems);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - product.quantity * product.price);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - product.quantity);
    }

    return (
        <Context.Provider
            value={{
                qty,
                incQty,
                decQty,
                onAdd,
                totalPrice,
                totalQuantities,
                cartItems,
                showCart,
                setShowCart,
                toggleCartItemQuanitity,
                onRemove,
                setCartItems,
                setTotalPrice,
                setTotalQuantities,
                setQty
            }}
        >
            {children}
        </Context.Provider>
    );
}

export const useStateContext = () => useContext(Context);

