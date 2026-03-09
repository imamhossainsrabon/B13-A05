const allBtn = document.getElementById('all');
const openBtn = document.getElementById('open');
const closedBtn = document.getElementById('closed');

const issueCardContainer = document.getElementById('issueCardContainer');
const issueCount = document.getElementById('issueCount');
const searchInput = document.getElementById('search');
const modalContent = document.getElementById('modalContent');

let allIssues = [];
let currentFilter = 'all';
let searchTimer = null;

function showLoader() {
    document.getElementById('loader').classList.remove('hidden');
}

function hideLoader() {
    document.getElementById('loader').classList.add('hidden');
}

async function loadIssues() {
    showLoader();
    issueCardContainer.innerHTML = '';

    const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
    const data = await res.json();

    allIssues = data.data
    applyFilterAndRender();

    hideLoader();
}

function updateIssueCount(issueArray) {
    issueCount.innerText = issueArray.length;
}


function filteredBtn(id) {
    allBtn.classList.add('inactive');
    openBtn.classList.add('inactive');
    closedBtn.classList.add('inactive');

    allBtn.classList.remove('active');
    openBtn.classList.remove('active');
    closedBtn.classList.remove('active');

    const selected = document.getElementById(id);
    selected.classList.add('active');
    selected.classList.remove('inactive');

    currentFilter = id;

    renderWithLoader();
}


function renderWithLoader() {
    showLoader();
    issueCardContainer.innerHTML = '';

    setTimeout(function () {
        applyFilterAndRender();
        hideLoader();
    }, 200);
}


function applyFilterAndRender() {
    let filteredIssues = allIssues;

    if (currentFilter === 'open') {
        filteredIssues = allIssues.filter(function (issue) {
            return issue.status === 'open';
        });
    } else if (currentFilter === 'closed') {
        filteredIssues = allIssues.filter(function (issue) {
            return issue.status === 'closed';
        });
    }

    const searchValue = searchInput.value.trim().toLowerCase();

    if (searchValue !== '') {
        filteredIssues = filteredIssues.filter(function (issue) {
            const titleMatch = issue.title.toLowerCase().includes(searchValue);
            const descriptionMatch = issue.description.toLowerCase().includes(searchValue);
            const authorMatch = issue.author.toLowerCase().includes(searchValue);

            let labelMatch = false;

            issue.labels.forEach(function (label) {
                if (label.toLowerCase().includes(searchValue)) {
                    labelMatch = true;
                }
            });

            return titleMatch || descriptionMatch || authorMatch || labelMatch;
        });
    }

    renderIssues(filteredIssues);
    updateIssueCount(filteredIssues);
}


function renderIssues(issues) {
    issueCardContainer.innerHTML = '';

    if (issues.length === 0) {
        issueCardContainer.innerHTML = `<p class="message">No issues found.</p>`;
        return;
    }

    issues.forEach(function (issue) {
        const div = document.createElement('div');
        div.innerHTML = createCard(issue);
        issueCardContainer.appendChild(div.firstElementChild);
    });
}


function createLabels(labels) {
    let allLabels = '';

    labels.forEach(function (label) {
        let labelClass = 'label-default';

        if (label.toLowerCase() === 'bug') {
            labelClass = 'label-bug';
        } else if (label.toLowerCase() === 'help wanted') {
            labelClass = 'label-help-wanted';
        } else if (label.toLowerCase() === 'enhancement') {
            labelClass = 'label-enhancement';
        }

        allLabels += `<span class="label ${labelClass}">${label.toUpperCase()}</span>`;
    });

    return allLabels;
}


function getPriorityClass(priority) {
    let priorityClass = '';

    if (priority === 'high') {
        priorityClass = 'high';
    } else if (priority === 'medium') {
        priorityClass = 'medium';
    } else {
        priorityClass = 'low';
    }

    return priorityClass;
}


function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }

    return text;
}


function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
}



