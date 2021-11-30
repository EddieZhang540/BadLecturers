const axios = require("axios");
const fs = require("fs");

const termInfo = "1219";
// GET courses
const options = {
    method: 'GET',
    url: `https://openapi.data.uwaterloo.ca/v3/Courses/${termInfo}`,
    headers: { "x-api-key": "FDAAA4A37F3B40FC905E38AA79458F7D"}
}
axios.request(options).then(result => {
    result = result.data;
    // only generate a list of course CODES - aint saving descriptions thats too long
    result.forEach((c, i) => (result[i] = { id: i, display: c.subjectCode + " " + c.catalogNumber, subject: c.subjectCode, catalog: c.catalogNumber }));
    result = JSON.stringify(result);
    // console.log(result.data);
    fs.writeFileSync(`../badlecturers/src/.course_list.js`, `const data=${result};export default data;`);
})
