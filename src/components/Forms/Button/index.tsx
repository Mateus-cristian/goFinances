import React from 'react'

import { TouchableOpacityProps } from 'react-native'
import { Container, Title } from './styles'

interface Props extends TouchableOpacityProps {
    title: string;

}

function Button({ title, ...rest }: Props) {

    return (
        <Container>
            <Title {...rest}>
                {title}
            </Title>
        </Container>
    )
}

export default Button