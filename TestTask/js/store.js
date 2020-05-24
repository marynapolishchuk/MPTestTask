function save(joke, key) {
    let jokesArray = getStoredJokes(key);
    jokesArray.push(joke);
    localStorage.setItem(key, jokesArray);
}

function unsave(joke, key) {
    let jokesArray = localStorage.getItem(key);
    if (jokesArray == null || jokesArray == "") {
        return;
    } else {
        if (document.querySelector(".main__jokes").children.length > 1 || document.querySelector(".favourite__jokes").children.length > 1) {
            jokesArray = jokesArray.replace("," + joke, "");
        } else {
            jokesArray = jokesArray.replace(joke, "");
        }
        localStorage.setItem(key, jokesArray);
    }
}

function loadJokes() {
    // localStorage.clear();
    // return;
    let favJokesArray = getStoredJokes("fav");
    let mainJokesArray = getStoredJokes("main");

    let favBlock = document.querySelector(".favourite__jokes");
    let mainBlock = document.querySelector(".main__jokes")
    if (favJokesArray != null) {
        for (let i = favJokesArray.length - 1; i >= 0 ; --i) {
            favBlock.innerHTML += favJokesArray[i];
        }
    }
    if (mainJokesArray != null) {
        for (let i = mainJokesArray.length - 1; i >= 0 ; --i) {
            mainBlock.innerHTML += mainJokesArray[i];
        }
    }
}


function getStoredJokes(key) {
    let jokesArray = localStorage.getItem(key);
    if (jokesArray == null || jokesArray == "") {
        jokesArray = new Array();
    } else {
        let re = /div>,<div/gi;
        jokesArray = jokesArray.replace(re, "div>~<div");
        jokesArray = jokesArray.split('~');
    }
    return jokesArray;
}