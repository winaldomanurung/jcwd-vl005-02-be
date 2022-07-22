const db = require("../../config").promise();

// 1.GET  REPORT CURRENT MONTH
module.exports.reports = async (req, res) => {
  try {
    // CURRENT MONTH
    const GET_REVENUE = `
    SELECT 
    DATE_FORMAT(date,'%Y-%m') AS current_month, SUM(shopping_amount) AS revenue
FROM
    invoice_headers
WHERE
    status = 'Approved'
        AND DATE(date) >= (LAST_DAY(NOW()) + INTERVAL 1 DAY - INTERVAL 1 MONTH)
        AND DATE(date) < (LAST_DAY(NOW()) + INTERVAL 1 DAY)
GROUP BY month(date);
    `;

    // CURRENT MONTH
    const GET_NUMBER_OF_SALES = `
    SELECT 
    month(date) AS current_month,
    SUM(ID.amount) AS number_of_sales
FROM
    invoice_details ID
        LEFT JOIN
    invoice_headers IH ON ID.invoice_header_id = IH.id
WHERE
    status = 'Approved'
        AND DATE(date) >= (LAST_DAY(NOW()) + INTERVAL 1 DAY - INTERVAL 1 MONTH)
        AND DATE(date) < (LAST_DAY(NOW()) + INTERVAL 1 DAY)
GROUP BY month(date);
    `;

    // TOP 3 MOST SOLD CURRENT MONTH

    GET_TOP_THREE = `
    SELECT 
    MONTH(date) AS current_month,
    ID.product_id AS id,
    P.name AS product,
    C.name AS category,
    ID.price,
    ID.unit,
    SUM(ID.amount) AS sold
FROM
    invoice_details ID
        LEFT JOIN
    invoice_headers IH ON ID.invoice_header_id = IH.id
        LEFT JOIN
    products P ON ID.product_id = P.id
        LEFT JOIN
    categories C ON P.category = C.id
WHERE
    status = 'Approved'
        AND DATE(date) >= (LAST_DAY(NOW()) + INTERVAL 1 DAY - INTERVAL 1 MONTH)
        AND DATE(date) < (LAST_DAY(NOW()) + INTERVAL 1 DAY)
GROUP BY product_id
ORDER BY sold DESC
LIMIT 3;    
    `;
    const GET_DATA_TRANSACTIONS = `
SELECT 
    i.id,
    i.code,
    CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
    i.status,
    i.shopping_amount,
    i.shipping_cost,
    i.total_payment,
    i.payment_method,
    i.date
FROM
    invoice_headers i
        LEFT JOIN
    users u ON i.user_id = u.id
        LEFT JOIN
    payments p ON i.id = p.invoice_id
WHERE
    status = 'Approved'
        AND DATE(date) >= (LAST_DAY(NOW()) + INTERVAL 1 DAY - INTERVAL 1 MONTH)
        AND DATE(date) < (LAST_DAY(NOW()) + INTERVAL 1 DAY)
    `;

    const [REVENUE] = await db.execute(GET_REVENUE);
    const [NUMBER_OF_SALES] = await db.execute(GET_NUMBER_OF_SALES);
    const [TOP_THREE] = await db.execute(GET_TOP_THREE);
    const [DATA_TRANSACTIONS] = await db.execute(GET_DATA_TRANSACTIONS);

    const current_month = REVENUE[0].current_month;
    const revenue = REVENUE[0].revenue;
    const cost = revenue * 0.4;
    const profit = revenue - cost;
    const number_of_sales = NUMBER_OF_SALES[0].number_of_sales;
    const top_three = TOP_THREE;
    const data_transactions = DATA_TRANSACTIONS;
    if (
      !REVENUE.length &&
      !NUMBER_OF_SALES.length &&
      !TOP_THREE.length &&
      !DATA_TRANSACTIONS.length
    ) {
      return res.status(200).send('No Data');
    }

    res.status(200).send({
      current_month: current_month,
      revenue: revenue,
      cost: cost,
      profit: profit,
      number_of_sales: number_of_sales,
      top_three: top_three,
      data_transactions: data_transactions,
    });
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(error);
  }
};

