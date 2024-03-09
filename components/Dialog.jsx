import * as React from "react";
import { Button, Dialog, Portal, Text } from "react-native-paper";

const Modal = ({ props }) => (
  <Portal>
    <Dialog visible={props?.open} onDismiss={() => {}}>
      <Dialog.Title>{props?.title}</Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium">{props?.text}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        {props?.onCancel && (
          <Button onPress={props?.onCancel}>{props?.cancelText}</Button>
        )}
        <Button onPress={props?.onOk}>{props?.okText}</Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
);

export default Modal;
