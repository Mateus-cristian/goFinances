import React from "react";

import { Container, Title, Amount, Category, Icon, CategoryName, Date, Footer } from './styles'

type Category = {
    name: string;
    icon: string;
}

export interface TransactionCardProps {
    title: string;
    amount: string;
    category: Category;
    date: string;
    type: 'positive' | 'negative'
}

interface Props {
    data: TransactionCardProps;
}


export function TransactionCard({ data }: Props) {
    return <Container>
        <Title>
            {data.title}
        </Title>
        <Amount type={data.type}>
            {data.type === 'negative' ? '- ' : ''}
            R$ {
                data.amount}
        </Amount>
        <Footer>
            <Category>
                <Icon name={data.category.icon} />
                <CategoryName>
                    {data.category.name}
                </CategoryName>
            </Category>

            <Date>
                {data.date}
            </Date>
        </Footer>

    </Container>
}