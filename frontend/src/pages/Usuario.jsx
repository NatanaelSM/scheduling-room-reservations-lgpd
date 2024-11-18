import { Flex, Text } from "@chakra-ui/react";
import { FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export function Usuario() {

  return (
    <Flex
      justifyContent='center'
      alignItems='center'
      h='85vh'>
      <Flex
        border='1px solid black'
        h='20rem'
        w='30rem'
        bg='#07022C'
        borderRadius='2rem'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        gap='3rem'>

        <Link style={{
          color: "black",
          textDecoration: 'none',
          width: "70%",
          height: "5rem",
          display: "flex",
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "0.5rem"
        }}
          to="/usuario/excluir">
          <Text mr='9rem'>Excluir Usuário</Text>
          <FaChevronRight />
        </Link>

        <Link
          style={{
            color: "black",
            textDecoration: 'none',
            width: "70%",
            height: "5rem",
            display: "flex",
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "0.5rem"
          }}
          to="/usuario/editar">
          <Text mr='9rem'>Editar Usuário</Text>
          <FaChevronRight />
        </Link>

      </Flex>
    </Flex>
  )
}