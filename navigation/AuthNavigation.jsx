import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "../screens/SignIn";
import SignUp from "../screens/SignUp";

const Stack = createNativeStackNavigator();

function AuthNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ title: "Sign In", headerShown: false }}
          name="SignIn"
          component={SignIn}
        />
        <Stack.Screen
          options={{
            title: "Sign Up",
            headerShown: false,
          }}
          name="SignUp"
          component={SignUp}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AuthNavigation;
