import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Checkbox,
  Link,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState, useRef } from "react";
import { ModalTermos } from "../ModalTermos/Index";

export function CadastroUsuario() {
  const nome = useRef<HTMLInputElement>(null);
  const data_nascimento = useRef<HTMLInputElement>(null);
  const doc_cpf = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const usuario = useRef<HTMLInputElement>(null);
  const senha = useRef<HTMLInputElement>(null);
  const check_termo_opcional_1 = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      nome.current &&
      data_nascimento.current &&
      doc_cpf.current &&
      email.current &&
      usuario.current &&
      senha.current &&
      check_termo_opcional_1.current
    ) {
      const dadosUsuario = {
        nome: nome.current.value,
        data_nascimento: data_nascimento.current.value,
        doc_cpf: doc_cpf.current.value,
        email: email.current.value,
        usuario: usuario.current.value,
        senha: senha.current.value,
        aceite_termo_opcional_1: check_termo_opcional_1.current.checked,
      };

      try {
        const req = await axios.post(
          "http://localhost:8800/addUsuario",
          dadosUsuario
        );

        // Limpar os campos após a submissão
        nome.current.value = "";
        data_nascimento.current.value = "";
        doc_cpf.current.value = "";
        email.current.value = "";
        usuario.current.value = "";
        senha.current.value = "";
        check_termo_opcional_1.current.checked = false;
      } catch (error) {
        console.log("Erro ao cadastrar usuário: ", error);
      }
    } else {
      console.error("Algum campo está nulo.");
    }
  };

  return (
    <Flex justifyContent="center" alignItems="center" w="100%" h="100vh">
      <Flex
        bg="#07012C"
        w="60rem"
        borderRadius="2rem"
        boxShadow="4px 5px 4px 0px rgba(0, 0, 0, 0.50)"
        direction="column"
        alignItems="center"
        justifyContent="center"
        p="2rem"
      >
        <Flex h="20%" justifyContent="center" alignItems="center">
          <Heading>Cadastro de Usuario</Heading>
        </Flex>
        <Box h="80%" w="100%">
          <form onSubmit={handleSubmit}>
            <Box mb="2rem">
              <FormControl isRequired>
                <FormLabel>Nome completo</FormLabel>
                <Input ref={nome} type="text" />
              </FormControl>
            </Box>

            <Box mb="2rem">
              <FormControl isRequired>
                <FormLabel>Data de Nascimento</FormLabel>
                <Input ref={data_nascimento} type="date" />
              </FormControl>
            </Box>

            <Box mb="2rem">
              <FormControl isRequired>
                <FormLabel>CPF</FormLabel>
                <Input ref={doc_cpf} type="text" />
              </FormControl>
            </Box>

            <Flex gap="2rem">
              <Box mb="2rem">
                <FormControl isRequired>
                  <FormLabel>E-mail</FormLabel>
                  <Input ref={email} type="email" />
                </FormControl>
              </Box>
              <Box mb="2rem">
                <FormControl isRequired>
                  <FormLabel>Nome de Usuário</FormLabel>
                  <Input ref={usuario} type="text" />
                </FormControl>
              </Box>
              <Box mb="2rem">
                <FormControl isRequired>
                  <FormLabel>Senha</FormLabel>
                  <Input ref={senha} type="password" />
                </FormControl>
              </Box>
            </Flex>

            <Flex
              justifyContent="center"
              alignItems="start"
              flexDirection="column"
            >
              <FormControl isRequired>
                <Checkbox variant={"solid"}>
                  Li e concordo com os{" "}
                  <Link color="blue" onClick={openModal}>
                    Termos de Uso e Políticas de Privacidade
                  </Link>
                  .
                </Checkbox>
              </FormControl>
              <Checkbox ref={check_termo_opcional_1} variant={"solid"}>
                Termo opcional 1.
              </Checkbox>
            </Flex>

            <Flex justifyContent="center" alignItems="center">
              <Button mt={4} colorScheme="blue" type="submit">
                Cadastrar
              </Button>
            </Flex>
          </form>
        </Box>
      </Flex>
      <ModalTermos isOpen={isOpen} onClose={closeModal} />
    </Flex>
  );
}