//2. GET  REPORT BY DATE PICKED
module.exports.getreportbydate = async (req, res) => {
  const { date } = req.body;
  try {
    console.log(date);
    // CURRENT MONTH
    GET_REVENUE_BY_DATE = `
SELECT
    DATE(date) AS date, SUM(shopping_amount) AS revenue
FROM
    invoice_headers
WHERE
    status = 'Approved'
        AND DATE(date) = ${db.escape(date)}
GROUP BY DATE(date);

    
    `;

    const GET_NUMBER_OF_SALES_BY_DATE = `
SELECT
    DATE(date) AS date, SUM(ID.amount) AS number_of_sales
FROM
    invoice_details ID
        LEFT JOIN
    invoice_headers IH ON ID.invoice_header_id = IH.id
WHERE
    status = 'Approved'
        AND DATE(date) = ${db.escape(date)}
GROUP BY DATE(date);
   
    `;

    // TOP 3 MOST SOLD CURRENT MONTH

    GET_TOP_THREE_BY_DATE = `
SELECT
    DATE(date) AS date,
    ID.product_id AS id,
    P.name AS product,
    C.name AS category,
    ID.price,
    ID.unit,
    SUM(ID.amount) AS sold
FROM
    invoice_details ID
        LEFT JOIN
    invoice_headers IH ON ID.invoice_header_id = IH.id
        LEFT JOIN
    products P ON ID.product_id = P.id
        LEFT JOIN
    categories C ON P.category = C.id
WHERE
    status = 'Approved'
        AND DATE(date) = ${db.escape(date)}
GROUP BY product_id
ORDER BY sold DESC
LIMIT 3;
`;

    const GET_DATA_TRANSACTIONS_BY_DATE = `
SELECT
        i.id,
        i.code,
        CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
        i.status,
        i.shopping_amount,
        i.shipping_cost,
        i.total_payment,
        i.payment_method,
        i.date as date
    FROM
        invoice_headers i
            LEFT JOIN
        users u ON i.user_id = u.id
            LEFT JOIN
        payments p ON i.id = p.invoice_id
    WHERE
        status = 'Approved'
            AND DATE(date) =  ${db.escape(date)}


`;

    const [REVENUE_BY_DATE] = await db.execute(GET_REVENUE_BY_DATE);
    const [NUMBER_OF_SALES_BY_DATE] = await db.execute(
      GET_NUMBER_OF_SALES_BY_DATE
    );
    const [TOP_THREE_BY_DATE] = await db.execute(GET_TOP_THREE_BY_DATE);
    const [DATA_TRANSACTIONS_BY_DATE] = await db.execute(
      GET_DATA_TRANSACTIONS_BY_DATE
    );
    // console.log(NUMBER_OF_SALES);
    // console.log(REVENUE);
    if (
      !REVENUE_BY_DATE.length &&
      !NUMBER_OF_SALES_BY_DATE.length &&
      !TOP_THREE_BY_DATE.length &&
      !DATA_TRANSACTIONS_BY_DATE.length
    ) {
      return res.status(200).send({
        date: date,
        revenue: null,
        cost: null,
        profit: null,
        number_of_sales: null,
        top_three: [],
        data_transactions: [],
      });
    }

    const date_picked = REVENUE_BY_DATE[0].date;
    const revenue = REVENUE_BY_DATE[0].revenue;
    const cost = revenue * 0.4;
    const profit = revenue - cost;
    const number_of_sales = NUMBER_OF_SALES_BY_DATE[0].number_of_sales;
    const top_three = TOP_THREE_BY_DATE;
    const data_transactions = DATA_TRANSACTIONS_BY_DATE;
    res.status(200).send({
      date: date,
      revenue: revenue,
      cost: cost,
      profit: profit,
      number_of_sales: number_of_sales,
      top_three: top_three,
      data_transactions: data_transactions,
    });
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(error);
  }
};

