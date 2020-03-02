const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const products = require("../products.json");

const app = express();
const router = express.Router();

router.get("/products", (req, res) => {
  const { id } = req.query;

  if (!id) {
    res.json(products).end();
    return;
  }

  const idList = id.split(",");

  const foundProducts = idList.map(productId => {
    return products.find(product => {
      return productId === product.id;
    });
  });
  res.json(foundProducts);
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

app.use(cors());
app.use("/.netlify/functions/api", router);

module.exports.handler = serverless(app);
