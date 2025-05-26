import { useState } from "react";
import {
  Box,
  Textarea,
  Button,
  Heading,
  VStack,
  HStack,
  Text,
  Spinner,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import axios from "axios";

const OpenAIChat = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const bgUser = useColorModeValue("blue.100", "blue.600");
  const bgAI = useColorModeValue("gray.100", "gray.700");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const newMessages = [...messages, { sender: "user", text: prompt }];
    setMessages(newMessages);
    setPrompt("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/ai/chat`,
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessages([
        ...newMessages,
        { sender: "ai", text: res.data.message || "No response." },
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { sender: "ai", text: "An error occurred while getting a response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="600px" mx="auto" mt={8} p={4}>
      <Heading textAlign="center" mb={4} size="lg">
        Ask AI
      </Heading>

      <Box
        border="1px solid"
        borderColor="gray.300"
        borderRadius="md"
        height="400px"
        overflowY="auto"
        p={4}
        mb={4}
        bg={useColorModeValue("white", "gray.800")}
        shadow="md"
      >
        <VStack spacing={4} align="stretch">
          {messages.map((msg, i) => (
            <Flex
              key={i}
              justify={msg.sender === "user" ? "flex-end" : "flex-start"}
            >
              <Box
                bg={msg.sender === "user" ? bgUser : bgAI}
                color={msg.sender === "user" ? "black" : "blue"}
                px={4}
                py={2}
                borderRadius="lg"
                maxW="75%"
              >
                <Text fontSize="sm" whiteSpace="pre-wrap">
                  {msg.text}
                </Text>
              </Box>
            </Flex>
          ))}

          {loading && (
            <Flex justify="center">
              <Spinner size="sm" />
              <Text ml={2}>AI is thinking...</Text>
            </Flex>
          )}
        </VStack>
      </Box>

      <form onSubmit={handleSubmit}>
        <HStack align="flex-start">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt..."
            rows={3}
            resize="none"
            bg={useColorModeValue("white", "gray.700")}
          />
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={loading}
            loadingText="Asking"
            px={6}
          >
            Ask
          </Button>
        </HStack>
      </form>
    </Box>
  );
};

export default OpenAIChat;
