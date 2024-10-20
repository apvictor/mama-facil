import { useState, useEffect } from 'react';
import { Styles } from './global';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from "expo-notifications";
import { FlatList, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  const [hour, setHour] = useState(4);
  const [feedings, setFeedings] = useState([]);

  // Função para salvar os agendamentos no AsyncStorage
  const saveFeedings = async (feedings) => {
    try {
      await AsyncStorage.setItem('feedings', JSON.stringify(feedings));
    } catch (error) {
      console.error("Erro ao salvar os agendamentos:", error);
    }
  };

  // Função para carregar os agendamentos do AsyncStorage ao iniciar o app
  const loadFeedings = async () => {
    try {
      const savedFeedings = await AsyncStorage.getItem('feedings');
      if (savedFeedings) {
        const parsedFeedings = JSON.parse(savedFeedings).map((feeding) => ({
          ...feeding,
          time: new Date(feeding.time), // Converter string para Date
        }));
        // Ordenar os agendamentos do mais recente para o mais antigo
        parsedFeedings.sort((a, b) => b.time - a.time);
        setFeedings(parsedFeedings);
      }
    } catch (error) {
      console.error("Erro ao carregar os agendamentos:", error);
    }
  };

  // Carregar os agendamentos assim que o app iniciar
  useEffect(() => {
    loadFeedings();
  }, []);

  // Função para adicionar um novo agendamento e salvar no AsyncStorage
  async function addNotification() {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hora de mamar 🍼",
        body: `Não esqueça de concluir, se passou ${hour} horas.`,
      },
      trigger: { seconds: hour * 3600 },
    });

    const newFeeding = {
      id,
      hour,
      status: false,
      time: new Date(new Date().getTime() + hour * 3600 * 1000),
    };

    const updatedFeedings = [...feedings, newFeeding];
    // Ordenar os agendamentos do mais recente para o mais antigo
    updatedFeedings.sort((a, b) => b.time - a.time);
    setFeedings(updatedFeedings);
    saveFeedings(updatedFeedings); // Salvar os agendamentos
  }

  // Função para cancelar uma notificação e atualizar o AsyncStorage
  async function cancelNotification(id) {
    await Notifications.cancelScheduledNotificationAsync(id);
    const updatedFeedings = feedings.filter((feeding) => feeding.id !== id);
    // Ordenar os agendamentos do mais recente para o mais antigo
    updatedFeedings.sort((a, b) => b.time - a.time);
    setFeedings(updatedFeedings);
    saveFeedings(updatedFeedings); // Atualizar o armazenamento
  }


  const toggleStatus = async (id) => {
    const updatedFeedings = feedings.map((feeding) => {
      if (feeding.id === id) {
        return { ...feeding, status: !feeding.status };
      }
      return feeding;
    });

    // Ordenar os agendamentos do mais recente para o mais antigo
    updatedFeedings.sort((a, b) => b.time - a.time);
    setFeedings(updatedFeedings);
    saveFeedings(updatedFeedings); // Salvar as alterações no AsyncStorage
  };

  console.log(feedings);



  return (
    <Styles.Container>
      <StatusBar
        style="light"
        translucent
        backgroundColor='#121214'
      />

      <Styles.Form>
        <Image
          source={require("./assets/logo.png")}
          style={{ width: 250, height: 50 }}
        />
      </Styles.Form>

      <Styles.ListsDiv>
        <Styles.Title>Mamadeiras agendadas</Styles.Title>
        {feedings.length > 0 ? (
          <FlatList
            data={feedings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Styles.ListDiv>

                <TouchableOpacity onPress={() => toggleStatus(item.id)}>
                  {item.status
                    ? <Image source={require("./assets/check.png")} style={{ width: 24, height: 24 }} />
                    : <Image source={require("./assets/selection.png")} style={{ width: 24, height: 24 }} />
                  }
                </TouchableOpacity>

                <Styles.Text>
                  Próxima mamadeira {new Intl.DateTimeFormat('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZone: 'America/Sao_Paulo',
                  }).format(item.time)}
                </Styles.Text>
                <TouchableOpacity onPress={() => cancelNotification(item.id)}>
                  <Image
                    source={require("./assets/trash.png")}
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>
              </Styles.ListDiv>
            )}
          />
        ) : (
          <Styles.Form>
            <Styles.Text>Nenhuma mamadeira agendada</Styles.Text>
          </Styles.Form>
        )}
      </Styles.ListsDiv>

      <Styles.Div>
        <Styles.Text>Definir o tempo para a próxima mamadeira</Styles.Text>
        <Styles.Form>
          <Styles.ButtonSecond
            onPress={() => setHour(hour > 1 ? hour - 1 : 1)}
          >
            <Image
              source={require("./assets/minus.png")}
              style={{ width: 20, height: 20 }}
            />
          </Styles.ButtonSecond>
          <Styles.Input value={`${hour}H`} editable={false} />
          <Styles.ButtonSecond onPress={() => setHour(hour + 1)}>
            <Image
              source={require("./assets/plus.png")}
              style={{ width: 20, height: 20 }}
            />
          </Styles.ButtonSecond>
        </Styles.Form>
        <Styles.Button onPress={addNotification}>
          <Image
            source={require("./assets/baby.png")}
            style={{ width: 50, height: 50 }}
          />
        </Styles.Button>
      </Styles.Div>

    </Styles.Container>
  );
}
