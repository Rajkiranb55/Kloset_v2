import React, { useEffect, useState } from "react";
import "./listproduct.css";
import remove_icon from "../../assets/cross_icon.png";

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    await fetch("https://kloser-server2.onrender.com/allproducts")
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    fetchInfo();
    console.log("on list product ");
  }, []);

  const removeProduct = async (id) => {
    await fetch("https://kloser-server2.onrender.com/removeproduct", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    await fetchInfo();
  };
  return (
    <div className="listproduct">
      <h1>All Products List</h1>
      <div className="list_products_format">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="list-product_all_products">
        <hr />
        {allProducts.map((product, i) => {
          return (
            <>
              <div key={i} className=" list_products_format products_align">
                <img src={product.image} className="product_image" alt="" />
                <p>{product.name}</p>
                <p>${product.old_price}</p>
                <p>${product.new_price}</p>
                <p>{product.category}</p>
                <img
                  src={remove_icon}
                  className="list_product_remove_icon"
                  alt=""
                  onClick={() => removeProduct(product.id)}
                />
              </div>
              <hr />
            </>
          );
        })}
      </div>
    </div>
  );
};

export default ListProduct;
