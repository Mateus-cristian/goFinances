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
import { useNavigation } from '@react-navigation/native'

import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'
import { useAuth } from '../../hooks/auth'

interface FormData {
    name: string;
    amount: string
}

const schema = object().shape({
    name: string().required('Nome deve ser informado'),
    amount: number().positive('Valor não pode ser negativo').required('Preço deve ser informado')
})


export default function Register() {

    const [date, setDate] = useState(null);

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
    const navigation = useNavigation()

    const [transationType, setTransactionType] = useState('')
    const [categoryOpenModal, setCategoryOpenModal] = useState(false)
    const [category, setCategory] = useState({
        name: '',
        key: '',
    })


    const { control, handleSubmit, formState: { errors }, reset } = useForm({
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

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
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
        navigation.navigate('Listagem')
    }

    useEffect(() => {
        async function loadData() {
            const result = await AsyncStorage.getItem(dataKey)
        }
        loadData()


    }, [])

    function formatDate(date: Date) {
        const formattedDate = date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

        return formattedDate;
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
