import { useState } from 'react';
import * as Notifications from "expo-notifications";
import AsyncStorage from '@react-native-async-storage/async-storage';

export function appController() {
  const [hour, setHour] = useState(4);
  const [feedings, setFeedings] = useState([]);

  // Função para salvar os agendamentos no AsyncStorage
  async function saveFeedings(feedings) {
    await AsyncStorage.setItem('feedings', JSON.stringify(feedings));
  };

  // Função para carregar os agendamentos do AsyncStorage ao iniciar o app
  async function loadFeedings() {
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

  };

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

  async function toggleStatus(id) {
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
  }

  return {
    hour,
    feedings,
    saveFeedings,
    loadFeedings,
    addNotification,
    cancelNotification,
    toggleStatus
  }

}
