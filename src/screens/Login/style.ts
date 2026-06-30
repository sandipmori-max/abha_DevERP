import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
  },

  stepItem: {
    alignItems: 'center',
  },

  circle: {
    width: 35,
    height: 35,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CFCFCF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },

  activeCircle: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },

  circleText: {
    color: '#999',
    fontWeight: '600',
  },

  activeCircleText: {
    color: '#FFF',
  },

  stepLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#999',
  },

  activeStepLabel: {
    color: '#2E7D32',
    fontWeight: '600',
  },

  line: {
    top: 20,
    flex: 0.7,
    height: 2,
    backgroundColor: '#DADADA',
  },

  activeLine: {
    backgroundColor: '#2E7D32',
  },
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },

  stepItem: {
    flex: 1,
    alignItems: 'center',
  },

  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeCircle: {
    backgroundColor: '#4F6EDB',
  },

  stepNumber: {
    color: '#999',
    fontWeight: '600',
  },

  activeNumber: {
    color: '#FFF',
  },

  stepLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#999',
  },

  activeLabel: {
    color: '#000',
    fontWeight: '600',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 24
  },

  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
  },

  nextButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#D96A27',
    borderRadius: 8,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  container: {
    flex: 1,
    backgroundColor: '#F6F8FC',
  },
  captchaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  captchaInput: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
    marginHorizontal: 12,
  },
  captchaCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',

  },

  captchaLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 12,
  },

  captchaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  captchaBox: {
    width: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },

  captchaText: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 1,
  },

  answerInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 14,
    marginHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },

  iconButton: {
    height: 42,
    width: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  prefix: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 10,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 8
  },
  back: {
    fontSize: 28,
    color: '#173D8F',
  },
  hero: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  welcome: {
    fontSize: 30,
    fontWeight: '700',
    color: '#173D8F',
  },
  subtitle: {
    color: '#666',
  },
  typeChip: {
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#173D8F',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row'
  },
  typeText: {
    color: '#fff',
    fontWeight: '600',
  },
  forgotText: {
    color: '#D96A27',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 8,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: '#D96A27',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D96A27',
  },
  radioText: {
    marginLeft: 12,
    fontSize: 16,
  },
  bottomBar: {
    backgroundColor: '#fff',
    padding: 16,
  },
  continueBtn: {
    height: 46,
    backgroundColor: '#D96A27',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  faceAuthCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },

  faceEmoji: {
    fontSize: 42,
  },

  faceText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#173D8F',
    fontSize: 16,
  },
  footer: {
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerText: {
    color: '#555',
    fontSize: 10,
  },

  createNow: {
    marginLeft: 6,
    color: '#D96A27',
    fontSize: 10,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  hintText: {
    fontSize: 12,
    color: '#000',
    marginLeft: 8,
  },
  termsContainer: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 12
  },

  termsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#222',
  },

  termsCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
  },

  termsText: {
    padding: 18,
    fontSize: 14,
    lineHeight: 24,
    color: '#555',
  },

  termsFooter: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#173D8F',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxActive: {
    backgroundColor: '#173D8F',
  },

  checkmark: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  agreeText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },

  speakerIcon: {
    fontSize: 22,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },

  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },

  eyeIcon: {
    fontSize: 20,
  },
  
});