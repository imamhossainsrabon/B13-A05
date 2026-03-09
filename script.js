const filterBtn = document.getElementById('filter-btns')
const allBtn = document.getElementById('all')
const openedBtn = document.getElementById('opened')
const closedBtn = document.getElementById('closed')

const issueCardContainer = document.getElementById('issueCardContainer')
const issueCount = document.getElementById('issueCount')

function issueCounting() {
    issueCount.innerHTML = issueCardContainer.children.length
}

issueCounting()

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

const searchInput = document.getElementById('search')
const modalContent = document.getElementById('modalContent')

let allIssues = []
let currentFilter = 'all'
let searchTimer = null

function showLoader() {
    document.getElementById('loader').classList.remove('hidden')
}

function hideLoader() {
    document.getElementById('loader').classList.add('hidden')
}

async function loadIssues() {
    showLoader()
    issueCardContainer.innerHTML = ''

    const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
    const data = await res.json()

    allIssues = data.data || []
    applyFilterAndRender()

    hideLoader()
}