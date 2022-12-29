import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";
import { Fontisto } from "@expo/vector-icons/";

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  flex: 1;
`;

export const ContainerCalendar = styled.View`
  position: relative;
`;

export const IconCalendar = styled(Fontisto)`
  font-size: ${RFValue(21)}px;
  position: absolute;
  right: 10px;
  transform: translateY(17px);
`;

export const Header = styled.View`
  background-color: ${({ theme }) => theme.colors.primary};

  width: 100%;
  height: ${RFValue(113)}px;

  align-items: center;
  justify-content: flex-end;
  padding-bottom: 19px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.shape};
  font-family: ${({ theme }) => theme.fonts.regular};

  font-size: ${RFValue(18)}px; ;
`;

export const Form = styled.View`
  flex: 1;
  width: 100%;
  padding: 24px;
  justify-content: space-between;
`;

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

export const Fields = styled.View``;
