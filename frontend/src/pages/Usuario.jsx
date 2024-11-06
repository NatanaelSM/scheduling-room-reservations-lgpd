import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { CardUsuario } from "../components/CardUsuario";


export function Usuario({ token }) {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        fetchUsuario();
    }, [token]);

    const fetchUsuario = async () => {
        try {
            const req = await axios.get('http://localhost:8800/usuario/:id', { 
                headers: { Authorization: token },
                
            });
            const usuario = req.data;
            setUsuario(usuario);
        } catch (error) {
            console.log("erro ao buscar usuário", error);
        }
    };

    return (
        <>
            <Flex wrap='wrap' px='6rem' mt='4rem' justifyContent={"center"}>
                {usuario && <CardUsuario usuario={usuario} />}
            </Flex>
        </>
    );
}