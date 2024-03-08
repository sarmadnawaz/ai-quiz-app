import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import {
  MD2DarkTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import QuizzesList from "./screens/QuizzesList";
import GenerateQuiz from "./screens/GenerateQuiz";

const theme = {
  ...DefaultTheme,
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <GenerateQuiz />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
