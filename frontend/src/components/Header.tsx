import { FcMindMap } from "react-icons/fc";
import { FaMoon, FaSun } from "react-icons/fa";
import {
  Avatar,
  Box,
  Button,
  HStack,
  IconButton,
  LightMode,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  ToastId,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import useUser from "../lib/useUser";
import { logOut } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Text } from "@chakra-ui/react";
import React, { useState } from 'react';
import { BsChatDots } from 'react-icons/bs';
import ChatBot from '../routes/ChatBot';


const ChatbotIcon = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      <Box position="fixed" bottom="90px" right="50px" style={{ display: showChat ? 'block' : 'none' }}>
        <ChatBot />
      </Box>
      <IconButton
        icon={<BsChatDots />}
        colorScheme="teal"
        borderRadius="full"
        size="lg"
        aria-label="챗봇 열기"
        onClick={() => setShowChat(!showChat)}
        position="fixed" // 아이콘 버튼을 고정 위치에 두기
        bottom="50px" // 아이콘 버튼의 위치 조정
        right="50px"
      />
    </>
  );
};

export default function Header() {
  const { userLoading, isLoggedIn, user } = useUser();
  const {
    isOpen: isLoginOpen,
    onClose: onLoginClose,
    onOpen: onLoginOpen,
  } = useDisclosure();
  const {
    isOpen: isSignUpOpen,
    onClose: onSignUpClose,
    onOpen: onSignUpOpen,
  } = useDisclosure();
  const { toggleColorMode } = useColorMode();
  const logoColor = useColorModeValue("red.500", "red.200");
  const Icon = useColorModeValue(FaMoon, FaSun);
  const toast = useToast();
  const queryClient = useQueryClient();
  const toastId = useRef<ToastId>();
  const mutation = useMutation(logOut, {
    onMutate: () => {
      toastId.current = toast({
        title: "Login out...",
        description: "이용해 주셔서 감사합니다.",
        status: "loading",
        duration: 10000,
        position: "bottom-right",
      });
    },
    onSuccess: () => {
      if (toastId.current) {
        queryClient.refetchQueries(["me"]);
        toast.update(toastId.current, {
          status: "success",
          title: "Done!",
          description: "See you later!",
        });
      }
    },
  });
  const onLogOut = async () => {
    mutation.mutate();
  };
  return (
    <Stack
      justifyContent={"space-between"}
      alignItems="center"
      py={5}
      px={40}
      direction={{
        sm: "column",
        md: "row",
      }}
      spacing={{
        sm: 4,
        md: 0,
      }}
      borderBottomWidth={1}
    >
      <Box color={logoColor}>
        <Link to={"/"}>
          <HStack>
            <FcMindMap size={"48"} />
            <Text color="#0A66C2" fontSize="lg">예비 창업자 도우미</Text>
          </HStack>
        </Link>
      </Box>

      <HStack spacing={2}>
        <Link to="/subboard">업체 </Link>
        
        <Link to="/new-board">게시판</Link>
        <IconButton
          onClick={toggleColorMode}
          variant={"ghost"}
          aria-label="Toggle dark mode"
          icon={<Icon />}
        />

        {!userLoading ? (
          !isLoggedIn ? (
            <>
              <Button onClick={onLoginOpen}>Log in</Button>
              <LightMode>
                <Link to="/signup">
                  <Button onClick={onSignUpOpen} colorScheme={"red"}>
                    Sign up
                  </Button>
                </Link>
              </LightMode>
            </>
          ) : (
            <Menu>
              <MenuButton>
                <Avatar name={user?.name} src={user?.avatar} size={"md"} />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={onLogOut}>Log out</MenuItem>
                <Link to="/profile">
                  <MenuItem>Profile</MenuItem>
                </Link>
              </MenuList>
            </Menu>
          )
        ) : null}
      </HStack>

      <LoginModal isOpen={isLoginOpen} onClose={onLoginClose} />
      {/* 챗봇 아이콘 컴포넌트 추가 */}
      <ChatbotIcon />
    </Stack>
  );
}