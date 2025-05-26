import React, { useEffect, useState } from 'react';
import {
  Flex,
  Text,
  Spinner,
  IconButton,
  useColorMode,
  useToast,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  VStack,
  HStack,
  Box,
} from '@chakra-ui/react';
import { FiBell } from 'react-icons/fi';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import axios from 'axios';
import UserMenu from './UserMenu';
import useTopStore from '../stores/topstore';
import useStore from '../stores/sidebarStores';

const Topbar = () => {
  const selectedWorkspace = useStore((state) => state.selectedWorkspace);
  const { user, setUser } = useTopStore();
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [inviteEmail, setInviteEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [invites, setInvites] = useState([]);
  const [loadingInvites, setLoadingInvites] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        toast({
          title: "Error fetching user.",
          description: err.response?.data?.message || "Server error",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    const fetchInvites = async () => {
      try {
        setLoadingInvites(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/invites/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInvites(res.data);
      } catch (err) {
        console.error("Failed to fetch invites:", err);
      } finally {
        setLoadingInvites(false);
      }
    };

    fetchUser();
    fetchInvites();
  }, [setUser, toast]);

  const handleSendInvite = async () => {
    if (!inviteEmail) {
      toast({
        title: "Email is required",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setIsSending(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/invites`,
        {
          toEmail: inviteEmail,
          workspaceId: selectedWorkspace,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: "Invite sent!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setInviteEmail('');
      onClose();
    } catch (err) {
      console.error("Failed to send invite:", err);
      toast({
        title: "Failed to send invite",
        description: err.response?.data?.message || "Server error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleInviteResponse = async (inviteId, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/invites/respond`,
        { inviteId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: `Invite ${action}ed!`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      // Remove invite from UI
      setInvites((prev) => prev.filter((invite) => invite._id !== inviteId));
    } catch (err) {
      console.error(`Failed to ${action} invite:`, err);
      toast({
        title: `Failed to ${action} invite`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Flex
        as="header"
        align="center"
        justify="space-between"
        p={4}
        bg="white"
        _dark={{ bg: "gray.800" }}
        borderBottom="1px solid"
        borderColor="gray.200"
        shadow="sm"
        position="sticky"
        top="0"
        zIndex="1000"
      >
        <Text fontSize="xl" fontWeight="bold">
          My Dashboard
        </Text>

        <Flex align="center" gap={4}>
          <Button size="sm" colorScheme="teal" onClick={onOpen}>
            Invite
          </Button>

          <IconButton
            aria-label="Toggle Theme"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            fontSize="20px"
          />

          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Box position="relative">
                <IconButton
                  aria-label="Notifications"
                  icon={<FiBell />}
                  variant="ghost"
                  fontSize="20px"
                />
                {invites.length > 0 && (
                  <Box
                    position="absolute"
                    top="0"
                    right="0"
                    height="10px"
                    width="10px"
                    bg="red.500"
                    borderRadius="full"
                    border="2px solid white"
                  />
                )}
              </Box>
            </PopoverTrigger>

            <PopoverContent w="300px">
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader fontWeight="bold">Invitations</PopoverHeader>
              <PopoverBody>
                {loadingInvites ? (
                  <Spinner size="sm" />
                ) : invites.length === 0 ? (
                  <Text fontSize="sm" color="gray.500">No pending invites</Text>
                ) : (
                  <VStack align="stretch" spacing={3}>
                    {invites.map((invite) => (
                      <Box key={invite._id} p={2} borderWidth="1px" borderRadius="md">
                        <Text fontSize="sm">
                          <b>{invite.fromUserId?.name || 'Someone'}</b> invited you to <b>{invite.workspaceId?.name || 'a workspace'}</b>
                        </Text>
                        <HStack justify="end" mt={2}>
                          <Button size="xs" colorScheme="green" onClick={() => handleInviteResponse(invite._id, 'accept')}>
                            Accept
                          </Button>
                          <Button size="xs" colorScheme="red" onClick={() => handleInviteResponse(invite._id, 'reject')}>
                            Reject
                          </Button>
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                )}
              </PopoverBody>
            </PopoverContent>
          </Popover>

          {user ? <UserMenu user={user} /> : <Spinner size="sm" />}
        </Flex>
      </Flex>

      {/* Invite Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invite to Workspace</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Enter user's email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleSendInvite}
              isLoading={isSending}
            >
              Send Invite
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Topbar;
