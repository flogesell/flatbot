import { Box, Center, List, ListItem, Skeleton, Spinner } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { Expense as ExpenseType } from '../../models/expenses.model';
import { useGetExpensesQuery } from '../../services/expense.service';
import { Expense } from './Expense';

export const ExpenseList = () => {
  const { data: expenses, isLoading } = useGetExpensesQuery();
  const [elementsToShow, setElementsToShow] = React.useState(20);
  const [loading, setLoading] = React.useState(false);
  const [listItems, setListItems] = React.useState<ExpenseType[]>([]);
  const loader = useRef(null);

  const loadMore = () => {
    setLoading(true);
    if (elementsToShow + 20 <= expenses.length) setElementsToShow(elementsToShow + 20);
    else setElementsToShow(expenses.length);
  };

  useEffect(() => {
    setListItems(expenses.slice(0, elementsToShow));
    setLoading(false);
  }, [isLoading, elementsToShow, expenses, loading]);

  if (isLoading) return <Skeleton width="100%"></Skeleton>;
  return (
    <List>
      {!isLoading &&
        listItems.map((expense) => (
          <ListItem key={expense.expenseId}>
            <Expense expense={expense} isLoading={isLoading} />
          </ListItem>
        ))}
      {loading && (
        <Center>
          <Spinner />
        </Center>
      )}
      <Box ref={loader} />
    </List>
  );
};
