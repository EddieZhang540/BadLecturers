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
    result = JSON.stringify(result.data);
    fs.writeFileSync(`../badlecturers/src/.course_list.JSON`, result);
})
