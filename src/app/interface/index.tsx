export interface DataType {
  name?: string;
  hema?: number | 0;
  sam?: number | 0;
  wxEat?: number | 0;
  zfbEat?: number | 0;
  wxShopping?: number | 0;
  alipayShopping?: number | 0;
  geidao?: number | 0;
  rent?: number | 0;
  parking?: number | 0;
  phone?: number | 0;
  water?: number | 0;
  electricity?: number | 0;
  gas?: number | 0;
}
export interface EditableRowProps {
  index: number;
}

export interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}
export interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

