document.addEventListener("DOMContentLoaded", () => {
    let start = document.querySelector("#start");
    let deck_id;
    let score = 0;
    let playerScore;
    let main = document.querySelector("#main")
    let hitBtn = document.querySelector("#hit")
    let begin = document.querySelector("#begin")
    let player = document.querySelector("#player")
    let dealer = document.querySelector("#dealer")

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
                } else if (draw.data.cards[j].value === "ACE"){
                    draw.data.cards[j].value = 11
                }
                score += Number(draw.data.cards[j].value)
            }
            playerScore.innerText = `Score: ${score}`
            player.appendChild(playerScore);  
            begin.removeChild(start)
            if(score === 21){
                let win = document.createElement("h1")
                win.innerText = "21! You Win."
                player.appendChild(win)
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
                card.data.cards[0].vale = 11
            }
            score += Number(card.data.cards[0].value)
            playerScore.innerText = `Score: ${score}`
            if(score === 21){
                let winner = document.createElement("h2")
                winner.innerText = " 21! You win"
                player.appendChild(winner)
            }
            if(score > 21){
                let lose = document.createElement("h2")
                lose.innerText = "Bust"
                player.appendChild(lose)
            } else if(score < 21) {
                let hitAgain = document.createElement("h2")
                hitAgain.innerText = "HIT OR STAY?!"
                player.appendChild(hitAgain)
            }
    }

    start.addEventListener("click", drawCards)
    hitBtn.addEventListener("click", hit)
})