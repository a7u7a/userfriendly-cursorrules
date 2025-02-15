class DataTable {
  constructor(containerId, data, config) {
    this.container = document.getElementById(containerId);
    this.data = data;
    this.config = config;
    this.currentPage = 1;
    this.selectedRows = new Set();
    this.sortColumn = null;
    this.sortDirection = 'asc';

    this.sortConfig = {
      column: null,
      direction: null // null, 'asc', or 'desc'
    };

    this.init();
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
    // First sort
    let sortedData = [...this.data];
    if (this.sortConfig.column) {
      sortedData.sort((a, b) => {
        const aVal = a[this.sortConfig.column];
        const bVal = b[this.sortConfig.column];

        return this.compareValues(aVal, bVal, this.sortConfig.direction);
      });
    }

    // Then paginate
    const startIndex = (this.currentPage - 1) * this.config.itemsPerPage;
    const endIndex = startIndex + this.config.itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }

  updateSortIndicators() {
    const headers = this.container.querySelectorAll('th');
    headers.forEach(header => {
      const key = header.dataset.key;
      const indicator = header.querySelector('.sort-indicator');
      if (indicator) {
        if (key === this.sortConfig.column) {
          indicator.textContent = this.sortConfig.direction === 'asc' ? '+' : '-';
        } else {
          indicator.textContent = 'Sort';  // empty space
        }
      }
    });
  }

  // Handle sort
  handleSort(column) {
    // If clicking the same column, cycle through: asc -> desc -> no sort
    if (this.sortConfig.column === column) {
      if (this.sortConfig.direction === 'asc') {
        this.sortConfig.direction = 'desc';
      } else if (this.sortConfig.direction === 'desc') {
        this.sortConfig.column = null;
        this.sortConfig.direction = null;
      }
    } else {
      // New column, start with ascending
      this.sortConfig.column = column;
      this.sortConfig.direction = 'asc';
    }

    // Reset to first page when sorting
    this.currentPage = 1;
    this.updateTable();
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

  updateTable() {
    this.renderBody();
    this.renderPagination();
    this.updateSortIndicators();
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

    this.container.querySelector('thead').addEventListener('click', (e) => {
      console.log("clicked");
      const header = e.target.closest('th');
      if (header && header.classList.contains('sortable')) {
        const column = header.dataset.key;
        this.handleSort(column);
      }
    });
  }

  init() {
    this.renderHeaders();
    this.updateTable();
    this.setupEventListeners();
  }

  compareValues(a, b, direction) {
    // Handle null/undefined values
    if (a == null) return direction === 'asc' ? -1 : 1;
    if (b == null) return direction === 'asc' ? 1 : -1;

    // Detect value type and compare accordingly
    if (typeof a === 'string' && typeof b === 'string') {
      return direction === 'asc'
        ? a.localeCompare(b)
        : b.localeCompare(a);
    }

    // Handle numbers
    if (typeof a === 'number' && typeof b === 'number') {
      return direction === 'asc' ? a - b : b - a;
    }

    // Handle dates
    if (a instanceof Date && b instanceof Date) {
      return direction === 'asc'
        ? a.getTime() - b.getTime()
        : b.getTime() - a.getTime();
    }

    // Default comparison
    return direction === 'asc'
      ? String(a).localeCompare(String(b))
      : String(b).localeCompare(String(a));
  }

}

// Test data with edge cases
const testData = [
  { id: 1, name: 'Product A', price: 100, date: new Date('2024-01-01') },
  { id: 2, name: 'Product C', price: 50, date: new Date('2024-03-15') },
  { id: 3, name: 'Product B', price: null, date: new Date('2024-02-01') },
  { id: 4, name: 'Product D', price: 75, date: null },
  { id: 5, name: null, price: 200, date: new Date('2024-01-15') },
  { id: 6, name: 'Product É', price: 150, date: new Date('2024-02-15') }, // Unicode character
  { id: 7, name: 'product a', price: 90, date: new Date('2024-03-01') }   // Case difference
];

const config = {
  columns: [
    { key: 'name', label: 'Product Name', sortable: true },
    { key: 'price', label: 'Price', sortable: true },
    { key: 'date', label: 'Date', sortable: true }
  ],
  itemsPerPage: 10
};

const table = new DataTable('data-table', testData, config);