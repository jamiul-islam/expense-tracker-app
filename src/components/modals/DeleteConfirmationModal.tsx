/**
 * DeleteConfirmationModal - Confirm transaction deletion (Redesigned to match Figma)
 */

import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/theme';

interface DeleteConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  loading = false,
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Delete Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="trash-outline" size={28} color="#E02C2F" />
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Delete Transaction</Text>
            <Text style={styles.message}>
              Are you sure you want to delete your transaction? This action is permanent and will
              remove all your data from Tranzo. You can&apos;t undo this.
            </Text>

            {/* Delete Button */}
            <TouchableOpacity
              style={[styles.deleteButton, loading && styles.deleteButtonDisabled]}
              onPress={onConfirm}
              disabled={loading}
            >
              <Text style={styles.deleteButtonText}>Yes, Delete</Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  cancelButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  cancelButtonText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  contentContainer: {
    alignItems: 'center',
    gap: spacing['2xl'],
  },
  deleteButton: {
    alignItems: 'center',
    backgroundColor: '#E02C2F',
    borderRadius: 60,
    height: 50,
    justifyContent: 'center',
    width: '100%',
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  deleteButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  message: {
    color: '#434A52',
    fontSize: typography.fontSize.sm,
    lineHeight: 22,
    textAlign: 'center',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 18,
    marginHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
    paddingHorizontal: spacing.lg,
    paddingTop: 40,
    width: 358,
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(9, 36, 73, 0.21)',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#091C35',
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
});

export default DeleteConfirmationModal;
