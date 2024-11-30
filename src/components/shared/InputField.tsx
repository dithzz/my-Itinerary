import React from "react";
import { TextInput } from "react-native-paper";
import { View } from "react-native";
import { commonStyles } from "../../styles/commonStyles";

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  keyboardType = "default",
}) => {
  return (
    <View style={commonStyles.inputContainer}>
      <TextInput
        mode="outlined"
        label={label}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        style={{ backgroundColor: "#FFFFFF" }} // White surface for inputs
        theme={{
          colors: {
            text: "#212121", // Dark gray for text
            placeholder: "#757575", // Light gray for placeholder
          },
        }}
      />
    </View>
  );
};

export default InputField;
