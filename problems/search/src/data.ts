import { TableRow } from "./types";
import { TableConfig } from "./types";

const testData: TableRow[] = [
  { id: 1, name: 'Product A', price: 100, date: new Date('2024-01-01') },
  { id: 2, name: 'Product C', price: 50, date: new Date('2024-03-15') },
  { id: 3, name: 'Product B', price: null, date: new Date('2024-02-01') },
  { id: 4, name: 'Product D', price: 75, date: null },
  { id: 5, name: null, price: 200, date: new Date('2024-01-15') },
  { id: 6, name: 'Product É', price: 150, date: new Date('2024-02-15') },
  { id: 7, name: 'product a', price: 90, date: new Date('2024-03-01') }
];

const tableConfig: TableConfig = {
  columns: [
    { key: 'name', label: 'Product Name', sortable: true },
    { key: 'price', label: 'Price', sortable: true },
    { key: 'date', label: 'Date', sortable: false }
  ],
  itemsPerPage: 10
};

export { testData, tableConfig };