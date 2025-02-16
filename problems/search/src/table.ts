import { TableRow, TableConfig } from './types';
import { testData, tableConfig } from './data';
import { compareValues, debounce } from './utils';

class DataTable {
  private container: HTMLElement | null;
  private data: TableRow[];
  private config: TableConfig;
  private currentPage: number;
  private sortConfig: {
    column: string | null;
    direction: 'asc' | 'desc' | null;
  };

  constructor(containerId: string, data: TableRow[], config: TableConfig) {
    this.container = document.getElementById(containerId);
    this.data = data;
    this.config = config;
    this.currentPage = 1;

    this.sortConfig = {
      column: null,
      direction: null
    };

    this.init();
  }

  init() {
    this.renderHeaders();
    this.updateTable();
    this.setupEventListeners();
  }

  renderHeaders() {
    if (!this.container || !this.config.columns) throw new Error('Container not found');
    const headerRow = this.container.querySelector('thead tr');
    headerRow!.innerHTML = this.config.columns
      .map(column => `
            <th class="${column.sortable ? 'sortable' : ''}" 
                data-key="${column.key}">
                ${column.label}
                ${column.sortable ? '<span class="sort-indicator"></span>' : ''}
            </th>
        `).join('');
  }

  get totalPages() {
    return Math.ceil(this.data.length / this.config.itemsPerPage);
  }

  getCurrentPageData() {
    let sortedData = [...this.data];
    if (this.sortConfig.column) {
      sortedData.sort((a, b) => {
        const column = this.sortConfig.column as keyof TableRow;
        const aVal = a[column];
        const bVal = b[column];
        return compareValues(aVal, bVal, this.sortConfig.direction);
      });
    }

    // Paginate
    const startIndex = (this.currentPage - 1) * this.config.itemsPerPage;
    const endIndex = startIndex + this.config.itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }

  updateSortIndicators() {
    if (!this.container) throw new Error('Container not found');
    const headers = this.container.querySelectorAll('th');
    headers.forEach(header => {
      const key = header.dataset.key;
      const indicator = header.querySelector('.sort-indicator');
      if (indicator) {
        if (key === this.sortConfig.column) {
          indicator.textContent = this.sortConfig.direction === 'asc' ? '+' : '-';
        } else {
          indicator.textContent = 'Sort';
        }
      }
    });
  }

  handleSort(column: string) {
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

  renderBody() {
    if (!this.container) throw new Error('Container not found');
    const tbody = this.container.querySelector('tbody');
    const pageData = this.getCurrentPageData();

    // Clear existing rows
    tbody!.innerHTML = '';

    const fragment = document.createDocumentFragment();

    pageData.forEach(item => {
      const row = document.createElement('tr');
      row.dataset.id = item.id.toString(); // Store item id for selection

      this.config.columns.forEach(column => {
        const cell = document.createElement('td');
        const value = item[column.key];
        cell.textContent = value?.toString() ?? '';
        row.appendChild(cell);
      });

      fragment.appendChild(row);
    });

    tbody!.appendChild(fragment);
  }

  renderPaginationControls() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) throw new Error('Pagination container not found');
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
    this.renderPaginationControls();
    this.updateSortIndicators();
  }

  setupEventListeners() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) throw new Error('Pagination container not found');
    paginationContainer.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.id === 'prev-page' && this.currentPage > 1) {
        this.currentPage--;
        this.updateTable();
      }
      else if (target.id === 'next-page' && this.currentPage < this.totalPages) {
        this.currentPage++;
        this.updateTable();
      }
    });

    if (!this.container) throw new Error('Container not found');
    const thead = this.container.querySelector('thead');
    if (!thead) throw new Error('Table head not found');

    thead.addEventListener('click', (e: MouseEvent) => {

      const headerCell = (e.target as HTMLElement).closest('th');
      if (headerCell?.classList.contains('sortable')) {
        const column = headerCell.dataset.key;
        this.handleSort(column!);
      }
      e.stopImmediatePropagation();
    });

    const handleSearch = (searchTerm: string) => {
      console.log('Searching for:', searchTerm);
    };

    const debouncedSearch = debounce(handleSearch, 300);
    const searchInput = document.getElementById('filter') as HTMLInputElement;
    searchInput.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      debouncedSearch(target.value);
    });
  }
}

const _ = new DataTable('data-table', testData, tableConfig);
