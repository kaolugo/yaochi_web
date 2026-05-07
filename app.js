const sheetUrl = "https://script.google.com/macros/s/AKfycby_rTl5ElIUcf0Fxd_-_chgbUcB2vEPFgADKTQMv7_I-7eoRVnOzbK786BGArXJMDpo/exec";
const categories = [
    "おすすめ",
    "お好み焼き",
    "とりあえず",
    "トッピング",
    "ドリンク",
    "ライス",
    "ランチメニュー",
    "一品",
    "焼きそば"
];

const mapping = {
    appetizer: "とりあえず",
    recommendation: "おすすめ"
};

const buttons = document.querySelectorAll('button');
const sections = document.querySelectorAll('.menuContent');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const target = button.dataset.target;

        // reset sections
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // reset buttons
        buttons.forEach(btn => {
            btn.classList.remove('active');
        });

        // activate current
        document.getElementById(target).classList.add('active');
        button.classList.add('active');
    });
});

async function getData() {
    console.log("entered getData")
    let response;
    try {
        response = await fetch(sheetUrl);
    } catch (err) {
        console.log("error: ", err);
    } finally {
        response = await response.json();
    }

    console.log("response", response);

    return response;
}

function categorize(data) {
    let result = {};
    data.forEach((item) => {
        if (result[item.category]) {
            result[item.category].push(item);
        } else {
            result[item.category] = [ item ];
        }
    });
    return result;
}

function renderHTML(category, data) {
    const container = document.getElementById(category);
    container.innerHTML = data.map(item => `
        <div class = "menuItem">
            <div class = "dish">${item.name}</div>
            <div class = "price">${item.price}</div>
        </div>
    `).join('');
}

async function main() {
    const menuData = await getData();
    let categorizedMenu = categorize(menuData);

    
    
    renderHTML("appetizer", categorizedMenu["とりあえず"]);
    renderHTML("recommendation", categorizedMenu["おすすめ"]);
}

main();

// let menuData = getData();
// console.log("kaoru", menuData);