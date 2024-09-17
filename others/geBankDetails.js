const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const { state, city, bank } = req.query;

  let filteredData = data;

  if (state && !city && !bank) {
    filteredData = filteredData.filter(item => item.State.toLowerCase() === state.toLowerCase());
    const uniqueCity1Values = [...new Set(filteredData.map(item => item.City1 ? item.City1.toLowerCase() : ''))];
    res.json(uniqueCity1Values);
  }else if (state && city && !bank) {
    filteredData = filteredData.filter(item => item.State && item.State.toLowerCase() === state.toLowerCase() &&
    item.City1 && item.City1.toLowerCase() === city.toLowerCase());
    const uniqueBanks = [...new Set(filteredData.map(item => item.Bank ? item.Bank : ''))];
    res.json(uniqueBanks);
  }else if (state && city && bank) {
    filteredData = filteredData.filter(item => item.State && item.State.toLowerCase() === state.toLowerCase() &&
    item.City1 && item.City1.toLowerCase() === city.toLowerCase() &&
    item.Bank && item.Bank.toLowerCase() === bank.toLowerCase());

    res.json(filteredData);

  }else{
    res.status(400).json({ error: "Invalid query parameters" });
  }
  
});


module.exports = router;
