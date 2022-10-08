import React, { useState } from 'react'
import Input from '../../components/Forms/input'
import Button from '../../components/Forms/Button'

import { Container, Header, Title, Form, Fields } from './styles'
import TransactionTypeButton from '../../components/Forms/TransactionTypeButton'
import { View } from 'react-native'
import CategorySelect from '../../components/Forms/CategorySelect'

export default function Register() {

    const [buttonSelected, setSelectedButton] = useState('')

    function handleTransactionsTypeSelect(type: 'up' | 'down') {
        setSelectedButton(type)
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
                    <CategorySelect title='categoria' />
                </Fields>

                <Button title='Enviar' />
            </Form>
        </Container>
    )
}
