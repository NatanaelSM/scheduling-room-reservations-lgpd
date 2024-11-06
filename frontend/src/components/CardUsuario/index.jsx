import { Card, CardBody, Stack, Text, Flex } from "@chakra-ui/react";
import { PerfilUsuario } from "../PerfilUsuario";

export function CardUsuario ({usuario}) {

return (
    <Card 
    w='30rem'
    mx='1rem'
    mb='2rem'>
        <CardBody>
                <Flex justifyContent='center'>
                    <PerfilUsuario nomeUsuario={'Pedro'} />
                </Flex>
                <Stack mt='6' spacing='3'>
                    <Text fontWeight='bold'>Nome completo: {usuario.nome}</Text>
                    <Text fontWeight='bold'>Data de Nascimento: {usuario.data_nascimento}</Text>
                    <Text fontWeight='bold'>CPF: {usuario.doc_cpf}</Text>
                    <Text fontWeight='bold'>E-mail: {usuario.email}</Text>
                    <Text fontWeight='bold'>Nome de Usuário: {usuario.usuario}</Text>
                </Stack>
            </CardBody>
    </Card> 
)
}