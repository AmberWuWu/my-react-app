import React, { useContext, useEffect, useRef, useState } from 'react';
import type { GetRef, InputRef, TableProps, TableColumnsType } from 'antd';
import { Button, Form, Input, Popconfirm, Table } from 'antd';
import { DataType, EditableRowProps, Item, EditableCellProps, FixedDataType } from '../interface/index';

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);



const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};



const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type ColumnTypes = Exclude<TableProps<DataType>['columns'], undefined>;


const TableData: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([
    {
      name: '琼',
      hema: 419.9,
      sam: 390,
      wxEat: 743.81,
      zfbEat: 903.1,
      wxShopping: 1325,
      alipayShopping: 1381.49,
      water: 100,
      electricity: 326,
      gas: 156,
    },
    {
      name: '浩然',
      hema: 146.81,
      wxEat: 863.6,
      zfbEat: 510.85,
      wxShopping: 779.47,
      alipayShopping: 462.7,
      geidao: 291.86,
      parking: 1000,
      phone: 200,
    },
    {
      name: '妈',
      wxShopping: 660,
    },
  ]);

  const [count, setCount] = useState(2);

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string; })[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      fixed: 'left',
    },
    {
      title: '吃',
      dataIndex: 'eat',
      key: 'eat',
      editable: true,
      children: [
        {
          title: '盒马',
          dataIndex: 'hema',
          key: 'hema',
        },
        {
          title: '山姆',
          dataIndex: 'sam',
          key: 'sam',
        },

        {
          title: '微信',
          dataIndex: 'wxEat',
          key: 'wxEat',
        },
        {
          title: '支付宝',
          dataIndex: 'zfbEat',
          key: 'zfbEat',
        },
      ]
    },
    {
      title: '购物',
      dataIndex: 'shopping',
      key: 'shopping',
      children: [
        {
          title: '微信',
          dataIndex: 'wxShopping',
          key: 'wxShopping',
        },
        {
          title: '支付宝',
          dataIndex: 'alipayShopping',
          key: 'alipayShopping',
        },
      ]
    },
    {
      title: '给到',
      dataIndex: 'geidao',
      key: 'geidao',
    },
    {
      title: '固定支出',
      dataIndex: 'guding',
      key: 'guding',
      children: [
        {
          title: '房租',
          dataIndex: 'rent',
        },
        {
          title: '停车',
          dataIndex: 'parking',
        },
        {
          title: '电话费',
          dataIndex: 'phone',
        },
      ]
    },
    {
      title: '生活缴费',
      dataIndex: 'life',
      key: 'life',
      children: [
        {
          title: '水',
          dataIndex: 'water',
          key: 'water',
        },
        {
          title: '电',
          dataIndex: 'electricity',
          key: 'electricity',
        },
        {
          title: '燃气',
          dataIndex: 'gas',
          key: 'gas',
        },
      ]
    },
    {
      title: '总计',
      dataIndex: 'total',
      key: 'total',
      fixed: 'right',
      render: (text, record) => {
        let total = 0;
        for (const key in record) {
          if (key !== 'name') {
            total = numbersEqual(total, (record[key] || 0));
          }
        }
        return (
          <span>{total}</span>
        );
      }
    }
  ];
  const numbersEqual = (num1: number, num2: number) => {
    return Number((num1 + num2).toFixed(10));
  };
  const handleAdd = () => {
    const newData: DataType = {
      key: count,
      name: `Edward King ${count}`,
      age: '32',
      address: `London, Park Lane no. ${count}`,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };
  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };
  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      {/* <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add a row
      </Button> */}
      <Table<DataType>
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
      />
    </div>
  );
};
export default TableData;