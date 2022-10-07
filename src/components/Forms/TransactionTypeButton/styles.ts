import styled, { css } from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

interface IconProps {
  type: "up" | "down";
  isActive: boolean;
}

interface ButtonProps {
  type: "up" | "down";
  isActive: boolean;
}

export const Container = styled.View<ButtonProps>`
  width: 48%;
  border-radius: 5px;

  flex-direction: row;
  align-items: center;
  justify-content: center;

  padding: 16px;

  border: 1.5px solid ${({ theme }) => theme.colors.text};

  ${({ isActive, type }) =>
    isActive &&
    type === "up" &&
    css`
      background-color: ${({ theme }) => theme.colors.sucess_light};
      border: none;
    `};

  ${({ isActive, type }) =>
    isActive &&
    type === "down" &&
    css`
      background-color: ${({ theme }) => theme.colors.attention_light};
      border: none;
    `};
`;

export const Icon = styled(Feather)<IconProps>`
  margin-right: 12px;
  font-size: ${RFValue(24)}px;

  color: ${({ theme, type }) =>
    type === "up" ? theme.colors.sucess : theme.colors.attention};
`;

export const Title = styled.Text`
  font-size: ${RFValue(12)}px;
  font-family: ${({ theme }) => theme.fonts.regular}; ;
`;
