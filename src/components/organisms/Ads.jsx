import PropTypes from "prop-types"
import { Box, Button, Flex, Heading, Image, Text, VStack } from "@chakra-ui/react";
import cashboxImg from "../../assets/cashbox.png"

export default function Ads({ title, text }) {
    return (
        <Flex w='100%' bg='blue' p={6} align='center' borderRadius='lg' justify='space-between'>
            <VStack align='flex-start' spacing={8}>
                <Text color='white' fontSize='md'>{ title }</Text>
                <Heading color='white' size='md' >{ text }</Heading>
                <Button bg='white' color='blue'>Learn more</Button>
            </VStack>
            <Box>
                <Image src={ cashboxImg } />
            </Box>
        </Flex>
    )
}

Ads.defaultProps = {
    text: "",
    title: "",
}

Ads.propTypes = {
    text: PropTypes.string,
    title: PropTypes.string,
}
