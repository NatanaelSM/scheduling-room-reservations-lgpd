import { Flex, Input } from "@chakra-ui/react";
import { CardReserva } from "../components/CardReserva";
import { useEffect, useState } from "react";
import axios from "axios";


export function Home({ token }) {
    const [reservas, setReservas] = useState([]);
    const [filtroNomeSala, setFiltroNomeSala] = useState("");

    useEffect(() => {
        fetchReservas();
    }, [token]);

    const fetchReservas = async () => {
        try {
            const req = await axios.get('http://localhost:8800/reservas',{
                headers: { Authorization: token },
            });

            const reservas = req.data;
            reservas.sort((a, b) => new Date(a.data_uso) - new Date(b.data_uso));
            setReservas(reservas);
        } catch (error) {
            console.log("erro");

        }
    };

    const handleFiltroNomeSalaChange = (e) => {
        setFiltroNomeSala(e.target.value);
    };

    return (
        <>
            <Flex pl='7rem' mt='2rem' w='30%'>
                <Input
                    bg='white'
                    pr='4.5rem'
                    type="text"
                    placeholder='Filtrar...'
                    color='black'
                    value={filtroNomeSala}
                    onChange={handleFiltroNomeSalaChange}
                />
            </Flex>

            <Flex wrap='wrap' px='6rem' mt='2rem'>
                {reservas
                    .filter(reserva => reserva.nome_sala.toLowerCase().includes(filtroNomeSala.toLowerCase()))
                    .map((reserva, index) => (
                        <CardReserva key={index} reserva={reserva} />
                    ))}
            </Flex>
        </>
    );
}
