'use strict';

function mkPro() {
  return new Promise(function(ok, err) {
    ok();
  })
}

mkPro().then(f3).then(f1).then(f2).then(f5).then(f4);

function f4() {console.log(4); return 4}
function f5() {console.log(5); return 5}
function f1() {console.log(1); return 1}
function f2() {console.log(2); return 2}
function f3() {console.log(3); return 3}
