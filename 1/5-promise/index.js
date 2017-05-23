'use strict';

function mkPro(arg) {
  return new Promise(function(resolve, reject) {
    console.log('run mkPro : ' + arg);
    resolve('mkPro resolve');
    console.log('end mkPro');
  })
}

function getPro(arg) {
  return new Promise(function(resolve, reject) {
    console.log('run getPro : ' + arg);
    resolve('getPro resolve');
    console.log('end getPro');
  })
}

console.log('--- Второй вызов ---');
mkPro()
  .then(f1)
  .then(f2)
  .then(arg =>
    getPro(arg)
      .then(f11)
      .then(f12)
      .then(f13)
  )
  .then(f3)
  .then(f4)
  .then(f5)
;


function f1(par) {console.log(' 1: input='+par); return 1}
function f2(par) {console.log(' 2: input='+par); return 2}
function f3(par) {console.log(' 3: input='+par); return 3}
function f4(par) {console.log(' 4: input='+par); return 4}
function f5(par) {console.log(' 5: input='+par); return 5}

function f11(par) {console.log('11: input='+par); return 11}
function f12(par) {console.log('12: input='+par); return 12}
function f13(par) {console.log('13: input='+par); return 13}
