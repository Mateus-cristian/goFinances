import styled, { css } from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

interface TypeProps {
  type: "up" | "down" | "total";
}

export const Container = styled.View<TypeProps>`
  background-color: ${({ theme, type }) =>
    type === "total" ? theme.colors.secondary : theme.colors.shape};

  border-radius: 12px;
  height: 200px;
  width: ${RFValue(300)}px;

  padding: 19px 23px;
  padding-bottom: ${RFValue(42)}px;
  margin-right: 16px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
`;

export const Icon = styled(Feather)<TypeProps>`
  font-size: ${RFValue(33)}px;

  ${(props) =>
    props.type === "up" &&
    css`
      color: ${({ theme }) => theme.colors.sucess};
    `};
  ${(props) =>
    props.type === "down" &&
    css`
      color: ${({ theme }) => theme.colors.attention};
    `};
  ${(props) =>
    props.type === "total" &&
    css`
      color: ${({ theme }) => theme.colors.secondary};
    `};
`;

export const Footer = styled.View``;

export const Amount = styled.Text`
  font-size: ${RFValue(32)}px;
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme }) => theme.colors.text_dark};
  margin-top: 32px;
`;

export const LastTransaction = styled.Text`
  font-size: ${RFValue(12)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text};
  transform: translateY(-10px);
`;
