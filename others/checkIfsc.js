const express = require("express");
const router = express.Router();
const db = require("../db"); // Import the MySQL connection

router.get("/:ifsc", async (req, res) => {
  const ifscCode = req.params.ifsc.toUpperCase();
  const all = req.query.all;

  if (ifscCode.length < 8) {
    res.json({ message: "Too Short" });
  }

  try {
    if (all === "all") {
      const [data] = await db.query("SELECT * FROM banks");
      const links = data.map((bank) => {
        const city = bank.City2?.replaceAll(" ", "-").toLowerCase() ?? "";
        const state = bank.State?.replaceAll(" ", "-").toLowerCase() ?? "";
        const bankName = bank.Bank?.replaceAll(" ", "-").toLowerCase() ?? "";
        const ifsc = bank.Ifsc?.toUpperCase() ?? "";

        return `${state}/${city}/${bankName}/${ifsc}`;
      });
      res.json({ links });
    } else {
      const [rows] = await db.query(
        "SELECT Bank, Ifsc, City2, State FROM banks WHERE Ifsc LIKE ?",
        [`${ifscCode}%`]
      );

      res.json(rows);
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
