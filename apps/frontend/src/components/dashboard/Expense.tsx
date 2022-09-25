import { Avatar, Box, HStack, Tag, TagLabel, Text, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { Expense as ExpenseType } from '../../models/expenses.model';
import { useGetProfileQuery } from '../../services/user.service';

export const Expense = ({ expense, isLoading }: { expense: ExpenseType; isLoading: boolean }) => {
  const { data: user } = useGetProfileQuery();
  const expenseByMe = expense.paidById === user.userId;
  const expenseAmount = expenseByMe ? expense.amount : -expense.amount;
  const localeString = expenseAmount.toLocaleString('de-De', { style: 'currency', currency: 'EUR' });
  const localeStringShare = (expenseAmount / 2).toLocaleString('de-De', { style: 'currency', currency: 'EUR' });
  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);
  return (
    <Box margin="10px 0">
      <HStack width="100%">
        <HStack>
          <Avatar name={expense.paidBy.firstName} background="#979797" width="35px" height="35px" marginRight="5px" />
          <VStack alignItems="start">
            <Text fontWeight="bold">{expense.tag.name}</Text>
            <Text marginTop="0px !important" fontSize="xs">
              {new Date(expense.date).toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' })}
            </Text>
          </VStack>
        </HStack>
        <VStack textAlign="right" alignItems="end" marginLeft="auto" flexGrow="1">
          <Text fontSize="18px" fontWeight="bold" color={!expenseByMe ? '#f64747' : '#26c281'}>
            {localeStringShare}
          </Text>
          <Text fontSize="12px" color="#313131" marginTop="0px !important">
            total: {localeString}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};
