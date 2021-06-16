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
        if (!idArray.includes(data[idx].id)) {
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
    const arr = await catId;
    for (let i = 0; i < arr.length; i++) {
        let clueObj = {};
        const id = arr[i];
        const {res, data} = await axios.get('http://jservice.io/api/category',
        {params: {id,}});
        clueObj['title'] = data.title;
        for (let j = 0; j < 5; j++) {
            const clueId = Math.floor(Math.random() * data.clues.length);
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
    }
    return categories;
};


/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO