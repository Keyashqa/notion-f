import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Spinner,
  Text,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
} from '@chakra-ui/react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchUsers = async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/users?page=${pageNum}&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(data.users);
      setPage(data.page);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const openEditModal = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: 'User deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchUsers(page);
    } catch (error) {
      toast({
        title: 'Error deleting user',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/users/${selectedUser._id}`,
        {
          name: selectedUser.username,
          email: selectedUser.email,
          role: selectedUser.role,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast({
        title: 'User updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchUsers(page);
    } catch (error) {
      toast({
        title: 'Error updating user',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleChange = (e) => {
    setSelectedUser({
      ...selectedUser,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) return <Spinner size="xl" />;

  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>
        User Management
      </Text>
      <Table variant="striped" size="md">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Joined On</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user._id}>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>{user.role}</Td>
              <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
              <Td>
                <Button size="sm" mr={2} onClick={() => openEditModal(user)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Flex justify="space-between" mt={4}>
        <Button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </Button>
        <Text alignSelf="center">
          Page {page} of {pages}
        </Text>
        <Button
          onClick={() => setPage((p) => Math.min(p + 1, pages))}
          disabled={page === pages}
        >
          Next
        </Button>
      </Flex>

      {/* Edit User Modal */}
      {selectedUser && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit User</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleEditSubmit}>
              <ModalBody pb={6}>
                <FormControl mb={3}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name="name"
                    value={selectedUser.username}
                    onChange={handleChange}
                    required
                  />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    name="email"
                    value={selectedUser.email}
                    onChange={handleChange}
                    required
                  />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>Role</FormLabel>
                  <Select
                    name="role"
                    value={selectedUser.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </Select>
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} type="submit">
                  Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default UserManagement;
