class DataTable {
  constructor(containerId, data, config) {
    this.container = document.getElementById(containerId);
    this.data = data;
    this.config = config;
    this.currentPage = 1;
    this.selectedRows = new Set();
    this.sortColumn = null;
    this.sortDirection = 'asc';

    this.init();
  }

  init() {
    this.renderHeaders();
    this.renderBody();
    this.setupEventListeners();
  }

  renderHeaders() {
    const headerRow = this.container.querySelector('thead tr');
    headerRow.innerHTML = this.config.columns
      .map(column => `
              <th class="${column.sortable ? 'sortable' : ''}" 
                  data-key="${column.key}">
                  ${column.label}
                  ${column.sortable ? '<span class="sort-indicator"></span>' : ''}
              </th>
          `).join('');
  }

  // Calculate total pages
  get totalPages() {
    return Math.ceil(this.data.length / this.config.itemsPerPage);
  }

  // Get current page data
  getCurrentPageData() {
    const startIndex = (this.currentPage - 1) * this.config.itemsPerPage;
    const endIndex = startIndex + this.config.itemsPerPage;
    return this.data.slice(startIndex, endIndex);
  }

  // Render table body
  renderBody() {
    const tbody = this.container.querySelector('tbody');
    const pageData = this.getCurrentPageData();

    // Clear existing rows
    tbody.innerHTML = '';

    // Create document fragment for better performance
    const fragment = document.createDocumentFragment();

    pageData.forEach(item => {
      const row = document.createElement('tr');
      row.dataset.id = item.id; // Store item id for selection

      this.config.columns.forEach(column => {
        const cell = document.createElement('td');
        cell.textContent = item[column.key];
        row.appendChild(cell);
      });

      fragment.appendChild(row);
    });

    tbody.appendChild(fragment);
  }

  // Render pagination controls
  renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = `
            <button id="prev-page" ${this.currentPage === 1 ? 'disabled' : ''}>
                Previous
            </button>
            <span>Page ${this.currentPage} of ${this.totalPages}</span>
            <button id="next-page" ${this.currentPage === this.totalPages ? 'disabled' : ''}>
                Next
            </button>
        `;
  }

  // Update table
  updateTable() {
    this.renderBody();
    this.renderPagination();
  }

  setupEventListeners() {
    // Pagination event listeners
    document.getElementById('pagination').addEventListener('click', (e) => {
      if (e.target.id === 'prev-page' && this.currentPage > 1) {
        this.currentPage--;
        this.updateTable();
      }
      else if (e.target.id === 'next-page' && this.currentPage < this.totalPages) {
        this.currentPage++;
        this.updateTable();
      }
    });
  }

  init() {
    this.renderHeaders();
    this.updateTable(); // Changed from renderBody() to updateTable()
    this.setupEventListeners();
  }

}

// Test data
const testData = Array.from({ length: 55 }, (_, index) => ({
  id: index + 1,
  name: `Product ${index + 1}`,
  price: Math.floor(Math.random() * 1000),
  category: ['Electronics', 'Books', 'Clothing'][Math.floor(Math.random() * 3)]
}));

// Configuration
const config = {
  columns: [
    { key: 'name', label: 'Product Name', sortable: true },
    { key: 'price', label: 'Price', sortable: true },
    { key: 'category', label: 'Category', sortable: true }
  ],
  itemsPerPage: 10
};

// Initialize table
const table = new DataTable('data-table', testData, config);