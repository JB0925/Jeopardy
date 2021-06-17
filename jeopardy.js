// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];
let counter = 0;
const $spinner = $('#spinner');
const $restartButton = $('button');
let startGame = true;
/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    let idArray = [];
    const {res, data} = await axios.get('http://jservice.io/api/categories',
    {params: {count: 100}});
    for (let i = 0; i < data.length; i++) {
        let idx = Math.floor(Math.random() * data.length)

        const allQuestions = await axios.get('http://jservice.io/api/category',
        {params: {id:data[idx].id}})
        
        const trueOrFalse = Array.from(allQuestions.data.clues).every(item => item.question !== "");
    
        if (!idArray.includes(data[idx].id) && trueOrFalse) {
            idArray.push(data[idx].id)
        }
        if (idArray.length === 6) {
            return idArray;
        };
    };
};

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    let clues = [];
    let clueCategories = {};
    const arr = await catId;

    for (let i = 0; i < arr.length; i++) {
        let clueObj = {};
        const id = arr[i];
        const {res, data} = await axios.get('http://jservice.io/api/category',
        {params: {id,}});
        
        clueObj['title'] = data.title;
        clueCategories[data.title] = []
        for (let j = 0; j < 5; j++) {
            let clueId = Math.floor(Math.random() * data.clues.length);
            if (data.clues.length === 5) {
                clueId = j;
            } else {
                if (clueCategories[data.title].indexOf(clueId) !== -1) {
                    while (clueCategories[data.title].indexOf(clueId) !== -1) {
                        clueId = Math.floor(Math.random() * data.clues.length);
                    }
                }
            }
            clueCategories[data.title].push(clueId);
            const newClue = {
                question: data.clues[clueId].question,
                answer: data.clues[clueId].answer,
                showing: null
            }
            clues.push(newClue);
        }
        clueObj['clues'] = clues;
        categories.push(clueObj);
        clues = [];
        clueIdArray = [];
    };
    return categories;
};


/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

// create the pieces needed for the HTML table
const makeTableHeadTableRowandHeaderRow = () => {
    const table = $(`<table id="jeopardy"></table>`);
    let thead = $('<thead></thead>');
    let tbody = $('<tbody></tbody>');
    let headerRow = $('<tr></tr>');
    headerRow.attr('id', 'header');
    return [
        table,
        thead,
        tbody,
        headerRow
    ];
};

// append the category titles to the table header
const makeCategoryHeaders = (data, header) => {
    for (let i = 0; i < data.length; i++) {
        let $categoryHeader = $(`<th>${data[i].title}</th>`);
        header.append($categoryHeader);
    };
};

// creating the rows of questions, answers, and placeholder question mark cells
const makeAndFillTableRows = function (data, tbody) {
    for (let j = 0; j < data.length; j++) {
        let $newRow = $('<tr></tr>');
        for (let k = 0; k < data[0]['clues'].length+1; k++) {
            try {
                createAndAppendQuestionandAnswerTrs(data, j, k, $newRow);
            } catch(e) {
                console.log('no question at this index');
            }
        }
        tbody.append($newRow);
    };
};

// take the data and create three table cells, which will be appended to the rows in the body
const createAndAppendQuestionandAnswerTrs = (data, indexOne, indexTwo, newRow) => {
    const newQuestion = data[indexTwo].clues[indexOne].question;
    const newAnswer = data[indexTwo].clues[indexOne].answer;
    const $newTd = $(`<td>${newQuestion}</td>`)
    const $questionMark = $('<td>?</td>');
    const $answer = $(`<td>${newAnswer}</td>`);
    $answer.attr('id', `a${indexTwo}-${indexOne}`);
    $questionMark.attr('id', `${indexTwo}-${indexOne}`)
    $newTd.attr('id', `q${indexTwo}-${indexOne}`);
    $answer.css('display', 'none');
    $newTd.css('display', 'none');
    newRow.append($newTd);
    newRow.append($answer);
    newRow.append($questionMark);
    return newRow;
};

// puts the pieces from the functions above together and forms the HTML table
async function fillTable() {
    await getCategory(getCategoryIds());
    
    let [$table, $thead, $tbody, $headerRow] = makeTableHeadTableRowandHeaderRow();
    $thead.appendTo($table);
    $tbody.appendTo($table);
    $headerRow.appendTo($thead);
    
    makeCategoryHeaders(categories, $headerRow);
    makeAndFillTableRows(categories, $tbody);

    $table.appendTo($('body'));
    $table.on('click', handleClick);
    return $table;
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    let id = evt.target.id;
    if (id.length === 3) {
        let $questionMark = $(`#${id}`);
        let $question = $(`#q${id}`);
        $questionMark.remove();
        $question.css('display', 'table-cell');
    } 
    if (id.slice(0)[0] === 'q') {
        let $question = $(`#${id}`);
        $question.remove();
        let secondPartOfId = id.slice(1)
        let $answer = $(`#a${secondPartOfId}`)
        $answer.css('display', 'table-cell');
    } 
    else {
        return;
    }
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
    setTimeout(() => {
        $spinner.css('opacity', '1');
    })
    $restartButton.text('Loading...')
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
    setTimeout(() => {
        $spinner.css('opacity', '0');
        $restartButton.text('Restart');
    },10);
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    showLoadingView();
    await fillTable();
    $(function() {
        hideLoadingView();
    }) 
}

$restartButton.on('click', async function() {
    let $oldTable = $('#jeopardy');
    $oldTable.remove();
    categories = [];
    await setupAndStart();
});
/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO