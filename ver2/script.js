'use strict';

// DOM群
const numbers = document.querySelectorAll( ".number" );
const display = document.getElementById( "display" );
const clear = document.getElementById( "clear" );
const operators = document.querySelectorAll( ".operator" );
const equal = document.getElementById( "equal" );
const memory = document.getElementById( "memory" );
const memory_clear = document.getElementById( "memory_clear" );
const memory_recall = document.getElementById( "memory_recall" );

// 状態変数群
var operating = false; // 現在の演算の種類 Boolean or String
var pre_operate = false; // ひとつ前の演算の種類 Boolean or String
var values = [ 0, 0 ]; // 演算の引数 List of Number
var waiting = true; // 待機状態 Boolean
var erroring = false; // エラー Boolean
var memorying = 0; // メモリ Number

// 定数群
const ERROR = "Too Large."; // 桁数オーバー
const ERROR2 = "Invalid Calc."; // ゼロ除算
const DIGIT = 10; // 最大桁数

window.onload = function(){
	Array.prototype.forEach.call( numbers, function(number){
		number.addEventListener( 'click', inputNumber, false );
	} );
	clear.addEventListener( 'click', clearDisplay, false );
	Array.prototype.forEach.call( operators, function(operator){
		operator.addEventListener( 'click', startOperate, false );
	} );
	equal.addEventListener( 'click', calculate, false );

	// メモリ系
	memory.addEventListener( 'click', saveMemory, false );
	memory_clear.addEventListener( 'click', clearMemory, false );
	memory_recall.addEventListener( 'click', showMemory, false );
};

// 数字ボタン押下時の挙動
function inputNumber(e) {
	if ( waiting ) {
		display.textContent = "0";
	}
	erroring = false;
	if ( e.target.id === "" ) {
		// 数字ボタン
		if ( display.textContent === "0" ) {
			display.textContent = e.target.textContent;
		} else if ( display.textContent === "-0" ) {
			display.textContent = "-" + e.target.textContent;
		} else if ( display.textContent.length < DIGIT ) {
			display.textContent += e.target.textContent;
		}
	} else if ( e.target.id === "dot" ) {
		// 小数点ボタン
		if ( display.textContent.indexOf('.') === -1 && display.textContent.length < DIGIT ) {
			display.textContent += e.target.textContent;
		}
	} else if ( e.target.id === "minus" ) {
		// マイナスボタン
		if ( display.textContent.substr(0,1) === "-" ) {
			display.textContent = display.textContent.substr(1);
		} else if ( display.textContent.length < DIGIT ) {
			display.textContent = "-" + display.textContent;
		}
	}
	waiting = false;
}

// クリアボタン押下時の挙動
function clearDisplay(e) {
	display.textContent = "0";
	operating = false;
	waiting = true;
	values[0] = 0;
	erroring = false;
}

// 演算子ボタン押下時の挙動
function startOperate(e) {
	if ( operating ) return;
	operating = e.target.id;
	waiting = true;
	e.target.classList.add("active");
	values[0] = Number(display.textContent);
}

