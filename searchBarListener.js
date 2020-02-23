const { shell } = require('electron')
const { ipcRenderer } = require('electron');

const searchBarEl = document.querySelector('.js-search-bar');
let itemIndex = -1;
let suggestionList = [];

window.addEventListener('show', () => {
    window.getSelection().removeAllRanges();
});

searchBarEl.addEventListener('keydown', (e) => {
    // console.log(e.target.value);
    // console.log(e.keyCode); // 38 ^ :: 40 \/
    if (e.keyCode === 38) e.preventDefault();

    if (e.keyCode === 38 && itemIndex > 0) {
        itemIndex--;
        ipcRenderer.send('request-change-list-item-highlighted', itemIndex);
    }
    if (e.keyCode === 40 && itemIndex < (suggestionList.length - 1)) { // TODO: change when dynamic window will be applied
        itemIndex++;
        ipcRenderer.send('request-change-list-item-highlighted', itemIndex);
    }
    
    
    // highlighted list item position - max 9, min 0

    // console.log(suggestionList);
    // console.log(itemIndex);

    if (e.keyCode === 13) {
        let encodedUri = encodeURIComponent(e.target.value);

        if (itemIndex !== -1) {
            suggestionItemText = removeBoldTags(suggestionList[itemIndex]);
            encodedUri = encodeURIComponent(suggestionItemText);
            // console.log(removeBoldTags(suggestionList[itemIndex]));
            // get Dropdown List
            // [i] of item + it's innerText, then move to Chrome
        }

        
        shell.openExternal('https://www.google.com/search?q=' + encodedUri)
        e.target.value = '';
    }

    if (e.keyCode !== 38 && e.keyCode !== 40) itemIndex = -1;
});

function removeBoldTags(text) {
    return text.replace(/<\/?b>/g, '');
}

// ADD HERE A CUSTOM EVENT EMITTER?

// GET SUGGESTIONS FROM GOOGLE
searchBarEl.addEventListener('input', (e) => {
    const searchQuery = encodeURIComponent(e.target.value);
    const googleLink = 'https://www.google.com/complete/search?client=psy-ab&q=';
    const promise = fetch(googleLink + searchQuery);

    // console.log(promise);

    promise.then(res => {
        return res.json();

        // console.log(result);
    }).then(res => {
        // console.log(res);
        res = res[1]
            .map(item => item[0]);

        ipcRenderer.send('request-update-dropdown-data', res);
        suggestionList = res;
    })
});
