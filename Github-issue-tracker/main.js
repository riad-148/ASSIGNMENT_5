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

