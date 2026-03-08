const filterBtn = document.getElementById('filter-btns')
const allBtn = document.getElementById('all')
const openedBtn = document.getElementById('opened')
const closedBtn = document.getElementById('closed')




function filteredBtn(id) {
    allBtn.classList.add('inactive')
    openedBtn.classList.add('inactive')
    closedBtn.classList.add('inactive')

    allBtn.classList.remove('active')
    openedBtn.classList.remove('active')
    closedBtn.classList.remove('active')

    const selected = document.getElementById(id)
    selected.classList.add('active')
    selected.classList.remove('inactive')
}




