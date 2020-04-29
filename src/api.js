const express = require("express");
const fs = require("fs");
const path = require("path");
const serverless = require("serverless-http");
const cors = require("cors");
const products = require("../products.json");

const app = express();
const router = express.Router();

const resolveImages = (product) => {
  return {
    ...product,
    images: product.images.map((image) => {
      return `https://auros-api.netlify.app/.netlify/functions/api/product/${product.id}/images/${image}`;
    }),
  };
};

router.get("/products", (req, res) => {
  const { id } = req.query;

  if (!id) {
    res.json(products).end();
    return;
  }

  const idList = id.split(",");

  const foundProducts = idList.map((productId) => {
    return products.find((product) => {
      return productId === product.id;
    });
  });

  res.json(foundProducts.map(resolveImages));
});

router.get("/product/:productId", (req, res) => {
  const productId = req.params.productId;

  const foundProduct = products.find((product) => {
    return productId === product.id;
  });

  if (!foundProduct) {
    return res.status(404).end();
  }

  res.send(resolveImages(foundProduct));
});

router.get("/product/:productId/images/:imageName", (req, res) => {
  const { productId, imageName } = req.params;

  console.log("in the route");

  fs.readFile(
    path.resolve(`static/images/${productId}/${imageName}`),
    (error, image) => {
      console.log("Read an image!");

      if (error) {
        console.log(error);
        return res.status(404);
      }

      res.send(Buffer.from(image));
    }
  );
});

app.use(cors());
app.use("/.netlify/functions/api", router);

module.exports.handler = serverless(app);
