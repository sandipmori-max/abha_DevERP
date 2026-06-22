import Toast from 'react-native-toast-message';

export const showToast = (
  type: 'success' | 'error' | 'warning' | 'info',
  text1: string,
  text2?: string,
) => {
  Toast.show({
    type,
    text1,
    text2,
    props: {
      toastId: `${Date.now()}-${Math.random()}`,
    },
  });
};