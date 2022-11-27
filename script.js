'use strcit';

const evalSegment = document.querySelector('.calc--eval');
const displaySegment = document.querySelector('.display--value');
const keyboard = document.querySelector('.keyboard--part');

// Globals
let happenedOnce = false;
let isWaitingForSecond = false;
let operationArray = [];

function clearAll() {
  evalSegment.textContent = '';
  displaySegment.textContent = '';
  operationArray = [];
  isWaitingForSecond = false;
  happenedOnce = false;
}

function updateArray(isWaiting) {
  if (isWaiting) {
    operationArray[2] = Number(displaySegment.textContent);
  } else {
    operationArray[0] = Number(displaySegment.textContent);
  }
}

function deleteOne(number) {
  if (happenedOnce) {
    return;
  } else {
    if (number === '') return;
    else if (number.length === 1) displaySegment.textContent = '';
    else {
      displaySegment.textContent = number.slice(0, -1);
    }
  }
}

function displayNumber(val, curNum, isWaiting) {
  if (curNum === '' && val === '.') {
    displaySegment.textContent = '0.';
    return;
  }
  if (/\./.test(curNum) && val === '.') return;
  if (curNum === '0' && val !== '.') displaySegment.textContent = val;
  else {
    displaySegment.textContent = curNum + val;
  }
}

function displayOperator(operator) {
  evalSegment.textContent = `${operationArray[0]} ${operator}`;
  displaySegment.textContent = '';
  operationArray[1] = operator;
  isWaitingForSecond = true;
}

function ifTooBig(number, operation) {
  if (operation === '/') {
    return true;
  }
  if (number.toString().length > 15) {
    let counter = '0';
    const doDamage = setInterval(function () {
      displaySegment.textContent = `TOO BIG.`;
      displaySegment.textContent += `${'.'.repeat(++counter)}`;
    }, 250);
    setTimeout(function () {
      clearInterval(doDamage);
    }, 1750);
    setTimeout(clearAll, 1750);
    return false;
  }
  return true;
}

function doCalculation(opArr) {
  if (opArr.length !== 3) return;
  evalSegment.textContent = `${opArr.join(' ')} =`;
  if (opArr[1] === '+') {
    if (ifTooBig(opArr[0] + opArr[2])) {
      displaySegment.textContent = `${opArr[0] + opArr[2]}`;
      return opArr[0] + opArr[2];
    }
  }
  if (opArr[1] === '-') {
    if (ifTooBig(opArr[0] - opArr[2])) {
      displaySegment.textContent = `${opArr[0] - opArr[2]}`;
      return opArr[0] - opArr[2];
    }
  }
  if (opArr[1] === '*') {
    if (ifTooBig(opArr[0] * opArr[2])) {
      displaySegment.textContent = `${opArr[0] * opArr[2]}`;
      return opArr[0] * opArr[2];
    }
  }
  if (opArr[1] === '/') {
    if (ifTooBig(opArr[0] / opArr[2], opArr[1])) {
      if (opArr[2] === 0) {
        let counter = 0;
        const doDamage = setInterval(function () {
          displaySegment.textContent = `NO WAY.`;
          displaySegment.textContent =
            displaySegment.textContent + `${'.'.repeat(++counter)}`;
        }, 250);
        setTimeout(function () {
          clearInterval(doDamage);
        }, 2250);
        setTimeout(clearAll, 2250);
        return;
      }
      displaySegment.textContent = `${Number(
        (opArr[0] / opArr[2]).toFixed(5)
      )}`;
      return Number((opArr[0] / opArr[2]).toFixed(5));
    }
    isWaitingForSecond = false;
  }
}

keyboard.addEventListener('click', function (e) {
  const value = e.target.dataset.value;
  const currentNumber = displaySegment.textContent;
  if (happenedOnce && /[0-9\.]/.test(value)) {
    isWaitingForSecond = false;
    happenedOnce = false;
    evalSegment.textContent = '';
    const currentNumber = '';
    operationArray[0] = Number(value);
    displayNumber(value, currentNumber, isWaitingForSecond);
  } else if (happenedOnce && /[\*\/\+\-]/.test(value)) {
    isWaitingForSecond = false;
    happenedOnce = false;
    displayOperator(value);
  } else {
    if (value === 'clear') {
      clearAll();
    } else if (value === 'delete') {
      deleteOne(currentNumber);
      updateArray(isWaitingForSecond);
    } else if (/[0-9\.]/.test(value)) {
      if (currentNumber.length === 15) return;
      displayNumber(value, currentNumber, isWaitingForSecond);
      updateArray(isWaitingForSecond);
    } else if (/[\*\/\+\-]/.test(value)) {
      if (operationArray.length === 3) {
        return;
      }
      if (operationArray.length < 1) {
        return;
      }
      displayOperator(value);
    } else if (value === 'equal') {
      if (operationArray.length !== 3) return;
      const newFirstVal = doCalculation(operationArray);
      operationArray.length = 0;
      operationArray[0] = newFirstVal;
      if (operationArray[0] === undefined) {
        clearAll();
        return;
      }
      happenedOnce = true;
    }
  }
});

document.querySelector('.key--equal').classList.add('darken');
document.querySelectorAll('.manipulate').forEach((elem) => {
  elem.classList.add('darken');
});

document.addEventListener('click', function (e) {
  if (operationArray.length === 0) {
    document.querySelector('.key--equal').classList.add('darken');
    document.querySelectorAll('.manipulate').forEach((elem) => {
      elem.classList.add('darken');
    });
  } else if (operationArray.length === 1) {
    document.querySelector('.key--equal').classList.add('darken');
    document.querySelectorAll('.manipulate').forEach((elem) => {
      elem.classList.remove('darken');
    });
  } else if (operationArray.length === 2) {
    document.querySelectorAll('.manipulate').forEach((elem) => {
      elem.classList.add('darken');
    });
  } else if (operationArray.length === 3) {
    document.querySelector('.key--equal').classList.remove('darken');
  }
});
