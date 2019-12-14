document.addEventListener("DOMContentLoaded", () => {
    let start = document.querySelector("#start");
    let deck_id;
    
    const drawCards = async () => {
        try {
            let res = await axios.get("https://deckofcardsapi.com/api/deck/new/");
            deck_id = res.data.deck_id
            let shuffled = await axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/shuffle/`);
            let draw = await axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=2`);
            for(let i = 0; i < draw.data.cards.length; i++){
                let img = document.createElement("img");
                let src = draw.data.cards[i].image;
                img.src = src;
                document.body.appendChild(img);
            }
        }
        catch(err){
            console.log(err)
        }
    }
    start.addEventListener("click", drawCards)
})