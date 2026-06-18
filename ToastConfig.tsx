import React from 'react';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#16a34a',
        borderRadius: 10, 
        paddingVertical: 8,
      }}
      contentContainerStyle={{
        paddingHorizontal: 12,
        paddingVertical: 6,
      }}
      text1Style={{
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        flexWrap: 'wrap',
      }}
      text2Style={{
        fontSize: 12,
        color: '#6b7280',
        flexWrap: 'wrap',
      }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#dc2626',
        borderRadius: 10, 
        paddingVertical: 8,
      }}
      contentContainerStyle={{
        paddingHorizontal: 12,
        paddingVertical: 6,
      }}
      text1Style={{
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        flexWrap: 'wrap',
      }}
      text2Style={{
        fontSize: 12,
        color: '#6b7280',
        flexWrap: 'wrap',
      }}
    />
  ),
};