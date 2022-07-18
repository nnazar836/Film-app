import HTMLObject from './HTMLObject.js';
import { main, shelves, } from './Creater.js'


class Main extends HTMLObject{
    constructor(){
        super('.main')
        this.moviesContainer = document.querySelector( `.main__grid-movies-container`)
        this.switcher = this.body.querySelector(`.main__page-switcher`)
    }

    start(){
        this.switcher.addEventListener('click', Main.switcherFunctional.bind(this)) // add switcher functional
    }

    renderSwitcher(max = 500, curentPage = 1){// Functional for switcher
        if(max === false){
            this.switcher.innerHTML = ''
            return false
        }

        let HTML =``
        let renderPage = curentPage - 2
        
        for(let i = 0; i < 5; i++){

            if(renderPage <= 0 || renderPage > max){
                renderPage++
                continue
            }

            if(renderPage == curentPage){
                HTML += `<li class="page-switcher__page page-switcher__active-page">${renderPage}</li>`
                renderPage++
                continue
            }

            HTML += `<li class="page-switcher__page">${renderPage}</li>`
            renderPage++
        }

        this.switcher.innerHTML = `
            <ul class="page-switcher__pages">
                ${HTML}
            </ul>
        `
        this.switcher.dataset.curentpage = curentPage
    }

    static switcherFunctional(event){// Functional for switcher
        // ability to switch pages
        let nextPage = event.target.closest(`.page-switcher__page`)        

        if(nextPage){
            shelves.switchPages(nextPage.textContent)
            main.body.scrollTo({top:0,left:0, behavior:"smooth"})

        }
        // ability to switch pages^^
        
    }
}

export default Main;