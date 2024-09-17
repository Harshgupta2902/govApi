const express = require("express");
const fs = require("fs");
const router = express.Router();

router.get("/", async (req, res) => {
  const { pincode, state, district, office, taluk, po } = req.query;


  try {
    if(pincode && !state && !district && !office && !taluk && !po){
      const results = data
      .filter((entry) => entry.PinCode == pincode)
      .map((entry) => ({
        PostOffice: entry.PostOffice,
        State: entry.State,
        District: entry.District,
        PinCode: entry.PinCode,
        Taluk: entry.Taluk,
      }));

    res.json(results.length ? results : { message: "No results found" });
    }else if(!pincode && state && !district && !office && !taluk && !po){
      filteredData = data.filter(item => item.State.toLowerCase() === state.toLowerCase());
      const uniqueCityValues = [...new Set(filteredData.map(item => item.District ? item.District : ''))];
      res.json(uniqueCityValues);
    }else if(!pincode && state && district && !office && !taluk && !po){
      filteredData = data.filter(item => item.State && item.State.toLowerCase() === state.toLowerCase() &&
      item.District && item.District.toLowerCase() === district.toLowerCase());
      const uniqueOffices = [...new Set(filteredData.map(item => item.Taluk ? item.Taluk : ''))];
      res.json(uniqueOffices);
    }else if(!pincode && state && district && office && !taluk && !po){
      datas = data.filter(item => item.State && item.State.toLowerCase() === state.toLowerCase() &&
      item.District && item.District.toLowerCase() === district.toLowerCase() &&
      item.Taluk && item.Taluk.toLowerCase() === office.toLowerCase());
      res.json(datas);
    }else if(!pincode && !state && !district && !office && taluk && po){
      details = data.filter(item => item.Taluk && item.Taluk.toLowerCase() === taluk.toLowerCase() &&
      item.PostOffice && item.PostOffice.toLowerCase().replaceAll(" ", "-") === po.toLowerCase());
      res.json(details);
    }else{
      res.json({message: "error"});
    }
  } catch (parseError) {
    res
      .status(500)
      .json({ error: `Error returnig data: ${parseError.message}` });
  }
});

module.exports = router;

// const mysql = require('mysql2');
// const fs = require('fs');

// // Create a MySQL connection
// const connection = mysql.createConnection({
//   host: 'localhost',  // Replace with your MySQL host
//   user: 'root',       // Replace with your MySQL username
//   password: '',  // Replace with your MySQL password
//   database: 'banks' // Replace with your database name
// });

// // Function to fetch data and save to JSON
// function fetchPincodeAndSaveToJson() {
//   // SQL query to select all from the 'pincode' table
//   const query = 'SELECT * FROM pincode_details1';

//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Error executing query:', error);
//       return;
//     }

//     // Convert results to JSON
//     const filteredResults = results.map((entry) => {
//       const { id, Country, ...rest } = entry;  // Destructure and exclude 'id' and 'Country'
//       return rest;
//     });

//     // Convert filtered results to JSON
//     const jsonData = JSON.stringify(filteredResults, null, 2);

//     // Write JSON data to a file
//     fs.writeFile('pincode_data.json', jsonData, (err) => {
//       if (err) {
//         console.error('Error writing to file:', err);
//       } else {
//         console.log('Data saved to pincode_data.json');
//       }
//     });
//   });
// }

// // Call the function
// fetchPincodeAndSaveToJson();
