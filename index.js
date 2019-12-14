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

            // for(let k = 0; k < draw.data.cards.length; k++){

            // }

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
                body.parentNode.removeChild(main)
                let win = document.createElement("h1")
                win.innerText = "YOU BITCH ASS WINNER"
                document.body.appendChild(win)
            }
        }
        catch(err){
            console.log(err)
        }
    }

    // const scoreKeeper = (score, card) => {
    //     score += Number(card.data.cards[].value)
    //     if(scored === 21){
    //         let win = document.createElement("h2")
    //         win.innerText = 
    //     }
    // }
    const hit = async() => {
        // if(score < 21) {
            let card = await axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`);
            let hitCard = document.createElement("img");
            let src = card.data.cards[0].image;
            hitCard.src = src;
            player.appendChild(hitCard);
            score += Number(card.data.cards[0].value)
            playerScore.innerText = `Score: ${score}`
            if(score > 21){
                // document.body.parentNode.removeChild(main)
                let lose = document.createElement("h2")
                lose.innerText = "LOSE HOE"
                document.body.replaceWith(lose)
                // document.body.appendChild(lose)
            } else if(score < 21) {
                let hitAgain = document.createElement("h2")
                hitAgain.innerText = "HIT OR STAY?!"
                player.appendChild(hitAgain)
            }
            if(card.data.cards[0].value === "KING" || card.data.cards[0].value === "QUEEN" || card.data.cards[0].value === "JACK"){
                card.data.cards[0].value = 10 
            } 
            if (card.data.cards[0].value === "ACE"){
                card.data.cards[0].value = 11
            }
            // player.appendChild(playerScore);  
            debugger
    // } else if(score > 21) {
    //     let bust = document.createElement("h2")
    //     bust.innerText = "YOU ARE A LOSER"
    //     player.appendChild(bust)
    // } else if(score === 21) {
    //     let win = document.createElement("h2")
    //     win.innerText ="YOU BITCH ASS WINNER!!!"
    // }
    }
    start.addEventListener("click", drawCards)
    hitBtn.addEventListener("click", hit)
})