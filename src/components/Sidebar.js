import { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Divider,
  Text,
  IconButton,
  useToast,
  Spinner,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Input,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { AddIcon, SettingsIcon } from '@chakra-ui/icons';
import axios from 'axios';

import WorkspaceSelector from './workspace';
import PageList from './pageList';
import LogoutButton from './logout';
import useStore from '../stores/sidebarStores';
import { useNavigate } from 'react-router-dom';
import { StarIcon,ChatIcon } from '@chakra-ui/icons';

const Sidebar = () => {
  const navigate = useNavigate();
  const workspaces = useStore((state) => state.workspaces);
  const setWorkspaces = useStore((state) => state.setWorkspaces);
  const selectedWorkspace = useStore((state) => state.selectedWorkspace);
  const setSelectedWorkspace = useStore((state) => state.setSelectedWorkspace);
  const pages = useStore((state) => state.pages);
  const setPages = useStore((state) => state.setPages);
  const loading = useStore((state) => state.loading);
  const setLoading = useStore((state) => state.setLoading);

  const addWorkspace = useStore((state) => state.addWorkspace);
  const updateWorkspace = useStore((state) => state.updateWorkspace);
  const addPage = useStore((state) => state.addPage);
  const toast = useToast();
  const token = localStorage.getItem('token');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState(null);
  const [drawerMode, setDrawerMode] = useState('create');
  const [inputValue, setInputValue] = useState('');

  const openDrawer = (type, mode = 'create') => {
    setDrawerType(type);
    setDrawerMode(mode);
    setInputValue(
      mode === 'settings'
        ? type === 'workspace'
          ? selectedWorkspace?.name
          : ''
        : ''
    );
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleCreate = async () => {
    if (!inputValue) return;
    try {
      if (drawerType === 'workspace') {
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/workspaces`,
          { name: inputValue },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        addWorkspace(res.data);
        setSelectedWorkspace(res.data);
      } else if (drawerType === 'page' && selectedWorkspace) {
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/pages`,
          { title: inputValue, workspaceId: selectedWorkspace._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        addPage(res.data);
      }

      toast({
        title: `${drawerType === 'workspace' ? 'Workspace' : 'Page'} created successfully!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      closeDrawer();
    } catch (err) {
      console.error(err);
      toast({
        title: `Error creating ${drawerType}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdate = async () => {
    try {
      const url =
        drawerType === 'workspace'
          ? `${process.env.REACT_APP_BACKEND_URL}/api/workspaces/${selectedWorkspace._id}`
          : `${process.env.REACT_APP_BACKEND_URL}/api/pages/${selectedWorkspace._id}`;

      const payload =
        drawerType === 'workspace' ? { name: inputValue } : { title: inputValue };

      const res = await axios.put(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (drawerType === 'workspace') {
        updateWorkspace(res.data);
        setSelectedWorkspace(res.data);
      }

      toast({
        title: `${drawerType} updated successfully!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      closeDrawer();
    } catch (err) {
      console.error(err);
      toast({
        title: `Error updating ${drawerType}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const url =
        drawerType === 'workspace'
          ? `${process.env.REACT_APP_BACKEND_URL}/api/workspaces/${selectedWorkspace._id}`
          : `${process.env.REACT_APP_BACKEND_URL}/api/pages/${selectedWorkspace._id}`;

      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (drawerType === 'workspace') {
        const filtered = workspaces.filter((w) => w._id !== selectedWorkspace._id);
        setWorkspaces(filtered);
        setSelectedWorkspace(filtered[0] || null);
      }

      toast({
        title: `${drawerType} deleted successfully!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      closeDrawer();
    } catch (err) {
      console.error(err);
      toast({
        title: `Error deleting ${drawerType}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (!token) return;
    const fetchWorkspaces = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/workspaces/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkspaces(res.data);
        if (res.data.length > 0 && !selectedWorkspace) {
          setSelectedWorkspace(res.data[0]);
        }
      } catch (err) {
        console.error(err);
        toast({
          title: 'Error fetching workspaces.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchWorkspaces();
  }, [token]);

  useEffect(() => {
    if (!token || !selectedWorkspace) return;
    const fetchPages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/workspaces/${selectedWorkspace._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPages(res.data.pages || []);
      } catch (err) {
        console.error(err);
        toast({
          title: 'Error fetching pages.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, [selectedWorkspace, token]);

  const drawerBg = useColorModeValue('white', 'gray.800');
  const inputBg = useColorModeValue('gray.50', 'gray.700');
  const inputColor = useColorModeValue('black', 'white');

  return (
    <>
      <VStack h="100%" align="stretch" p={4} spacing={4}>
        <Box>
          <HStack justifyContent="space-between">
            <Text fontWeight="bold" fontSize="xl">Workspaces</Text>
            <HStack>
              <IconButton
                size="sm"
                icon={<SettingsIcon />}
                aria-label="Workspace Settings"
                onClick={() => openDrawer('workspace', 'settings')}
              />
              <IconButton
                size="sm"
                icon={<AddIcon />}
                aria-label="Add Workspace"
                onClick={() => openDrawer('workspace')}
              />
            </HStack>
          </HStack>
          <WorkspaceSelector
            workspaces={workspaces}
            selected={selectedWorkspace}
            onSelect={setSelectedWorkspace}
          />
        </Box>

        <Divider />

        <Box flex="1">
          <HStack justifyContent="space-between">
            <Text fontWeight="bold" fontSize="md">Pages</Text>
            <IconButton
              size="sm"
              icon={<AddIcon />}
              aria-label="Add Page"
              onClick={() => openDrawer('page')}
              isDisabled={!selectedWorkspace}
            />
          </HStack>
          {loading ? <Spinner size="sm" /> : <PageList pages={pages} />}
        </Box>
        <Button
          colorScheme="teal"
          leftIcon={<ChatIcon />}
          onClick={() => navigate('/dashboard/chatbot')}
          isDisabled={!selectedWorkspace}
        >
          Chatbot
        </Button>
        <Button
          colorScheme="yellow"
          leftIcon={<StarIcon />}
          onClick={() => navigate(`/dashboard/upgrade/${selectedWorkspace?._id}`)}
          isDisabled={!selectedWorkspace}
        >
          Upgrade
        </Button>

        <Divider />

        <Divider />
      </VStack>

      <Drawer isOpen={isDrawerOpen} placement="right" onClose={closeDrawer}>
        <DrawerOverlay />
        <DrawerContent bg={drawerBg}>
          <DrawerHeader>
            {drawerMode === 'create' ? `Create New ${drawerType}` : `Update ${drawerType}`}
          </DrawerHeader>
          <DrawerBody>
            <Input
              placeholder={`Enter ${drawerType} name`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              bg={inputBg}
              color={inputColor}
            />
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={closeDrawer}>Cancel</Button>
            {drawerMode === 'create' ? (
              <Button colorScheme="blue" onClick={handleCreate}>Create</Button>
            ) : (
              <>
                <Button colorScheme="red" mr={3} onClick={handleDelete}>Delete</Button>
                <Button colorScheme="green" onClick={handleUpdate}>Update</Button>
              </>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;
