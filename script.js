const filterBtn = document.getElementById('filter-btns')
const allBtn = document.getElementById('all')
const openedBtn = document.getElementById('opened')
const closedBtn = document.getElementById('closed')

const issueCardContainer = document.getElementById('issueCardContainer')
const issueCount = document.getElementById('issueCount')
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

function updateIssueCount(issueArray) {
    issueCount.innerText = issueArray.length
}

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

    currentFilter = id
    renderWithLoader()
}

function renderWithLoader() {
    showLoader()
    issueCardContainer.innerHTML = ''

    setTimeout(function () {
        applyFilterAndRender()
        hideLoader()
    }, 200)
}

function applyFilterAndRender() {
    let filteredIssues = allIssues

    if (currentFilter === 'opened') {
        filteredIssues = allIssues.filter(function (issue) {
            return issue.status === 'open'
        })
    } else if (currentFilter === 'closed') {
        filteredIssues = allIssues.filter(function (issue) {
            return issue.status === 'closed'
        })
    }

    const searchValue = searchInput.value.trim().toLowerCase()

    if (searchValue !== '') {
        filteredIssues = filteredIssues.filter(function (issue) {
            const titleMatch = issue.title.toLowerCase().includes(searchValue)
            const descriptionMatch = issue.description.toLowerCase().includes(searchValue)
            const authorMatch = issue.author.toLowerCase().includes(searchValue)

            let labelMatch = false

            issue.labels.forEach(function (label) {
                if (label.toLowerCase().includes(searchValue)) {
                    labelMatch = true
                }
            })

            return titleMatch || descriptionMatch || authorMatch || labelMatch
        })
    }

    renderIssues(filteredIssues)
    updateIssueCount(filteredIssues)
}

function renderIssues(issues) {
    issueCardContainer.innerHTML = ''

    if (issues.length === 0) {
        issueCardContainer.innerHTML = `<p class="message">No issues found.</p>`
        return
    }

    issues.forEach(function (issue) {
        const div = document.createElement('div')
        div.innerHTML = createCard(issue)
        issueCardContainer.appendChild(div.firstElementChild)
    })
}

function createLabels(labels) {
    let allLabels = ''

    labels.forEach(function (label) {
        let labelClass = 'label-default'

        if (label.toLowerCase() === 'bug') {
            labelClass = 'label-bug'
        } else if (label.toLowerCase() === 'help wanted') {
            labelClass = 'label-help-wanted'
        } else if (label.toLowerCase() === 'enhancement') {
            labelClass = 'label-enhancement'
        }

        allLabels += `<span class="label ${labelClass}">${label.toUpperCase()}</span>`
    })

    return allLabels
}

function getPriorityClass(priority) {
    let priorityClass = ''

    if (priority === 'high') {
        priorityClass = 'high'
    } else if (priority === 'medium') {
        priorityClass = 'medium'
    } else {
        priorityClass = 'low'
    }

    return priorityClass
}

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...'
    }

    return text
}

function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US')
}