export interface TableRow {
  id: number;
  name: string | null;
  price: number | null;
  date: Date | null;
  [key: string]: string | number | Date | null;
}

export interface TableConfig {
  columns: {
    key: string
    label: string
    sortable: boolean
  }[]
  itemsPerPage: number
}