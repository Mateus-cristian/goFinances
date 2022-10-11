import React from 'react'
import { Container, Error } from './styles'
import { Control, Controller, FieldError, FieldErrorsImpl, Merge } from 'react-hook-form'

import Input from '../input'
import { TextInputProps } from 'react-native'


interface Props extends TextInputProps {
    control: Control,
    name: string
    error: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
}

export default function InputForm({ control, name, error = '', ...rest }: Props) {
    return (
        <Container>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value } }) => (
                    < Input
                        onChangeText={onChange}
                        value={value}
                        {...rest}
                    />
                )}
            />
            {error ? (<Error>{error}</Error>) : ('')}
        </Container >
    )
}
