import { useEffect } from 'react';
import { Styles } from './global';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from "expo-notifications";
import { FlatList, Image, TouchableOpacity } from 'react-native';
import { appController } from './App-controller';

export default function App() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  const {
    hour,
    feedings,
    loadFeedings,
    addNotification,
    cancelNotification,
    toggleStatus
  } = appController()

  useEffect(() => {
    loadFeedings()
  }, [])

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
