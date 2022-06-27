let area = document.getElementById('area');
// раздел: текущий игрок
let currentPlayer = document.getElementById('curPlyr');
currentPlayer.style = "color: red;"

// Используется живая коллекция "getElementsByClassName" вместо современного, но не автообновляемого querySelectorAll:
// ?Все методы "getElementsBy*" возвращают живую коллекцию. 
// Такие коллекции всегда отражают текущее состояние документа и автоматически обновляются при его изменении.
// из главы "Поиск: getElement*, querySelector*": https://learn.javascript.ru/searching-elements-dom
let cell = document.getElementsByClassName('cell');
//cell[0].style = "color: blue;"; // работает только на первый элемент И ПОСЛЕ ЦИКЛА СОЗДАНИЯ

let player = "x"; // первый игрок "x"
// статистика игры:
let stat = {
    "x": 0,
    "o": 0,
    "d": 0, // ничья 
}

// ВЫИГРАШНЫЕ КОМБИНАЦИИ: то есть, к примеру если все ячеки будут заполнены по диагонали или вретикально и т.д.
// и если визуально (показано в win-index.jpg в папке проекта) отметить ячейки уникальным идентификатором (НУМИРОВАННЫХ ЯЧЕЕК), то можно JS в массиве указать удачные композииции: 
let winIndex = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
]


// создание-вставка ячеек (блоков <div></div>)
for (let i = 1; i <= 9; i++) {
    area.innerHTML += `<div class="cell" pos= ${i} ></div>`; // `..${value}` и pos - это номер ячейки (позиции) - пригодится в дальнейшем

};
// ?изменения cell уже после уже построенного элемента (или коллекции)

// каждой ячейки добавляем событие click, при нажатии которого будет запускатся функция cellclick
for (let i = 0; i < cell.length; i++) { // у колекции имеются вспомогательные свойства, такие как length: https://learn.javascript.ru/dom-navigation#dom-kollektsii
    // cell[i].innerHTML += "проверка";
    cell[i].addEventListener('click', cellClick, false) // addEventListener('событие: клик мыши', обработчик: функция, доп. опции)
}

// обработчик
function cellClick() {

    // массив номеров ячеек, которые заняты игроком. То есть мы сохраняем позиции игрока, пробегаяс по нему циклом (ниже)
    let data = [];
    // проверка на: занята ли ячейка, если нет, то в ячейку записываем текущего игрока
    // условие (если ячейка НЕ занята, то вставить в ячейку "x":
    if (!this.innerHTML) {
        this.innerHTML = player; // == "x"
    } else {
        alert("Ячейка занята");
        return; // выйти из обработчика
    };

    // добавить в массив положение "x"
    for (let i in cell) {
        // если ячейка занята игроком (player == "x"), то добавить номер ячейки в массив data = [только "x"]
        if (cell[i].innerHTML == player) {
            //parseInt() преобразует первый аргумент в число по указанному основанию, а если это невозможно - возвращает NaN.
            // data.прибавить в массив(Превратить в число(определнная ячейка.взять атрибут(где его номер)));
            data.push(parseInt(cell[i].getAttribute('pos'))); // пример: 1
        }
    }

    //совпадает ли, текущее положение "x" с выиграшным (winIndex)
    if (checkWin(data)) { // checkWin() - функция проверки совпадений с выиграшными комбианциями
    //    статистика игры:
        stat[player] += 1; // +1 к статистики
       
        restart(`Выиграл: ${ player }`)
    // если checkWin => false, то:
    } else { //----------------логика положения НЕИЧЬЯ: https://www.youtube.com/watch?v=Hx7zgxCeFxU&t=343s
        
        let draw = true; // иначе НИЧЬЯ
        for (let i in cell) { // пробежимся по колекции (по ячейкам)
            if (cell[i].innerHTML == '') draw = false; // проверка на пустую ячейку
        }

        if (draw) {
            //    статистика игры:
            stat.d += 1; // +1 к статистики
            // если draw == true, то:
            // очистиются клетки
            // и на экран вывидится "Ничья!"
            restart("Ничья!"); // функция очищения("Строка, которая будет на экране") 
        }
    }
        

    // после каждого хода - меняем игрока ("x" и "o") и через консоль вводим массив data
    // то есть ЧЕРЕДУЕТСЯ вставка: "x" и "o"
    // player =присвоить результат условия = ЕСЛИ (player == "x") ТО ВРЕНУТЬ "o" ИЛИ "x"
    player = player == "x" ? "o" : "x"; 
    // покажем текущего игрока (на странице):
    currentPlayer.innerHTML = player.toUpperCase(); // все ЗАГЛАВНЫЕ буквы (пример: Сейчас ходит: X)
    // console.log(data); // для понимания кода: data хранит в себе положение игрока
}


// функция полной (все три) сверки текущей комбинации позиции игрока с выиграшной winIndex
function checkWin(data) {
    // перебор winIndex
    for (let i in winIndex) {  // берем одно значение (напимер [1,4,7]), помним, что winIndex = [[1,2,3], [4,5,6], ...]
        let win = true;
        for (let j in winIndex[i]) { // и перебираем на части (напимер [1,4,7] на 1, 4 и 7)
            let id = winIndex[i][j]; // пример: id = winIndex[2] => [7,8,9] => winIndex[2][1] = 8
            // arr.indexOf(item, from) ищет item совпадающий с arr, начиная с индекса from, и возвращает индекс, на котором был найден искомый элемент, в противном случае -1. (https://learn.javascript.ru/array-methods#indexof-lastindexof-i-includes)
            let ind = data.indexOf(id); // возвращает индекс data совпадения. Например: [1,2,3].indexOf(2) == 1

            if (ind == -1) { // если хоть одно число не совпадает с data, то метка win = false, и когда закончится цикл по ткущим([1,2,4],), win останеться false - то есть полного совадения нет с выиграшными комбинациями
                win = false;
            }
        }

        if (win) return true; // если есть совпадение в цикле, то будут возращатся true 
    }

    return false; // лимбо если нет совпадений => false
}


// функция очищения клеток:
function restart(text) {
    //console.log(stat) // пример: {x: 1, o: 2, d: 1}

    alert(text); // показать сообщение (например: ничья! или выиграл!)
    // перебрать все ячейки и присвоить им пустые строки ''
    for(let i = 0; i < cell.length; i++) {
        cell[i].innerHTML = '';

    }

    // функция обновления статистики:
    updateStat();

}


// функция обновления статистики игры:
function updateStat() {
    // выводим результаты статистики на старницу:
    // взял элемент с классом ... и вставил внутрь результат:
    document.getElementById('sX').innerHTML = stat.x;
    document.getElementById('sO').innerHTML = stat.o;
    document.getElementById('sD').innerHTML = stat.d;
}











// ?ЭКСПЕРИМЕНТЫ МОИ:
// проверка колликции на массив
console.log(Array.isArray(cell)); //false
// Вывод: Коллекции – не массивы! https://learn.javascript.ru/dom-navigation#dom-kollektsii

// коллекция – особый перебираемый объект-псевдомассив.
// поэтому есть два варианта:

// 1) перевести в массивы, а потом методы массивов
// Array.from(cell).forEach(element => { // Array.from -  универсальный метод Array.from, который принимает итерируемый объект или псевдомассив и делает из него «настоящий» Array. После этого мы уже можем использовать методы массивов. : https://learn.javascript.ru/iterable#array-from
//         element.style = "color: blue;";
//     });

// 2) перебор объекта:
// for (let node of cell) {
//   node.style = "color: blue;";
// }





