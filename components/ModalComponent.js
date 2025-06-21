import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from "react-native";
import Colors from "../constants/Colors";

const ModalComponent = ({ isVisible, onClose, children }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <ScrollView style={styles.scrollViewContent}>{children}</ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)"
  },
  modalContent: {
    backgroundColor: Colors.light.background, // Usando cor da paleta
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxHeight: "90%",
    elevation: 5,
    shadowColor: Colors.light.black, // Usando cor da paleta
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1
  },
  closeButtonText: {
    fontSize: 20,
    color: Colors.light.text // Usando cor da paleta
  },
  scrollViewContent: {
    paddingTop: 30
  }
});

export default ModalComponent;
