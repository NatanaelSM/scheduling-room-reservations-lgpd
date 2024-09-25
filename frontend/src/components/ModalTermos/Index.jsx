import { Modal, Button, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Text, Box } from "@chakra-ui/react";

export const ModalTermos = ({ isOpen, onClose }) => {

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader align='center' color='blue'>Termo de Uso e Política de Privacidade</ModalHeader>
        <ModalBody >
          <Box
            height='60vh'
            overflow='auto'>
            <Text color='black'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium pariatur amet exercitationem voluptatem magni dolore vero cumque deleniti, sunt numquam ipsa dolor facere eius velit. Sed id iure esse veritatis?</Text>
            <Text color='black'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus quia expedita sed! Ex aspernatur atque ullam expedita temporibus quo similique magni optio. Esse non eos neque cupiditate consequuntur, at officiis.
              Voluptatem dicta sint odio tempore atque debitis minus nam aspernatur facere ea optio tempora laboriosam, nostrum quisquam placeat, reprehenderit exercitationem, nulla assumenda deserunt eaque aliquid ex mollitia vitae magnam? Magnam.</Text>
            <Text color='black'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus dicta enim non, alias quibusdam ducimus natus sapiente illum velit magni voluptate perspiciatis quidem minima ab vero. Maxime quaerat quod adipisci.
              Sed maiores quasi veritatis temporibus voluptates rerum veniam molestias placeat, totam, eius vitae? Magni, id cupiditate repellendus ullam sint, totam suscipit culpa natus odit quod voluptate tenetur dolorem rem expedita.
              Officia aperiam autem unde repudiandae reprehenderit sequi aut fugiat maxime molestias, natus pariatur sit velit deleniti odio ad ipsa ullam quo, nulla accusamus nemo beatae neque, harum repellat! Voluptate, soluta.</Text>
          </Box>

        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}