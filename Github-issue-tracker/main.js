let allIssues = [];
document.addEventListener('DOMContentLoaded', () => {
  loadIssues('all');
  setActiveTab('all');

  const searchInput = document.getElementById('search');
  searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      searchIssues();
    }
  });

  const container = document.getElementById('issues');
  container.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : event.target.parentElement;
    if (!target) return;

    const button = target.closest('button[data-issue-id]');
    if (button) {
      event.stopPropagation();
      showModal(button.dataset.issueId);
      return;
    }

    const card = target.closest('.issue-card');
    if (card && card.dataset.issueId) {
      showModal(card.dataset.issueId);
    }
  });
});

function loadIssues(status) {
  const container = document.getElementById("issues");
  container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

  fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
    .then(response => response.json())
    .then(data => {
      allIssues = data.data;

      const filteredIssues =
        status === 'all'
          ? allIssues
          : allIssues.filter(issue => issue.status === status);

      displayIssues(filteredIssues);
      updateIssueCount(filteredIssues.length);
    })
    .catch(error => {
      console.error("Error fetching data: ", error);
      container.innerHTML = '<p>Error loading issues. Please try again.</p>';
    });
}


function searchIssues() {
  const query = document.getElementById("search").value.trim();

  if (query === '') {
    displayIssues(allIssues);
    updateIssueCount(allIssues.length);
    return;
  }

  const container = document.getElementById("issues");
  container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

  fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
      const searchResults = data.data || [];
      displayIssues(searchResults);
      updateIssueCount(searchResults.length);
    })
    .catch(error => {
      console.error("Error searching issues: ", error);
      container.innerHTML = '<p>Error searching issues. Please try again.</p>';
    });
}
function displayIssues(issues) {
  const container = document.getElementById("issues");
  container.innerHTML = '';

  issues.forEach(issue => {
    const card = document.createElement('div');
    card.classList.add('issue-card', issue.status);

    const cardStatusClass = issue.status === 'open' ? 'open' : 'closed';
    card.classList.add(cardStatusClass);

    const labelsHtml = issue.labels.map(label => `<span class="label">${label}</span>`).join(' ');
    const createdDate = new Date(issue.createdAt).toLocaleDateString();

    card.dataset.issueId = issue.id;

    card.innerHTML = `
      <div class="priority ${issue.priority.toLowerCase()}">${issue.priority.toUpperCase()}</div>

      <div class="card-top-row">
        <span class="status-pill ${issue.status}">
          ${issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
        </span>
        <span class="created-date">${createdDate}</span>
      </div>

      <h3>${issue.title}</h3>
      <p>${issue.description}</p>

      <div class="card-meta">
        <span class="card-author">${issue.author}</span>
        <span class="card-labels">${labelsHtml}</span>
      </div>

      <button type="button" class="view-details" data-issue-id="${issue.id}">
        View Details
      </button>
    `;

    card.classList.add('clickable');
    container.appendChild(card);
  });
}


function updateIssueCount(count) {
  document.getElementById('issue-count').textContent = count;
}


function setActiveTab(tab) {
  document.querySelectorAll('.tab')
    .forEach(tabBtn => tabBtn.classList.remove('active'));

  const activeTab = document.getElementById(`${tab}-tab`);
  if (activeTab) {
    activeTab.classList.add('active');
  }
}


function handleTabClick(status) {
  loadIssues(status);
  setActiveTab(status);
}
function showModal(id) {
  console.log('showModal called with id:', id);

  // Reset loading state
  document.getElementById("title").innerText = "Loading...";
  document.getElementById("num").innerText = "";
  document.getElementById("statusb").innerHTML = "";
  document.getElementById("author").innerText = "";
  document.getElementById("created").innerText = "";
  document.getElementById("desc").innerText = "";
  document.getElementById("labels").innerHTML = "";
  document.getElementById("assignee").innerHTML = "";
  document.getElementById("priority").innerHTML = "";
  document.getElementById("createdTime").innerText = "";
  document.getElementById("updatedTime").innerText = "";

  document.getElementById("m").style.display = "block";

  fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
    .then(response => response.json())
    .then(data => {
      const issue = data.data || data;

      // Header
      document.getElementById("title").innerText = issue.title;
      document.getElementById("num").innerText = `#${issue.id}`;

      // Status
      const statusBadge = document.getElementById("statusb");
      statusBadge.innerHTML = `
        <span class="issue-status-large ${issue.status}">
          ${issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
        </span>
      `;

      // Meta
      document.getElementById("author").innerHTML =
        `<span class="author-avatar">${issue.author.charAt(0).toUpperCase()}</span> ${issue.author} opened this issue`;

      document.getElementById("created").innerText =
        new Date(issue.createdAt).toLocaleDateString();

      // Description
      document.getElementById("desc").innerText = issue.description;

      // Labels
      const labelsSection = document.getElementById("labels");
      if (Array.isArray(issue.labels) && issue.labels.length > 0) {
        labelsSection.innerHTML = `
          <div class="labels-header">Labels</div>
          <div class="labels-list">
            ${issue.labels.map(label => `<span class="label-large">${label}</span>`).join('')}
          </div>
        `;
      }

      // Assignee
      const assigneeSidebar = document.getElementById("assignee");
      if (issue.assignee && issue.assignee !== "") {
        assigneeSidebar.innerHTML = `
          <div class="assignee-item">
            <span class="assignee-avatar">${issue.assignee.charAt(0).toUpperCase()}</span>
            ${issue.assignee}
          </div>
        `;
      } else {
        assigneeSidebar.innerHTML = `<div class="no-assignee">No one assigned</div>`;
      }

      // Priority
      document.getElementById("priority").innerHTML = `
        <span class="priority-indicator ${issue.priority}">
          ${issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
        </span>
      `;

      // Timeline
      document.getElementById("createdTime").innerText =
        new Date(issue.createdAt).toLocaleString();

      document.getElementById("updatedTime").innerText =
        new Date(issue.updatedAt).toLocaleString();
    })
    .catch(error => {
      console.error('Error fetching issue details:', error);
      document.getElementById("title").innerText = "Error loading issue details";
    });
}


function closeModal() {
  document.getElementById("m").style.display = "none";
}





