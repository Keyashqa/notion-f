import React from 'react';
import {
  Avatar,
  Box,
  Text,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuDivider,
} from '@chakra-ui/react';
import LogoutButton from './logout';
import UpdateProfileModal from './UpdateProfileModel';
import useTopStore from '../stores/topstore';

const UserMenu = () => {
  const { user } = useTopStore();
  const { username, email, profilePicUrl } = user || {};

  return (
    <Menu>
      <MenuButton>
        <Avatar name={username} src={profilePicUrl || ''} size="sm" />
      </MenuButton>
      <MenuList>
        <Box px={4} py={2}>
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold">{username}</Text>
            <Text fontSize="sm" color="gray.500">{email}</Text>
          </VStack>
        </Box>
        <MenuDivider />
        <UpdateProfileModal />
        <LogoutButton />
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
