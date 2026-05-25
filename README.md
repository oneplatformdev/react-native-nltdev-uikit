import { UIKitThemeProvider } from '@oneplatform/ui';

const appTheme = {
  colors: {
    primary: '#FF6600',
    buttonBackground: '#FF6600',
    buttonText: '#FFFFFF',
  },
};

export const App = () => {
  return (
    <UIKitThemeProvider theme={appTheme}>
      {/* app */}
    </UIKitThemeProvider>
  );
};


npm login
npm publish --access public