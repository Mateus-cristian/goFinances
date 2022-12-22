import React, { useContext, useState } from 'react'
import { ActivityIndicator, Alert, Platform } from 'react-native';
import { Container, Header, Title, TitleWrapper, SignInTitle, Footer, FooterWrapper } from './styles'

import { useTheme } from 'styled-components'

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google-icon.svg';
import LogoSvg from '../../assets/logo.svg';
import { RFValue } from 'react-native-responsive-fontsize';
import { SignInSocialButton } from '../../components/SignInSocialButton';

import { useAuth } from '../../hooks/auth'

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false)
    const { signInWithGoogle } = useAuth()

    const theme = useTheme()

    async function handleSignInWithGoogle() {
        try {
            setIsLoading(true)
            return await signInWithGoogle();
        } catch (error) {
            console.log(error)
            Alert.alert('Não foi possível concectar a conta Google')
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg
                        width={RFValue(120)}
                        height={RFValue(68)}
                    />
                    <Title>
                        Controle suas {'\n'}
                        finanças de forma {'\n'}
                        muito simples
                    </Title>
                    <SignInTitle>
                        Faça seu login com {'\n'}
                        uma das contas abaixo
                    </SignInTitle>
                </TitleWrapper>
            </Header>
            <Footer>
                <FooterWrapper>
                    {Platform.OS === 'android' &&
                        <SignInSocialButton title='Entrar com Google' svg={GoogleSvg} signApp={handleSignInWithGoogle} />
                    }
                    {Platform.OS === 'ios' &&
                        <SignInSocialButton title='Entrar com Apple' svg={AppleSvg} />
                    }
                </FooterWrapper>
                {isLoading && <ActivityIndicator color={theme.colors.shape} size="large" />}
            </Footer>
        </Container>
    )
}