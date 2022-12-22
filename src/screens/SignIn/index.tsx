import React, { useContext } from 'react'
import { Alert } from 'react-native';
import { Container, Header, Title, TitleWrapper, SignInTitle, Footer, FooterWrapper } from './styles'

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google-icon.svg';
import LogoSvg from '../../assets/logo.svg';
import { RFValue } from 'react-native-responsive-fontsize';
import { SignInSocialButton } from '../../components/SignInSocialButton';

import { useAuth } from '../../hooks/auth'

export function SignIn() {
    const { signInWithGoogle } = useAuth()

    async function handleSignInWithGoogle() {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.log(error)
            Alert.alert('Não foi possível concectar a conta Google')
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
                    <SignInSocialButton title='Entrar com Google' svg={GoogleSvg} signApp={handleSignInWithGoogle} />
                    <SignInSocialButton title='Entrar com Apple' svg={AppleSvg} />
                </FooterWrapper>
            </Footer>
        </Container>
    )
}