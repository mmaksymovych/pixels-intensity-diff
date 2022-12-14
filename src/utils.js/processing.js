import { width, height } from "../constants";
var stats = require("stats-lite");

export const processImages = () => {
  const canvas1 = document.getElementById("1");
  const canvas2 = document.getElementById("2");

  const ctx1 = canvas1.getContext("2d");
  const ctx2 = canvas2.getContext("2d");

  const data1 = ctx1.getImageData(0, 0, width, height);
  const data2 = ctx2.getImageData(0, 0, width, height);

  const canvas = document.getElementById("result");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  ctx.rect(0, 0, width, height);
  ctx.fill();
  const data3 = ctx.getImageData(0, 0, width, height);

  const diffs = [];

  for (var i = 0; i < data1.data.length; i += 4) {
    var ir = data1.data[i];
    var ig = data1.data[i + 1];
    var ib = data1.data[i + 2];

    var fr = data2.data[i];
    var fg = data2.data[i + 1];
    var fb = data2.data[i + 2];

    const diffr = Math.abs(ir - fr);
    const diffg = Math.abs(ig - fg);
    const diffb = Math.abs(ib - fb);

    diffs.push(diffr, diffg, diffb);

    const dr = diffr > 10 ? fr : 0;
    const dg = diffg > 10 ? fg : 0;
    const db = diffb > 10 ? fb : 0;

    const pxchanged = dr > 0 && dg > 0 && db > 0;
    data3.data[i] = pxchanged ? 255 : 0;
    data3.data[i + 1] = pxchanged ? 0 : 0;
    data3.data[i + 2] = pxchanged ? 0 : 0;
  }

  console.log("standard deviation: %s", stats.stdev(diffs));

  ctx.putImageData(data3, 0, 0);
};
