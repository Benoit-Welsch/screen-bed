import * as express from 'express';
import {Time} from './screen/time';

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const time = new Time();

app.get('/screen', (req, res) => {
  let body = '<table style="background:black">';
  time.forEach(row => {
    body += '<tr>';
    row.forEach(p => {
      body += `<td><div style="width:2.5mm;height:2.5mm;border-radius:50%;background-color: rgb(${p.r},${p.g},${p.b});"></div></td>`;
    });
    body += '</tr>';
  });
  body += '</table>';
  res.send(body);

  // Memory usage
  // for (const [key, value] of Object.entries(process.memoryUsage())) {
  //   console.log(`Memory usage by ${key}, ${value / 1000000}MB `);
  // }
});

export default () =>
  app.listen(port, () => {
    console.log(`listening on http://127.0.0.1:${port}`);
  });
