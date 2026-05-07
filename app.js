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

async function main() {
    const menuData = await getData();
    let categorizedMenu = categorize(menuData);

    const container = document.getElementById("appetizer");
    container.innerHTML = categorizedMenu["とりあえず"].map(item => `
        <div class = "menuItem">
            <div class = "dish">${item.name}</div>
            <div class = "price">${item.price}</div>
        </div>
    `
    ).join('')
}

main();

// let menuData = getData();
// console.log("kaoru", menuData);