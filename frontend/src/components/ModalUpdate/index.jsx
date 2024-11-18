import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Input, Button } from "@chakra-ui/react";
import { useState } from "react";

export function ModalUpdate({ isOpen, onClose, campo, onSave }) {
  const [value, setValue] = useState("");

  const getInputType = () => {
    switch (campo) {
      case "senha":
        return "password";
      case "email":
        return "email";
      case "data_nascimento":
        return "date";
      default:
        return "text";
    }
  };

  const handleSave = () => {
    onSave(campo, value);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color={"black"}>Atualizar {campo}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            type={getInputType()}
            color={"black"}
            placeholder={`Digite o novo ${campo}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button mt="1rem" mr="1rem" colorScheme="teal" onClick={handleSave}>
            Salvar
          </Button>
          <Button mt="1rem" colorScheme="red" onClick={onClose}>
            Fechar
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
