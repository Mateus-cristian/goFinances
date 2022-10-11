import React from 'react'
import { TouchableOpacityProps } from 'react-native';
import { Container, Icon, Title } from './styles'

interface Props extends TouchableOpacityProps {
    title: string;
    type: 'up' | 'down'
    isActive: boolean;
}

const icons: any = {
    up: 'arrow-up-circle',
    down: 'arrow-down-circle'
}
function TransactionTypeButton({ title, type, isActive, ...rest }: Props) {
    return (
        <Container isActive={isActive} type={type}>
            <Icon name={icons[type]} type={type} />
            <Title {...rest} >
                {title}
            </Title>
        </Container>
    )
}

export default TransactionTypeButton