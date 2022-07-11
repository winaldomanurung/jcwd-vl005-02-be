const db = require("../../config").promise();

// use REDUX untuk menampilkan data

// 1.GET ALL DATA TRANSACTIONS
module.exports.getAllTransactions = async (req, res) => {
  try {
    const GET_ALL_TRANSACTIONS = `SELECT * FROM dummy_transactions;`;
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
  const { id, status, month, startDate, endDate } = req.body;
  try {
    const CHANGE_TRANSACTIONS_STATUS = `UPDATE dummy_transactions SET status = ${db.escape(
      status
    )} WHERE id = ${db.escape(id)};`;

    await db.execute(CHANGE_TRANSACTIONS_STATUS);

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
    const GET_ALL_TRANSACTIONS = `SELECT * FROM dummy_transactions;`;
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
