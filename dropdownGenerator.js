const { shell } = require('electron')
const { ipcRenderer } = require('electron');


const suggestionListEl = document.querySelector('.js-suggestion-list');

suggestionListEl.addEventListener('click', (e) => {
    if (e.target.tagName === 'UL') return;
    // console.dir(e.target.innerText);
    let listItemText = e.target.innerText;

    if (e.target.tagName === 'B') listItemText = e.target.parentNode.innerText;
    const encodedUri = encodeURIComponent(listItemText);
    shell.openExternal('https://www.google.com/search?q=' + encodedUri)
});

// suggestionListEl.addEventListener('keydown', e => {
//     console.log(e.keyCode);
// });

ipcRenderer.on('action-update-dropdown-data', (event, arg) => {    
    // arg contains the data sent from the first view
    renderDropdown(arg);
});

ipcRenderer.on('action-change-list-item-highlighted', (event, arg) => {
    removeAllHighlighted();
    suggestionListEl.childNodes[arg].classList.add('hightlighted');
    // console.log(arg);
});

function renderDropdown(listItems) {
    suggestionListEl.innerHTML = '';

    listItems.forEach(listItemText => {
        const li = document.createElement('li');
        li.innerHTML = listItemText;

        suggestionListEl.appendChild(li);

        li.addEventListener('mousemove', (e) => {
            removeAllHighlighted();
            if (e.target.tagName === 'B') {
                e.target.parentNode.classList.add('hightlighted');
                return;
            }
            e.target.classList.add('hightlighted');
        });
        li.addEventListener('mouseleave', (e) => {
            e.target.classList.remove('hightlighted');
        });
    });
}

// TODO: add removing ALL highlighted
function removeAllHighlighted() {
    suggestionListEl.childNodes.forEach(node => {
        node.classList.remove('hightlighted');
    });
}
