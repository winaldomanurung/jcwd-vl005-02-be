const db = require("../../config").promise();

// 1.GET ALL DATA TRANSACTIONS
module.exports.reports = async (req, res) => {
  try {
    GET_REVENUE = `SELECT sum(sold*price) as revenue from products;`;
    const [REVENUE] = await db.execute(GET_REVENUE);

    GET_NUMBER_OF_SALES = `SELECT sum(sold) as numberOfSales from products;`;
    const [NUMBER_OF_SALES] = await db.execute(GET_NUMBER_OF_SALES);
    // console.log()

    const revenue = REVENUE[0].revenue;
    // 4%
    const cost = revenue * 0.4;
    const profit = revenue - cost;
    const numberOfSales = NUMBER_OF_SALES[0].numberOfSales;

    // console.log(revenue);
    // console.log(cost);
    // console.log(profit);

    res.status(200).send({
      revenue: revenue,
      cost: cost,
      profit: profit,
      numberOfSales: numberOfSales,
    });
    // res.status(200).send(NUMBER_OF_SALES[0])
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(error);
  }
};

//1. PER TANGGAL

//2. TOP 3 MOST SOLD
module.exports.topthree = async (req, res) => {
  try {
    GET_TOP_THREE = `SELECT p.id  , p.name as product,c.name as category,p.unit ,p.price,sold  from  products p left join categories c on p.category=c.id order by sold desc limit 3;`;
    const [TOP_THREE] = await db.execute(GET_TOP_THREE);

    // console.log(TOP_THREE);

    res.status(200).send(TOP_THREE);
    // revenue
    // harga X sold
    // profit
    // revenue - cost
    // cost 10%  revenue
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(error);
  }
};
