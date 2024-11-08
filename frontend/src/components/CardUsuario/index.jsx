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

export function CardUsuario({ usuario, id, handleDelete, token }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8800/deleteUsuario`, {
                headers: { Authorization: token },
            });
            toast({
                title: "Usuário excluído",
                description: "O usuário foi excluído com sucesso.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            onClose();
            handleDelete(usuario.id); 
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

    return (
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
    );
}
