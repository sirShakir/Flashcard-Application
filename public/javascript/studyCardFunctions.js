var myCards;
var myCardsStack;

function startStudyingButtonClicked(){
    let requestedDeckID = document.getElementById("deckid").value;
    let requestedLang = document.getElementById("languageSelector2").value
    let params = {deckid : requestedDeckID, lang: requestedLang};
    $.post("/notecards/getStudyCards",
    params,
    function(data, status){
      myCards = data.cards;
      myCardsStack = myCards.slice();
       console.log(myCards);
       console.log(myCardsStack);
      loadRandomCardView()
    });
}



var focusCard;
function loadRandomCardView(){
    let size = myCards.length;
    let randomNum = Math.floor(Math.random() * size);
    focusCard = myCards[randomNum];
    document.getElementById("studyWord").innerHTML = focusCard['word'];
    document.getElementById("audioEle").src = "uploads/" + focusCard['link'] + ".wav";
}

var flipCount = 0;
let element =  document.getElementById('studyWord');

function wordClicked(){    
    element.classList.add('animated', 'rotateOutUpRight');
}


element.addEventListener('animationend', function() {  
    element.classList.remove('animated', 'rotateOutUpRight');
    //console.log(flipCount);
    if(flipCount == 0){
        flipCount = 1;
        document.getElementById("studyWord").innerHTML = focusCard['english'];

    }else
    if(flipCount == 1){
        flipCount = 0;
        document.getElementById("studyWord").innerHTML = focusCard['word'];

    }
    //console.log(flipCount);
})

function nextCard(){

    let nextword = myCardsStack.pop(); 
    focusCard = nextword;
    if(!nextword){
        myCardsStack = myCards.slice();
        nextword = myCardsStack.pop(); 
    }       
    document.getElementById("studyWord").innerHTML = nextword['word'];
    document.getElementById("audioEle").src = "uploads/" + nextword['link'] + ".wav";

}

function randomCard(){
    loadRandomCardView();
}


