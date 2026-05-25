export type ThemeMode = 'light' | 'dark';

export type UIKitColors = {
    primary: string;
    background: string;
    border: string;
    card: string;

    text: string;
    text_inverted: string;

    activeButtonBackground: string;
    inactiveButtonBackground: string;
    activeButtonText: string;
    inactiveButtonText: string;

    icon: string,
    error: string,
};

export type UIKitTheme = {
    mode: ThemeMode;
    colors: UIKitColors;
};