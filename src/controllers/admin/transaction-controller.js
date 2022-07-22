const db = require("../../config").promise();

// use REDUX untuk menampilkan data

// 1.GET ALL DATA TRANSACTIONS
module.exports.getAllTransactions = async (req, res) => {
  try {
    const GET_ALL_TRANSACTIONS = `SELECT
    h.id, h.code, h.user_id, CONCAT(u.first_name, ' ', u.last_name) AS name, h.date, DATE_FORMAT(h.expired_date, '%M %e, %Y') as expired_date, h.address, h.city, h.province, h.postal_code, h.total_payment, h.payment_method,
    h.status, h.total_payment, p.picture_url, DATE_FORMAT(p.created_at, '%M %e, %Y') as created_at, expired_date as exp_date_in_js
        FROM invoice_headers h 
        LEFT JOIN users u ON h.user_id = u.id
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
      return res.status(200).send(DATA[0]);
    }
    const TRANSACTIONS_BY_DATE_RANGE = `
    SELECT
    h.id, h.code, h.user_id, CONCAT(u.first_name, ' ', u.last_name) AS name , h.date, DATE_FORMAT(h.expired_date, '%M %e, %Y') as expired_date, h.address, h.city, h.province, h.postal_code, h.total_payment, h.payment_method,
    h.status, h.total_payment, p.picture_url, DATE_FORMAT(p.created_at, '%M %e, %Y') as created_at, expired_date as exp_date_in_js
        FROM invoice_headers h 
        LEFT JOIN users u ON h.user_id = u.id
        LEFT JOIN payments p ON h.id = p.invoice_id
    where date(date) between date(${db.escape(startDate)}) and date(${db.escape(
      endDate
    )});`;

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
      return res.status(200).send(DATA[0]);
    }
    const TRANSACTIONS_BY_MONTH = `
    SELECT
    h.id, h.code, h.user_id, CONCAT(u.first_name, ' ', u.last_name) AS name, h.date, DATE_FORMAT(h.expired_date, '%M %e, %Y') as expired_date, h.address, h.city, h.province, h.postal_code, h.total_payment, h.payment_method,
    h.status, h.total_payment, p.picture_url, DATE_FORMAT(p.created_at, '%M %e, %Y') as created_at, expired_date as exp_date_in_js
        FROM invoice_headers h 
        LEFT JOIN users u ON h.user_id = u.id
        LEFT JOIN payments p ON h.id = p.invoice_id
    WHERE DATE_FORMAT(date,'%Y-%m') = ${db.escape(month)}`;

    const DATA = await db.execute(TRANSACTIONS_BY_MONTH);
    console.log(month);
    res.status(200).send(DATA[0]);
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(error);
  }
};

// 4. CHANGE TRANSACTION STATUS
module.exports.ChangeTransactionsStatusApproved = async (req, res) => {
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

    const GET_NOTIFICATION_ID = `SELECT id FROM user_notifications 
    WHERE invoice_header_code=${db.escape(invoiceHeaderCode)}`;
    console.log(GET_NOTIFICATION_ID);
    const NOTIFICATION_ID = await db.execute(GET_NOTIFICATION_ID);
    // Add or update notification
    if (!NOTIFICATION_ID[0].length) {
      const ADD_NOTIFICATION = `INSERT INTO user_notifications (user_id, message, invoice_header_id, invoice_header_code, opened)
    VALUES (
    ${db.escape(userId)}, ${db.escape(message)}, ${db.escape(
        invoiceHeaderId
      )}, ${db.escape(invoiceHeaderCode)}, 'false');`;

      await db.execute(ADD_NOTIFICATION);
    } else {
      let notificationId = NOTIFICATION_ID[0][0].id;
      const UPDATE_NOTIFICATION = `
        UPDATE user_notifications
        SET message = ${db.escape(message)}, opened='false'
        WHERE id=${db.escape(notificationId)};`;
      await db.execute(UPDATE_NOTIFICATION);
    }

    // res.status(200).send(status);

    if (month !== "") {
      const TRANSACTIONS_BY_MONTH = `
      SELECT
      h.id, h.code, h.user_id,CONCAT(u.first_name, ' ', u.last_name) AS name, h.date, DATE_FORMAT(h.expired_date, '%M %e, %Y') as expired_date, h.address, h.city, h.province, h.postal_code, h.total_payment, h.payment_method,
      h.status, h.total_payment, p.picture_url, DATE_FORMAT(p.created_at, '%M %e, %Y') as created_at, expired_date as exp_date_in_js
          FROM invoice_headers h 
          LEFT JOIN users u ON h.user_id = u.id
          LEFT JOIN payments p ON h.id = p.invoice_id
      WHERE DATE_FORMAT(date,'%Y-%m') = ${db.escape(month)}`;
      const DATA = await db.execute(TRANSACTIONS_BY_MONTH);
      res.status(200).send(DATA[0]);
    } else if (startDate !== "" && endDate !== "") {
      const TRANSACTIONS_BY_DATE_RANGE = `
    SELECT
    h.id, h.code, h.user_id,CONCAT(u.first_name, ' ', u.last_name) AS name, h.date, DATE_FORMAT(h.expired_date, '%M %e, %Y') as expired_date, h.address, h.city, h.province, h.postal_code, h.total_payment, h.payment_method,
    h.status, h.total_payment, p.picture_url, DATE_FORMAT(p.created_at, '%M %e, %Y') as created_at, expired_date as exp_date_in_js
        FROM invoice_headers h 
        LEFT JOIN users u ON h.user_id = u.id
        LEFT JOIN payments p ON h.id = p.invoice_id
    where date(date) between date(${db.escape(startDate)}) and date(${db.escape(
        endDate
      )});`;

      const DATA = await db.execute(TRANSACTIONS_BY_DATE_RANGE);
      console.log(startDate);
      console.log(endDate);
      res.status(200).send(DATA[0]);
    } else {
      const GET_ALL_TRANSACTIONS = `SELECT
      h.id, h.code, h.user_id,CONCAT(u.first_name, ' ', u.last_name) AS name, h.date, DATE_FORMAT(h.expired_date, '%M %e, %Y') as expired_date, h.address, h.city, h.province, h.postal_code, h.total_payment, h.payment_method,
      h.status, h.total_payment, p.picture_url, DATE_FORMAT(p.created_at, '%M %e, %Y') as created_at, expired_date as exp_date_in_js
          FROM invoice_headers h 
          LEFT JOIN users u ON h.user_id = u.id
          LEFT JOIN payments p ON h.id = p.invoice_id;`;
      const DATA = await db.execute(GET_ALL_TRANSACTIONS);
      res.status(200).send(DATA[0]);
    }

    // }
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(error);
  }
};

module.exports.ChangeTransactionsStatusRejected = async (req, res) => {
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

    const GET_NOTIFICATION_ID = `SELECT id FROM user_notifications 
    WHERE invoice_header_code=${db.escape(invoiceHeaderCode)}`;
    console.log(GET_NOTIFICATION_ID);
    const NOTIFICATION_ID = await db.execute(GET_NOTIFICATION_ID);
    // console.log(NOTIFICATION_ID[0].length);
    // console.log(NOTIFICATION_ID[0][0].length);

    // Add or update notification
    if (!NOTIFICATION_ID[0].length) {
      const ADD_NOTIFICATION = `INSERT INTO user_notifications (user_id, message, invoice_header_id, invoice_header_code, opened)
    VALUES (
    ${db.escape(userId)}, ${db.escape(message)}, ${db.escape(
        invoiceHeaderId
      )}, ${db.escape(invoiceHeaderCode)}, 'false');`;

      await db.execute(ADD_NOTIFICATION);
    } else {
      let notificationId = NOTIFICATION_ID[0][0].id;
      const UPDATE_NOTIFICATION = `
        UPDATE user_notifications
        SET message = ${db.escape(message)}, opened='false'
        WHERE id=${db.escape(notificationId)};`;
      await db.execute(UPDATE_NOTIFICATION);
    }

    const GET_CHECKOUT_ITEMS = `
    SELECT *
    FROM invoice_details
    WHERE invoice_header_id = ${db.escape(invoiceHeaderId)};`;

    const CHECKOUT_ITEMS = await db.execute(GET_CHECKOUT_ITEMS);

    console.log("CHECKOUT_ITEMS");
    console.log(CHECKOUT_ITEMS[0]);

    CHECKOUT_ITEMS[0].map(async (item) => {
      const INCREASE_PRODUCT_STOCK = `
    UPDATE products
    SET stock_in_unit=stock_in_unit+${db.escape(
      item.amount
    )}, stock=GREATEST(CEIL(stock_in_unit/volume),0)
    WHERE id=${db.escape(item.product_id)};`;
      console.log(INCREASE_PRODUCT_STOCK);

      await db.execute(INCREASE_PRODUCT_STOCK);
    });
    if (month !== "") {
      const TRANSACTIONS_BY_MONTH = `
      SELECT
      h.id, h.code, h.user_id,CONCAT(u.first_name, ' ', u.last_name) AS name, h.date, DATE_FORMAT(h.expired_date, '%M %e, %Y') as expired_date, h.address, h.city, h.province, h.postal_code, h.total_payment, h.payment_method,
      h.status, h.total_payment, p.picture_url, DATE_FORMAT(p.created_at, '%M %e, %Y') as created_at, expired_date as exp_date_in_js
          FROM invoice_headers h 
          LEFT JOIN users u ON h.user_id = u.id
          LEFT JOIN payments p ON h.id = p.invoice_id
      WHERE DATE_FORMAT(date,'%Y-%m') = ${db.escape(month)}`;
      const DATA = await db.execute(TRANSACTIONS_BY_MONTH);
      res.status(200).send(DATA[0]);
    } else if (startDate !== "" && endDate !== "") {
      const TRANSACTIONS_BY_DATE_RANGE = `
    SELECT
    h.id, h.code, h.user_id,CONCAT(u.first_name, ' ', u.last_name) AS name, h.date, DATE_FORMAT(h.expired_date, '%M %e, %Y') as expired_date, h.address, h.city, h.province, h.postal_code, h.total_payment, h.payment_method,
    h.status, h.total_payment, p.picture_url, DATE_FORMAT(p.created_at, '%M %e, %Y') as created_at, expired_date as exp_date_in_js
        FROM invoice_headers h 
        LEFT JOIN users u ON h.user_id = u.id
        LEFT JOIN payments p ON h.id = p.invoice_id
    where date(date) between date(${db.escape(startDate)}) and date(${db.escape(
        endDate
      )});`;

      const DATA = await db.execute(TRANSACTIONS_BY_DATE_RANGE);
      console.log(startDate);
      console.log(endDate);
      res.status(200).send(DATA[0]);
    } else {
      const GET_ALL_TRANSACTIONS = `SELECT
      h.id, h.code, h.user_id,CONCAT(u.first_name, ' ', u.last_name) AS name, h.date, DATE_FORMAT(h.expired_date, '%M %e, %Y') as expired_date, h.address, h.city, h.province, h.postal_code, h.total_payment, h.payment_method,
      h.status, h.total_payment, p.picture_url, DATE_FORMAT(p.created_at, '%M %e, %Y') as created_at, expired_date as exp_date_in_js
          FROM invoice_headers h 
          LEFT JOIN users u ON h.user_id = u.id
          LEFT JOIN payments p ON h.id = p.invoice_id;`;
      const DATA = await db.execute(GET_ALL_TRANSACTIONS);
      res.status(200).send(DATA[0]);
    }
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(error);
  }
};

// GET PAYMENT PROOF  BY INVOICE ID
module.exports.getTransactionsById = async (req, res) => {
  const invoiceId = req.params.invoiceId;
  try {
    const GET_TRANSACTIONS_BY_INVOICEID = `
    select i.id,
    i.code,
    concat(u.first_name,' ', u.last_name) as customer_name,
    i.status,
    i.total_payment,
    i.date,
    p.picture_url as payment_proof 
    from invoice_headers i 
    left join users u on i.user_id = u.id 
    left join  payments p on i.id = p.invoice_id where i.id = ?`;
    const [DATA] = await db.execute(GET_TRANSACTIONS_BY_INVOICEID, [invoiceId]);
    res.status(200).send(DATA[0].payment_proof);
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(error);
  }
};
