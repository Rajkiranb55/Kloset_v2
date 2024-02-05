const port = 4000;
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const path = require("path");

const cors = require("cors");
app.use(express.json());
app.use(cors());

//Database connection  with mondoDB

mongoose.connect(
  "mongodb+srv://radba8:Mrabd360@cluster0.4rqegda.mongodb.net/ "
);

//API EDPOINT CREATION

app.get("/", (req, res) => {
  res.send("Express app is running");
});

app.listen(port, (error) => {
  if (!error) {
    console.log("server runing on port" + port);
  } else {
    console.log("Error" + error);
  }
});

//image storage engine

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.filename}_${Date.now()}_${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

//creating upload end point for images

app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

//Schema for creating products

const Product = mongoose.model("Product", {
  id: { type: Number, reuired: true },
  name: {
    type: String,
    reuired: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    reuiired: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log(product);
  await product.save();
  console.log("saved");
  res.json({
    success: true,
    name: req.body.name,
  });
});

//creating API for deleting products

app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({
    id: req.body.id,
  });
  console.log("removed");
  res.json({
    success: true,
    name: req.body.name,
  });
});

//creating api for getting all products

app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("all products fetched");
  res.send(products);
});

//for login and cart

//schema for use model

const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//creating endpoint/api for registering the user

app.post("/signup", async (req, res) => {
  // let { name, email, password } = req.body;
  // // let check = await Users.findOne({ email: req.body.email });
  // // if (check) {
  // //   return res.status(400).json({
  // //     success: false,
  // //     error: "exisisting user found with same email address",
  // //   });
  // // }
  // let cart = {};
  // for (let i = 0; i < 30; i++) {
  //   cart[i] = 0;
  // }
  // let user = new Users({
  //   name: name,
  //   email: email,
  //   password: password,
  //   cartData: cart,
  // });
  // await user.save();
  // //jwt authentication
  // const data = {
  //   user: {
  //     id: user.id,
  //   },
  // };
  // // const token = jwt.sign(data, "secret_ecom");
  // // res.json({ success: true, token });
  // res.status(200).json({ status: "ok" });
  ////////////////////////////////
  let { name, email, password } = req.body;
  let cart = {};
  for (let i = 0; i < 40; i++) {
    cart[i] = 0;
  }

  let user = new Users({
    name: name,
    email: email,
    password: password,
    cartData: cart,
  });
  await user.save();
  res.status(200).json({ status: "ok" });
});

//user login endpoint

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  console.log("trying to login with", email);

  let userlogin = await Users.findOne({ email });

  if (!userlogin) {
    console.log("user is not availabe");
    return res.status(401).json({ error: "Authentication failed" });
  }
  console.log("user is present");
  const passCompare = password === userlogin.password;
  if (!passCompare) {
    return res.status(401).json({ error: "Authentication failed" });
  }
  console.log("password is wrong");
  const token = jwt.sign({ userId: userlogin._id }, "rkb2345fgvvwlopandkd");
  console.log("almost about to login");
  res.json({ success: true, token });
});

//http://localhost:4000/newcollection

//creating end point for new collection data

app.get("/newcollection", async (req, res) => {
  let products = await Product.find({});

  let newcollection = products.slice(1).slice(-8);

  console.log("new collections fetched");
  res.send(newcollection);
});

//creating middleware to fetch user
const auth = async (req, res, next) => {
  try {
    const token = req.header("auth-token");
    const decoded = jwt.verify(token, "rkb2345fgvvwlopandkd");
    const user = await Users.findOne({ _id: decoded.userId });

    if (!user) {
      console.log("user not found");
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Authentication required" });
  }
};
//creating endpoint for adding items to cart

app.post("/addtocart", auth, async (req, res) => {
  // console.log(req.body, req.user);
  let userData = req.user;
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Added");
});

//endpoint to remove items from cart

app.post("/removefromcart", auth, async (req, res) => {
  let userData = req.user;
  if (userData.cartData[req.body.itemId] > 0) {
    userData.cartData[req.body.itemId] -= 1;
  }

  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Removed");
});

//end point to get all cart data

app.post("/getcartdata", auth, async (req, res) => {
  console.log("getting cart");

  let userData = await Users.findOne({ _id: req.user.id });

  res.json(userData.cartData);
});
