import React from 'react';
import CustomToast from './CustomToast';

export const toastConfig = {
  success: ({ text1, text2, props }: any) => (
    <CustomToast
      toastId={props?.toastId}
      text1={text1}
      text2={text2}
      icon="check-circle"
      backgroundColor="#10B981"
      progressColor="#FFFFFF"
    />
  ),

  error: ({ text1, text2, props }: any) => (
    <CustomToast
      toastId={props?.toastId}
      text1={text1}
      text2={text2}
      icon="error"
      backgroundColor="#EF4444"
      progressColor="#FFFFFF"
    />
  ),

  warning: ({ text1, text2, props }: any) => (
    <CustomToast
      toastId={props?.toastId}
      text1={text1}
      text2={text2}
      icon="warning"
      backgroundColor="#F59E0B"
      progressColor="#FFFFFF"
    />
  ),

  info: ({ text1, text2, props }: any) => (
    <CustomToast
      toastId={props?.toastId}
      text1={text1}
      text2={text2}
      icon="info"
      backgroundColor="#3B82F6"
      progressColor="#FFFFFF"
    />
  ),
};