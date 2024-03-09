import { View, StyleSheet } from "react-native";
import { Button, useTheme } from "react-native-paper";

const Modal = ({ children, onAction, actionButtonTitle }) => {
  const theme = useTheme();
  return (
    <View
      style={{
        ...styless.modalBackdrop,
        backgroundColor: theme.colors.background,
      }}
    >
      <View style={styless.modalContainer}>
        {children}
        {onAction && (
          <Button onPress={onAction} mode="outlined">
            {actionButtonTitle}
          </Button>
        )}
      </View>
    </View>
  );
};

const styless = StyleSheet.create({
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    padding: 20,
    minWidth: 300,
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: "center",
    flexDirection: "column",
    gap: 10,
  },
});

export default Modal;
