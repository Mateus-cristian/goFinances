import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import HighlightCard from '../../components/HighlightCard'
import { TransactionCard, TransactionCardProps } from '../../components/HighlightCard/TransactionCard'
import { TransactionsList } from '../../components/HighlightCard/TransactionCard/styles'
import {
    Transactions, LoadContainer, LogoutButton, Title, Container, Header, UserWrapper, UserInfo, Photo, User, UserGreeting, UserName, Icon, HighlightCards
} from './styles'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native'
import { useTheme } from 'styled-components'
import { useAuth } from '../../hooks/auth'


export interface DataListProps extends TransactionCardProps {
    id: string
};

interface HighlightData {
    entries: string;
    expensives: string;
    total: string;
    lastTransactionEntriesDate: string;
    lastTransactionExpansiveDate: string;
    totalTransactions: string;
}

function Dashboard() {
    const { signOut, user } = useAuth()

    const [isLoading, setIsLoading] = useState(true)
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const dataKey = `@goFinance:transactions_user:${user.id}`;
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData)

    const theme = useTheme()


    function getLastTransactionData(collection: DataListProps[], type: 'positive' | 'negative') {

        const collectionFiltered = collection.filter(transaction => transaction.type === type);

        if (collectionFiltered.length === 0) {
            return 0;
        }
        const lastTransaction = new Date(
            Math.max.apply(Math, collectionFiltered
                .map((y) => new Date(y.date).getTime()))
        )


        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`

    }


    // Função que carrega os dados da página 
    async function loadTransactions() {
        const response = await AsyncStorage.getItem(dataKey);
        const transactions: DataListProps[] = response ? JSON.parse(response) : [];
        let entriesTotal = 0;
        let expensiveTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions.map((item: DataListProps) => {

            if (item.type === 'positive') {
                entriesTotal += Number(item.amount)
            } else {
                expensiveTotal += Number(item.amount)
            }

            const amount = Number(item.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).format(new Date(item.date))

            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date
            }
        })

        setTransactions(transactionsFormatted)
        const totalAmount = entriesTotal - expensiveTotal
        const lastTransactionEntries = getLastTransactionData(transactions, 'positive')
        const lastTransactionExpensive = getLastTransactionData(transactions, 'negative')
        const totalInterval = `01 a ${lastTransactionExpensive}`

        setHighlightData({
            entries:
                entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
            expensives:
                expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }),
            total:
                totalAmount.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }),
            lastTransactionEntriesDate: lastTransactionEntries === 0 ? '' : `Última entrada dia ${lastTransactionEntries}`,
            lastTransactionExpansiveDate: lastTransactionExpensive === 0 ? '' : `Última saída dia ${lastTransactionExpensive}`,
            totalTransactions: (lastTransactionEntries && lastTransactionExpensive) ? totalInterval : ''
        })

        setIsLoading(false)
    }


    //deleta um card na HOME
    async function deleteCard(id: string) {

        const response = await AsyncStorage.getItem(dataKey);
        if (response) {
            // converte para array
            const convertedResponseInArray = JSON.parse(response)
            //filtra pelas transaction menos a passada
            const filterPayments = convertedResponseInArray.filter((transaction: any) => transaction.id !== id);
            //converte em string para guardar no storage novamente
            const convertedArrayToString = JSON.stringify(filterPayments)

            AsyncStorage.setItem(dataKey, convertedArrayToString);
            //carrega as transações para atualizar a página
            loadTransactions()
        }

    }

    useEffect(() => {
        loadTransactions()

    }, [])

    useFocusEffect(useCallback(() => {
        loadTransactions()
    }, []))

    return (
        <Container>
            {
                isLoading ?
                    <LoadContainer>
                        <ActivityIndicator color={theme.colors.secondary} size='large' />
                    </LoadContainer> :
                    <>
                        <Header>
                            <UserWrapper>
                                <UserInfo>
                                    <Photo source={{ uri: user.photo }} />
                                    <User>
                                        <UserGreeting>Olá,</UserGreeting>
                                        <UserName>{user.name}</UserName>
                                    </User>
                                </UserInfo>
                                <LogoutButton onPress={signOut}>
                                    <Icon name='power' />
                                </LogoutButton>
                            </UserWrapper>
                        </Header>
                        <HighlightCards >
                            <HighlightCard type='up' title="Entradas" amount={highlightData.entries} lastTransaction={highlightData.lastTransactionEntriesDate} />
                            <HighlightCard type='down' title="Saidas" amount={highlightData.expensives} lastTransaction={highlightData.lastTransactionExpansiveDate} />
                            <HighlightCard type='total' title="Total" amount={highlightData.total} lastTransaction={highlightData.totalTransactions} />
                        </HighlightCards>

                        <Transactions>
                            <Title>Listagem</Title>

                            <TransactionsList
                                data={transactions}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => <TransactionCard key={item.id} data={item} deleteCard={deleteCard} />}
                            />


                        </Transactions>
                    </>
            }
        </Container>

    )
}



export default Dashboard


