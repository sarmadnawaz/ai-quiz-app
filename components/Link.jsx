import { TouchableOpacity } from "react-native";
import { Text, useTheme } from "react-native-paper";

const Link = ({ to, children, navigation, style = {}, ...props }) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate(to)}>
      <Text
        style={{
          textDecorationLine: "underline",
        }}
        {...props}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export default Link;
