import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function App() {
  const [person, setPerson] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const fetchData = async () => {
    try {
      const users = await fetch("https://randomuser.me/api/?results=40");
      const response = await users.json();
      if (response && response.results) {
        setPerson(response.results);
      } else {
        setError("No Data found.");
      }
    } catch (error) {
      setError("Failed to fetch data");
      console.log(error);
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefresh(true);
    fetchData();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#be93c5", "#7bc6cc"]} className="flex-1">
      <SafeAreaView className="flex-1">
        <Text className="text-4xl text-center mt-16 text-white font-bold">
          RandomPerson
        </Text>
        <FlatList
          className="w-full px-3 mt-5"
          data={person}
          keyExtractor={(item) => item.login.uuid}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View className="flex flex-row bg-white mb-2 rounded-[30px] items-center p-3">
              <Image
                source={{ uri: item.picture.thumbnail }}
                className="w-14 h-14 rounded-full"
              />
              <View className="px-4">
                <Text className="text-lg font-semibold text-gray-800">
                  {item.name.first} {item.name.last}
                </Text>
                <View className="flex flex-row justify-between w-48">
                  <Text className="text-sm text-sky-600">{item.phone}</Text>
                  <Text className="text-sm text-gray-600">{item.gender}</Text>
                </View>
                <Text className="text-sm text-sky-600">{item.email}</Text>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
