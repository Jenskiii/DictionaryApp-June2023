const errorMessage = document.querySelector(".input__error");
const url = "https://api.dictionaryapi.dev/api/v2/entries/en/"
// add dictionaryFn to search button onclick
const searchButton = document.getElementById("search__button");
searchButton.addEventListener("click", dictionaryFn);

// changes audio button on hover
const audioButton = document.getElementById("header__audio--button");
const buttonAudioInner = document.getElementById("audio__button--inner");
const buttonAudioOuter = document.getElementById("audio__button--outer");
audioButton.addEventListener("click", playAudio);
audioButton.addEventListener("mouseover", audioButtonMouseOver);
audioButton.addEventListener("mouseout", audioButtonMouseOut);

// toggles darkmode
const darkmodeButton = document.getElementById("checkbox");
darkmodeButton.addEventListener("click", darkMode)

//selects input + audio element
let input = document.getElementById("input");
let audioHolder = document.getElementById("audio")
// starts dictionaryFn if enter pressed
input.addEventListener("keypress", (event) =>{
    if(event.key === "Enter"){
        event.preventDefault();
        dictionaryFn();
    }})
// change font style
const selectFont = document.getElementById("fonts");
selectFont.addEventListener('change', changeFont);

// opens new window to wikipedia when logo is clicked next to wikilink
const wikiLogo = document.querySelector(".source__img");
let wikiUrl = "https://en.wiktionary.org/wiki/example";
wikiLogo.addEventListener("click", () =>{
    window.open(wikiUrl);
})
// will fetch data from dictionary api + update values of word
async function dictionaryFn(){
// selecting elements that need to be updated with new word information
    const headerTitle = document.querySelector(".header__output");
    const phoneticOutput = document.querySelector(".header__phonetic");
    const nounList = document.querySelector(".noun__list");
    const synonym = document.querySelector(".synonyms__outcome");
    const verbList = document.querySelector(".verb__list");
    const wikiLink = document.getElementById("wiki__link");
    const verbExample = document.querySelector(".verb__example");
//if input is empty show error/ else update word
    if(input.value === ""){
        showError("can't be empty...");
    }else if(!input.value.match(/^[a-zA-Z]+$/)){
        showError("Text only");
    }else{
        removeError();
    fetch(`${url}${input.value}`)
    .then((response) => response.json())
    .then((data) => {
        //changes title
        headerTitle.innerHTML = data[0].word;
        //changes phonetic if no date there it will show not available
        if(data[0].phonetic){
        phoneticOutput.innerHTML = data[0].phonetic;
        }else{
            phoneticOutput.innerHTML = "Not Available";
        }
        //nounces
        // changes 1st noun
        nounList.childNodes[1].innerHTML = data[0].meanings[0].definitions[0].definition;
        // if 1 nounce it will hide the other 2 lines
        if(data[0].meanings[0].definitions.length === 1){
            nounList.childNodes[3].classList.add("hidden");// hides element
            nounList.childNodes[5].classList.add("hidden");// hides element
        // will make 2nd visible and hide 3rd
        }else if(data[0].meanings[0].definitions.length === 2){
            nounList.childNodes[3].classList.remove("hidden");// shows element
            nounList.childNodes[3].innerHTML = data[0].meanings[0].definitions[1].definition;
            nounList.childNodes[5].classList.add("hidden");// hides element
        // will make 2nd+3rd nounce visible
        }else{
            nounList.childNodes[3].classList.remove("hidden");// shows element
            nounList.childNodes[5].classList.remove("hidden");// shows element
            // links 2nd and 3rd nounce
            nounList.childNodes[3].innerHTML = data[0].meanings[0].definitions[1].definition;
            nounList.childNodes[5].innerHTML = data[0].meanings[0].definitions[2].definition;
        }

        //change synonym
        if(data[0].meanings[0].synonyms[0]){
            synonym.innerHTML = data[0].meanings[0].synonyms[0];
        }else{
            synonym.innerHTML = "Not Available";
        }
        // change verb if there is no verb it will show no data available
        if(data[0].meanings[1]){
            verbList.childNodes[1].innerHTML = data[0].meanings[1].definitions[0].definition
        }else{
            verbList.childNodes[1].innerHTML = "Sorry, no data available"
        }

        // show example if its available
        if(data[0].meanings[1] && data[0].meanings[1].definitions[0].example){
            verbExample.classList.remove("hidden");// shows element
            verbExample.innerHTML = '“' + data[0].meanings[1].definitions[0].example + '”';
        }else{
            verbExample.classList.add("hidden");// hides element
        }
        
        // replace wiki link + add link to logo on click
        wikiLink.innerHTML = data[0].sourceUrls;
        wikiUrl = data[0].sourceUrls;
        // link audio file to sound

        if(data[0].phonetics[0].audio){
            audioHolder.setAttribute("src", data[0].phonetics[1].audio) 
        }else{
            audioHolder.removeAttribute("src");
        }

    }) .catch(()=>{
       showError("No match found or incomplete data...");
        setTimeout(removeError,2000)
    })   
}}

// changes inner to white + full colour on hover
function audioButtonMouseOver(){
    buttonAudioOuter.style.opacity = "1";
    buttonAudioInner.style.fill = "white";
} 

// changes back to normal after mouse leave
function audioButtonMouseOut(){
    buttonAudioOuter.style.opacity = ".25";
    buttonAudioInner.style.fill = "#A445ED";
}

// turns on darkmode
function darkMode(){
    const moonSymbol = document.getElementById("moon");
    const paragraph = document.querySelectorAll(".list__item");
    const fontBackground = document.querySelector(".nav__options");
    const nounAndVerb = document.querySelectorAll(".hr__title");
    const link = document.querySelector("#wiki__link");
    if(checkbox.checked){
        moonSymbol.style.stroke = "#A445ED";
    }else{
        moonSymbol.style.stroke = "#838383";
    }
    //changes input to darkmode
    input.classList.toggle("darkmode__style");
    // makes options field darkmode
    selectFont.classList.toggle("darkmode__style");
    fontBackground.classList.toggle("darkmode__style");
    link.classList.toggle("darkmode__style");
    // changes both noun and verb title to darkmode
    nounAndVerb.forEach(e=>{
        e.classList.toggle("darkmode__style");
    })
    //makes all list item darkmode
    document.getElementById("body").classList.toggle("darkmode__style");
    paragraph.forEach(e=>{
        e.classList.toggle("darkmode__style");
    })
}

// plays audio that is linked to the button
function playAudio(){
    if(audioHolder.src){
        audioHolder.play();
    }
    
}

//shows error message + changes the sentence to correct error
function showError(error){
    errorMessage.innerHTML = `Whoops, ${error}`
    input.classList.add("error");
    errorMessage.classList.add("active");
}

//removes error
function removeError(){
    input.classList.remove("error");
    errorMessage.classList.remove("active");
}

// changes fontFamily based on input
function changeFont(){
    let font = selectFont.value;
    const selectBody = document.getElementById("body");
    switch(font){
        case "Sans Serif":
        selectBody.style.fontFamily = "'Inter', sans-serif";
        input.style.fontFamily = "'Inter', sans-serif";
        selectFont.style.fontFamily = "'Inter', sans-serif";
        break;
        case "Serif":
        selectBody.style.fontFamily = "'Lora', serif";
        input.style.fontFamily = "'Lora', serif";
        break;
        case "Mono":
        selectBody.style.fontFamily = "'Inconsolata', monospace";
        break;
    }
}