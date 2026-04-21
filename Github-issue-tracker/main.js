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
