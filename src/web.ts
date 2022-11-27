import * as express from 'express';
import {Time} from './window/time';

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const pixels = new Time();

pixels.run();

app.get('/screen', (req, res) => {
  let body = '<table>';
  pixels.screen.forEach((p, _, columnIndex) => {
    if (columnIndex === 0) {
      body += '<tr>';
    }
    body += `<td><div style="width:15px;height:15px;background-color: rgba(${p.r},${p.g},${p.b},${p.a});"></div></td>`;
    if (columnIndex === 63) {
      body += '</tr>';
    }
  });
  body += '</table>';
  res.send(body);
});

export default () =>
  app.listen(port, () => {
    console.log(`listening on http://127.0.0.1:${port}`);
  });
