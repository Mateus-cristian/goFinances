import React, { useCallback, useEffect, useState } from 'react'
import HistoryCard from '../../components/HistoryCard'
import { Container, LoadContainer, MonthSelect, Month, MonthSelectButton, MonthSelectIcon, Header, Title, Content, ChartContainer } from './styles'
import { categories } from '../../utils/categories';
import { VictoryPie } from 'victory-native'
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, subMonths, format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { useTheme } from 'styled-components'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { database } from '../../../config/firebase';


export interface TransactionProps {
    name: string;
    amount: string;
    category: string;
    date: string;
    type: 'positive' | 'negative'
}

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}

export default function Resume() {
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])
    const [totalByCategoriesAllPeriod, setTotalByCategoriesAllPeriod] = useState<CategoryData[]>([])
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [isLoading, setIsLoading] = useState(true)

    const [onlyAllPeriod, setOnlyAllPeriod] = useState(false);

    const theme = useTheme()

    const { user } = useAuth();

    function handleDateChange(action: 'next' | 'prev') {
        setIsLoading(true)
        if (action === 'next') {
            const newDate = addMonths(selectedDate, 1)
            setSelectedDate(newDate)

        } else {
            const newDate = subMonths(selectedDate, 1)
            setSelectedDate(newDate)
        }
    }

    async function loadData() {
        const dataKey = `@goFinance:transactions_user:${user.id}`;


        let returnDataFirebase: any[] = []

        const collectTransactions = collection(database, "transactions");
        const queryGetTransactions = query(collectTransactions, where("user", "==", dataKey));
        const querySnapshot = await getDocs(queryGetTransactions);
        querySnapshot.forEach((doc) => {
            returnDataFirebase.push(doc.data())
        });


        const responseFormatted: TransactionProps[] = returnDataFirebase;

        const totalByCategory: CategoryData[] = [];
        let expensives: any[] = [];
        if (!onlyAllPeriod) {
            expensives = responseFormatted.filter((expensive) =>
                expensive.type === 'negative' &&
                new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
                new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
            )
        } else {
            expensives = responseFormatted.filter((expensive) => expensive.type === 'negative')
        }


        const expensiveTotal = expensives
            .reduce((acumullator: number, expensive: TransactionProps) => {
                return acumullator + Number(expensive.amount)
            }, 0)


        const data = categories.forEach((category) => {
            let categorySum = 0;

            expensives.forEach(expensive => {
                if (expensive.category === category.key) {
                    categorySum += Number(expensive.amount)
                }
            })
            if (categorySum > 0) {
                const totalFormatted = categorySum
                    .toLocaleString('pt-br', {
                        style: 'currency', currency: 'BRL'
                    })

                const percent = `${(categorySum / expensiveTotal * 100).toFixed(0)}%`

                totalByCategory.push({
                    name: category.name,
                    color: category.color,
                    key: category.key,
                    totalFormatted,
                    total: categorySum,
                    percent
                })
            }
        })
        setTotalByCategories(totalByCategory)
        setIsLoading(false)
    }

    // Apenas troca o período do filtro
    const handlePeriod = () => {
        setOnlyAllPeriod(!onlyAllPeriod);
    }



    useFocusEffect(useCallback(() => {
        loadData()
    }, [selectedDate, onlyAllPeriod]))

    return (
        <Container>
            <Header>
                <Title>Resumo de gastos por categoria</Title>
            </Header>
            <Content
                style={{ paddingHorizontal: 24, }}
                showVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: useBottomTabBarHeight()
                }}
            >
                <MonthSelect>
                    <MonthSelectButton onPress={() => handlePeriod()}>
                        <MonthSelectIcon name='chevron-left' />
                    </MonthSelectButton>

                    <Month>
                        {onlyAllPeriod ? 'Todo o periodo' : 'Por mês'}
                    </Month>

                    <MonthSelectButton onPress={() => handlePeriod()}>
                        <MonthSelectIcon name='chevron-right' />
                    </MonthSelectButton>
                </MonthSelect>
                {!onlyAllPeriod && (
                    <MonthSelect>
                        <MonthSelectButton onPress={() => handleDateChange('prev')}>
                            <MonthSelectIcon name='chevron-left' />
                        </MonthSelectButton>

                        <Month>
                            {format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}
                        </Month>

                        <MonthSelectButton onPress={() => handleDateChange('next')}>
                            <MonthSelectIcon name='chevron-right' />
                        </MonthSelectButton>
                    </MonthSelect>
                )}
                {
                    isLoading ?
                        <LoadContainer>
                            <ActivityIndicator color={theme.colors.secondary} size='large' />
                        </LoadContainer> :
                        <>
                            {!onlyAllPeriod ? (
                                <ChartContainer>
                                    <VictoryPie data={totalByCategories}
                                        colorScale={totalByCategories.map(category => category.color)}
                                        x='percent'
                                        y='total'
                                        labelRadius={80}
                                        style={{
                                            labels: {
                                                fontSize: RFValue(18),
                                                fontWeight: 'bold',
                                                fill: '#fff'
                                            }
                                        }}
                                    />
                                </ChartContainer>
                            ) : (
                                <ChartContainer>
                                    <VictoryPie data={totalByCategories}
                                        colorScale={totalByCategories.map(category => category.color)}
                                        x='percent'
                                        y='total'
                                        labelRadius={80}
                                        style={{
                                            labels: {
                                                fontSize: RFValue(18),
                                                fontWeight: 'bold',
                                                fill: '#fff'
                                            }
                                        }}
                                    />
                                </ChartContainer>

                            )}
                            {totalByCategories.map(item => (
                                <HistoryCard
                                    key={item.key}
                                    title={item.name}
                                    amount={item.totalFormatted}
                                    color={item.color}
                                />
                            ))
                            }
                        </>
                }
            </Content>
        </Container>
    )
}
