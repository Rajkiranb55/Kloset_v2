import React, { useState } from "react";
import "./addproduct.css";
import upload_area_img from "../../assets/upload_area.svg";
const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
  });
  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };
  const changeHandeler = (e) => {
    setProductDetails({
      ...productDetails,
      [e.target.name]: e.target.value,
    });
  };
  const addProduct = async () => {
    console.log(productDetails);
    let ressponseData;
    let product = productDetails;

    let formData = new FormData();
    formData.append("product", image);

    await fetch("http://localhost:4000/upload", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    })
      .then((resp) => resp.json())
      .then((data) => (ressponseData = data));

    if (ressponseData.success) {
      product.image = ressponseData.image_url;
      console.log(product);
      await fetch("http://localhost:4000/addproduct", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })
        .then((res) => res.json())
        .then((data) => {
          data.success
            ? alert("product added")
            : alert("failed to add product");
        });
    }
  };

  return (
    <div className="addproduct">
      <div className="add_product_item_fields">
        <p>Product Title</p>
        <input
          type="text"
          name="name"
          placeholder="Type Product name"
          value={productDetails.name}
          onChange={changeHandeler}
        />
      </div>
      <div className="add_produut_price">
        <div className="add_product_item_fields">
          <p>Price</p>
          <input
            type="text"
            name="old_price"
            placeholder="Type Product old price"
            value={productDetails.old_price}
            onChange={changeHandeler}
          />
        </div>
        <div className="add_product_item_fields">
          <p>Offer Price</p>
          <input
            type="text"
            name="new_price"
            placeholder="Type Product old price"
            value={productDetails.new_price}
            onChange={changeHandeler}
          />
        </div>
      </div>
      <div className="add_product_item_fields">
        <p>Product Category</p>
        <select
          name="category"
          className="add_product_selector"
          value={productDetails.category}
          onChange={changeHandeler}
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="product_item_fields">
        <label htmlFor="file_input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area_img}
            className="add_product_thumb_img"
            alt=""
          />
          <input
            type="file"
            name="image"
            id="file_input"
            hidden
            onChange={imageHandler}
          />
        </label>
      </div>
      <button
        className="add_product_btn"
        onClick={() => {
          addProduct();
        }}
      >
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
