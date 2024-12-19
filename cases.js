import axios from "axios";
import * as cheerio from "cheerio";
import chalk from "chalk";

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
  let contentArr = selTool("#maincounter-wrap span");

  let stats = [];

  contentArr.each(function (i, element) {
    stats.push(selTool(element).text().trim());
  });

  if (stats[0]) {
    console.log(chalk.white(`Total Deaths: ${stats[0]}`));
  }
  if (stats[1]) {
    console.log(chalk.yellow(`Total Recovered: ${stats[1]}`));
  }
  if (stats[2]) {
    console.log(chalk.green(`Active Cases: ${stats[2]}`));
  }
}
