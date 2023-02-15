'use strict';

const express = require('express');
// Importing all necessary dependencies
const QuickChart = require('quickchart-js');
const dotenv = require('dotenv');
const { Client } = require('@notionhq/client');
const axios = require('axios');

dotenv.config();

// Constants
const PORT = 7000;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Running!');
});

// Creating global variables that store our API credentials and other necessary information

async function queryDatabase(databaseId) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      // TODO: optimise query addig filters
    });
    return response.results;
  } catch (error) {
    console.log(error.body);
  }
}

// async function getChart(databaseId, chartType) {

//   const results = await queryDatabase(databaseId)

//   const dataPts = [];
//   const labels = [];

//   for (let i = 0; i < 1; i++) {
//     const page = results[i];
//     const status = page.properties.Status.select.name;
//     console.log(status)
//     // const nameId = results[i].properties.Name.id;
//     // const statusId = results[i].properties.Status.id;

//     // const nameVal = await notion.pages.properties.retrieve({ page_id: pageId, property_id: nameId });
//     // const statusVal = await notion.pages.properties.retrieve({ page_id: pageId, property_id: statusId });

//     // console.log(nameVal, statusVal)
//     // try {
//     //   const nameVal = await notion.pages.properties.retrieve({ page_id: pageId, property_id: nameId });
//     //   const scoreVal = await notion.pages.properties.retrieve({ page_id: pageId, property_id: scoreId });

//     //   labels.push(nameVal.results[0].title.text.content);
//     //   dataPts.push(scoreVal.number);

//     // } catch (error) {
//     //   console.log(error.body);
//     // }
//   }

//   const data = chartData;
//   // const data = {
//   //   type: chartType,
//   //   data: {
//   //     labels: data["Labels"],
//   //     datasets: [{ label: 'Scores', data: data["Data Points"] }]
//   //   },
//   // };

//   const myChart = new QuickChart();
//   myChart
//     .setConfig(data)
//     .setWidth(1900)
//     .setHeight(180)
//     .setFormat('png')
//     .setBackgroundColor('transparent');

//   // the chart URL
//   //console.log(myChart.getUrl());
//   return myChart.toBinary();
// };

app.get('/chart/:token/:databaseId/:width/:height', async (req, res) => {
  const { token, databaseId, width, height } = req.params;
  const notion = new Client({ auth: token });

  const { results } = await notion.databases.query({ database_id: databaseId });

  const dataPts = [];
  const labels = [];

  for (let i = 0; i < 1; i++) {
    const page = results[i];
    const status = page.properties.Status.select.name;
    console.log(status)
  }

  const data = chartData;
  const myChart = new QuickChart();
  myChart
    .setConfig(data)
    .setWidth(width || 1900)
    .setHeight(height || 180)
    .setFormat('png')
    .setBackgroundColor('transparent');

  // the chart URL
  //console.log(myChart.getUrl());
  const chartBuffer = await myChart.toBinary();

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': chartBuffer.length,
  });
  res.end(chartBuffer);
  console.log('SENT')
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});

const chartData = {
  "type": "bar",
  "data": {
    "labels": [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July"
    ],
    "datasets": [
      {
        "type": "line",
        "label": "Dataset 1",
        "borderColor": "rgb(54, 162, 235)",
        "borderWidth": 2,
        "fill": false,
        "data": [
          -33,
          26,
          29,
          89,
          -41,
          70,
          -84
        ]
      },
      {
        "type": "bar",
        "label": "Dataset 2",
        "backgroundColor": "rgb(255, 99, 132)",
        "data": [
          -42,
          73,
          -69,
          -94,
          -81,
          18,
          87
        ],
        "borderColor": "white",
        "borderWidth": 2
      },
      {
        "type": "bar",
        "label": "Dataset 3",
        "backgroundColor": "rgb(75, 192, 192)",
        "data": [
          93,
          60,
          -15,
          77,
          -59,
          82,
          -44
        ]
      }
    ]
  },
  "options": {
    "responsive": true,
    "title": {
      "display": true,
      "text": "Chart.js Combo Bar Line Chart"
    },
    "tooltips": {
      "mode": "index",
      "intersect": true
    }
  }
}