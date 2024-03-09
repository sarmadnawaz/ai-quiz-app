import * as React from "react";
import { TextInput, Text } from "react-native-paper";

const TextField = ({ error, ...props }) => {
  return (
    <>
      <TextInput style={{ width: "100%" }} mode="outlined" {...props} />
      {error && (
        <Text
          style={{
            color: "#dc2626",
          }}
          marginVertical={5}
        >
          {error}
        </Text>
      )}
    </>
  );
};

export default TextField;
