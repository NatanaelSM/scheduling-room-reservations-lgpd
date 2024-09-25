import React, { useState } from 'react';
import { Flex, Heading, Box, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import axios from "axios";

export function Login({ setToken }) {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await axios.post('http://localhost:8800/login', { usuario, senha });

            if (response.status == 200) {
                setToken(response.data.token)
            } else {
                alert('Login falhou!');
            }
        } catch (error) {
            console.error('Erro na rota!');
        }
    };

    return (
        <Flex justifyContent='center' alignItems='center' w='100%' h='100vh'>
            <Flex
                bg='#07012C'
                w='30rem'
                h='28rem'
                borderRadius='2rem'
                boxShadow='4px 5px 4px 0px rgba(0, 0, 0, 0.50)'
                direction='column'
                alignItems='center'
                justifyContent='center'
                p='2rem'>
                <Flex h='20%' justifyContent='center' alignItems='center'>
                    <Heading color='white'>Login</Heading>
                </Flex>
                <Box h='80%' w='100%'>
                    <form onSubmit={handleSubmit}>
                        <Box mb='2rem'>
                            <FormControl isRequired>
                                <FormLabel color='white'>Usuário</FormLabel>
                                <Input
                                    placeholder="Usuario0102"
                                    type='text'
                                    value={usuario}
                                    onChange={(e) => setUsuario(e.target.value)}
                                />
                            </FormControl>
                        </Box>

                        <Box mb='2rem'>
                            <FormControl isRequired>
                                <FormLabel color='white'>Senha</FormLabel>
                                <Input
                                    type='password'
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                />
                            </FormControl>
                        </Box>

                        <Flex justifyContent='center' alignItems='center'>
                            <Button mt={4} colorScheme='green' type='submit'>
                                Entrar
                            </Button>
                        </Flex>
                    </form>
                </Box>
            </Flex>
        </Flex>
    );
}
