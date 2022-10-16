import React from 'react'
import { Container, Header, Title, Icon, Footer, Amount, LastTransaction } from './styles'

interface Props {
    title: string;
    amount: string;
    lastTransaction: string;
    type: 'up' | 'down' | 'total'
}

const icon = {
    up: 'arrow-up-circle',
    down: 'arrow-down-circle',
    total: 'dollar-sign'
}

export default function HighlightCard({
    title,
    amount,
    lastTransaction,
    type
}: Props) {
    return (
        <Container>
            <Header>
                <Title>{title}</Title>
                <Icon name={icon[type]} type={type} />
            </Header>

            <Footer>
                <Amount>{amount}</Amount>
                <LastTransaction>{lastTransaction}</LastTransaction>
            </Footer>
        </Container>
    )
}
