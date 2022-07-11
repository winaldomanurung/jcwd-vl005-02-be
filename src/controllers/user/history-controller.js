const { uploader } = require("../../helpers/uploader");
const database = require("../../config").promise();
const databaseSync = require("../../config");
const createError = require("../../helpers/createError");
const createResponse = require("../../helpers/createResponse");
const httpStatus = require("../../helpers/httpStatusCode");
const {
  addAddressSchema,
  addProofSchema,
} = require("../../helpers/validation-schema");
const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId();

module.exports.readAllInvoice = async (req, res) => {
  let userId = req.user.id;

  try {
    const GET_INVOICE_HEADERS = `
    SELECT *, date_format(date, '%M %e, %Y') as date FROM invoice_headers h 
        WHERE h.user_id = ${database.escape(userId)} ;`;

    const [INVOICE_HEADERS] = await database.execute(GET_INVOICE_HEADERS);

    // create response
    const response = new createResponse(
      httpStatus.OK,
      "Address data fetched",
      "Address data fetched successfully!",
      INVOICE_HEADERS,
      INVOICE_HEADERS.length
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

// module.exports.readAllInvoice = async (req, res) => {
//   let userId = req.user.id;

//   try {
//     const GET_INVOICE_ITEMS = `
//     SELECT
//     h.id, h.code, h.user_id, date_format(h.date, '%M %e, %Y') as date, h.address_id, a.address, a.city, a.province, a.postal_code, h.shipping_cost, h.total_payment, h.payment_method,
//     h.status, d.invoice_header_id, d.product_id, p.name, d.price, d.amount, d.unit
//         FROM invoice_headers h
//         LEFT JOIN invoice_details d ON h.id = d.invoice_header_id
//         LEFT JOIN products p ON d.product_id = p.id
//         LEFT JOIN address a ON h.address_id = a.id
//         WHERE h.user_id = ${database.escape(userId)} AND d.invoice_header_id=(
//             SELECT
//             id
//             FROM invoice_headers
//             WHERE user_id = ${database.escape(userId)}
//             ORDER  BY date DESC
//             LIMIT 1);`;

//     const [INVOICE_ITEMS] = await database.execute(GET_INVOICE_ITEMS);

//     // create response
//     const response = new createResponse(
//       httpStatus.OK,
//       "Address data fetched",
//       "Address data fetched successfully!",
//       INVOICE_ITEMS,
//       INVOICE_ITEMS.length
//     );

//     res.status(response.status).send(response);
//   } catch (err) {
//     console.log("error : ", err);
//     const isTrusted = err instanceof createError;
//     if (!isTrusted) {
//       err = new createError(
//         httpStatus.Internal_Server_Error,
//         "SQL Script Error",
//         err.sqlMessage
//       );
//       console.log(err);
//     }
//     res.status(err.status).send(err);
//   }
// };
