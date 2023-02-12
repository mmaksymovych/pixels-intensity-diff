import { width, height } from "../constants";
var stats = require("stats-lite");

export const processImages = (useBlackBg = false, threadHold=10) => {
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

  const diffsR = [];
  const diffsG = [];
  const diffsB = [];

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

    diffsR.push(diffr);
    diffsG.push(diffg);
    diffsB.push(diffb);

    const dr = diffr > threadHold ? fr : 0;
    const dg = diffg > threadHold ? fg : 0;
    const db = diffb > threadHold ? fb : 0;

    const pxchanged = dr > 0 && dg > 0 && db > 0;
    data3.data[i] = pxchanged ? 255 : !useBlackBg && data1.data[i] || 0;
    data3.data[i + 1] = pxchanged ? 0 : !useBlackBg && data1.data[i + 1] || 0;
    data3.data[i + 2] = pxchanged ? 0 : !useBlackBg &&  data1.data[i + 2] || 0;
  }


  const deviationRAbs = parseInt(stats.stdev(diffsR));
  const deviationGAbs = parseInt(stats.stdev(diffsG));
  const deviationBAbs = parseInt(stats.stdev(diffsB));
  const resAbs = parseInt((deviationRAbs + deviationGAbs + deviationBAbs) / 3)

  const calcPercentageDeviation = (value) => value * 100 / 255

  console.log(deviationRAbs)
  console.log(deviationGAbs)
  console.log(deviationBAbs)
  console.log('resAbs', resAbs)

  const deviationR = parseInt(calcPercentageDeviation(deviationRAbs))
  const deviationG = parseInt(calcPercentageDeviation(deviationGAbs))
  const deviationB = parseInt(calcPercentageDeviation(deviationBAbs))
  const res = parseInt((deviationR + deviationG + deviationB) / 3)

  console.log(deviationR)
  console.log(deviationG)
  console.log(deviationB)
  console.log('res', res)

  ctx.putImageData(data3, 0, 0);

  return { deviationRAbs, deviationGAbs, deviationBAbs, resAbs, deviationR, deviationG, deviationB, res };
};
