import React from 'react'

import { Text, TouchableOpacityProps } from 'react-native'
import { TitleButtonCalendar, ButtonCalendar } from './styles'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { View } from 'react-native';
import { IconCalendar } from '../../../screens/Register/styles';

interface Props extends TouchableOpacityProps {
    label?: string;
    title: string;
    setDate: React.Dispatch<React.SetStateAction<Date | null>>
    date: Date | null;
}


function ButtonDate({ title, setDate, date, label, ...rest }: Props) {

    const showTimepicker = () => {
        DateTimePickerAndroid.open({
            value: date === null ? new Date() : date,
            onChange,
            is24Hour: true,
        });
    };

    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate;
        setDate(currentDate);
    };

    return (
        <View {...rest}>
            {label && (<Text style={{ marginBottom: 5, color: '#888' }}>{label}</Text>)}
            <ButtonCalendar onPress={showTimepicker} >
                <TitleButtonCalendar>
                    {title}
                </TitleButtonCalendar>
            </ButtonCalendar>
        </View>
    )
}

export default ButtonDate;