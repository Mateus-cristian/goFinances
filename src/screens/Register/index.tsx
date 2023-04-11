import React, { useEffect, useState } from 'react'
import Button from '../../components/Forms/Button'

import { Modal, TouchableWithoutFeedback, Keyboard, Alert, Text } from 'react-native'
import { Container, Header, Title, Form, Fields, ButtonCalendar, TitleButtonCalendar } from './styles'
import TransactionTypeButton from '../../components/Forms/TransactionTypeButton'
import { View } from 'react-native'
import CategorySelectButton from '../../components/Forms/CategorySelectButton'
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

import { string, number, object } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import CategorySelect from '../CategorySelect';
import { useForm } from 'react-hook-form'
import InputForm from '../../components/Forms/InputForm'
import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native'

import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'
import { useAuth } from '../../hooks/auth'

import { useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../@types/types'

interface FormData {
    name: string;
    amount: string
}

const schema = object().shape({
    id: string().nullable(),
    name: string().required('Nome deve ser informado'),
    amount: string().required('Preço deve ser informado')
})

interface RouteParams {
    amount: number;
    category: string;
    date: string;
    id: string;
    name: string;
    type: 'positive' | 'negative';
}


export default function Register() {

    const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
    const navigation = useNavigation<NavigationProp<RootStackParamList, 'Listagem'>>();
    const [date, setDate] = useState<any>(null);

    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate;
        setDate(currentDate);
    };

    const showMode = (currentMode: string) => {
        DateTimePickerAndroid.open({
            value: date === null ? new Date() : date,
            onChange,

            is24Hour: true,
        });
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    //---------------------------------------------------------------------------

    const { user } = useAuth()

    const dataKey = `@goFinance:transactions_user:${user.id}`;

    const [transationType, setTransactionType] = useState('')
    const [categoryOpenModal, setCategoryOpenModal] = useState(false)
    const [category, setCategory] = useState({
        name: '',
        key: '',
    })

    const { control, handleSubmit, formState: { errors }, reset, setValue, getValues, setError } = useForm({
        resolver: yupResolver(schema)
    })

    function handleTransactionsTypeSelect(type: 'positive' | 'negative') {
        setTransactionType(type)
    }

    function handleCloseModal() {
        setCategoryOpenModal(false)
    }

    function handleOpenModal() {
        setCategoryOpenModal(true)
    }

    async function handleRegister(form: any) {
        if (!transationType) {
            return Alert.alert('Selecione o tipo da transação');
        }
        if (category.name === '') {
            return Alert.alert('Selecione a categoria');
        }

        if (Number(form.amount) <= 0) {
            setError('amount', {
                type: 'required',
                message: "Não pode ser negativo"
            })
            return;
        }

        const existId = getValues('id')
        if (existId) {
            await deleteCard(existId)
        }

        const newTransaction = {
            id: existId ?? String(uuid.v4()),
            name: form.name,
            amount: Number(form.amount),
            type: transationType,
            category: category.key,
            date: date
        }

        try {
            const data = await AsyncStorage.getItem(dataKey)
            const currentData = data ? JSON.parse(data) : []

            const dataFormatted =
                [
                    ...currentData,
                    newTransaction
                ]


            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted))

        } catch (error) {
            console.log(error)
            Alert.alert('Não foi possível cadastrar')
        }
        reset()
        setTransactionType('')
        setCategory({ key: '', name: '' })
        setDate(null)
        navigation.navigate('Listagem', '')
    }

    useEffect(() => {

        if (route.params) {
            const { amount: valueAmount, category: categoryParam, date: dateParam, id, name, type } = route.params;
            setValue('id', id);
            setValue('amount', String(valueAmount));
            setValue('name', name);
            setTransactionType(type);
            setCategory({ key: categoryParam, name: categoryParam })
            setDate(new Date(dateParam))
        }
    }, [route.params])

    function formatDate(date: Date) {
        const formattedDate = date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).toString();

        return formattedDate;
    }

    // Metodo temporario até fazer a API
    async function deleteCard(id: string) {
        const response = await AsyncStorage.getItem(dataKey);
        if (response) {
            // converte para array
            const convertedResponseInArray = JSON.parse(response)
            //filtra pelas transaction menos a passada
            const filterPayments = convertedResponseInArray.filter((transaction: any) => transaction.id !== id);
            if (filterPayments) {
                //converte em string para guardar no storage novamente
                const convertedArrayToString = JSON.stringify(filterPayments)
                AsyncStorage.setItem(dataKey, convertedArrayToString);

            }
        }

    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                    <Title>Cadastro</Title>
                </Header>
                <Form>
                    <Fields>
                        <InputForm
                            name='name'
                            control={control}
                            placeholder="name"
                            autoCapitalize='sentences'
                            autoCorrect={false}
                            error={errors.name && errors.name.message}

                        />
                        <InputForm
                            name='amount'
                            control={control}
                            placeholder="Preço"
                            autoCapitalize='sentences'
                            autoCorrect={false}
                            keyboardType='numeric'
                            error={errors.amount && errors.amount.message}
                        />
                        <ButtonCalendar onPress={showTimepicker} title="Show time picker!">
                            <TitleButtonCalendar>{`${date === null ? 'Data' : formatDate(date)}`}</TitleButtonCalendar>
                        </ButtonCalendar>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
                            <TransactionTypeButton
                                isActive={transationType === 'positive'}
                                title='Entradas'
                                type='positive'
                                onPress={() => handleTransactionsTypeSelect('positive')} />
                            <TransactionTypeButton
                                isActive={transationType === 'negative'}
                                title='Saídas'
                                type='negative'
                                onPress={() => handleTransactionsTypeSelect('negative')} />
                        </View>
                        <CategorySelectButton
                            title={category.name ? category.name : 'Selecione'}
                            onPress={handleOpenModal} />
                    </Fields>

                    <Button title='Enviar' onPress={handleSubmit(handleRegister)} />

                </Form>

                <Modal visible={categoryOpenModal} >
                    <CategorySelect
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseModal}
                    />
                </Modal>
            </Container>
        </TouchableWithoutFeedback>
    )
}
