// src/components/PageList.js
import React from 'react';
import { VStack, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import useStore from '../stores/pageStore';

const PageList = ({ pages }) => {
  const navigate = useNavigate();
  const selectedPage= useStore(state => state.selectedPage);
  const setSelectedPageId = useStore(state => state.setSelectedPageId);
  return (
    <VStack align="stretch" spacing={2}>
      {pages.map(page => (
        <Button
          key={page._id}
          variant="ghost"
          justifyContent="flex-start"
          onClick={() => {
            setSelectedPageId(page._id);
            navigate(`/dashboard/pages/${page._id}`);
            console.log(page._id);
          }}
        >
          {page.title}
        </Button>
      ))}

      {pages.length === 0 && (
        <Text fontSize="sm" color="gray.500">
          No pages found.
        </Text>
      )}
    </VStack>
  );
};

export default PageList;
