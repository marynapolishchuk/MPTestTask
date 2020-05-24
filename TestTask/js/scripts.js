"use strict"

//---------------------------------------------------------------------
function firstOptionReaction(op) {
    if (op.checked) {
        $('.options__categories').hide();
        $('.options__search-block').hide();
    }
}
function secOptionReaction(op) {
    if(op.checked) {
        $('.options__categories').fadeIn(600);
        $('.options__search-block').hide();
    }
}
function thirdOptionReaction(op) {
    if(op.checked) {
        $('.options__search-block').fadeIn(600);
        $('.options__categories').hide();
    }
}

//---------------------------------------------------------------------
function unselectAll() {
    let categories_block = document.querySelector(".options__categories");
    for (let child of categories_block.children) {
        unselect(child);
    }
}

function unselect(category) {
    let category_text = category.firstChild.innerText;
    category.className = "options__category category";
    category.setAttribute("onclick", "select(this);");
    category.innerHTML = `<div class="category__text">${category_text}</div>`;
}

function select(category) {
    unselectAll();
    let category_text = category.firstChild.innerText;
    category.className = "options__category category_selected";
    category.innerHTML = `<div class="category_selected__text">${category_text}</div>`;
}

//---------------------------------------------------------------------
window.onload = function(){
    loadJokes();
    const joke_button = document.querySelector(".form__submit");
    joke_button.addEventListener('click', () => {
        console.log("clicked");
        let url;
        if(document.querySelector(".options__inp1").checked) {
            url = "https://api.chucknorris.io/jokes/random";
        }
        else if (document.querySelector(".options__inp2").checked) {
            let category = document.querySelector(".category_selected__text").innerHTML;
            url = `https://api.chucknorris.io/jokes/random?category=${category.toLowerCase()}`;
        }
        else if (document.querySelector(".options__inp3").checked) {
            let inp = document.querySelector(".options__search").value;
            if (inp != "") {
                url = `https://api.chucknorris.io/jokes/search?query=${inp.replace(/ /g, "%20")}`;
            } else {
                alert("Oops! You should enter something!");
                return;
            }
        }
        fetch(url)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (document.querySelector(".options__inp3").checked) {
                    if (data.result.length == 0) {
                        alert("Nothing's found :(");
                        return;
                    }
                    for (let i = 0; i < data.result.length; ++i) {
                        addJoke(data.result[i].value, data.result[i].id, data.result[i].url, data.result[i].updated_at, data.result[i].categories);
                    }
                } else {
                    addJoke(data.value, data.id, data.url, data.updated_at, data.categories);
                }
            });
    
    });
}

function addJoke(joke_text, joke_id, joke_url, joke_last_update, joke_categories) {
    let date_time = String(joke_last_update).split(' ');
    let ms1 = Date.parse(`${date_time[0]}T${date_time[1]}Z`);
    let ms2 = new Date().getTime();
    document.querySelector(".main__jokes").innerHTML = `
    <div class="main__joke joke" id="${joke_id}">
        <div class="joke__heart" onclick="addToFavs(this);"></div>    
        <div class="joke__content">
            <div class="joke__message-icon"></div>
            <div class="joke__link">ID: <a href="${joke_url}">${joke_id}</a> <img src="images/joke/link.png" alt="link"> </div>
            <div class="joke__text">${joke_text}</div>
            <div class="joke__last-update">Last update: ${Math.round((+ms2 - +ms1)/3.6e+6)} hours ago</div>
        </div> 
    </div> ` + document.querySelector(".main__jokes").innerHTML;
    if(joke_categories.length) {
        document.querySelector(".main__joke").innerHTML += `
        <div class="joke__category category">
            <div class="category__text joke__cat-text">${joke_categories[0]}</div>
        </div>`;
    }
} 


//---------------------------------------------------------------------
function addToFavs(heart) {
    let joke = heart.parentNode;
    joke.classList.add("fav");
    heart.setAttribute("onclick", "removeFromFavs(this);");
    let favsBlock = document.querySelector(".favourite__jokes");
    favsBlock.innerHTML = ` 
    <div class="joke favourite__joke fav" id="${joke.id}_inblock">
        <div class="joke__heart"  onclick="removeFromFavsBlock(this, '${joke.id}')"></div>
        <div class="joke__content">
        ${joke.children[1].innerHTML}
        </div>
    </div>` + favsBlock.innerHTML;
    let favJoke = document.getElementById(`${joke.id}_inblock`);
    save(joke.outerHTML, "main");
    save(favJoke.outerHTML, "fav");
}

function removeFromFavs(heart) {
    let joke = heart.parentNode;
    unsave(joke.outerHTML, "main");
    joke.classList.remove("fav");
    heart.setAttribute("onclick", "addToFavs(this);");
    let joke_inblock_id = joke.id + "_inblock";
    let favJoke = document.getElementById(joke_inblock_id);
    unsave(favJoke.outerHTML, "fav");
    favJoke.remove(); 
}

function removeFromFavsBlock(heart, joke_id) {
    unsave(document.getElementById(joke_id).outerHTML, "main");
    unsave(heart.parentNode.outerHTML, "fav");
    document.getElementById(joke_id).classList.remove("fav");
    document.getElementById(joke_id).children[0].setAttribute("onclick", "addToFavs(this);");
    heart.parentNode.remove();
}

//---------------------------------------------------------------------
const burger = document.querySelector(".burger");
burger.addEventListener('click', () => {
    document.querySelector(".favourite").classList.toggle("active");
    document.querySelector(".burger__icon").classList.toggle("active");
    document.querySelector(".darkened").classList.toggle("active");
});

