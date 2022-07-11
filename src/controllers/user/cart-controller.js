const database = require("../../config").promise();
const createError = require("../../helpers/createError");
const createResponse = require("../../helpers/createResponse");
const httpStatus = require("../../helpers/httpStatusCode");
const {
  editProductSchema,
  addProductSchema,
} = require("../../helpers/validation-schema");

module.exports.readAllCart = async (req, res) => {
  let userId = req.user.id;

  try {
    const GET_CART_ITEMS = `
    SELECT
    c.id,
    c.user_id,
    c.product_id,
      p.name, p.unit,
      pc.name as category,
      p.stock, p.stock_in_unit,
    c.amount,
      p.stock-c.amount as remaining_stock,
      p.price,
      p.picture
    FROM cart_items c
    LEFT JOIN products p ON c.product_id = p.id 
      LEFT JOIN categories pc ON p.category = pc.id
    WHERE c.user_id = ${userId};`;

    const [CART_ITEMS] = await database.execute(GET_CART_ITEMS);

    // create response
    const response = new createResponse(
      httpStatus.OK,
      "Cart data fetched",
      "Cart data fetched successfully!",
      CART_ITEMS,
      CART_ITEMS.length
    );

    res.status(response.status).send(response);
  } catch (err) {
    console.log("error : ", err);
    const isTrusted = err instanceof createError;
    if (!isTrusted) {
      err = new createError(
        httpStatus.Internal_Server_Error,
        "SQL Script Error",
        err.sqlMessage
      );
      console.log(err);
    }
    res.status(err.status).send(err);
  }
};

module.exports.readCart = async (req, res) => {
  // const userId = req.params.userId || 1;
  const userId = req.user.id;
  console.log(userId);
  const page = req.query.page || 1;
  const offset = (page - 1) * 5;
  console.log("masuk");

  try {
    const GET_CART_ITEMS = `
    SELECT
    c.id,
    c.user_id,
    c.product_id,
      p.name, p.unit,
      pc.name as category,
      p.stock, p.stock_in_unit,
    c.amount,
      p.stock-c.amount as remaining_stock,
      p.price,
      p.picture
    FROM cart_items c
    LEFT JOIN products p ON c.product_id = p.id 
      LEFT JOIN categories pc ON p.category = pc.id
    WHERE c.user_id = ${userId} LIMIT ${offset}, 5;`;

    const [CART_ITEMS] = await database.execute(GET_CART_ITEMS);

    if (!CART_ITEMS.length) {
      // create response
      const response = new createResponse(
        httpStatus.OK,
        "There isn't any items in the cart yet",
        "Cart item is not found.",
        { items: CART_ITEMS, total: CART_ITEMS.length },
        CART_ITEMS.length
      );

      res.status(response.status).send(response);
    } else {
      const GET_CART_ITEMS_TOTAL = `SELECT * FROM cart_items 
      WHERE user_id = ${userId};`;
      const [TOTAL_CART_ITEMS] = await database.execute(GET_CART_ITEMS_TOTAL);

      let total;
      if (TOTAL_CART_ITEMS <= CART_ITEMS.length) {
        total = CART_ITEMS.length;
      } else {
        total = TOTAL_CART_ITEMS.length;
      }

      // create response
      const response = new createResponse(
        httpStatus.OK,
        "Cart data fetched",
        "Cart data fetched successfully!",
        CART_ITEMS,
        total
      );

      res.status(response.status).send(response);
    }
  } catch (err) {
    console.log("error : ", err);
    const isTrusted = err instanceof createError;
    console.log("error");
    if (!isTrusted) {
      err = new createError(
        httpStatus.Internal_Server_Error,
        "SQL Script Error",
        err.sqlMessage
      );
      console.log(err);
    }
    res.status(err.status).send(err);
  }
};

