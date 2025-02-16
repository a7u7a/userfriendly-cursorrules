import { TableRow, TableConfig } from './types';
import { testData, tableConfig } from './data';
import { compareValues, debounce, searchItems } from './utils';

class DataTable {
  private container: HTMLElement | null;
  private data: TableRow[];
  private filteredData: TableRow[];
  private config: TableConfig;
  private currentPage: number;
  private sortConfig: {
    column: string | null;
    direction: 'asc' | 'desc' | null;
  };
  private isLoading: boolean;
  private searchInput: HTMLInputElement | null;

  constructor(containerId: string, data: TableRow[], config: TableConfig) {
    this.container = document.getElementById(containerId);
    this.data = data;
    this.config = config;
    this.filteredData = data;
    this.currentPage = 1;
    this.isLoading = false;
    this.searchInput = document.getElementById('filter') as HTMLInputElement;
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

  private async handleSearch(query: string) {
    try {
      this.setLoading(true);
      this.currentPage = 1;
      this.filteredData = await searchItems(this.data, query);
      this.updateTable();
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      this.setLoading(false);
    }
  }

  private setLoading(loading: boolean) {
    this.isLoading = loading; // Unused for now
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.textContent = loading ? 'Loading...' : '';
    }
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
    return Math.ceil(this.filteredData.length / this.config.itemsPerPage);
  }

  getCurrentPageData() {
    let sortedData = [...this.filteredData];

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
    tbody!.innerHTML = '';
    const fragment = document.createDocumentFragment();

    if (pageData.length > 0) {
      pageData.forEach(item => {
        const row = document.createElement('tr');
        this.config.columns.forEach(column => {
          const cell = document.createElement('td');
          const value = item[column.key];
          cell.textContent = value?.toString() ?? '';
          row.appendChild(cell);
        });
        fragment.appendChild(row);
      });
    } else {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = this.config.columns.length;
      cell.textContent = 'No results found';
      row.appendChild(cell);
      fragment.appendChild(row);
    }
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

    if (this.searchInput) {
      const debouncedSearch = debounce(
        (query: string) => this.handleSearch(query),
        300
      );

      this.searchInput.addEventListener('input', (e: Event) => {
        const target = e.target as HTMLInputElement;
        debouncedSearch(target.value);
      });
    }
  }
}

const _ = new DataTable('data-table', testData, tableConfig);
