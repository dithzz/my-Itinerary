import React from "react";
import { Button } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { StyleSheet } from "react-native";
import { commonStyles } from "../../styles/commonStyles";

interface DatePickerButtonProps {
  label: string;
  date: Date | undefined;
  isVisible: boolean;
  onPress: () => void;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
}

const DatePickerButton: React.FC<DatePickerButtonProps> = ({
  label,
  date,
  isVisible,
  onPress,
  onConfirm,
  onCancel,
}) => {
  return (
    <>
      <Button
        mode="outlined"
        onPress={onPress}
        style={commonStyles.button}
        theme={{
          colors: {
            primary: "#00BCD4", // Cyan for accent
          },
        }}
      >
        {date ? `${label}: ${date.toLocaleDateString()}` : `Select ${label}`}
      </Button>
      <DateTimePickerModal
        isVisible={isVisible}
        mode="datetime"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </>
  );
};

export default DatePickerButton;
