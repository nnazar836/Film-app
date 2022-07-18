import { shelves, main, films, header, sideBar, shelfEditor, search, topShelve } from './Creater.js'


function start(){
    shelves.start()
    main.start()
    films.start()
    header.start(sideBar)
    sideBar.start()
    shelfEditor.start()
    search.start()
    topShelve.start()
}

export default start;