module.exports.addToCart = async (req, res) => {
  let userId = req.user.id;
  let productId = req.params.productId;
  // console.log(userId);
  // console.log(productId);

  try {
    // // validation for body
    // const { error } = addCategorySchema.validate(req.body);
    // if (error) {
    //   throw new createError(
    //     httpStatus.Bad_Request,
    //     "Create category failed",
    //     error.details[0].message
    //   );
    // }

    // validation for duplicate data
    const CHECK_ITEM = `
            SELECT id
            FROM cart_items
            WHERE user_id = ${database.escape(
              userId
            )} AND product_id = ${database.escape(productId)};`;
    const [ITEM] = await database.execute(CHECK_ITEM);

    if (ITEM.length) {
      const itemId = ITEM[0].id;
      // define query
      const UPDATE_ITEM = `
            UPDATE cart_items SET amount = amount+1
            WHERE id=${database.escape(itemId)};`;
      const [ITEM_UPDATED] = await database.execute(UPDATE_ITEM);

      // create respond
      const response = new createResponse(
        httpStatus.OK,
        "Update item's amount success",
        `Your cart item's amount is updated.`,
        ITEM_UPDATED,
        ""
      );
      res.status(response.status).send(response);
    } else {
      // define query
      const ADD_ITEM = `
      INSERT INTO cart_items(user_id, product_id, amount)
      VALUES(
          ${database.escape(userId)},${database.escape(
        productId
      )},${database.escape(1)}
      );
  `;
      const [ITEM_ADDED] = await database.execute(ADD_ITEM);

      // create respond
      const response = new createResponse(
        httpStatus.OK,
        "Add item success",
        `Your cart item is updated.`,
        ITEM_ADDED,
        ""
      );
      res.status(response.status).send(response);
    }
  } catch (err) {
    console.log("error : ", err);
    const isTrusted = err instanceof createError;
    if (!isTrusted) {
      err = new createError(
        httpStatus.Internal_Server_Error,
        "SQL Script Error",
        err.sqlMessage
      );
      console.log(err);
    }
    res.status(err.status).send(err);
  }
};

module.exports.addToCartWithQuantity = async (req, res) => {
  let userId = req.user.id;
  let productId = req.params.productId;
  let qty = req.params.qty;
  // console.log(userId);
  // console.log(productId);
  console.log(qty);

  try {
    // // validation for body
    // const { error } = addCategorySchema.validate(req.body);
    // if (error) {
    //   throw new createError(
    //     httpStatus.Bad_Request,
    //     "Create category failed",
    //     error.details[0].message
    //   );
    // }

    // validation for duplicate data
    const CHECK_ITEM = `
            SELECT 
              c.id,
              c.user_id,
              c.product_id, 
              c.amount, 
              p.stock, p.stock_in_unit
            FROM cart_items c
            LEFT JOIN products p ON c.product_id = p.id
            WHERE user_id = ${database.escape(
              userId
            )} AND product_id = ${database.escape(productId)};`;
    const [ITEM] = await database.execute(CHECK_ITEM);

    console.log(ITEM);

    if (ITEM.length) {
      const itemId = ITEM[0].id;
      const qtyToAdd = parseInt(qty);
      const qtyExisting = parseInt(ITEM[0].amount);
      const qtyStock = parseInt(ITEM[0].stock);

      let UPDATE_ITEM;

      if (qtyExisting + qtyToAdd <= qtyStock) {
        // define query
        console.log("masuk if");
        UPDATE_ITEM = `
              UPDATE cart_items SET amount = amount+${qtyToAdd}
              WHERE id=${database.escape(itemId)};`;
      } else {
        console.log("masuk else");
        UPDATE_ITEM = `
              UPDATE cart_items SET amount = ${qtyStock}
              WHERE id=${database.escape(itemId)};`;
      }
      const [ITEM_UPDATED] = await database.execute(UPDATE_ITEM);

      // create respond
      const response = new createResponse(
        httpStatus.OK,
        "Update item's amount success",
        `Your cart item's amount is updated.`,
        ITEM_UPDATED,
        ""
      );
      res.status(response.status).send(response);
    } else {
      // define query
      const ADD_ITEM = `
      INSERT INTO cart_items(user_id, product_id, amount)
      VALUES(
          ${database.escape(userId)},${database.escape(productId)},${qty}
      );
  `;
      const [ITEM_ADDED] = await database.execute(ADD_ITEM);

      // create respond
      const response = new createResponse(
        httpStatus.OK,
        "Add item success",
        `Your cart item is updated.`,
        ITEM_ADDED,
        ""
      );
      res.status(response.status).send(response);
    }
  } catch (err) {
    console.log("error : ", err);
    const isTrusted = err instanceof createError;
    if (!isTrusted) {
      err = new createError(
        httpStatus.Internal_Server_Error,
        "SQL Script Error",
        err.sqlMessage
      );
      console.log(err);
    }
    res.status(err.status).send(err);
  }
};

