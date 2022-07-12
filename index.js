const express = require("express");
const app = express();
const cors = require("cors");
const bearerToken = require("express-bearer-token");

require("dotenv").config();

const port = process.env.PORT || 2000;
const routers = require("./src/routes");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    exposedHeaders: ["UID", "Auth-Token", "Authorization"],
  })
);
app.use(express.static("public"));
app.use(bearerToken());

// Database connection
const connection = require("./src/config");
connection.connect((error) => {
  if (error) {
    console.log("Database connection error: ", error);
  }

  console.log(
    `Database connection is established at ID: ${connection.threadId}`
  );
});

app.get("/", (req, res) => {
  res.send("<h1>TEST</h1>");
});

app.use("/admin", routers.adminProductRouter);
app.use("/admin", routers.adminTransactionRouter);
app.use("/admin", routers.adminReportRouter);
app.use("/admin/categories", routers.adminCategoriesRouter);
app.use("/users", routers.user_router);
app.use("/user/products", routers.userProductRouter);
app.use("/user/cart", routers.userCartRouter);
app.use("/user/checkout", routers.userCheckoutRouter);
app.use("/user/payment", routers.braintreeRouter);
app.use("/user/history", routers.historyRouter);

app.listen(port, () => {
  console.log("Listening to Port: " + port);
});
