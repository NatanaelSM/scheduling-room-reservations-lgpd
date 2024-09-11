import { Flex, Heading } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export function PerfilUsuario({ nomeUsuario }) {
    const [iniciais, setIniciais] = useState('');

    useEffect(() => {
        getIniciais();
    }, []);

    const getIniciais = () => {
        const nome = nomeUsuario?.split('');

        if (nome && nome.length > 0) {
            const iniciaisNome = nome[0].toLowerCase() + nome[1].toLowerCase();
            setIniciais(iniciaisNome);
        } else {
            setIniciais('');
        }
    };

    return (
        <Flex
            justifyContent='center'
            alignItems='center'
            borderRadius='2rem'
            w='4rem'
            h='4rem'
            bg='blue'>
            <Heading color='white'>{iniciais}</Heading>
        </Flex>
    );
}
