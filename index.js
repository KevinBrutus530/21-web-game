document.addEventListener("DOMContentLoaded", () => {
    let start = document.querySelector("#start");
    let deck_id;
    let score = 0;
    let dscore = 0;
    let imgArr = []
    let playerScore;
    let dealerScore;
    let game = document.querySelector("#game")
    let hitBtn = document.querySelector("#hit")
    let stayBtn = document.querySelector("#stay")
    let begin = document.querySelector("#begin")
    let player = document.querySelector("#player")
    let dealer = document.querySelector("#dealer")
    let displayResults = document.createElement("h1")
   
    const drawCards = async () => {
        try {
            let res = await axios.get("https://deckofcardsapi.com/api/deck/new/");
            deck_id = res.data.deck_id
            let shuffled = await axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/shuffle/`);
            let draw = await axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=2`);

            for(let i = 0; i < draw.data.cards.length; i++){
                let playerImg = document.createElement("img");
                let src = draw.data.cards[i].image;
                playerImg.src = src;
                player.appendChild(playerImg);
            }

            playerScore = document.createElement("h3")
            for(let j = 0; j < draw.data.cards.length; j++){
                if(draw.data.cards[j].value === "KING" || draw.data.cards[j].value === "QUEEN" || draw.data.cards[j].value === "JACK"){
                    draw.data.cards[j].value = 10 
                } 
                if (draw.data.cards[j].value === "ACE"){
                        draw.data.cards[j].value = 11
                }
                score += Number(draw.data.cards[j].value)
                if(score === 22){
                    score = 12
                }
            }
            playerScore.innerText = `Score: ${score}`
            player.appendChild(playerScore);  
            begin.removeChild(start)
            if(score === 21){
                displayResults.innerText = "21! You Win."
                game.replaceWith(displayResults)
            }
        }
        catch(err){
            console.log(err)
        }
    }

    const hit = async() => {

            let card = await axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`);
            let hitCard = document.createElement("img");
            let src = card.data.cards[0].image;
            hitCard.src = src;
            player.appendChild(hitCard);
            if(card.data.cards[0].value === "KING" || card.data.cards[0].value === "QUEEN" || card.data.cards[0].value === "JACK"){
                card.data.cards[0].value = 10 
            } 
            if (card.data.cards[0].value === "ACE"){
                if(score > 11)
                card.data.cards[0].value = 1
                if(score < 11)
                card.data.cards[0].value = 11
            }
            score += Number(card.data.cards[0].value)
            playerScore.innerText = `Score: ${score}`
            if(score === 21){
                displayResults.innerText = " 21! You win"
                game.replaceWith(displayResults)
            }
            if(score > 21){
                displayResults.innerText = "Bust"
                game.replaceWith(displayResults)
            } else if(score < 21) {
                let hitAgain = document.createElement("h1")
                hitAgain.innerText = "HIT OR STAY?!"
                player.appendChild(hitAgain)
            }
    }
    const compCards = async () => {
        try {
        let dealerDraw = await axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=3`);

        for(let i = 0; i < dealerDraw.data.cards.length; i++){
            let dealerImg = document.createElement("img");
            let src = dealerDraw.data.cards[i].image;
            dealerImg.src = src;
            dealer.appendChild(dealerImg);
        }
        dealerScore = document.createElement("h3");
        for(let j = 0; j < dealerDraw.data.cards.length; j++){
            if(dealerDraw.data.cards[j].value === "KING" || dealerDraw.data.cards[j].value === "QUEEN" || dealerDraw.data.cards[j].value === "JACK"){
                dealerDraw.data.cards[j].value = 10 
            } 
            if (dealerDraw.data.cards[j].value === "ACE"){
                    dealerDraw.data.cards[j].value = 11
            }
            dscore += Number(dealerDraw.data.cards[j].value)
            // if(dscore > 21){
            //     dealerDraw.data.cards[j].value["ACE"] === 1
            // }
        }
        dealerScore.innerText = `Score: ${dscore}`
        dealer.appendChild(dealerScore);  
        if(dscore < 21 && dscore > score){
            displayResults.innerText = "DEALER WINS"
        } else if (dscore < 21 && dscore < score){
            displayResults.innerText = "PLAYER WINS"
        } else if (dscore === 21) {
            displayResults.innerText = "DEALER WINS"
        } else if (dscore > 21){
            displayResults.innerText = "PLAYER WINS"
        } else if (dscore === score) {
            displayResults.innerText = "TIE GAME"
        }
        game.replaceWith(displayResults)
    }
    catch(err){
        console.log(err)
    }
}

    start.addEventListener("click", drawCards)
    hitBtn.addEventListener("click", hit)
    stayBtn.addEventListener("click", compCards)
})