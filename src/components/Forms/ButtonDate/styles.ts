import "react-native-gesture-handler";
import styled from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";

export const ButtonCalendar = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.shape};
  border-radius: 5px;

  align-items: flex-start;
`;

export const TitleButtonCalendar = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text};

  font-size: ${RFValue(14)}px;

  padding: 18px;
`;