// イコールボタン押下時の挙動
function calculate(e) {
	if ( !operating ) {
		if ( !pre_operate ) {
			return;
		}

		// ひとつ前の演算を再度実行
		let ans = "0";
		values[0] = Number(display.textContent);
		if ( pre_operate === "add" ) {
			ans = String(values[0] + values[1]);
			display.textContent = (ans.length>DIGIT) ? showError(1) : ans;
		} else if ( pre_operate === "subtract" ) {
			ans = String(values[0] - values[1]);
			display.textContent = (ans.length>DIGIT) ? showError(1) : ans;
		} else if ( pre_operate === "multiply" ) {
			ans = String(values[0] * values[1]);
			display.textContent = (ans.length>DIGIT) ? showError(1) : ans;
		} else if ( pre_operate === "divide" ) {
			ans = values[0] / values[1];
			if ( String(ans).indexOf("e-") !== -1 ) {
				ans = Num2FracStr(ans);
			} else {
				ans = String(ans);
			}
			display.textContent = (ans.length>DIGIT) ? ans.substr(0,DIGIT) : ans;
		}
		if ( erroring ) pre_operate = false;
		waiting = true;
	} else {
		// 演算実行
		let ans = "0";
		values[1] = Number(display.textContent);
		if ( operating === "add" ) {
			ans = String(values[0] + values[1]);
			display.textContent = (ans.length>DIGIT) ? showError(1) : ans;
		} else if ( operating === "subtract" ) {
			ans = String(values[0] - values[1]);
			display.textContent = (ans.length>DIGIT) ? showError(1) : ans;
		} else if ( operating === "multiply" ) {
			ans = String(values[0] * values[1]);
			display.textContent = (ans.length>DIGIT) ? showError(1) : ans;
		} else if ( operating === "divide" ) {
			if ( display.textContent === "0" || display.textContent === "-0" ) {
				display.textContent = showError(2);
			} else {
				ans = values[0] / values[1];
				if ( String(ans).indexOf("e-") !== -1 ) {
					ans = Num2FracStr(ans);
				} else {
					ans = String(ans);
				}
				display.textContent = (ans.length>10) ? ans.substr(0,DIGIT) : ans;
			}
		}
		document.getElementById( operating ).classList.remove("active");
		if ( !erroring ) pre_operate = operating;
		operating = false;
		waiting = true;
	}
}

// メモリ保存
function saveMemory(e) {
	if ( erroring ) return;
	memorying += Number(display.textContent);
	memory.classList.add("active");
	memory_clear.classList.add("active");
	memory_recall.classList.add("active");
}

// メモリ消去
function clearMemory(e) {
	if ( !memory.classList.contains("active") ) return;
	memorying = 0;
	memory.classList.remove("active");
	memory_clear.classList.remove("active");
	memory_recall.classList.remove("active");
}

// メモリ表示
function showMemory(e) {
	if ( !memory.classList.contains("active") ) return;
	erroring = false;
	if ( memorying >= Math.pow(10,DIGIT) ) {
		display.textContent = showError(1);
		operating = false;
		pre_operate = false;
		waiting = true;
	} else if ( String(memorying).indexOf('e-') !== -1 ) {
		display.textContent = Num2FracStr(memorying).substr(0,DIGIT);
	} else if ( String(memorying).length > DIGIT ) {
		display.textContent = String(memorying).substr(0,DIGIT);
	} else {
		display.textContent = String(memorying);
	}
}

