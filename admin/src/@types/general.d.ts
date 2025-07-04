export interface MenuItem {
  name: string;
  url: string;
  icon?: JSX.Element;
}

export interface DataListOption {
  value: string;
  key?: string;
}

export interface ChartPieData {
  name: string;
  value: number;
}

type ColumnSort = {
  id: string
  desc: boolean
}

export type SortingState = ColumnSort[]