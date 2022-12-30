const GAME_STATE = {
    FirstCard: 'FirstCard',
    SecondCard: 'SecondCard',
    CardMatched: 'CardMatched',
    CardMatchFailed: 'CardMatchFailed',
    GameOver: 'GameOver'
}
const Symbols = [
    'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png',
    'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png',
    'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png',
    'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png',
]

const view = {

    getCardElement(index){
        return`
        <div class="card back" data-index="${index}">
        </div>
        `
    },

    getCardContent(index){
        const number = this.tranfromNumber((index % 13)+1)
        const symbol = Symbols[Math.floor(index/13)]
        return`
            <p>${number}</p>
            <img src="${symbol}">
            <p>${number}</p>
        `
    } ,
    
    tranfromNumber(number){
        switch(number){
            case 1 :
                return 'A'
            case 11 :
                return 'J'
            case 12 :
                 return 'Q'
            case 13 :
                return 'K'
            default:
                return number
        }
    },

    displayCard(indexes){ 
        const rootCard = document.querySelector('#cards')
        rootCard.innerHTML = indexes.map(index=>this.getCardElement(index)).join('')
    },

    filpCards(...cards){
        cards.map(card=>{
            if(card.classList.contains('back')){
                card.classList.remove('back')
                card.innerHTML = this.getCardContent(card.dataset.index)
                return
            }
            card.classList.add('back')
            card.innerHTML = null
        })
    },
    Cardspair(...cards){
        cards.map(card=>{
            card.classList.add('pair')
        })
    },

    renderScore(score){
        document.querySelector('.score').textContent = `Score: ${score}`
    },

    renderTiredTimes(times){
        document.querySelector('.tried').textContent = `You've tried: ${times} times`
    },

    appendWrongAnimation(...cards) {
        cards.map(card => {
          card.classList.add('wrong')
          card.addEventListener('animationend', event =>   event.target.classList.remove('wrong'), { once: true })
          })
    },

    gameOver(){
       const newDiv =  document.createElement('div')
       newDiv.classList.add('completed')
       newDiv.innerHTML = `
        <p>Complete!</p>
        <p>Score: ${model.score}</p>
        <p>You've tried: ${model.times} times</p>
       `
       const header = document.querySelector('#header')
       header.before(newDiv)
    }

    


}

const utility = {
    getRandomNumberArray(count) {
        const number = Array.from(Array(count).keys())
        for (let index = number.length - 1; index > 0; index--) {
          let randomIndex = Math.floor(Math.random() * (index + 1))
          ;[number[index], number[randomIndex]] = [number[randomIndex], number[index]]
        }
        return number
      },
}

const model = {
    revealCards: [],
    score: 0,
    times: 0,
}

const controller = {
    currentGameState: GAME_STATE.FirstCard,

    controllerDisplayCards(){
        view.displayCard(utility.getRandomNumberArray(52))
    },

    cardAction(card){
        if(!card.classList.contains('back')){
            return
        }
        switch(this.currentGameState){
            case GAME_STATE.FirstCard:
                view.filpCards(card)
                view.renderTiredTimes(++model.times)
                model.revealCards.push(card)
                this.currentGameState = GAME_STATE.SecondCard
                break
            case GAME_STATE.SecondCard:
                view.filpCards(card)
                model.revealCards.push(card)
                // 配對成功
                if(model.revealCards[0].dataset.index %13 == model.revealCards[1].dataset.index %13){
                    this.currentGameState = GAME_STATE.CardMatched
                    view.renderScore(model.score += 10)
                    view.Cardspair(...model.revealCards)
                    this.currentGameState = GAME_STATE.FirstCard
                    model.revealCards=[]
                    if(model.score == 260){
                        this.currentGameState = GAME_STATE.GameOver
                        view.gameOver()
                        return
                    }                   
                }
                // 配對失敗
                else{
                    this.currentGameState = GAME_STATE.CardMatchFailed
                    view.appendWrongAnimation(...model.revealCards)
                    setTimeout(()=>{
                        view.filpCards(...model.revealCards)
                        this.currentGameState = GAME_STATE.FirstCard
                        model.revealCards=[]    
                    },1000)
                }
        }


    }
}


controller.controllerDisplayCards()


document.querySelectorAll('.card').forEach((card)=>{
    card.addEventListener('click',()=>{
        controller.cardAction(card)
    })
})