//3. GET  REPORT BY MONTH PICKED
module.exports.getreportbymonth = async (req, res) => {
  const { month } = req.body;
  try {
    // console.log(date);
    // CURRENT MONTH
    GET_REVENUE_BY_MONTH = `
SELECT
    DATE_FORMAT(date,'%Y-%m') AS month, SUM(shopping_amount) AS revenue
FROM
    invoice_headers
WHERE
    status = 'Approved'
        AND DATE_FORMAT(date,'%Y-%m') = ${db.escape(month)}
GROUP BY DATE_FORMAT(date,'%Y-%m');

    
    `;

    const GET_NUMBER_OF_SALES_BY_MONTH = `
    SELECT
        DATE_FORMAT(date,'%Y-%m') AS month, SUM(ID.amount) AS number_of_sales
    FROM
        invoice_details ID
            LEFT JOIN
        invoice_headers IH ON ID.invoice_header_id = IH.id
    WHERE
        status = 'Approved'
            AND DATE_FORMAT(date,'%Y-%m') = ${db.escape(month)}
    GROUP BY DATE_FORMAT(date,'%Y-%m');

   
    `;

    // TOP 3 MOST SOLD CURRENT MONTH

    const GET_TOP_THREE_BY_MONTH = `
    SELECT
        DATE_FORMAT(date,'%Y-%m') as month,
        ID.product_id AS id,
        P.name AS product,
        C.name AS category,
        ID.price,
        ID.unit,
        SUM(ID.amount) AS sold
    FROM
        invoice_details ID
            LEFT JOIN
        invoice_headers IH ON ID.invoice_header_id = IH.id
            LEFT JOIN
        products P ON ID.product_id = P.id
            LEFT JOIN
        categories C ON P.category = C.id
    WHERE
        status = 'Approved'
            AND DATE_FORMAT(date, '%Y-%m') = ${db.escape(month)}
    GROUP BY product_id
    ORDER BY sold DESC
    LIMIT 3;
`;

    const GET_DATA_TRANSACTIONS_BY_MONTH = `
SELECT 
    i.id,
    i.code,
    CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
    i.status,
    i.shopping_amount,
    i.shipping_cost,
    i.total_payment,
    i.payment_method,
    i.date
FROM
    invoice_headers i
        LEFT JOIN
    users u ON i.user_id = u.id
        LEFT JOIN
    payments p ON i.id = p.invoice_id
WHERE
    status = 'Approved' 
AND
    DATE_FORMAT(date, '%Y-%m') = ${db.escape(month)}
    `;

    const [REVENUE_BY_MONTH] = await db.execute(GET_REVENUE_BY_MONTH);
    const [NUMBER_OF_SALES_BY_MONTH] = await db.execute(
      GET_NUMBER_OF_SALES_BY_MONTH
    );
    const [TOP_THREE_BY_MONTH] = await db.execute(GET_TOP_THREE_BY_MONTH);
    const [DATA_TRANSACTIONS_BY_MONTH] = await db.execute(
      GET_DATA_TRANSACTIONS_BY_MONTH
    );
    // console.log(NUMBER_OF_SALES_BY_MONTH);
    // console.log(REVENUE);
    if (
      !REVENUE_BY_MONTH.length &&
      !NUMBER_OF_SALES_BY_MONTH.length &&
      !TOP_THREE_BY_MONTH.length &&
      !DATA_TRANSACTIONS_BY_MONTH.length
    ) {
      return res.status(200).send({
        month: month,
        revenue: null,
        cost: null,
        profit: null,
        number_of_sales: null,
        top_three: [],
        data_transactions: [],
      });
    }

    const month_picked = REVENUE_BY_MONTH[0].month;
    const revenue = REVENUE_BY_MONTH[0].revenue;
    const cost = revenue * 0.4;
    const profit = revenue - cost;
    const number_of_sales = NUMBER_OF_SALES_BY_MONTH[0].number_of_sales;
    const top_three = TOP_THREE_BY_MONTH;
    const data_transactions = DATA_TRANSACTIONS_BY_MONTH;
    res.status(200).send({
      month: month,
      revenue: revenue,
      cost: cost,
      profit: profit,
      number_of_sales: number_of_sales,
      top_three: top_three,
      data_transactions: data_transactions,
    });
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(error);
  }
};

