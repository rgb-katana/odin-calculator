'use strcit';

const evalSegment = document.querySelector('.calc--eval');
const displaySegment = document.querySelector('.display--value');
const keyboard = document.querySelector('.keyboard--part');

// Globals
operands = Array(3);
operators = {
  plus: '+',
  minus: '-',
  mul: '*',
  divide: '/',
};

function display(value) {
  // Variables
  let toDisplay = '';
  const curNum = displaySegment.textContent;

  // Logic

  // Limit
  if (curNum.length === 15) return;

  // If it is already a decimal
  if (/\./.test(value)) {
    if (/\./.test(curNum)) return;
    toDisplay = curNum + value;

    // User want's to input operations before second operand.
  } else if (['plus', 'minus', 'mul', 'divide'].includes(value)) {
    // If user wants to change the opeation
    if (/\*|\+|\-|\//.test(evalSegment.textContent)) {
      evalSegment.textContent = `${operands[0]} ${operators[value]}`;
      toDisplay = '';
      operands[1] = operators[value];
      return;
    }
    evalSegment.textContent = `${curNum} ${operators[value]}`;
    operands[0] = Number(curNum);
    operands[1] = operators[value];
    toDisplay = '';

    // If user just wants to input a number.
  } else {
    toDisplay = Number(curNum + value).toString();
  }

  // Display!
  displaySegment.textContent = toDisplay;
}

keyboard.addEventListener('click', (e) => {
  if (e.target.dataset.value) display(e.target.dataset.value);
});
