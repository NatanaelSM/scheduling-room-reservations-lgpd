import { Flex, Heading, Box, FormControl, FormLabel, Input, Button, Textarea } from "@chakra-ui/react"
import { useRef } from "react"
import axios from "axios";

export function Formulario({ token }) {

    const nome_sala = useRef(null);
    const local_sala = useRef(null);
    const data_uso = useRef(null);
    const hora_inicio_uso = useRef(null);
    const hora_final_uso = useRef(null);
    const responsavel = useRef(null);
    const motivo_uso = useRef(null);
    const info_gerais = useRef(null);
    const convidados = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dadosReserva = {
            nome_sala: nome_sala.current.value,
            local_sala: local_sala.current.value,
            data_uso: data_uso.current.value,
            hora_inicio_uso: hora_inicio_uso.current.value,
            hora_final_uso: hora_final_uso.current.value,
            responsavel: responsavel.current.value,
            motivo_uso: motivo_uso.current.value,
            info_gerais: info_gerais.current.value,
            convidados: convidados.current.value,
        };
        
        try {
            const req = await axios.post("http://localhost:8800/addReserva", dadosReserva, {
                headers: { Authorization: token },
            });


            nome_sala.current.value = "";
            local_sala.current.value = "";
            data_uso.current.value = "";
            hora_inicio_uso.current.value = "";
            hora_final_uso.current.value = "";
            responsavel.current.value = "";
            motivo_uso.current.value = "";
            info_gerais.current.value = "";
            convidados.current.value = "";
        } catch (error) {
            console.log("Erro ao fazer a reserva:", error);
        }
    }


    return (
        <Flex
            justifyContent='center'
            alignItems='center'
            w='100%'
            h='100vh'>
            <Flex
                bg='#07012C'
                w='60rem'
                borderRadius='2rem'
                boxShadow='4px 5px 4px 0px rgba(0, 0, 0, 0.50)'
                direction='column'
                alignItems='center'
                justifyContent='center'
                p='2rem'>
                <Flex
                    h='20%'
                    justifyContent='center'
                    alignItems='center'>
                    <Heading>Reservar Sala</Heading>
                </Flex>
                <Box
                    h='80%'
                    w='100%'>
                    <form onSubmit={handleSubmit}>
                        <Box
                            mb='2rem'>
                            <FormControl isRequired>
                                <FormLabel>Nome da sala</FormLabel>
                                <Input ref={nome_sala} type='text' />
                            </FormControl>
                        </Box>

                        <Box
                            mb='2rem'>
                            <FormControl isRequired>
                                <FormLabel>Responsável da sala</FormLabel>
                                <Input ref={responsavel} type='text' />
                            </FormControl>
                        </Box>

                        <Box
                            mb='2rem'>
                            <FormControl isRequired>
                                <FormLabel>Local da sala</FormLabel>
                                <Input ref={local_sala} type='text' />
                            </FormControl>
                        </Box>

                        <Flex
                            gap='2rem'>
                            <Box
                                mb='2rem'>
                                <FormControl isRequired>
                                    <FormLabel>Data de uso</FormLabel>
                                    <Input ref={data_uso} type='date' />
                                </FormControl>
                            </Box>
                            <Box
                                mb='2rem'>
                                <FormControl isRequired>
                                    <FormLabel>Início do uso</FormLabel>
                                    <Input ref={hora_inicio_uso} type='time' />
                                </FormControl>
                            </Box>
                            <Box
                                mb='2rem'>
                                <FormControl isRequired>
                                    <FormLabel>Final do uso</FormLabel>
                                    <Input ref={hora_final_uso} type='time' />
                                </FormControl>
                            </Box>
                        </Flex>

                        <Box
                            mb='2rem'>
                            <FormControl isRequired>
                                <FormLabel>Motivo do uso</FormLabel>
                                <Textarea ref={motivo_uso} />
                            </FormControl>
                        </Box>

                        <Box
                            mb='2rem'>
                            <FormControl isRequired>
                                <FormLabel>Informações gerais</FormLabel>
                                <Textarea ref={info_gerais} />
                            </FormControl>
                        </Box>

                        <Box
                            mb='2rem'>
                            <FormControl isRequired>
                                <FormLabel>Convidados</FormLabel>
                                <Input ref={convidados} type='text' />
                            </FormControl>
                        </Box>

                        <Flex
                            justifyContent='center'
                            alignItems='center'>
                            <Button
                                mt={4}
                                colorScheme='green'
                                type='submit'>
                                Registrar
                            </Button>
                        </Flex>
                    </form>
                </Box>
            </Flex>
        </Flex>
    )

}