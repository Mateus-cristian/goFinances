import React from 'react'
import { Text, Image, View } from 'react-native'
import HighlightCard from '../../components/HighlightCard'
import { TransactionCard, TransactionCardProps } from '../../components/HighlightCard/TransactionCard'
import { TransactionsList } from '../../components/HighlightCard/TransactionCard/styles'
import {
    Transactions, Title, Container, Header, UserWrapper, UserInfo, Photo, User, UserGreeting, UserName, Icon, HighlightCards
} from './styles'

export interface DataListProps extends TransactionCardProps {
    id: string
};

function Dashboard() {
    const data: DataListProps[] = [{
        id: '1',
        type: 'positive',
        title: 'Desenvolvimento de sites',
        amount: "12.000,00",
        category: {
            name: 'Vendas',
            icon: 'dollar-sign'
        },
        date: "10/10/2022"
    },
    {
        id: '2',
        type: 'negative',
        title: 'Aluguel da casa',
        amount: "5.000,00",
        category: {
            name: 'Compras',
            icon: 'shopping-bag'
        },
        date: "11/10/2022"
    },
    {
        id: '3',
        type: 'negative',
        title: 'MC donaids',
        amount: "4.000,00",
        category: {
            name: 'Alimentação',
            icon: 'coffee'
        },
        date: "12/10/2022"
    }

    ]

    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source={require("../../assets/eu.jpg")} />
                        <User>
                            <UserGreeting>Olá,</UserGreeting>
                            <UserName>Mateus</UserName>
                        </User>
                    </UserInfo>
                    <Icon name='power' />
                </UserWrapper>
            </Header>
            <HighlightCards >
                <HighlightCard type='up' title="Entradas" amount="17.400,00" lastTransaction='Última entrada dia 13 de abril' />
                <HighlightCard type='down' title="Saidas" amount="2.400,00" lastTransaction='Última saida dia 14 de abril' />
                <HighlightCard type='total' title="Total" amount="14.300,00" lastTransaction='Último calculo dia 14 de abril' />
            </HighlightCards>

            <Transactions>
                <Title>Listagem</Title>

                <TransactionsList
                    data={data}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <TransactionCard key={item.id} data={item} />}
                />


            </Transactions>
        </Container>

    )
}



export default Dashboard


