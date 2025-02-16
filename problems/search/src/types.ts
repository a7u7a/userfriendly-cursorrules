export interface TableRow {
  id: number;
  name: string | null;
  price: number | null;
  date: Date | null;
}

export interface TableConfig {
  columns: {
    key: keyof TableRow 
    label: string
    sortable: boolean
  }[]
  itemsPerPage: number
}