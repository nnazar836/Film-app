class HTMLObject{
    constructor(selector){
        this.body = document.querySelector(selector)
    }

    hide(){
        this.body.style.display = `none`
    }

    show(){
        this.body.style.display = `block`
    }

    remove(){
        this.body.remove()
    }
}

export default HTMLObject;