// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления
const minWeightInput = document.querySelector('.minweight__input');
const maxWeightInput = document.querySelector('.maxweight__input');

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript (массив)
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = (fruitsToDisplay = fruits) => {
  fruitsList.innerHTML = ''; // Очищаем список фруктов

  // Перебираем массив фруктов
   for (let i = 0; i < fruitsToDisplay.length; i++) {
    const fruit = fruitsToDisplay[i];

     // Определяем CSS-класс по цвету
    let colorClass = '';
    switch (fruit.color) {
      case 'фиолетовый':
        colorClass = 'fruit_violet';
        break;
      case 'зеленый':
        colorClass = 'fruit_green';
        break;
      case 'розово-красный':
        colorClass = 'fruit_carmazin';
        break;
      case 'желтый':
        colorClass = 'fruit_yellow';
        break;
      case 'светло-коричневый':
        colorClass = 'fruit_lightbrown';
        break;
      default:
        colorClass = '';
    }

    // Создаём карточку
    const li = document.createElement('li');
    li.classList.add('fruit__item', colorClass);

    // Заполняем данными
    li.innerHTML = `
      <div class="fruit__info">
        <div>index: ${i}</div>
        <div>kind: ${fruit.kind}</div>
        <div>color: ${fruit.color}</div>
        <div>weight: ${fruit.weight}</div>
      </div>
    `;

    // Добавляем в DOM
    fruitsList.appendChild(li);
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const shuffleFruits = () => {
  const oldFruits = [...fruits]; // сохранить оригинальный порядок
  const result = [];

  while (fruits.length > 0) {
    const index = getRandomInt(0, fruits.length - 1);
    const fruit = fruits.splice(index, 1)[0];
    result.push(fruit);
  }

  fruits = result;

  // сравнение по ссылке: если порядок тот же — значит неудача
  const isSame = oldFruits.every((fruit, i) => fruit === fruits[i]);

  if (isSame) {
    alert('Перемешивание не удалось. Попробуйте ещё раз.');
  }
};

// Событие на кнопку "Перемешать"
shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
let filteredFruits = [...fruits];

const filterFruits = () => {
  const min = parseInt(minWeightInput.value);
  const max = parseInt(maxWeightInput.value);

  if (isNaN(min) || isNaN(max)) {
    alert('Введите корректные значения веса');
    return;
  }

  const result = fruits.filter(fruit => fruit.weight >= min && fruit.weight <= max);
  display(result);
};

filterButton.addEventListener('click', () => {
  filterFruits();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const colorPriority = [
  'красный',          // на всякий случай
  'розово-красный',
  'оранжевый',
  'желтый',
  'зеленый',
  'голубой',
  'синий',
  'фиолетовый',
  'светло-коричневый'
];

const comparationColor = (a, b) => {
  const aIndex = colorPriority.indexOf(a.color);
  const bIndex = colorPriority.indexOf(b.color);

  const safeA = aIndex === -1 ? Infinity : aIndex;
  const safeB = bIndex === -1 ? Infinity : bIndex;

  return safeA - safeB;
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (comparation(arr[j], arr[j + 1]) > 0) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
  },

  quickSort(arr, comparation) {
    const recursiveSort = (items) => {
      if (items.length < 2) return items;

      const pivot = items[0];
      const left = items.slice(1).filter(item => comparation(item, pivot) < 0);
      const right = items.slice(1).filter(item => comparation(item, pivot) >= 0);
      return [...recursiveSort(left), pivot, ...recursiveSort(right)];
    };

    // Модифицируем оригинальный массив поэлементно
    const sorted = recursiveSort(arr);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = sorted[i];
    }
  },

  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  }
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  sortKind = sortKind === 'bubbleSort' ? 'quickSort' : 'bubbleSort';
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  sortTimeLabel.textContent = 'sorting...';

  const sortFunction = sortAPI[sortKind];
  sortAPI.startSort(sortFunction, fruits, comparationColor);

  display();
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  const kind = kindInput.value.trim();
  const color = colorInput.value.trim();
  const weight = parseInt(weightInput.value);

  if (!kind || !color || isNaN(weight)) {
    alert('Пожалуйста, заполните все поля корректно.');
    return;
  }

  const newFruit = {
    index: fruits.length,
    kind,
    color,
    weight
  };

  fruits.push(newFruit);
  display();
});
