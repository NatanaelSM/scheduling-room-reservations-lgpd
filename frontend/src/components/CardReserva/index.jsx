import { Card, CardBody, Stack, Text, Flex } from "@chakra-ui/react";
import { PerfilUsuario } from "../PerfilUsuario";

export function CardReserva({ reserva }) {

    const formatarData = () => {
        const date = new Date(reserva.data_uso)
        const dataFormatada = date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        return dataFormatada
    }

    return (
        <Card
            w='20rem'
            mx='1rem'
            mb='2rem'>
            <CardBody>
                <Flex justifyContent='center'>
                    <PerfilUsuario nomeUsuario={'teste'} />
                </Flex>
                <Stack mt='6' spacing='3'>
                    <Text fontWeight='bold'>Nome da sala: {reserva.nome_sala}</Text>
                    <Text fontWeight='bold'>local da sala: {reserva.local_sala}</Text>
                    <Text fontWeight='bold'>Data: {formatarData()}</Text>
                    <Text fontWeight='bold'>Hora inicial: {reserva.hora_inicio_uso}</Text>
                    <Text fontWeight='bold'>Hora final: {reserva.hora_final_uso}</Text>
                    <Text fontWeight='bold'>Responsável: {reserva.responsavel}</Text>
                </Stack>
            </CardBody>
        </Card>
    )
}