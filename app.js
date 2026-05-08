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
        const { category, subcategory } = item;

        if (!subcategory) {
            if (result[category]) {
                result[category].push(item);
            } else {
                result[category] = [ item ];
            }

            return;
        }

        if (result[category]) {
            if (result[category][subcategory]) {
                result[category][subcategory].push(item);
            } else {
                result[category][subcategory] = [ item ];
            }
        } else {
            result[category] = {};
            result[category][subcategory] = [ item ];
        }

        
    });
    return result;
}

function renderHTML(category, data, subcategorize = false) {
    const container = document.getElementById(category);

    // goal here
    // render <div class = "menuSubtitle"></div>
    // at the beginning of the list

    console.log("kaoru", data);

    if (subcategorize) { 
        let result = ``;
        for (const [subcategory, menuItems] of Object.entries(data)) {
            console.log("subcategory", subcategory);
            console.log("menu items", menuItems);
            let headHtml = `<div class = "menuSubtitle">${subcategory}</div>`;
            let html = menuItems.map(item => `
                <div class = "menuItem">
                    <div class = "dish">${item.name}</div>
                    <div class = "price">${item.price}</div>
                </div>
            `).join('');
            let closingHtml = `<div class = "menuCloser"></div>`
            result = result + headHtml + html + closingHtml;
        }

        container.innerHTML = result;
        return;
    }
    
    console.log("kaoru", data);
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
    renderHTML("okonomiyaki", categorizedMenu["お好み焼き"], true);
    renderHTML("yakisoba", categorizedMenu["焼きそば"]);
    renderHTML("entree", categorizedMenu["一品"]);
    renderHTML("lunch", categorizedMenu["ランチメニュー"]);
    renderHTML("drink", categorizedMenu["ドリンク"], true);
}

main();

// let menuData = getData();
// console.log("kaoru", menuData);