function createCard(issue) {
    let topLineClass = '';
    let statusCircleClass = '';
    let statusImg = '';

    if (issue.status === 'open') {
        topLineClass = 'top-open';
        statusCircleClass = 'status-open';
        statusImg = './assets/Open-Status.png';
    } else {
        topLineClass = 'top-closed';
        statusCircleClass = 'status-closed';
        statusImg = './assets/Closed-Status.png';
    }

    const priorityClass = getPriorityClass(issue.priority);
    const labelsHTML = createLabels(issue.labels);
    const shortDescription = truncateText(issue.description, 75);
    const formattedDate = formatDate(issue.createdAt);

    return `
        <div class="card" onclick="openIssueModal(${issue.id})">
            <div class="card-top-line ${topLineClass}"></div>

            <div class="card-details">
                <div class="priority-box">
                    <div class="status-circle ${statusCircleClass}">
                        <img src="${statusImg}" alt="${issue.status}" class="status-img">
                    </div>

                    <p class="priority ${priorityClass}">${issue.priority}</p>
                </div>

                <div class="card-mid-part">
                    <h2 class="title">${issue.title}</h2>
                    <p>${shortDescription}</p>

                    <div class="labels">
                        ${labelsHTML}
                    </div>
                </div>
            </div>

            <div class="card-info">
                <p>#${issue.id} by ${issue.author}</p>
                <p>${formattedDate}</p>
            </div>
        </div>
    `;
}


async function openIssueModal(id) {
    const modal = document.getElementById('issue_modal');

    modalContent.innerHTML = `
        <div class="text-center py-6">
            <span class="loading loading-spinner loading-xs"></span>
        </div>
    `;
    modal.showModal();

    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    const data = await res.json();
    const issue = data.data;
    showModalData(issue);
}



function showModalData(issue) {
    let statusClass = '';
    let statusText = '';

    if (issue.status === 'open') {
        statusClass = 'modal-status-open';
        statusText = 'Opened';
    } else {
        statusClass = 'modal-status-closed';
        statusText = 'Closed';
    }

    let priorityClass = '';

    if (issue.priority === 'high') {
        priorityClass = 'modal-priority-high';
    } else if (issue.priority === 'medium') {
        priorityClass = 'modal-priority-medium';
    } else {
        priorityClass = 'modal-priority-low';
    }

    let labelsHTML = '';

    issue.labels.forEach(function (label) {
        let labelClass = 'label-default';

        if (label.toLowerCase() === 'bug') {
            labelClass = 'label-bug';
        } else if (label.toLowerCase() === 'help wanted') {
            labelClass = 'label-help-wanted';
        } else if (label.toLowerCase() === 'enhancement') {
            labelClass = 'label-enhancement';
        }

        labelsHTML += `<span class="label ${labelClass}">${label.toUpperCase()}</span>`;
    });

    modalContent.innerHTML = `
        <h2 class="modal-title">${issue.title}</h2>

        <div class="modal-top-info">
            <span class="modal-status ${statusClass}">${statusText}</span>
            <span class="modal-meta">Opened by ${issue.author}</span>
            <span class="modal-dot">•</span>
            <span class="modal-meta">${formatDate(issue.createdAt)}</span>
        </div>

        <div class="modal-labels">
            ${labelsHTML}
        </div>

        <p class="modal-description">
            ${issue.description}
        </p>

        <div class="modal-bottom-box">
            <div>
                <p class="modal-small-title">Assignee:</p>
                <h4 class="modal-assignee">${issue.author}</h4>
            </div>

            <div>
                <p class="modal-small-title">Priority:</p>
                <span class="modal-priority ${priorityClass}">${issue.priority.toUpperCase()}</span>
            </div>
        </div>
    `;
}


searchInput.addEventListener('keyup', function () {
    clearTimeout(searchTimer);

    showLoader();
    issueCardContainer.innerHTML = '';

    searchTimer = setTimeout(function () {
        applyFilterAndRender();
        hideLoader();
    }, 300);
});

loadIssues();