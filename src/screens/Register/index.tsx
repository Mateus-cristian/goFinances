import React, { useEffect, useState } from 'react'
import Button from '../../components/Forms/Button'

import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native'
import { Container, Header, Title, Form, Fields } from './styles'
import TransactionTypeButton from '../../components/Forms/TransactionTypeButton'
import { View } from 'react-native'
import CategorySelectButton from '../../components/Forms/CategorySelectButton'

import { string, number, object } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import CategorySelect from '../CategorySelect';
import { useForm } from 'react-hook-form'
import InputForm from '../../components/Forms/InputForm'
import { useNavigation } from '@react-navigation/native'

import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'

interface FormData {
    name: string;
    amount: string
}

const schema = object().shape({
    name: string().required('Nome deve ser informado'),
    amount: number().positive('Valor não pode ser negativo').required('Preço deve ser informado')
})

export default function Register() {
    const dataKey = "@goFinance:transactions";
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

    function handleTransactionsTypeSelect(type: 'up' | 'down') {
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
            transationType,
            category: category.name,
            date: new Date()
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
            console.log("🚀 ~ file: index.tsx ~ line 86 ~ loadData ~ result", result)
        }
        loadData()

        // async function removeData() {
        //     const result = await AsyncStorage.removeItem(dataKey)
        //     return result
        // }

        // removeData()
    }, [])

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


                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
                            <TransactionTypeButton
                                isActive={transationType === 'up'}
                                title='Entradas'
                                type='up'
                                onPress={() => handleTransactionsTypeSelect('up')} />
                            <TransactionTypeButton
                                isActive={transationType === 'down'}
                                title='Saídas'
                                type='down'
                                onPress={() => handleTransactionsTypeSelect('down')} />
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
