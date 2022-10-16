import React from 'react'
import { TouchableOpacityProps } from 'react-native';
import { Container, Icon, Title } from './styles'

interface Props extends TouchableOpacityProps {
    title: string;
    type: 'positive' | 'negative'
    isActive: boolean;
}

const icons: any = {
    positive: 'arrow-up-circle',
    negative: 'arrow-down-circle'
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