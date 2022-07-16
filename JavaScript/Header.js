import HTMLObject from './HTMLObject.js'


class Header extends HTMLObject{
    constructor(){
        super('header')
        this.menuButton = document.querySelector(`.header__menu `)
    }

    start(sideBar){
        this.menuButton.addEventListener(`click`, sideBar.onOff.bind(sideBar)) // Lets us open aside on the phone
    }
}

export default Header;