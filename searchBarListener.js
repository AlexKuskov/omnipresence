const { shell } = require('electron')
const { ipcRenderer } = require('electron');


const searchBarEl = document.querySelector('.js-search-bar');
let itemIndex = -1;
let suggestionList = [];

window.addEventListener('show', () => {
    window.getSelection().removeAllRanges();
});

searchBarEl.addEventListener('keydown', (e) => {
    if (e.keyCode === 38) e.preventDefault();

    // functionality for up and down arrow buttons
    if (e.keyCode === 38 && itemIndex > 0) {
        itemIndex--;
        ipcRenderer.send('request-change-list-item-highlighted', itemIndex);
    }
    if (e.keyCode === 40 && itemIndex < (suggestionList.length - 1)) {
        itemIndex++;
        ipcRenderer.send('request-change-list-item-highlighted', itemIndex);
    }

    // Enter handling
    if (e.keyCode === 13) {
        let encodedUri = encodeURIComponent(e.target.value);

        if (itemIndex !== -1) {
            suggestionItemText = removeBoldTags(suggestionList[itemIndex]);
            encodedUri = encodeURIComponent(suggestionItemText);
        }
        
        shell.openExternal('https://www.google.com/search?q=' + encodedUri);
        ipcRenderer.send('request-update-dropdown-data', []);
        suggestionList = [];
        e.target.value = '';
    }

    if (e.keyCode !== 38 && e.keyCode !== 40) itemIndex = -1;
});

// SEND 'GET' REQUEST TO FETCH SUGGESTIONS FROM GOOGLE
searchBarEl.addEventListener('input', (e) => {
    const searchQuery = encodeURIComponent(e.target.value);
    const googleLink = 'https://www.google.com/complete/search?client=psy-ab&q=';
    const promise = fetch(googleLink + searchQuery);

    promise
        .then(res => res.json())
        .then(res => {
            res = res[1].map(item => item[0]);

            ipcRenderer.send('request-update-dropdown-data', res);
            suggestionList = res;
        });
});

function removeBoldTags(text) {
    return text.replace(/<\/?b>/g, '');
}