module.exports.updateCartQuantity = async (req, res) => {
  let userId = req.user.id;
  let productId = req.params.productId;
  let qty = req.body.qty;

  console.log(userId, productId);

  try {
    // 1. Check data apakah item exist di dalam cart
    const CHECK_ITEM = `
            SELECT id
            FROM cart_items
            WHERE user_id = ${database.escape(
              userId
            )} AND product_id = ${database.escape(productId)};`;
    const [ITEM] = await database.execute(CHECK_ITEM);

    if (!ITEM.length) {
      throw new createError(
        httpStatus.Bad_Request,
        "Cart update failed",
        "Product is not exist in the cart!"
      );
    }

    //  2. Buat query untuk update
    const itemId = ITEM[0].id;
    // define query
    const UPDATE_ITEM = `
            UPDATE cart_items SET amount = ${database.escape(qty)}
            WHERE id=${database.escape(itemId)};`;
    const [ITEM_UPDATED] = await database.execute(UPDATE_ITEM);

    // create respond
    const response = new createResponse(
      httpStatus.OK,
      "Update item's amount success",
      `Your cart item's amount is updated.`,
      ITEM_UPDATED,
      ""
    );
    res.status(response.status).send(response);
  } catch (err) {
    console.log("error : ", err);
    const isTrusted = err instanceof createError;
    if (!isTrusted) {
      err = new createError(
        httpStatus.Internal_Server_Error,
        "SQL Script Error",
        err.sqlMessage
      );
      console.log(err);
    }
    res.status(err.status).send(err);
  }
};

module.exports.deleteCartItem = async (req, res) => {
  let userId = req.user.id;
  let productId = req.params.productId;

  try {
    // check category data by its categoryId
    const CHECK_ITEM = `
            SELECT id
            FROM cart_items
            WHERE user_id = ${database.escape(
              userId
            )} AND product_id = ${database.escape(productId)};`;
    const [ITEM] = await database.execute(CHECK_ITEM);

    if (!ITEM.length) {
      throw new createError(
        httpStatus.Bad_Request,
        "Delete item failed",
        "Item is not exist!"
      );
    }

    const itemId = ITEM[0].id;

    // define query delete
    const DELETE_ITEM = `DELETE FROM cart_items WHERE id = ?;`;
    const [DELETED_ITEM] = await database.execute(DELETE_ITEM, [itemId]);

    console.log(DELETED_ITEM);

    // send respond to client-side
    const response = new createResponse(
      httpStatus.OK,
      "Delete item success",
      "Item deleted successfully!",
      "",
      ""
    );

    res.status(response.status).send(response);
  } catch (err) {
    console.log("error : ", err);
    const isTrusted = err instanceof createError;
    if (!isTrusted) {
      err = new createError(
        httpStatus.Internal_Server_Error,
        "SQL Script Error",
        err.sqlMessage
      );
      console.log(err);
    }
    res.status(err.status).send(err);
  }
};
