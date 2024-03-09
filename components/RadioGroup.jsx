import React from "react";
import { View, StyleSheet } from "react-native";
import { List, RadioButton, Text } from "react-native-paper";

const RadioGroup = ({ options, value, onChange, flexDirection = "row" }) => {
  return (
    <List.Section>
      <RadioButton.Group
        value={value}
        style={styles.row}
        onValueChange={(value) => onChange(value)}
      >
        <View flexDirection={flexDirection} style={styles.row}>
          {options.map((option, idx) => {
            return (
              <View
                flexDirection="row"
                gap={4}
                key={idx}
                alignItems="center"
                justifyContent={
                  flexDirection === "row" ? "flex-start" : "space-between"
                }
              >
                <Text>{option?.label}</Text>
                <RadioButton value={option?.value} />
              </View>
            );
          })}
        </View>
      </RadioButton.Group>
    </List.Section>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 20,
    gap: 10,
  },
});

export default RadioGroup;
