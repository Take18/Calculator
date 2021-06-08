(function(){
  "use strict";
//変数の取得
  var Clear = document.getElementById("Clear");
  var Memory = document.getElementById("Memory");
  var MemoryClear = document.getElementById("MemoryClear");
  var MemoryReveal = document.getElementById("MemoryReveal");
  var seven = document.getElementById("seven");
  var eight = document.getElementById("eight");
  var nine = document.getElementById("nine");
  var Divide = document.getElementById("Divide");
  var four = document.getElementById("four");
  var five = document.getElementById("five");
  var six = document.getElementById("six");
  var Multiply = document.getElementById("Multiply");
  var one = document.getElementById("one");
  var two = document.getElementById("two");
  var three = document.getElementById("three");
  var Subtract = document.getElementById("Subtract");
  var zero = document.getElementById("zero");
  var dot = document.getElementById("dot");
  var minus = document.getElementById("minus");
  var Add = document.getElementById("Add");
  var Equal = document.getElementById("Equal");

  var display = document.getElementById("display");
  var inner = "0";
  var outer = "0";
  var calculating = false;
  var operator = "";
  var memory = 0;
  var ErrorChecker = false;

//数をディスプレイに出力
  function output(){
    if(calculating){
      display.textContent = outer;
    }else{
      display.textContent = inner;
    }
  }

  function input(num){
    if(calculating === false){
      if(inner === "0"){
        inner = num;
      }else if(inner === "-0"){
        inner = "-" + num;
      }else{
        if(inner.length < 10){
          inner += num;
        }
      }
    }else{
      if(outer === "0"){
        outer = num;
      }else if(outer === "-0"){
        outer = "-" + num;
      }else{
        if(outer.length < 10){
          outer += num;
        }
      }
    }
    output();
  }

  one.addEventListener("click", function(){
    input("1");
  });

  two.addEventListener("click",function(){
    input("2");
  });
  three.addEventListener("click",function(){
    input("3");
  });
  four.addEventListener("click",function(){
    input("4");
  });
  five.addEventListener("click",function(){
    input("5");
  });
  six.addEventListener("click",function(){
    input("6");
  });
  seven.addEventListener("click",function(){
    input("7");
  });
  eight.addEventListener("click",function(){
    input("8");
  });
  nine.addEventListener("click",function(){
    input("9");
  });
  zero.addEventListener("click",function(){
    input("0");
  });
  Clear.addEventListener("click",function(){
    inner = "0";
    outer = "0";
    calculating = false;
    operator = "";
    ErrorChecker = false;
    output();
    Add.className = "operator";
    Subtract.className = "operator";
    Multiply.className = "operator";
    Divide.className = "operator";
  });
  dot.addEventListener("click",function(){
    if(calculating === false){
      if(~inner.indexOf(".")){
        return;
      }
      if(inner.length < 10){
        inner += this.textContent;
      }
    }else{
      if(~outer.indexOf(".")){
        return;
      }
      if(outer.length < 10){
        outer += this.textContent;
      }
    }
    output();
  });
  minus.addEventListener("click",function(){
    if(calculating === false){
      if(display.textContent !== inner){
        inner = display.textContent;
      }
      if(~inner.indexOf("-")){
        inner = inner.slice(1);
      }else{
        if(inner.length < 10){
          inner = "-" + inner;
        }
      }
    }else{
      if(~outer.indexOf("-")){
        outer = outer.slice(1);
      }else{
        if(outer.length < 10){
          outer = "-" + outer;
        }
      }
    }
    output();
  });
// 演算子ボタンの挙動
function Operate(ope){
  if(operator !== ""){
    if(operator === "Divide" && outer === "0"){
      ErrorChecker = true;
    }
    Equal.click();
  }
  calculating = true;
  operator = ope;
  if(inner==="0" && display.textContent !== "Error!"){
    inner = display.textContent;
  }
  if(display.textContent === "Error!" && ErrorChecker === false){
    display.textContent = "0";
  }
}

  Add.addEventListener("click",function(){
    Operate("Add");
    this.className = "selected";
  });
  Subtract.addEventListener("click",function(){
    Operate("Subtract");
    this.className = "selected";
  });
  Multiply.addEventListener("click",function(){
    Operate("Multiply");
    this.className = "selected";
  });
  Divide.addEventListener("click",function(){
    Operate("Divide");
    this.className = "selected";
  });
// 等号ボタンの挙動
  function lengthCheck(){
    if(display.textContent.length > 10){
      if(~display.textContent.indexOf(".")){
        if(display.textContent.indexOf(".") > 10){
          display.textContent = "Error!";
        }else{
          display.textContent = display.textContent.slice(0,10);
        }
      }else{
        display.textContent = "Error!";
      }
    }
  }

  Equal.addEventListener("click",function(){
    if(ErrorChecker === true){
      if(operator !== "Divide" || outer !== "0"){
        ErrorChecker = false;
      }
      inner = "0";
      outer = "0";
      calculating = false;
      operator = "";
      display.textContent = "Error!";
      return;
    }
    if(calculating){
      calculating = false;
      switch(operator){
        case "Add": inner = String(parseFloat(inner) + parseFloat(outer));
                  output();
                  inner = "0";
                  outer = "0";
                  Add.className = "operator";
                  lengthCheck();
                  break;
        case "Subtract": inner = String(parseFloat(inner) - parseFloat(outer));
                  output();
                  inner = "0";
                  outer = "0";
                  Subtract.className = "operator";
                  lengthCheck();
                  break;
        case "Multiply": inner = String(parseFloat(inner) * parseFloat(outer));
                  output();
                  inner = "0";
                  outer = "0";
                  Multiply.className = "operator";
                  lengthCheck();
                  break;
        case "Divide": if(parseFloat(outer) !== 0){
                  inner = String(parseFloat(inner) / parseFloat(outer));
                  output();
                  }else{
                    display.textContent = "Error!";
                  }
                  inner = "0";
                  outer = "0";
                  Divide.className = "operator";
                  lengthCheck();
                  break;
      }
    }else{
      if(inner === "0" && display.textContent !== "Error!"){
        inner = String(parseFloat(display.textContent));
      }else if(display.textContent !== "Error!"){
        inner = String(parseFloat(inner));
      }else{
        Clear.click();
      }
      output();
      inner = "0";
    }
    operator = "";
    ErrorChecker = false;
  });
//メモリー機能
  Memory.addEventListener("click",function(){
    Equal.click();
    if(display.textContent !== "Error!"){
      memory += parseFloat(display.textContent);
    }
    if(memory !== 0){
      Memory.className = "memoried";
      MemoryClear.className = "memoried";
      MemoryRecall.className = "memoried";
    }else{
      Memory.className = "memories";
      MemoryClear.className = "memories";
      MemoryRecall.className = "memories";
    }
  });
  MemoryClear.addEventListener("click",function(){
    memory = 0;
    calculating = false;
    display.textContent = "0";
    inner = "0";
    outer = "0";
    Memory.className = "memories";
    MemoryClear.className = "memories";
    MemoryRecall.className = "memories";
  });
  MemoryRecall.addEventListener("click",function(){
    calculating = false;
    display.textContent = String(memory);
    inner = "0";
    outer = "0";
  });

})();
