import { Box, Center, ListItem, Skeleton, Spinner } from '@chakra-ui/react';
import { List } from 'react-virtualized';
import React, { useEffect, useRef, useState } from 'react';
import { Expense as ExpenseType } from '../../models/expenses.model';
import { useGetExpensesQuery } from '../../services/expense.service';
import { Expense } from './Expense';

export const ExpenseList = () => {
  const { data: expenses, isLoading } = useGetExpensesQuery();
  const [elementsToShow, setElementsToShow] = React.useState(20);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {}, [elementsToShow, expenses, loading]);

  if (isLoading) return <Skeleton width="100%"></Skeleton>;

  const renderRow = ({ index, key, style }) => (
    <div>
      <ListItem>
        <Expense expense={expenses[index]} isLoading={isLoading} />
      </ListItem>
    </div>
  );

  return <List rowCount={expenses.length} rowHeight={45} width={400} height={400} rowRenderer={renderRow} />;
};
