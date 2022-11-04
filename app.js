const cols = document.querySelectorAll('.col');

document.addEventListener('keydown', event => {
  event.preventDefault();
  if (event.code.toLowerCase() === 'space') {
    setRandomColors();
  };
})

document.addEventListener('click', (event) => {
  const type = event.target.dataset.type;

  if (type === 'lock') {
    const node = event.target.tagName.toLowerCase() === 'i'
      ? event.target
      : event.target.children[0]

    node.classList.toggle('fa-lock-open');
    node.classList.toggle('fa-lock');
  } else if (type === 'сopy') {
    console.log('Вы скопировали текст');
    copyToClickboard(event.target.textContent);
  }
})

// генерация случайного цвета
// function generateRandomColor() {

//   const hexCodes = '0123456789ABCDEF';
//   let color = '';
//   for (let i = 0; i < 6; i++) {
//     color += hexCodes[Math.floor(Math.random() * hexCodes.length)]
//   }
//   return '#' + color
// };

// копирование в буфер обмена названия цвета
function copyToClickboard(text) {
  navigator.clipboard.writeText(text)
}

// установка случайного цвета в колонку
function setRandomColors(isInitial) {
  // если это первоначалбная загрузка то забираем цвета их хэша а иначе это будет пустой массив
  const colors = isInitial ? getColorsFromHash() : [];

  cols.forEach((col, index) => {
    // определяем заблокирована ли колонка
    const isLocked = col.querySelector('i')
      .classList.contains('fa-lock');
    const text = col.querySelector('h2');
    const button = col.querySelector('button');

    if (isLocked) {
      colors.push(text.textContent)
      return;
    }

    // генераия цвета
    // если это первичная загрузка то нужно получить цвета не рандомно а из массива colors
    const color = isInitial
      ? colors[index]
        // если существует то используем из массиа, если нет то генерируем
        ? colors[index]
        : chroma.random()
      : chroma.random();

    // добавлять цвет в массив только в том сле=учае если это не первоначальная загрузка
    if (!isInitial) {
      colors.push(color);
    }

    text.textContent = color;
    col.style.background = color;

    setTextColor(text, color);
    setTextColor(button, color);
  })

  updateColorsHash(colors);
};

function setTextColor(text, color) {
  const luminance = chroma(color).luminance();
  text.style.color = luminance > 0.5 ? 'black' : 'white';
}

function updateColorsHash(colors = []) {
  document.location.hash = colors
    .map((col) => {
      return col.toString().substring(1)
    })
    .join('-');
}

function getColorsFromHash() {
  // проверка есть ли в хэше данные кроме решетки
  if (document.location.hash.length > 1) {
    // список всех цветов, но без первой решетки. И к каждому добавляем свою решетку
    return document.location.hash
      .substring(1)
      .split('-')
      .map(color => '#' + color)
  }
  return []
}

setRandomColors(true);