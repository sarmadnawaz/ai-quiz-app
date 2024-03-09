import { createNativeStackNavigator } from "@react-navigation/native-stack";
import QuizzesList from "../screens/QuizzesList";
import Quiz from "../screens/Quiz";

const Stack = createNativeStackNavigator();

export default function MainNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Quizzes" component={QuizzesList} />
      <Stack.Screen name="Quiz" component={Quiz} />
    </Stack.Navigator>
  );
}