// 指数表示されてしまう数を非指数表示の文字列に変換
// お借りしました：https://gist.github.com/sounisi5011/a5039aedd1c378971d966fa55a61f473
function Num2FracStr(number) {
  /*
   * 引数の値を文字列化
   */
  const numStr = String(number);

  /*
   * 正規表現でマッチング
   */
  const match = numStr.match(/^([+-]?)0*([1-9][0-9]*|)(?:\.([0-9]*[1-9]|)0*)?(?:[eE]([+-]?[0-9]+))?$/);

  /*
   * 引数の型が適切な形式ではない場合…
   */
  if (!match) {
    if (typeof number == "number") {
      /*
       * 引数の型が数値であれば、文字列化した値をそのまま返す
       */
      return numStr;
    } else {
      /*
       * 引数の型が数値でなければ、エラーにする
       */
      throw new Error(`Invalid Number: "${numStr}"`);
    }
  }

  /** @type {string} 数の符号 */
  const sign = (match[1] === "-" ? "-" : "");
  /** @type {string} 仮数部の整数部 */
  const mantissa_int = match[2];
  /** @type {string} 仮数部の少数部 */
  const mantissa_frac = (match[3] ? match[3] : "");
  /** @type {number} 指数部 */
  const exponent = Number(match[4]);

  let returnValue = "";

  if (exponent) {
    /*
     * exponentがundefinedではなく（正規表現で指数部がマッチしていて）、
     * かつ、0ではない場合、指数表記として処理を開始する
     *
     * Note: 指数部が0の場合、ここで処理する意味は無いので少数表記として処理する。
     *       よって、指数部が0以外の場合にここで処理する。
     * Note: undefinedは数値化されるとNaNになり、false相当となる。
     *       一方、0の場合もfalse相当となる。
     *       ので、↑の条件文はコレで合っている。
     */

    /** @type {string} */
    const mantissa_str = mantissa_int + mantissa_frac;
    /** @type {number} */
    const mantissa_len = mantissa_str.length;

    if (0 < mantissa_len) {
      /** @type {number} */
      const mantissa_int_len = mantissa_int.length + exponent;

      /*
      12.145e+7  121450000             ;  mantissa_str: "12145"  mantissa_int_len: 9   ;  小数部が存在しない数値
      12.145e+6   12145000             ;  mantissa_str: "12145"  mantissa_int_len: 8   ;  小数部が存在しない数値
      12.145e+5    1214500             ;  mantissa_str: "12145"  mantissa_int_len: 7   ;  小数部が存在しない数値
      12.145e+4     121450             ;  mantissa_str: "12145"  mantissa_int_len: 6   ;  小数部が存在しない数値
      12.145e+3      12145             ;  mantissa_str: "12145"  mantissa_int_len: 5   ;  小数部が存在しない数値
      12.145e+2       1214.5           ;  mantissa_str: "12145"  mantissa_int_len: 4   ;  小数部が存在し、かつ、1より大きい数値
      12.145e+1        121.45          ;  mantissa_str: "12145"  mantissa_int_len: 3   ;  小数部が存在し、かつ、1より大きい数値
      12.145e0          12.145         ;  mantissa_str: "12145"  mantissa_int_len: 2   ;  小数部が存在し、かつ、1より大きい数値
      12.145e-1          1.2145        ;  mantissa_str: "12145"  mantissa_int_len: 1   ;  小数部が存在し、かつ、1より大きい数値
      12.145e-2          0.12145       ;  mantissa_str: "12145"  mantissa_int_len: 0   ;  小数部が存在し、かつ、1未満の数値
      12.145e-3          0.012145      ;  mantissa_str: "12145"  mantissa_int_len: -1  ;  小数部が存在し、かつ、1未満の数値
      12.145e-4          0.0012145     ;  mantissa_str: "12145"  mantissa_int_len: -2  ;  小数部が存在し、かつ、1未満の数値
      12.145e-5          0.00012145    ;  mantissa_str: "12145"  mantissa_int_len: -3  ;  小数部が存在し、かつ、1未満の数値
      12.145e-6          0.000012145   ;  mantissa_str: "12145"  mantissa_int_len: -4  ;  小数部が存在し、かつ、1未満の数値
      12.145e-7          0.0000012145  ;  mantissa_str: "12145"  mantissa_int_len: -5  ;  小数部が存在し、かつ、1未満の数値
      */

      if (mantissa_len <= mantissa_int_len) {
        /*
         * 小数部が存在しない数値（ex: 0, 12, 176, 1214500）の場合の処理
         */
        returnValue = mantissa_str.padEnd(mantissa_int_len, "0");

      } else if (0 < mantissa_int_len) {
        /*
         * 小数部が存在し、かつ、1より大きい数値（ex: 1.26, 1.0009, 121.45）の場合の処理
         */
        returnValue = mantissa_str.slice(0, mantissa_int_len) + "." + mantissa_str.slice(mantissa_int_len);

      } else {
        /*
         * 小数部が存在し、かつ、1未満の数値（ex: 0.26, 0.20098, 0.0012145）の場合の処理
         */
        returnValue = "0." + "0".repeat(-mantissa_int_len) + mantissa_str;
      }
    }

  } else if (mantissa_frac) {
    /*
     * 少数表記の場合
     */
    returnValue = (mantissa_int || "0") + "." + mantissa_frac;

  } else if (mantissa_int) {
    /*
     * 整数表記の場合
     */
    returnValue = mantissa_int;
  }

  return (returnValue) ? sign + (
    returnValue
      /* 先頭の余計なゼロを削除 */
      .replace(/^(?:0(?!\.|$))+/, "")
      /* 末尾の余計なゼロを削除 */
      .replace(/(?:\.0+|(\.[0-9]*[1-9])0+)$/, "$1")
  ) : "0";
};

// エラー
function showError(kind) {
	erroring = true;
	if ( kind === 1 ) return ERROR;
	if ( kind === 2 ) return ERROR2;
}
