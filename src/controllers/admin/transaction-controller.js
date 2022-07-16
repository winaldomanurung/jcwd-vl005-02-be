const db = require("../../config").promise();

// use REDUX untuk menampilkan data

// 1.GET ALL DATA TRANSACTIONS
module.exports.getAllTransactions = async (req, res) => {
  try {
    const GET_ALL_TRANSACTIONS = `
    select i.id,
    i.code,
    concat(u.first_name,' ', u.last_name) as customer_name,
    i.status,
    i.total_payment,
    date,
    p.picture_url as payment_proof 
    from invoice_headers i 
    left join users u on i.user_id = u.id 
    left join  payments p on i.id = p.invoice_id`;
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
    select i.id,
    i.code,
    concat(u.first_name,' ', u.last_name) as customer_name,
    i.status,
    i.total_payment,
    i.date,
    p.picture_url as payment_proof from invoice_headers i 
    left join users u on i.user_id = u.id 
    left join  payments p on i.id = p.invoice_id
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
      // const GET_ALL_TRANSACTIONS = `SELECT * FROM dummy_transactions;`;
      // const DATA = await db.execute(GET_ALL_TRANSACTIONS);
      return res.status(200).send(DATA[0]);
    }
    const TRANSACTIONS_BY_MONTH = `
    select i.id,
    i.code,
    concat(u.first_name,' ', u.last_name) as customer_name,
    i.status,
    i.total_payment,
    i.date,
    p.picture_url as payment_proof 
    from invoice_headers i 
    left join users u on i.user_id = u.id 
    left join payments p on i.id = p.invoice_id 
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
module.exports.ChangeTransactionsStatus = async (req, res) => {
  const { id, status, month, startDate, endDate } = req.body;
  try {
    const CHANGE_TRANSACTIONS_STATUS = `UPDATE invoice_headers SET status = ${db.escape(
      status
    )} WHERE id = ${db.escape(id)};`;

    await db.execute(CHANGE_TRANSACTIONS_STATUS);

    // res.status(200).send(status);

    if (month !== "") {
      const TRANSACTIONS_BY_MONTH = `
      select i.id,
      i.code,
      concat(u.first_name,' ', u.last_name) as customer_name,
      i.status,
      i.total_payment,
      i.date,
      p.picture_url as payment_proof 
      from invoice_headers i 
      left join users u on i.user_id = u.id 
      left join payments p on i.id = p.invoice_id 
      WHERE DATE_FORMAT(date,'%Y-%m') = ${db.escape(month)}`;

      const DATA = await db.execute(TRANSACTIONS_BY_MONTH);
      console.log(month);
      res.status(200).send(DATA[0]);
    } else if (startDate !== "" && endDate !== "") {
      const TRANSACTIONS_BY_DATE_RANGE = `
      select i.id,
      i.code,
      concat(u.first_name,' ', u.last_name) as customer_name,
      i.status,
      i.total_payment,
      i.date,
      p.picture_url as payment_proof from invoice_headers i 
      left join users u on i.user_id = u.id 
      left join  payments p on i.id = p.invoice_id
      where date(date) between date(${db.escape(
        startDate
      )}) and date(${db.escape(endDate)});`;

      const DATA = await db.execute(TRANSACTIONS_BY_DATE_RANGE);
      console.log(startDate);
      console.log(endDate);
      res.status(200).send(DATA[0]);
    } else {
      const GET_ALL_TRANSACTIONS = `
      select i.id,
      i.code,
      concat(u.first_name,' ', u.last_name) as customer_name,
      i.status,
      i.total_payment,
      i.date,
      p.picture_url as payment_proof 
      from invoice_headers i 
      left join users u on i.user_id = u.id 
      left join  payments p on i.id = p.invoice_id`;
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
