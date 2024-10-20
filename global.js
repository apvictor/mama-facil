import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  background-color: #d9f5ff;
  padding-top: 40px;
`;

const ListsDiv = styled.View`
  flex: 1;
  gap: 20px;
  display: flex;
  padding: 24px 24px;
`;

const ListDiv = styled.View`
  gap: 12px;
  padding: 16px;
  display: flex;
  border-radius: 8px;
  flex-direction: row;
  background-color: white;
  align-items: center;
  margin-bottom: 16px;
  justify-content: space-between;
`;

const Div = styled.View`
  padding: 24px 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: white;
  border-top-right-radius: 30px;
  border-top-left-radius: 30px;
`;

const Form = styled.View`
  width: 100%;
  display: flex;
  padding: 20px 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

const Text = styled.Text`
  font-size: 16px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const Button = styled.TouchableOpacity`
  padding: 20px;
  align-items: center;
  border-radius: 100px;
  justify-content: center;
  background-color: #d9f5ff;
`;

const ButtonSecond = styled.TouchableOpacity`
  padding: 12px;
  align-items: center;
  border-radius: 100px;
  justify-content: center;
  background-color: #d9f5ff;
`;

const Icon = styled.View`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Input = styled.TextInput`
    border-radius: 4px;
    height: 48px;
    background-color: #d9f5ff;
    color: #000;
    padding: 0px 16px;
    font-size: 16px;
    text-align: center;
  `;

export const Styles = {
  Container,
  ListsDiv,
  ListDiv,
  ButtonSecond,
  Button,
  Div,
  Form,
  Text,
  Title,
  Input,
  Icon,
}
