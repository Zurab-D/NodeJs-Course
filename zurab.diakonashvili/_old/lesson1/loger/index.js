'use strict';

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

function pad2(par) {
  if (!isNumeric(+par)) return par;
  return par < 10 ? '0' + par : par;
};

function formatDate(date) {
  let
    ss = date.getSeconds(),
    mi = date.getMinutes(),
    hh = date.getHours(),
    dd = date.getDate(),
    mm = date.getMonth() + 1,
    yy = date.getFullYear()
  ;
  ss = pad2(ss);
  mi = pad2(mi);
  hh = pad2(hh);
  dd = pad2(dd);
  mm = pad2(mm);
  yy = (''+yy).slice(-2);

  return dd +'.'+ mm +'.'+ yy + ' ' + hh + ':' + mi + ':' + ss;
}

function loger(mod) {
  return function() {
    let args = [formatDate(new Date()), mod.id].concat([].slice.call(arguments));
    console.log.apply(console, args);
  };
};

module.exports = loger;
