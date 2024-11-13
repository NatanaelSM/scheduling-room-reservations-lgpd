import {
    Card,
    CardBody,
    Stack,
    Text,
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Box,
    useToast
} from "@chakra-ui/react";
import { PerfilUsuario } from "../PerfilUsuario";
import axios from "axios";
import React, { useState, useEffect } from "react";

export function CardUsuario({ token, handleLogout }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
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
            setUsuario(req.data);
        } catch (error) {
            console.log("erro ao buscar usuário", error);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8800/deleteUsuario/${usuario.id}`, { // Supondo que `usuario` tenha uma propriedade `id`
                headers: { Authorization: token },
            });

            localStorage.removeItem('token');
            localStorage.removeItem('role');

            toast({
                title: "Usuário excluído",
                description: "O usuário foi excluído com sucesso.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            handleLogout();

        } catch (error) {
            console.error("Erro ao excluir usuário:", error);
            toast({
                title: "Erro",
                description: "Houve um erro ao excluir o usuário.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    if (!usuario) {
        return <Text>Carregando usuário...</Text>;
    }

    return (
        <Flex
            justifyContent='center'
            alignItems='center'
            h='80vh'>
            <Card w="30rem" mx="1rem" mb="2rem">
                <CardBody>
                    <Flex justifyContent="center">
                        <PerfilUsuario nomeUsuario={usuario.usuario} />
                    </Flex>
                    <Stack mt="6" spacing="3">
                        <Text fontWeight="bold">Nome completo: {usuario.nome}</Text>
                        <Text fontWeight="bold">Data de Nascimento: {usuario.data_nascimento}</Text>
                        <Text fontWeight="bold">CPF: {usuario.doc_cpf}</Text>
                        <Text fontWeight="bold">E-mail: {usuario.email}</Text>
                        <Text fontWeight="bold">Nome de Usuário: {usuario.usuario}</Text>
                    </Stack>
                    <Flex marginTop={3}>
                        <Button onClick={onOpen} colorScheme="red">Excluir conta</Button>

                        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                            <ModalOverlay />
                            <ModalContent color="black">
                                <ModalHeader>Excluir conta</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <Box>
                                        <Text fontWeight="bold" mb="1rem">
                                            Deseja realmente excluir o usuário?
                                        </Text>
                                    </Box>
                                </ModalBody>
                                <ModalFooter>
                                    <Button mr={3} onClick={onClose}>
                                        Cancelar
                                    </Button>
                                    <Button colorScheme="red" onClick={handleConfirmDelete}>
                                        Excluir
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </Flex>
                </CardBody>
            </Card>
        </Flex>

    );
}