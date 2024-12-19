const axios = require("axios");
const cheerio = require("cheerio");

console.log("before");

axios
  .get("https://worldometers.info/coronavirus/")
  .then(function (response) {
    console.log("statusCode:", response.status);
    let res = response.data;
    handleHtml(res);
  })
  .catch(function (error) {
    console.error("error:", error);
  });

console.log("after");

function handleHtml(res) {
  let selTool = cheerio.load(res);
  let h1s = selTool("h1");
  console.log(h1s.length);
  //   h1s.each(function (i, element) {
  //     console.log(selTool(element).text());
  //   });
}
