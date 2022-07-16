const db = require("../../config").promise();

// use REDUX untuk menampilkan data

// 1.GET ALL DATA TRANSACTIONS
module.exports.getAllTransactions = async (req, res) => {
  try {
    const GET_ALL_TRANSACTIONS = `SELECT
    h.id, h.code, h.user_id, u.username, h.date, DATE_FORMAT(h.expired_date, '%M %e, %Y') as expired_date, h.address_id, a.address, a.city, a.province, a.postal_code, h.total_payment, h.payment_method,
    h.status, h.total_payment, p.picture_url, DATE_FORMAT(p.created_at, '%M %e, %Y') as created_at, expired_date as exp_date_in_js
        FROM invoice_headers h 
        LEFT JOIN users u ON h.user_id = u.id
        LEFT JOIN address a ON h.address_id = a.id
        LEFT JOIN payments p ON h.id = p.invoice_id;`;
    const DATA = await db.execute(GET_ALL_TRANSACTIONS);
    res.status(200).send(DATA[0]);
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(error);
  }
};

// 2.GET DATA TRANSACTIONS BY DATE RANGE
module.exports.TransactionsByDateRange = async (req, res) => {
  const { startDate, endDate } = req.body;
  try {
    if (startDate === "" && endDate === "") {
      // const GET_ALL_TRANSACTIONS = `SELECT * FROM dummy_transactions;`;
      // const DATA = await db.execute(GET_ALL_TRANSACTIONS);
      return res.status(200).send(DATA[0]);
    }
    const TRANSACTIONS_BY_DATE_RANGE = `SELECT * from dummy_transactions where date(payment_date) between date(${db.escape(
      startDate
    )}) and date(${db.escape(endDate)});`;
    const DATA = await db.execute(TRANSACTIONS_BY_DATE_RANGE);
    console.log(startDate);
    console.log(endDate);
    res.status(200).send(DATA[0]);
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(error);
  }
};

// 3.GET DATA TRANSACTIONS BY MONTH
module.exports.TransactionsByMonth = async (req, res) => {
  const { month } = req.body;
  try {
    if (!month.length) {
      // const GET_ALL_TRANSACTIONS = `SELECT * FROM dummy_transactions;`;
      // const DATA = await db.execute(GET_ALL_TRANSACTIONS);
      return res.status(200).send(DATA[0]);
    }
    const TRANSACTIONS_BY_MONTH = `SELECT * FROM dummy_transactions WHERE DATE_FORMAT(payment_date,'%Y-%m') = ${db.escape(
      month
    )}`;
    const DATA = await db.execute(TRANSACTIONS_BY_MONTH);
    console.log(month);
    res.status(200).send(DATA[0]);
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(error);
  }
};

// 4. CHANGE TRANSACTION STATUS
module.exports.ChangeTransactionsStatus = async (req, res) => {
  const {
    id,
    status,
    month,
    startDate,
    endDate,
    userId,
    message,
    invoiceHeaderId,
    invoiceHeaderCode,
  } = req.body;
  try {
    const CHANGE_TRANSACTIONS_STATUS = `UPDATE invoice_headers SET status = ${db.escape(
      status
    )} WHERE id = ${db.escape(id)};`;

    await db.execute(CHANGE_TRANSACTIONS_STATUS);

    const ADD_NOTIFICATION = `INSERT INTO user_notifications (user_id, message, invoice_header_id, invoice_header_code)
    VALUES (
    ${db.escape(userId)}, ${db.escape(message)}, ${db.escape(
      invoiceHeaderId
    )}, ${db.escape(invoiceHeaderCode)});`;

    await db.execute(ADD_NOTIFICATION);

    // res.status(200).send(status);

    // if (month !== "") {
    //   const TRANSACTIONS_BY_MONTH = `SELECT * FROM dummy_transactions WHERE DATE_FORMAT(payment_date,'%Y-%m') = ${db.escape(
    //     month
    //   )}`;
    //   const DATA = await db.execute(TRANSACTIONS_BY_MONTH);
    //   console.log(month);

    //   res.status(200).send(DATA[0]);
    // } else if (startDate !== "" && endDate !== "") {
    //   const TRANSACTIONS_BY_DATE_RANGE = `SELECT * from dummy_transactions where date(payment_date) between date(${db.escape(
    //     startDate
    //   )}) and date(${db.escape(endDate)});`;
    //   const DATA = await db.execute(TRANSACTIONS_BY_DATE_RANGE);
    //   console.log(startDate);
    //   console.log(endDate);
    //   res.status(200).send(DATA[0]);
    // } else {
    const GET_ALL_TRANSACTIONS = `SELECT
    h.id, h.code, h.user_id, u.username, h.date, DATE_FORMAT(h.expired_date, '%M %e, %Y') as expired_date, h.address_id, a.address, a.city, a.province, a.postal_code, h.total_payment, h.payment_method,
    h.status, h.total_payment, p.picture_url, DATE_FORMAT(p.created_at, '%M %e, %Y') as created_at, expired_date as exp_date_in_js
        FROM invoice_headers h 
        LEFT JOIN users u ON h.user_id = u.id
        LEFT JOIN address a ON h.address_id = a.id
        LEFT JOIN payments p ON h.id = p.invoice_id;`;
    const DATA = await db.execute(GET_ALL_TRANSACTIONS);
    res.status(200).send(DATA[0]);
    // }
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(error);
  }
};

// SELECT * FROM pharmastore.dummy_transactions;
// -- DATE RANGE
// SELECT * from dummy_transactions
// where date(payment_date) between date('2021-01-03') and date('2021-12-05');

// -- MONTH AND YEAR
// SELECT * FROM dummy_transactions WHERE DATE_FORMAT(payment_date,'%Y-%m') = '2022-04'

module.exports.getTransactionPayment = async (req, res) => {
  let invoiceId = req.params.id;
  console.log(invoiceId);
  try {
    const GET_TRANSACTIONS_IMAGE = `SELECT picture_url FROM payments WHERE invoice_id=${db.escape(
      invoiceId
    )};`;
    const IMAGE = await db.execute(GET_TRANSACTIONS_IMAGE);
    console.log(IMAGE[0][0]["picture_url"]);
    res.status(200).send(IMAGE[0][0]["picture_url"]);
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(error);
  }
};
