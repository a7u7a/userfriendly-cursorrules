import { TableRow, TableConfig } from './types';
import { testData, tableConfig } from './data';

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
        const column = this.sortConfig.column as keyof TableRow;
        const aVal = a[column];
        const bVal = b[column];
        return this.compareValues(aVal, bVal, this.sortConfig.direction);
      });
    }

    // Then paginate
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
          indicator.textContent = 'Sort';  // empty space
        }
      }
    });
  }

  // Handle sort
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

  // Render table body
  renderBody() {
    if (!this.container) throw new Error('Container not found');
    const tbody = this.container.querySelector('tbody');
    const pageData = this.getCurrentPageData();

    // Clear existing rows
    tbody!.innerHTML = '';

    // Create document fragment for better performance
    const fragment = document.createDocumentFragment();

    pageData.forEach(item => {
      const row = document.createElement('tr');
      row.dataset.id = item.id.toString(); // Store item id for selection

      this.config.columns.forEach(column => {
        const cell = document.createElement('td');
        const value = item[column.key];
        cell.textContent = value?.toString() ?? ''; // Convert to string or empty string if null
        row.appendChild(cell);
      });

      fragment.appendChild(row);
    });

    tbody!.appendChild(fragment);
  }

  // Render pagination controls
  renderPagination() {
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
    this.renderPagination();
    this.updateSortIndicators();
  }

  setupEventListeners() {
    // Pagination event listeners
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
      const target = e.target as HTMLElement;
      const header = target.closest('th');
      if (header && header.classList.contains('sortable')) {
        const column = header.dataset.key;
        this.handleSort(column!);
      }
    });
  }

  init() {
    this.renderHeaders();
    this.updateTable();
    this.setupEventListeners();
  }

  compareValues(aVal: any, bVal: any, direction: 'asc' | 'desc' | null) {
    // Handle null/undefined values
    if (aVal == null) return direction === 'asc' ? -1 : 1;
    if (bVal == null) return direction === 'asc' ? 1 : -1;

    // Detect value type and compare accordingly
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return direction === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    // Handle numbers
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'asc' ? aVal - bVal : bVal - aVal;
    }

    // Handle dates
    if (aVal instanceof Date && bVal instanceof Date) {
      return direction === 'asc'
        ? aVal.getTime() - bVal.getTime()
        : bVal.getTime() - aVal.getTime();
    }

    // Default comparison
    return direction === 'asc'
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  }

}

const table = new DataTable('data-table', testData, tableConfig);