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
    let clueIdArray = [];
    const arr = await catId;
    for (let i = 0; i < arr.length; i++) {
        let clueObj = {};
        const id = arr[i];
        const {res, data} = await axios.get('http://jservice.io/api/category',
        {params: {id,}});
        // console.log(data.clues);
        let newArr = Array.from(data.clues)
        let truth = newArr.every(item => item.question !== "");
        console.log(truth)
        clueObj['title'] = data.title;
        for (let j = 0; j < 5; j++) {
            let clueId = Math.floor(Math.random() * data.clues.length);
            if (data.clues.length === 5) {
                clueId = j;
            } else {
                if (clueIdArray.indexOf(clueId) !== -1) {
                    // console.log(clueIdArray)
                    console.log(`first clue id: ${clueId}`)
                    while (clueIdArray.indexOf(clueId) !== -1) {
                        clueId = Math.floor(Math.random() * data.clues.length);
                        if (data.clues[clueId].question === "") {
                            clueId = clueIdArray.slice(-1)[0];
                        };
                        console.log(`new clue id: ${clueId}`);
                    }
                }
            }
            clueIdArray.push(clueId);
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
    }
    console.log(categories)
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
    let counter = 0;
    await getCategory(getCategoryIds());
    console.log(categories)
    let $thead = $('thead');
    let $tbody = $('tbody');
    let $headerRow = $('#header');
    for (let i = 0; i < categories.length; i++) {
        let $catHeader = $(`<th>${categories[i].title}</th>`);
        $headerRow.append($catHeader);
    }
    for (let j = 0; j < categories.length; j++) {
        let $newRow = $('<tr></tr>');
        for (let k = 0; k < categories[0]['clues'].length+1; k++) {
            try {
                const newQuestion = categories[k].clues[j].question;
                $newRow.append(`<td>${newQuestion}</td>`)
                counter++
            } catch(e) {
                console.log('no question at this index');
            }
        }
        $tbody.append($newRow);
        counter = 0;
    }
}
fillTable();
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