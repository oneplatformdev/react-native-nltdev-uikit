export type ThemeMode = 'light' | 'dark';

export type UIKitColors = {
    primary: string;
    background: string;
    text: string;
    border: string;

    activeButtonBackground: string;
    inactiveButtonBackground: string;
    activeButtonText: string;
    inactiveButtonText: string;

    icon: string,
};

export type UIKitTheme = {
    mode: ThemeMode;
    colors: UIKitColors;
};