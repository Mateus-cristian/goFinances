import React, { useState } from 'react'
import Input from '../../components/Forms/input'
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


interface FormData {
    name: string;
    amount: string
}

const schema = object().shape({
    name: string().required('Nome deve ser informado'),
    amount: number().positive('Valor não pode ser negativo').required('Preço deve ser informado')
})

export default function Register() {
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

    function handleRegister(form: FormData) {
        if (!transationType) {
            return Alert.alert('Selecione o tipo da transação');
        }
        if (category.name === '') {
            return Alert.alert('Selecione a categoria');
        }

        const data = {
            name: form.name,
            amount: form.amount,
            transationType,
            category: category.key
        }
        console.log("🚀 ~ file: index.tsx ~ line 53 ~ handleRegister ~ data", data)

        reset()
        setTransactionType('')
        setCategory({ key: '', name: '' })
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
                        //    
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
                                title='income'
                                type='up'
                                onPress={() => handleTransactionsTypeSelect('up')} />
                            <TransactionTypeButton
                                isActive={transationType === 'down'}
                                title='outcome'
                                type='down'
                                onPress={() => handleTransactionsTypeSelect('down')} />
                        </View>
                        <CategorySelectButton
                            title={category.name ? category.name : 'Selecione'}
                            onPress={handleOpenModal} />
                    </Fields>

                    {/* <Button title='Enviar' onPress={handleSubmit()} /> */}

                </Form>

                <Modal visible={categoryOpenModal}>
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
