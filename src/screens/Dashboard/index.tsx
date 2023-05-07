import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import HighlightCard from '../../components/HighlightCard'
import { TransactionCard, TransactionCardProps } from '../../components/HighlightCard/TransactionCard'
import { TransactionsList } from '../../components/HighlightCard/TransactionCard/styles'
import {
    Transactions, LoadContainer, LogoutButton, Title, Container, Header, UserWrapper, UserInfo, Photo, User, UserGreeting, UserName, Icon, HighlightCards
    , ModalContent, ModalWrapper
} from './styles'

import { ActivityIndicator, Alert, View } from 'react-native'
import { useTheme } from 'styled-components'
import { useAuth } from '../../hooks/auth'

import { useNavigation } from '@react-navigation/native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { RootStackParamList } from '../../@types/types'

import { collection, deleteDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore";
import { database } from '../../../config/firebase'
import Button from '../../components/Forms/Button'
import ButtonDate from '../../components/Forms/ButtonDate'
import { formatDate } from '../../utils/date'

import IconSvg from '@expo/vector-icons/FontAwesome5';

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

    const [openModal, setOpenModal] = useState(false);
    const navigation = useNavigation<NavigationProp<RootStackParamList, 'Cadastrar'>>();

    const theme = useTheme()
    const [antDate, setAntDate] = useState<Date | null>(null);
    const [postDate, setPostDate] = useState<any>(null);

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
    async function loadTransactions(dataFilter?: any) {

        let returnDataFirebase: any[] = []
        if (!dataFilter) {
            const collectTransactions = collection(database, "transactions");
            const queryGetTransactions = query(collectTransactions, where("user", "==", dataKey));
            const querySnapshot = await getDocs(queryGetTransactions);
            querySnapshot.forEach((doc) => {
                returnDataFirebase.push(doc.data())
            });
        } else {
            returnDataFirebase = dataFilter;
        };

        const transactions: DataListProps[] = returnDataFirebase;
        let entriesTotal = 0;
        let expensiveTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions.map((item: DataListProps) => {
            const dateFormatted = new Date(item.date).toISOString();

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
            }).format(new Date(dateFormatted))

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

    const searchDocument = async (idDoc: string) => {
        let transaction = {};

        // Faz a busca pela coleção passando a query  
        const collectTransaction = collection(database, "transactions");
        const queryGetTransactions = query(collectTransaction, where("user", "==", dataKey), where("id", "==", idDoc));
        const querySnapshot = await getDocs(queryGetTransactions);

        querySnapshot.forEach((doc) => {
            if (doc.data()) {
                transaction = doc.data()
                transaction = { ...transaction, docId: doc.id }
            }
        });

        return transaction;
    }

    //deleta um card na HOME
    async function deleteCard(id: string) {
        const transaction: any = await searchDocument(id);

        const idRef = await doc(database, "transactions", transaction.docId);

        await deleteDoc(idRef);
        await loadTransactions();
    }

    async function editCard(id: string) {
        const transaction: any = await searchDocument(id);
        // se existir vai para a pagina de cadastro de transações com as propriedades
        if (transaction) {
            navigation.navigate('Cadastrar', transaction)
        } else {
            Alert.alert("Erro na edição da transação")
        }
    }

    // Função que faz o filtro das datas na home
    async function filterData() {
        let returnDataFirebase: any[] = []

        const timeStampAntDate = antDate?.getTime();
        const timeStampPostDate = postDate?.getTime();

        const transactionsRef = collection(database, "transactions");
        const data = query(transactionsRef, where("date", ">", timeStampAntDate), where("date", "<=", timeStampPostDate), orderBy("date"));

        const querySnapshot = await getDocs(data);
        querySnapshot.forEach((doc) => {
            returnDataFirebase.push(doc.data())
        });

        await loadTransactions(returnDataFirebase);
        setOpenModal(false);
    }

    useEffect(() => {
        // Como esta na mesma página não recarrega apenas passa um objeto vazio ao parametro
        navigation.navigate('Listagem', {})
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
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginBottom: 15 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <IconSvg name="list-ul" size={14} style={{ marginRight: 7, marginBottom: 5 }} />
                                    <Title onPress={() => loadTransactions()}>Listagem</Title>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <IconSvg name="filter" size={14} style={{ marginRight: 7, marginBottom: 5 }} />
                                    <Title onPress={() => setOpenModal(true)}>Filtro</Title>
                                </View>
                            </View>

                            <TransactionsList
                                data={transactions}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => <TransactionCard key={item.id} data={item} deleteCard={deleteCard} editCard={editCard} />}
                            />
                        </Transactions>

                        {openModal && (
                            <ModalWrapper>
                                <ModalContent>
                                    <Title>Filtrar período</Title>
                                    <ButtonDate date={antDate} label="Data Inicial" setDate={setAntDate} title={`${antDate === null ? 'Data' : formatDate(antDate)}`} />
                                    <ButtonDate style={{ marginTop: 10 }} label="Data Final" date={postDate} setDate={setPostDate} title={`${postDate === null ? 'Data' : formatDate(postDate)}`} />

                                    <Button style={{ marginTop: 10 }} title='Enviar' onPress={() => filterData()} />
                                    <Button style={{ marginTop: 10 }} title='Cancelar' onPress={() => setOpenModal(false)} />
                                </ModalContent>
                            </ModalWrapper>
                        )}
                    </>
            }
        </Container >

    )
}



export default Dashboard


