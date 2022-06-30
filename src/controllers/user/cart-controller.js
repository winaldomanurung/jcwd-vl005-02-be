const database = require("../../config").promise();
const createError = require("../../helpers/createError");
const createResponse = require("../../helpers/createResponse");
const httpStatus = require("../../helpers/httpStatusCode");
const {
  editProductSchema,
  addProductSchema,
} = require("../../helpers/validation-schema");

module.exports.readCart = async (req, res) => {
  const userId = req.params.userId || 1;

  try {
    const GET_CART_ITEMS = `
    SELECT
	c.id,
	c.user_id,
	c.product_id,
    p.name,
    pc.name,
    p.stock,
	c.amount,
    p.stock-c.amount as remaining_stock,
    p.price,
    p.picture
	FROM cart_items c
	LEFT JOIN products p ON c.product_id = p.id 
    LEFT JOIN categories pc ON p.category = pc.id
    WHERE c.user_id = ?;`;

    const [CART_ITEMS] = await database.execute(GET_CART_ITEMS, [userId]);

    // validate
    if (!CART_ITEMS.length) {
      throw new createError(
        httpStatus.Internal_Server_Error,
        "There isn't any items in the cart yet",
        "Cart item is not found."
      );
    }

    // create response
    const response = new createResponse(
      httpStatus.OK,
      "Cart data fetched",
      "Cart data fetched successfully!",
      CART_ITEMS,
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
