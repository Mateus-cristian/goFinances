import React, { useState } from 'react'
import Input from '../../components/Forms/input'
import Button from '../../components/Forms/Button'

import { Modal } from 'react-native'
import { Container, Header, Title, Form, Fields } from './styles'
import TransactionTypeButton from '../../components/Forms/TransactionTypeButton'
import { View } from 'react-native'
import CategorySelectButton from '../../components/Forms/CategorySelectButton'

import CategorySelect from '../CategorySelect';

export default function Register() {

    const [buttonSelected, setSelectedButton] = useState('')
    const [categoryOpenModal, setCategoryOpenModal] = useState(false)

    const [category, setCategory] = useState({
        name: '',
        key: '',

    })

    function handleTransactionsTypeSelect(type: 'up' | 'down') {
        setSelectedButton(type)
    }

    function handleCloseModal() {
        setCategoryOpenModal(false)
    }

    function handleOpenModal() {
        setCategoryOpenModal(true)
    }

    return (
        <Container>
            <Header>
                <Title>Cadastro</Title>
            </Header>
            <Form>
                <Fields>

                    <Input
                        placeholder='Nome' />
                    <Input
                        placeholder='Preço' />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
                        <TransactionTypeButton
                            isActive={buttonSelected === 'up'}
                            title='income'
                            type='up'
                            onPress={() => handleTransactionsTypeSelect('up')} />
                        <TransactionTypeButton
                            isActive={buttonSelected === 'down'}
                            title='outcome'
                            type='down'
                            onPress={() => handleTransactionsTypeSelect('down')} />
                    </View>
                    <CategorySelectButton
                        title={category.name ? category.name : 'Selecione'}
                        onPress={handleOpenModal} />
                </Fields>

                <Button title='Enviar' />
            </Form>

            <Modal visible={categoryOpenModal}>
                <CategorySelect
                    category={category}
                    setCategory={setCategory}
                    closeSelectCategory={handleCloseModal}
                />
            </Modal>
        </Container>
    )
}
