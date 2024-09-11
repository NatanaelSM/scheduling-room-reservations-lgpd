import { Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export function BtnNavbar({ nome, direcionar }) {

    return (
        <Flex
            justifyContent='center'
            alignItems='center'
            w='11rem'
            px='2rem'>
            <Link to={direcionar}>{nome}</Link>
        </Flex>
    )

}