import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler'
import { SvgProps } from 'react-native-svg'

import {
    Button,
    ImageContainer,
    Text
} from './styles'

interface Props extends RectButtonProps {
    title: string;
    svg: React.FC<SvgProps>;
    signApp?: () => Promise<void>
}


export function SignInSocialButton({
    title,
    svg: Svg,
    signApp
}: Props) {
    return (
        <Button onPress={signApp}>
            <ImageContainer>
                <Svg />
            </ImageContainer>

            <Text>
                {title}
            </Text>
        </Button>
    )
}