let area = document.getElementById('area'); // простарнство для клетки
let currentPlayer = document.getElementById('curPlyr'); // текщий игрок
let cell = document.getElementsByClassName('cell'); // клетка 

// изначальный игрок
let player = "x"; 
let stat = {
    "x": 0,
    "o": 0,
    "d": 0, // ничья 
}

// ВЫИГРАШНЫЕ КОМБИНАЦИИ:
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


// создание ячеек
for (let i = 1; i <= 9; i++) {
    area.innerHTML += `<div class="cell" pos= ${i} ></div>`; // `..${value}` и pos - это номер ячейки (позиции) - пригодится в дальнейшем

};

// навешиваем события
for (let i = 0; i < cell.length; i++) { 
    cell[i].addEventListener('click', cellClick, false);
}

// обработчик
function cellClick() {
    let data = [];
    // проверка на занятость ячейки
    if (!this.innerHTML) {
        this.innerHTML = player; // = "x" или "o" (чередование ниже)
    } else {
        alert("Ячейка занята");
        return; // выйти из обработчика
    };

    // добавить в массив положение игрока
    for (let i in cell) {
       
        if (cell[i].innerHTML == player) {
            data.push(parseInt(cell[i].getAttribute('pos'))); // пример: 1
        }
    }

    //совпадает ли, текущее положение "x/o" с выиграшным (winIndex)
    if (checkWin(data)) { // checkWin() - функция проверки совпадений
    // статистика игры:
        stat[player] += 1; // +1 к статистики
    // очищение ячеек и вывод на экран сообщения
        restart(`Выиграл: ${ player }`)
    } else { 
        let draw = true; // иначе НИЧЬЯ
        for (let i in cell) { // пробежимся по колекции (по ячейкам)
            if (cell[i].innerHTML == '') draw = false; // проверка на пустую ячейку
        }

        if (draw) { // если draw == true
            //    статистика игры:
            stat.d += 1; // +1 к статистики
            restart("Ничья!"); 
        }
    }
        

 // чередование "x" и "o"
    player = player == "x" ? "o" : "x"; 
    // покажем текущего игрока (на странице):
    currentPlayer.innerHTML = player.toUpperCase(); // все ЗАГЛАВНЫЕ буквы (пример: Сейчас ходит: X)
}


// функция полной (все три) сверки текущей комбинации позиции игрока с выиграшной winIndex
function checkWin(data) {
    // перебор winIndex
    for (let i in winIndex) {  
        let win = true;
        for (let j in winIndex[i]) { 
            let id = winIndex[i][j]; 
            let ind = data.indexOf(id); 

            if (ind == -1) { 
                win = false;
            }
        }

        if (win) return true; 
    }

    return false; 
}


// функция очищения ячеек:
function restart(text) {
    alert(text);
    for(let i = 0; i < cell.length; i++) {
        cell[i].innerHTML = '';
    }
    // функция обновления статистики:
    updateStat();

}


// функция обновления статистики игры:
function updateStat() {
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





