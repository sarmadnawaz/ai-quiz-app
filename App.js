import {
  MD2DarkTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import QuizzesList from "./screens/QuizzesList";
import AuthNavigation from "./navigation/AuthNavigation";
import ScreenWrapper from "./components/ScreenWrapper";
import { UserProvider, useUser } from "./context/UserProvider";
import MainNavigation from "./navigation/MainNavigation";

const theme = {
  ...DefaultTheme,
};

function App() {
  const user = useUser();

  return user ? <MainNavigation /> : <AuthNavigation />;
}

export default () => {
  return (
    <PaperProvider theme={theme}>
      <ScreenWrapper
        contentContainerStyle={{
          flex: 1,
          paddingTop: 30,
        }}
      >
        <UserProvider>
          <App />
        </UserProvider>
      </ScreenWrapper>
    </PaperProvider>
  );
};
