/**
 * DeleteConfirmationModal - Confirm transaction deletion
 */

import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/theme';
import { Button } from '@/components/common/Button';

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
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="warning" size={48} color={colors.danger} />
          </View>

          {/* Content */}
          <Text style={styles.title}>Delete Transaction?</Text>
          <Text style={styles.message}>
            Are you sure you want to delete this transaction? This action cannot be undone.
          </Text>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="Cancel"
              variant="secondary"
              onPress={onClose}
              style={styles.actionButton}
              disabled={loading}
            />
            <Button
              title="Yes, Delete"
              variant="danger"
              onPress={onConfirm}
              style={styles.actionButton}
              loading={loading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing['2xl'],
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  message: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing['2xl'],
    padding: spacing['2xl'],
    ...shadows.card,
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
});

export default DeleteConfirmationModal;
