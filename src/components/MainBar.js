import  { useEffect, useState,useRef } from 'react';
import {
  Box,
  HStack,
  Input,
  Select,
  Textarea,
  Button,
  VStack,
  Spinner,
  Divider,
  Heading,
  Flex
} from '@chakra-ui/react';
import axios from 'axios';
import usePageStore from '../stores/pageStore';
import { v4 as uuidv4 } from 'uuid'; // For unique frontend IDs
import io from 'socket.io-client';


const BlockRow = ({ block, index, onChange }) => {
  const handleFieldChange = (field, value) => {
    const updatedBlock = { ...block, [field]: value };
    onChange(block._id, updatedBlock);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/uploads`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update metadata.url with uploaded image URL
      const updatedBlock = {
        ...block,
        metadata: {
          ...(block.metadata || {}),
          url: res.data.url, // Assuming backend sends back { url: '...' }
        },
      };
      console.log(res.data);
      onChange(block._id, updatedBlock);
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Image upload failed.');
    }
  };

  return (
    <VStack
      border="1px solid gray"
      borderRadius="md"
      p={4}
      align="stretch"
      spacing={2}
    >
      <HStack spacing={4}>
        <Input
          type="number"
          value={block.position}
          onChange={(e) =>
            handleFieldChange('position', parseInt(e.target.value))
          }
          placeholder="Order"
          w="60px"
        />
        <Select
          value={block.type}
          onChange={(e) => handleFieldChange('type', e.target.value)}
          w="150px"
        >
          <option value="paragraph">Paragraph</option>
          <option value="heading">Heading</option>
          <option value="image">Image</option>
          <option value="code">Code</option>
          <option value="list">List</option>
        </Select>
      </HStack>

      <Textarea
        value={block.content}
        onChange={(e) => handleFieldChange('content', e.target.value)}
        placeholder="Content"
      />

      {block.type === 'image' && (
        <>
          {block.metadata?.url && (
            <Box mt={2}>
              <img
                src={block.metadata.url}
                alt={block.metadata?.altText || 'Uploaded Image'}
                style={{ maxHeight: '200px', borderRadius: '8px' }}
              />
            </Box>
          )}
          <Input type="file" accept="image/*" onChange={handleFileUpload} />
        </>
      )}
    </VStack>
  );
};

const Mainbar = () => {
  const socket = useRef(null);
  const selectedPage = usePageStore((state) => state.selectedPage);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlocks = async () => {
      if (!selectedPage) return;
      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/blocks/page/${selectedPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBlocks(res.data);
      } catch (err) {
        console.error('Error fetching blocks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();

    // 🔌 Setup socket
  socket.current = io(process.env.REACT_APP_BACKEND_URL, {
    withCredentials: true,
  });

  socket.current.emit('join-page', selectedPage);

  socket.current.on('block-updated', (updatedBlock) => {
    // Update the block in the local state
    setBlocks((prev) =>
      prev.map((block) =>
        block._id === updatedBlock._id ? updatedBlock : block
      )
    );
  });

  return () => {
    socket.current.disconnect();
  };

  }, [selectedPage]);

  const handleBlockChange = (blockId, updatedBlock) => {
    setBlocks((prev) =>
      prev.map((block) => (block._id === blockId ? updatedBlock : block))
    );

    if (!updatedBlock.isNew) {
      socket.current.emit('block-update', {
        pageId: selectedPage,
        block: updatedBlock,
      });
    }
  };

  const handleAddBlock = () => {
  const newBlock = {
    _id: uuidv4(), // Temporary frontend ID
    position: blocks.length + 1,
    type: 'paragraph',
    content: '',
    pageId: selectedPage,  // ✅ Fix: use pageId instead of page
    isNew: true
  };
  setBlocks((prev) => [...prev, newBlock]);
};

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      await Promise.all(
        blocks.map((block) => {
          if (block.isNew) {
            // Create new block
            return axios.post(
              `${process.env.REACT_APP_BACKEND_URL}/api/blocks`,
              block,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } else {
            // Update existing block
            return axios.put(
              `${process.env.REACT_APP_BACKEND_URL}/api/blocks/${block._id}`,
              block,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          }
        })
      );
      alert('All blocks saved successfully!');
    } catch (err) {
      console.error('Error saving blocks:', err);
      alert('Failed to save blocks.');
    }
  };

  return (
    <Box p={6} w="100%">
      
      <Flex align="center" justify="space-between" mb={4}>
        <Heading fontSize="xl">{selectedPage}</Heading>
        <Button colorScheme="green" onClick={handleAddBlock}>
          + Add Block
        </Button>
        <Button colorScheme="blue" onClick={handleSave} alignSelf="flex-start">
            Save All
          </Button>
      </Flex>

      <Divider mb={4} />

      {loading ? (
        <Spinner />
      ) : (
        <VStack spacing={4} align="stretch">
          {blocks.map((block, idx) => (
            <BlockRow
              key={block._id}
              block={block}
              index={idx}
              onChange={handleBlockChange}
            />
          ))}
          
        </VStack>
      )}
    </Box>
  );
};

export default Mainbar;