//3. GET  REPORT BY YEAR PICKED
module.exports.getreportbyyear = async (req, res) => {
  const { year } = req.body;
  try {
    // console.log(date);
    // CURRENT MONTH
    GET_REVENUE_BY_YEAR = `
SELECT
    DATE_FORMAT(date, '%Y') AS year,
    SUM(shopping_amount) AS revenue
FROM
    invoice_headers
WHERE
    status = 'Approved'
        AND DATE_FORMAT(date, '%Y') = ${db.escape(year)}
GROUP BY DATE_FORMAT(date, '%Y');
    
    `;

    const GET_NUMBER_OF_SALES_BY_YEAR = `
SELECT
    DATE_FORMAT(date, '%Y') AS year,
    SUM(ID.amount) AS number_of_sales
FROM
    invoice_details ID
        LEFT JOIN
    invoice_headers IH ON ID.invoice_header_id = IH.id
WHERE
    status = 'Approved'
        AND DATE_FORMAT(date, '%Y') = ${db.escape(year)}
GROUP BY DATE_FORMAT(date, '%Y');

   
    `;

    // TOP 3 MOST SOLD CURRENT MONTH

    const GET_TOP_THREE_BY_YEAR = `
    SELECT
    DATE_FORMAT(date, '%Y') AS Year,
    ID.product_id AS id,
    P.name AS product,
    C.name AS category,
    ID.price,
    ID.unit,
    SUM(ID.amount) AS sold
FROM
    invoice_details ID
        LEFT JOIN
    invoice_headers IH ON ID.invoice_header_id = IH.id
        LEFT JOIN
    products P ON ID.product_id = P.id
        LEFT JOIN
    categories C ON P.category = C.id
WHERE
    status = 'Approved'
        AND DATE_FORMAT(date, '%Y') = ${db.escape(year)}
GROUP BY product_id
ORDER BY sold DESC
LIMIT 3;
   
`;

    const GET_DATA_TRANSACTIONS_BY_YEAR = `
SELECT 
    i.id,
    i.code,
    CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
    i.status,
    i.shopping_amount,
    i.shipping_cost,
    i.total_payment,
    i.payment_method,
    i.date
FROM
    invoice_headers i
        LEFT JOIN
    users u ON i.user_id = u.id
        LEFT JOIN
    payments p ON i.id = p.invoice_id
WHERE
    status = 'Approved'
        AND DATE_FORMAT(date, '%Y') = ${db.escape(year)}

`;

    const [REVENUE_BY_YEAR] = await db.execute(GET_REVENUE_BY_YEAR);
    const [NUMBER_OF_SALES_BY_YEAR] = await db.execute(
      GET_NUMBER_OF_SALES_BY_YEAR
    );
    const [TOP_THREE_BY_YEAR] = await db.execute(GET_TOP_THREE_BY_YEAR);
    const [DATA_TRANSACTIONS_BY_YEAR] = await db.execute(
      GET_DATA_TRANSACTIONS_BY_YEAR
    );
    // console.log(NUMBER_OF_SALES_BY_MONTH);
    // console.log(REVENUE);
    if (
      !REVENUE_BY_YEAR.length &&
      !NUMBER_OF_SALES_BY_YEAR.length &&
      !TOP_THREE_BY_YEAR.length &&
      !DATA_TRANSACTIONS_BY_YEAR.length
    ) {
      return res.status(200).send({
        year: year,
        revenue: null,
        cost: null,
        profit: null,
        number_of_sales: null,
        top_three: [],
        data_transactions: [],
      });
    }

    const year_picked = REVENUE_BY_YEAR[0].year;
    const revenue = REVENUE_BY_YEAR[0].revenue;
    const cost = revenue * 0.4;
    const profit = revenue - cost;
    const number_of_sales = NUMBER_OF_SALES_BY_YEAR[0].number_of_sales;
    const top_three = TOP_THREE_BY_YEAR;
    const data_transactions = DATA_TRANSACTIONS_BY_YEAR;
    res.status(200).send({
      year: year,
      revenue: revenue,
      cost: cost,
      profit: profit,
      number_of_sales: number_of_sales,
      top_three: top_three,
      data_transactions: data_transactions,
    });
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(error);
  }
};
