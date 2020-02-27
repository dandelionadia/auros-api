const express = require("express");
const serverless = require("serverless-http");
const products = require("../products.json");

const app = express();
const router = express.Router();

router.get("/products", (req, res) => {
  res.json(products);
});

router.get("/product/:productId", (req, res) => {
  const productId = req.params.productId;

  const foundProduct = products.find(product => {
    return productId === product.id;
  });

  if (!foundProduct) {
    return res.status(404).end();
  }

  res.send(foundProduct);
});

app.use("/.netlify/functions/api", router);

module.exports.handler = serverless(app);
