'use strict';

const express = require('express');
const dayjs = require('dayjs');
// Importing all necessary dependencies
const QuickChart = require('quickchart-js');
const { Client } = require('@notionhq/client');


// Constants
const PORT = process.env.PORT || 7000;
const HOST = process.env.HOST || '0.0.0.0';

// App
const app = express();
app.get('/', (_req, res) => res.send('ok'));

app.get('/chart/:token/:databaseId/:width/:height', async (req, res) => {
  const { token, databaseId, width, height } = req.params;
  const notion = new Client({ auth: token });

  const { results } = await notion.databases.query({
    database_id: databaseId,
    filter: {
      "or": [
        'Sprint Backlog',
        'Doing',
        'Blocked',
        'To Review',
        'To Validate',
        'Validated',
        'Done',
      ].map((label) => ({
        property: "Status",
        select: { equals: label },
      })),
    },
  });

  let totalPointsSprint = 0;
  const donePointsPerDay = {
    4: 0,
    5: 0,
    1: 0,
    2: 0,
    3: 0,
  };
  const today = dayjs().day();
  const showThursday = today === 5
    || today === 6
    || today === 0
    || today === 1
    || today === 2
    || today === 3;
  const showFriday = today === 6
    || today === 0
    || today === 1
    || today === 2
    || today === 3;
  const showMonday = today === 0
    || today === 1
    || today === 2
    || today === 3;
  const showTuesday = today === 2
    || today === 3;
  const showWednesday = today === 3;
  for (let i = 0; i < results.length; i++) {
    const page = results[i];
    const status = page.properties.Status.select.name;
    const points = page.properties.Points.number;
    const lastUpdateDay = dayjs(page.last_edited_time).day()

    if (status === 'Done') {
      if (lastUpdateDay === 4) {
        donePointsPerDay[4] += points;
      }
      if (lastUpdateDay === 5) {
        donePointsPerDay[5] += points;
      }
      if (lastUpdateDay === 6) {
        donePointsPerDay[1] += points;
      }
      if (lastUpdateDay === 0) {
        donePointsPerDay[1] += points;
      }
      if (lastUpdateDay === 1) {
        donePointsPerDay[1] += points;
      }
      if (lastUpdateDay === 2) {
        donePointsPerDay[2] += points;
      }
      if (lastUpdateDay === 3) donePointsPerDay[3] += points;
    }

    totalPointsSprint += points;
  }

  const sprintChunk = Math.round(totalPointsSprint / 9);
  const pointsPerDay = {
    4: sprintChunk * 9,
    5: sprintChunk * 8,
    1: sprintChunk * 6,
    2: sprintChunk * 4,
    3: sprintChunk * 2,
  };

  const pointsLine = [
    showThursday ? totalPointsSprint - donePointsPerDay[4] : totalPointsSprint,
    showFriday ? totalPointsSprint - (donePointsPerDay[4] + donePointsPerDay[5]) : undefined,
    showMonday ? totalPointsSprint - (donePointsPerDay[4] + donePointsPerDay[5] + donePointsPerDay[1]) : undefined,
    showTuesday ? totalPointsSprint - (donePointsPerDay[4] + donePointsPerDay[5] + donePointsPerDay[1] + donePointsPerDay[2]) : undefined,
    showWednesday ? totalPointsSprint - (donePointsPerDay[4] + donePointsPerDay[5] + donePointsPerDay[1] + donePointsPerDay[2] + donePointsPerDay[3]) : undefined,
  ];
  const previsionLine = [
    pointsPerDay[4],
    pointsPerDay[5],
    pointsPerDay[1],
    pointsPerDay[2],
    pointsPerDay[3],
    0,
  ]

  const data = {
    "title": '',
    "type": "bar",
    "data": {
      "labels": [
        "Thursday",
        "Friday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Ceremony",
      ],
      "datasets": [{
          "type": "line",
          "label": "Points",
          "fill": false,
          "backgroundColor": "rgb(50, 102, 70)",
          "data": pointsLine,
          "borderColor": "rgb(50, 102, 70)",
          "borderWidth": 4,
          "lineTension": 0.4,
        },
        {
        "type": "line",
        "label": "Prevision",
        "borderColor": "rgb(54, 162, 235)",
        "borderWidth": 2,
        "fill": false,
        "data": previsionLine,
        },
        {
          "type": "bar",
          "label": "late",
          "backgroundColor": "rgba(215,74,74, .5)",
          radius: 50,
          "data": [
            pointsLine[0] ? Math.max(pointsLine[0] - previsionLine[0], 0) : undefined,
            pointsLine[1] ? Math.max(pointsLine[1] - previsionLine[1], 0) : undefined,
            pointsLine[2] ? Math.max(pointsLine[2] - previsionLine[2], 0) : undefined,
            pointsLine[3] ? Math.max(pointsLine[3] - previsionLine[3], 0) : undefined,
            pointsLine[4] ? Math.max(pointsLine[4] - previsionLine[4], 0) : undefined,
          ],
          "borderColor": "red",
          "borderWidth": 2
        },
      ]
    },
    "options": {
      "responsive": true,
      "title": { "display": false },
      "legend": { "display": false },
      "tooltips": { "display": false },
    }
  };

  const myChart = new QuickChart();
  myChart
    .setConfig(data)
    .setWidth(width || 1900)
    .setHeight(height || 180)
    .setFormat('png')
    .setBackgroundColor('transparent');

  const chartBuffer = await myChart.toBinary();

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': chartBuffer.length,
  });
  res.end(chartBuffer);
  // console.log('SENT')
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});

/**
{
  object: 'page',
  id: '68138771-0698-485a-8ba4-fbb281a4a9a5',
  created_time: '2023-02-16T16:59:00.000Z',
  last_edited_time: '2023-02-16T16:59:00.000Z',
  created_by: { object: 'user', id: 'a352c85b-3215-4c05-917b-596787f843ac' },
  last_edited_by: { object: 'user', id: 'a352c85b-3215-4c05-917b-596787f843ac' },
  cover: null,
  icon: null,
  parent: {
    type: 'database_id',
    database_id: '73d3f9c1-a2ed-4305-aec8-c119534b40c9'
  },
  archived: false,
  properties: {
    headline: { id: '%3EL%3Eg', type: 'formula', formula: [Object] },
    'Ticket number': { id: 'C%5Etz', type: 'formula', formula: [Object] },
    Points: { id: 'Z%3DbM', type: 'number', number: 5 },
    '👱🏼‍♀️ Epic planning': { id: '%5CM%7CH', type: 'relation', relation: [], has_more: false },
    Label: { id: 'f%5DQX', type: 'multi_select', multi_select: [Array] },
    Assign: { id: 'hSg%3F', type: 'people', people: [Array] },
    Status: { id: 'qjLa', type: 'select', select: [Object] },
    Name: { id: 'title', type: 'title', title: [Array] }
  },
  url: 'https://www.notion.so/Timebox-4h-As-a-Dev-I-know-why-the-reminders-are-not-generated-for-the-leasing-invoices-681387710698485a8ba4fbb281a4a9a5'
}
 */
