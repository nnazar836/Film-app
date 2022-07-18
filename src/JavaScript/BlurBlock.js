import HTMLObject from './HTMLObject.js'

class BlurBlock extends HTMLObject{
    constructor(){
        super(`.blur-block`)
    }

    create(popUp){
        let blurBlock = document.createElement(`div`)

        blurBlock.classList.add(`blur-block`)

        blurBlock.innerHTML = `
        <div class="blur-block__cross">
            <div class="blur-block__line-1">
                <div class="blur-block__line-2"></div>
            </div>
        </div>
        `

        this.body = blurBlock;

        document.body.prepend(blurBlock)

        if(popUp) this.body.addEventListener('click', popUp.remove.bind(popUp))
    }

    remove(){
        super.remove()
        this.body = null
    }


}

export default BlurBlock;