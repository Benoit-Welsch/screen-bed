import * as express from 'express';
import {Time} from './time';

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
});

export default () =>
  app.listen(port, () => {
    console.log(`listening on http://127.0.0.1:${port}`);
  });
