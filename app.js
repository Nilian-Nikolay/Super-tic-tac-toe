let step = "krest";
let spanPlayer = document.querySelector('#spanPlayer');
const whoIsNext = () => {
    spanPlayer.innerText = step === "circle" ? "Х" : "О";
}

let nextActiveField = null; 

const combi = [
    [1, 2, 3], [4, 5, 6], [7, 8, 9],
    [1, 4, 7], [2, 5, 8], [3, 6, 9],
    [1, 5, 9], [3, 5, 7]
];

const globalResults = {
    1: null, 2: null, 3: null,
    4: null, 5: null, 6: null,
    7: null, 8: null, 9: null
};

const fields = {
    1: { krestikPositions: [], nolikPositions: [], gameFinished: false },
    2: { krestikPositions: [], nolikPositions: [], gameFinished: false },
    3: { krestikPositions: [], nolikPositions: [], gameFinished: false },
    4: { krestikPositions: [], nolikPositions: [], gameFinished: false },
    5: { krestikPositions: [], nolikPositions: [], gameFinished: false },
    6: { krestikPositions: [], nolikPositions: [], gameFinished: false },
    7: { krestikPositions: [], nolikPositions: [], gameFinished: false },
    8: { krestikPositions: [], nolikPositions: [], gameFinished: false },
    9: { krestikPositions: [], nolikPositions: [], gameFinished: false },
};

const smlcell = document.querySelectorAll(".sml-cell");
smlcell.forEach(item => {
    item.addEventListener('click', handleClick);
    item.addEventListener('mouseenter', handleMouseEnter);
    item.addEventListener('mouseleave', handleMouseLeave);
});

function handleClick() {
    whoIsNext();
    let cellid = Number(this.id.split('-')[2]);
    let fieldid = Number(this.parentElement.id.split('-')[2]);
    let field = fields[fieldid];
    
    if (nextActiveField !== null && nextActiveField !== fieldid) {
        console.log("Ход в это поле не разрешен");
        return;
    }
    if (!field.gameFinished && !this.classList.contains('circle') && !this.classList.contains('krest')) {
        handleCellClick(this, cellid, fieldid);
    }
}

function handleCellClick(cell, cellid, fieldid) {
    let field = fields[fieldid];
    cell.classList.add(step);
    cell.innerText = step === "krest" ? "X" : "O";
    field[step === "krest" ? "krestikPositions" : "nolikPositions"].push(cellid);

    checkWin(field, fieldid);
    step = step === "circle" ? "krest" : "circle";

    function clearFieldHighlights() {
        const allFields = document.querySelectorAll('.bg-cell');
        allFields.forEach(field => {
            field.style.backgroundColor = ''; // Сброс цвета фона
        });
    }
    clearFieldHighlights();
    nextActiveField = cellid; // Следующий ход должен быть в поле, соответствующем номеру этой ячейки
    
    // Проверяем, указывает ли nextActiveField на завершенное поле
    if (fields[nextActiveField] && fields[nextActiveField].gameFinished) {
        nextActiveField = null; // Разрешаем ход в любое поле
    }

    updateFieldAccessibility(); // Обновляем доступность полей

    // Уменьшение размера всех полей
    const allFields = document.querySelectorAll('.bg-cell');
    allFields.forEach(field => {
        field.style.transform = 'scale(1)';
    });
    // Увеличение размера поля с определенным идентификатором
    const currentField = document.getElementById(`bg-cell-${nextActiveField}`);
    if (currentField) {
        currentField.style.transform = 'scale(1.5)';
    }
    // Добавляем обработчики событий наведения мыши для всех блоков
    allFields.forEach(field => {
        field.addEventListener('mouseenter', handleMouseEnter);
        field.addEventListener('mouseleave', handleMouseLeave);
    });
}
function updateFieldAccessibility() {
    const allFields = document.querySelectorAll('.bg-cell');
    allFields.forEach(field => {
        const id = Number(field.id.split('-')[2]);
        if (fields[id].gameFinished) {
            field.classList.add('disabled');
            field.classList.remove('active');
        } else if (nextActiveField === null || id === nextActiveField) {
            field.classList.remove('disabled');
            field.classList.add('active');
        } else {
            field.classList.add('disabled');
            field.classList.remove('active');
        }
    });
}

function handleMouseEnter() {
    if (!this.style.transform || this.style.transform === 'scale(1)') {
        this.style.transform = 'scale(1.2)';
    }
    let fieldToHighlight = getFieldForHighlighting(this);
    if (fieldToHighlight) {
        fieldToHighlight.style.backgroundColor = 'green';
    }
}

function handleMouseLeave() {
    if (!this.style.transform || this.style.transform === 'scale(1.2)') {
        this.style.transform = 'scale(1)';
    }
    let fieldToUnhighlight = getFieldForHighlighting(this);
    if (fieldToUnhighlight) {
        fieldToUnhighlight.style.backgroundColor = '';
    }
}
function getFieldForHighlighting(element) {
    let cellid = Number(element.id.split('-')[2]);
    let parentFieldId = Number(element.parentElement.id.split('-')[2]);

    if (nextActiveField === null || nextActiveField === parentFieldId) {
        return document.getElementById(`bg-cell-${cellid}`);
    }
    return null;
}


function checkWin(field, fieldid) {
    const smlX = document.querySelector(`#smlX${fieldid}`);
    const smlO = document.querySelector(`#smlO${fieldid}`);
    const non = document.querySelector(`#non${fieldid}`);

    combi.forEach(pattern => {
        if (pattern.every(cell => field.krestikPositions.includes(cell))) {
            console.log("Победа крестиков в одном блоке");
            smlX.style.display = "block";
            field.gameFinished = true;
            globalResults[fieldid] = 'X';
            checkGlobalWin();
        } else if (pattern.every(cell => field.nolikPositions.includes(cell))) {
            console.log("Победа ноликов в одном блоке");
            smlO.style.display = "block";
            field.gameFinished = true;
            globalResults[fieldid] = 'O';
            checkGlobalWin();
        } else if (field.krestikPositions.length + field.nolikPositions.length === 9) {
            console.log("Ничья");
            non.style.display = "block";
            field.gameFinished = true;
            globalResults[fieldid] = 'Draw';
            checkGlobalWin();
        }
    });
}

function checkGlobalWin() {
    const biiigX = document.querySelector('#biiigX');
    const biiigO = document.querySelector('#biiigO');
    const biiigN = document.querySelector('#biiigN');

    combi.forEach(pattern => {
        if (pattern.every(id => globalResults[id] === 'X')) {
            console.log("Глобальная победа крестиков!");
            biiigX.style.display = "block";
        } else if (pattern.every(id => globalResults[id] === 'O')) {
            console.log("Глобальная победа ноликов!");
            biiigO.style.display = "block";
        }
    });
    if (Object.values(globalResults).every(result => result !== null)) {
        console.log("Глобальная ничья");
        biiigN.style.display = "block";
    }
}