const express = require("express");
const products = require("./products.json");

const app = express();

app.get("/products", (req, res) => {
  res.json(products);
});

app.get("/product/:productId", (req, res) => {
  const productId = req.params.productId;

  const foundProduct = products.find(product => {
    return productId === product.id;
  });

  if (!foundProduct) {
    return res.status(404).end();
  }

  res.send(foundProduct);
});

app.listen(8040, () => {
  console.log("http://localhost:8040");
});
