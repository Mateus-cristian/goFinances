import React from "react";
import { categories } from "../../../utils/categories";

import { Container, Header, ContainerIcons, Title, Amount, Category, Icon, CategoryName, Date, Footer } from './styles'
import { FontAwesome } from '@expo/vector-icons'

export interface TransactionCardProps {
    id: string;
    name: string;
    amount: string;
    category: string;
    date: string;
    type: 'positive' | 'negative'
}

interface Props {
    data: TransactionCardProps;
    deleteCard: (id: string) => void;
    editCard: (id: string) => void;
}


export function TransactionCard({ data, deleteCard, editCard }: Props) {

    const category = categories.filter(
        item => item.key === data.category
    )[0];



    return <Container>
        <Header>
            <Title>
                {data.name}
            </Title>
            <ContainerIcons>
                <Icon onPress={() => editCard(data.id)} style={{ paddingTop: 2 }}>
                    <FontAwesome name='edit' size={24} />
                </Icon>
                <Icon onPress={() => deleteCard(data.id)}>
                    <FontAwesome name='trash' size={24} />
                </Icon>
            </ContainerIcons>
        </Header>
        <Amount type={data.type}>
            {data.type === 'negative' ? '-' : ''}
            {
                data.amount}
        </Amount>
        <Footer>
            <Category>
                <Icon name={category.icon} />
                <CategoryName>
                    {category.name}
                </CategoryName>
            </Category>

            <Date>
                {data.date}
            </Date>
        </Footer>

    </Container>
}