const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 20,
});

router.get("/:ifsc", async (req, res) => {
  const ifscCode = req.params.ifsc.toUpperCase();
  const all = req.query.all;

  if (ifscCode.length < 8) {
    res.json({ message: "Too Short" });
  }

  try {
    const connection = await pool.getConnection();
    console.log("connection created");

    if (all === "all") {
      const [data] = await connection.query("SELECT * FROM banks");
      const links = data.map((bank) => {
        const city = bank.City2?.replaceAll(" ", "-").toLowerCase() ?? "";
        const state = bank.State?.replaceAll(" ", "-").toLowerCase() ?? "";
        const bankName = bank.Bank?.replaceAll(" ", "-").toLowerCase() ?? "";
        const ifsc = bank.Ifsc?.toUpperCase() ?? "";

        return `${state}/${city}/${bankName}/${ifsc}`;
      });
      res.json({ links });
    } else {
    console.log("connection is in else");
    console.log("data fetched start");

      const [rows] = await connection.query(
        "SELECT Bank, Ifsc, City2, State FROM banks WHERE Ifsc LIKE ?",
        [`${ifscCode}%`]
      );
      console.log(rows);

      res.json(rows);
    console.log("data fetched end");

    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

  // if (all === "all") {
  //     const links = data.map(bank => {
  //       const city = bank.City2?.replaceAll(" ", '-').toLowerCase() ?? "";
  //       const state = bank.State?.replaceAll(" ", '-').toLowerCase() ?? "";
  //       const bankName = bank.Bank?.replaceAll(" ", '-').toLowerCase() ?? "";
  //       const ifsc = bank.Ifsc?.toUpperCase() ?? "";

  //       return `${state}/${city}/${bankName}/${ifsc}`;
  //     });

  //     res.json({ links });

  // } else {
  //   if (matchingBanks.length > 0) {
  //     res.json(matchingBanks);
  //   } else {
  //     res.status(404).json({ message: 'No banks found' });
  //   }
  // }
});

module.exports = router;
