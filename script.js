const playField = document.querySelector('.play__field');
const startButton = document.querySelector('.play__button');
let coloredCells;
let timerId;
let timeSpent;

// Цвета, в которые будут окрашиваться клетки
const colors = ['red', 'green', 'gray', 'yellow', 'blue', 'pink', 'orange', 'light-blue'];

// Генерация клеток при загрузке страницы
for (let i = 0; i < 16; i += 1) {
  const cell = document.createElement('div');
  cell.classList.add('white');
  playField.appendChild(cell);
}

const cells = document.querySelectorAll('.white');

// Нажатие на Старт - устанавливается таймер и генерируются цвета клеток
startButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  const start = new Date();
  clearInterval(timerId);
  timerId = setInterval(() => {
    const timer = document.querySelector('.timer');
    // eslint-disable-next-line no-use-before-define
    timeSpent = msToTime(new Date() - start);
    timer.innerText = timeSpent;
  }, 1);

  // eslint-disable-next-line no-use-before-define
  generateColor();
});

// Клик по игровому полю - определяется клетка, по которой клиунули игра начинается
playField.onclick = function (event) {
  const { target } = event;
  // eslint-disable-next-line no-use-before-define
  rulesPlay(target);
};

// Раздаёт случайным образом цвета клеткам
function generateColor() {
  const randomColors = colors.concat(colors);
  // eslint-disable-next-line no-use-before-define
  randomColors.sort(compareRandom);
  coloredCells = randomColors.map(element => ({
    color: element, opened: false, halfOpened: false,
  }));
}

// Возвращает массив (открытую клетку без пары)
function existHalfOpened() {
  return coloredCells.filter(item => item.halfOpened);
}

// Возвращает массив открытых клеток (у которых открыта пара)
function existOpened() {
  return coloredCells.filter(item => item.opened);
}

function rulesPlay(target) {
  const parent = target.parentNode;
  const index = Array.prototype.indexOf.call(parent.children, target);

  if (target.className !== 'white') return;

  // Если нет открытых клеток без пары, окрасить кликнутую клетку и дать флаг "ожидает пару"
  if (existHalfOpened().length < 1) {
    target.classList.add(coloredCells[index].color);
    coloredCells[index].halfOpened = true;
  } else {
    const targetCell = existHalfOpened()[0];

    // Если цвета клеток совпадают - окрасить кликнутую клетку и
    // указать флаг "открыто" и "не ожидает пару"
    if (targetCell.color === coloredCells[index].color) {
      target.classList.add(coloredCells[index].color);
      targetCell.opened = true;
      targetCell.halfOpened = false;
    } else {
      // Если не совпадают - найти открытую клетку, ожидающую пару, окрасить в белый и
      // убрать "флаг ожидает пару"
      cells.forEach((element, ind) => {
        const item = coloredCells[ind];
        if (item.halfOpened === true) {
          element.classList.remove(item.color);
        }
      });
      targetCell.halfOpened = false;
    }
  }

  if (existOpened().length === coloredCells.length / 2) {
    clearInterval(timerId);
    setTimeout(() => {
      alert(`Вы выиграли!\nЗатраченное время:${timeSpent}`);
    }, 100);
  }
}

// Переводит милисекунды в стандартное время
function msToTime(ms) {
  return new Date(ms).toISOString().slice(14, -1);
}

// Функция для перемешивания массива цветов
// eslint-disable-next-line no-unused-vars
function compareRandom(a, b) {
  return Math.random() - 0.5;
}
