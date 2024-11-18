import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  IconButton,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { MdEdit } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa";
import axios from "axios";
import { PerfilUsuario } from "../PerfilUsuario";
import { useState, useEffect } from "react";
import { ModalUpdate } from "../ModalUpdate";

export function FormUpdateUser({ token }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [campoAtualizar, setCampoAtualizar] = useState("");
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    fetchUsuario();
  }, [token]);

  const fetchUsuario = async () => {
    try {
      const req = await axios.get(`http://localhost:8800/getUsuario`, {
        headers: { Authorization: token },

      });
      console.log(req.data);
      const usuario = req.data;
      setUsuario(usuario);
    } catch (error) {
      console.log("erro ao buscar usuário", error);
    }
  };

  const handleOpenModal = (campo) => {
    setCampoAtualizar(campo);
    onOpen();
  };

  const handleSave = async (campo, novoValor) => {
    try {
      const dadosAtualizados = {
        usuario: campo === "usuario" ? novoValor : usuario.usuario,
        data_nascimento:
          campo === "data_nascimento" ? novoValor : usuario.data_nascimento,
        email: campo === "email" ? novoValor : usuario.email,
        senha: campo === "senha" ? novoValor : usuario.senha,
      };
  
      const response = await axios.put(
        "http://localhost:8800/updateUsuario",
        dadosAtualizados,
        {
          headers: { Authorization: token },
        }
      );
  
      if (response.status === 200) {
        console.log(response.data.message);
        
        await fetchUsuario();
      }
    } catch (error) {
      if (error.response) {
        console.error("Erro ao atualizar o usuário:", error.response.data);
      } else if (error.request) {
        console.error("Sem resposta do servidor:", error.request);
      } else {
        console.error("Erro na configuração da requisição:", error.message);
      }
    }
  };

  return (
    <Flex justifyContent="center" alignItems="center" w="100%" h="100vh">
      <Flex
        bg="#07012C"
        borderRadius="2rem"
        boxShadow="4px 5px 4px 0px rgba(0, 0, 0, 0.50)"
        direction="column"
        alignItems="center"
        justifyContent="center"
        p="2rem"
      >
        <Flex justifyContent="center">
          {usuario && <PerfilUsuario nomeUsuario={usuario.usuario} />}
        </Flex>
        <Box h="80%" w="100%">
          <Box mb="2rem">
            <FormLabel>Nome</FormLabel>
            <Input isReadOnly type="text" value={usuario?.nome || ''} />
          </Box>

          <Box mb="2rem">
            <FormLabel>CPF</FormLabel>
            <Input isReadOnly type="text" value={usuario?.doc_cpf || ''} />
          </Box>

          <Box mb="2rem">
            <FormControl>
              <FormLabel>Usuario</FormLabel>
              <InputGroup>
                <Input isReadOnly type="text" value={usuario?.usuario || ''} />
                <InputRightElement>
                  <IconButton
                    bg={0}
                    _hover={{ bg: 0 }}
                    onClick={() => handleOpenModal("usuario")}
                    icon={<MdEdit color="white" />}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>

          <Box mb="2rem">
            <FormControl>
              <FormLabel>Data de Nascimento</FormLabel>
              <InputGroup>
                <Input isReadOnly type="date" value={usuario?.data_nascimento || ''} />
                <InputRightElement>
                  <IconButton
                    bg={0}
                    _hover={{ bg: 0 }}
                    onClick={() => handleOpenModal("data_nascimento")}
                    icon={<MdEdit color="white" />}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>

          <Box mb="2rem">
            <FormControl>
              <FormLabel>Email</FormLabel>
              <InputGroup>
                <Input isReadOnly type="text" value={usuario?.email || ''} />
                <InputRightElement>
                  <IconButton
                    bg={0}
                    _hover={{ bg: 0 }}
                    onClick={() => handleOpenModal("email")}
                    icon={<MdEdit color="white" />}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>

          <Box mb="2rem">
            <FormLabel>Senha</FormLabel>
            <Button
              variant="outline"
              bg="white"
              onClick={() => handleOpenModal("senha")}
            >
              Alterar Senha <FaChevronRight />
            </Button>
          </Box>
        </Box>
      </Flex>

      {isOpen && (
        <ModalUpdate
          isOpen={isOpen}
          onClose={onClose}
          campo={campoAtualizar}
          onSave={handleSave}/>
      )}

    </Flex>
  );

}
