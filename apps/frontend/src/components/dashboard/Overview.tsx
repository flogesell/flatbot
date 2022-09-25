import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, HStack, VStack, Text, Skeleton } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useGetExpensesQuery } from '../../services/expense.service';
import { useGetFlatQuery } from '../../services/flat.service';
import { useGetProfileQuery } from '../../services/user.service';
import { OverviewMoney } from './OverviewMoney';

export const Overview = () => {
  const { data: flat, isLoading: flatIsLoading } = useGetFlatQuery();
  const { data: user } = useGetProfileQuery();
  const { data: expenses, isLoading: expensesLoading } = useGetExpensesQuery();
  const total = 0;
  const myTotal = 0;
  const totalExpenses = expenses.reduce((previousValue, currentValue) => previousValue + currentValue.amount, total);
  const myShare = totalExpenses / user.flat.flatmates.length;
  const myExpenses = expenses
    .filter((expense) => expense.paidById === user.userId)
    .reduce((previousValue, currentValue) => previousValue + currentValue.amount, total);
  const myDebts = myShare - myTotal;

  useEffect(() => {
    console.log(flatIsLoading);
  }, [expenses, myDebts, myShare, total, totalExpenses, myExpenses, flatIsLoading]);

  return (
    <Box bgGradient="linear(to-r, #2980B9, #6DD5FA)" borderRadius="5px" height="150px" color="white" boxShadow="0px 0px 10px rgba(50, 50, 50, 0.35)">
      <VStack width="100%" height="100%">
        <Text padding="15px 0" fontWeight="bold" fontSize="xl" width="60%" textAlign="center">
          {expensesLoading && flat?.name.length === 0 && <Skeleton width="100%" height="30px" />}
          {!flatIsLoading && flat?.name}
        </Text>
        <HStack width="100%" justifyContent="space-around" alignItems="start" height="100%" textAlign="center">
          <OverviewMoney label="Du erhälst" amount={myShare / myExpenses} isLoading={expensesLoading} />
          <OverviewMoney label="Gesamtausgaben" amount={totalExpenses} isLoading={expensesLoading} />
        </HStack>
      </VStack>
      <Button
        borderRadius="50%"
        height="50px"
        width="50px"
        top="-25px"
        margin="0 auto"
        display="block"
        color={'#2980B9'}
        background="white"
        boxShadow="0px 0px 10px rgba(50, 50, 50, 0.35)"
      >
        <AddIcon />
      </Button>
    </Box>
  );
};
