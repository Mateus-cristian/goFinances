import React from 'react'
import { Container, Title, Amount } from './styles'

interface Props {
    title: string;
    amount: string;
    color: string;
}

export default function HistoryCard({ amount, color, title }: Props) {
    return (
        <Container color={color}>
            <Title>{title}</Title>
            <Amount>{amount}</Amount>
        </Container>
    )
}
