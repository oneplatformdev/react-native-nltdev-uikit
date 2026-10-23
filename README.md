# React Native NLtDev UI Kit

Reusable React Native theme, scaling, and UI components.

## Distribution modes

### Package mode — available now

Install with `npm install @oneplatformdev/react-native-uikit` and import ready-made components:

```tsx
import { Avatar, Button, Checkbox, EmptyListView, Input, PhotoPreview, Switch, Typography, UIProvider } from '@oneplatformdev/react-native-uikit';

<UIProvider>
  <Typography text="Hello" />
  <Input label="Name" value={name} onChangeText={setName} />
  <Button text="Continue" onPress={onContinue} />
  <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} accessibilityLabel="Notifications" />
  <Checkbox checked={accepted} onValueChange={setAccepted} accessibilityLabel="Accept terms" />
  <PhotoPreview source={{ uri: photoUri }} onPress={onOpenPhoto} accessibilityLabel="Open photo" />
  <EmptyListView title="No items" description="Try again later" />
  <Avatar source={{ uri: avatarUri }} name="Mykhailo Novikov" />
</UIProvider>
```

Choose package mode when theme tokens and public props cover the design and receiving package updates is useful. `UIProvider` is optional when the default theme is sufficient.

### Owned/local source mode — available now

Run from the consuming project root after declaring `@oneplatformdev/react-native-uikit`, `react`, and `react-native` in its `package.json`:

```sh
npx @oneplatformdev/react-native-uikit add typography
npx @oneplatformdev/react-native-uikit add avatar
npx @oneplatformdev/react-native-uikit add button
npx @oneplatformdev/react-native-uikit add checkbox
npx @oneplatformdev/react-native-uikit add input
npx @oneplatformdev/react-native-uikit add screen-container
npx @oneplatformdev/react-native-uikit add switch
npx @oneplatformdev/react-native-uikit add custom-alert
npx @oneplatformdev/react-native-uikit add empty-list-view
npx @oneplatformdev/react-native-uikit add bottom-modal
npx @oneplatformdev/react-native-uikit add connection-container
npx @oneplatformdev/react-native-uikit add header-with-back-button
npx @oneplatformdev/react-native-uikit add loader
npx @oneplatformdev/react-native-uikit add logger
npx @oneplatformdev/react-native-uikit add photo-preview
npx @oneplatformdev/react-native-uikit add button --dir src/UIKit
```

The default destination is `src/components/ui/<Component>/`; `--dir` changes its root, so the last command creates `src/UIKit/Typography/` and `src/UIKit/Button/`. No `init` command or configuration file is needed. The CLI refuses existing requested target folders, never overwrites, has no `--force`, and does not install npm dependencies. It reports missing declarations before copying.

The application owns and may freely change the copied implementation—structure, API, layout, animation, and behavior—without editing `node_modules` or changing the upstream package. Package upgrades do **not** update copied source. There is no diff/update command yet. Use this mode for substantial project-specific divergence, not ordinary color or spacing changes already supported by the theme.

Owned Button, Input, CustomAlert, BottomModal, ConnectionContainer, and HeaderWithBackButton import sibling local Typography. Their `add` commands install Typography automatically when missing; a compatible existing owned Typography is reused untouched. An incomplete or incompatible dependency aborts the command without installing the requested component. Copied components are actual sources, not wrappers around their package-mode counterparts. They still require the package for theme/scaling foundations; no project alias is required.

For Button, Typography, Input, future form controls, sheets, and other reusable primitives, documentation should cover: package import, basic usage, main props, theme customization, advanced/custom content, and owned-source availability. Components should serve both modes without becoming unlimited-configuration abstractions; source ownership is the escape hatch for major changes.

## Extending the theme

Define project tokens once and derive extension types from those objects instead of repeating every custom key:

```ts
// theme/tokens.ts
export const colors = {
  primary: '#123456',
  premium: '#D6A84B',
} as const;

export const spacing = {
  xs: 7,
  screenHorizontal: 20,
} as const;

export const radius = {
  card: 14,
} as const;

export const fonts = {
  regular: {
    fontFamily: 'Inter-Regular',
    fontWeight: 'normal',
  },
  bold: {
    fontFamily: 'Inter-Bold',
    fontWeight: 'normal',
  },
  extraBold: {
    fontFamily: 'Inter-ExtraBold',
    fontWeight: 'normal',
  },
} as const;

export const typography = {
  cardTitle: {
    font: 'extraBold',
    fontSize: 18,
    lineHeight: 24,
    color: 'premium',
  },
} as const;
```

```ts
// theme/index.ts
import {
  createTheme,
  type DefaultUIColors,
  type DefaultUIFonts,
  type DefaultUIRadius,
  type DefaultUISpacing,
  type DefaultUITypography,
} from '@oneplatformdev/react-native-uikit';
import { colors, fonts, radius, spacing, typography } from './tokens';

type ProjectColorExtensions = Omit<typeof colors, keyof DefaultUIColors>;
type ProjectFontExtensions = Omit<typeof fonts, keyof DefaultUIFonts>;
type ProjectRadiusExtensions = Omit<typeof radius, keyof DefaultUIRadius>;
type ProjectSpacingExtensions = Omit<typeof spacing, keyof DefaultUISpacing>;
type ProjectTypographyExtensions = Omit<typeof typography, keyof DefaultUITypography>;

declare module '@oneplatformdev/react-native-uikit' {
  interface UIColorsExtension extends ProjectColorExtensions {}
  interface UIFontsExtension extends ProjectFontExtensions {}
  interface UIRadiusExtension extends ProjectRadiusExtensions {}
  interface UISpacingExtension extends ProjectSpacingExtensions {}
  interface UITypographyExtension extends ProjectTypographyExtensions {}
}

export const appTheme = createTheme({ colors, fonts, radius, spacing, typography });
```

Pass `appTheme` to `UIProvider` before using project-specific keys. Module augmentation adds compile-time knowledge globally, but custom tokens are not present in the package's runtime `defaultTheme`.

Font tokens are merged with package defaults. Projects using face-specific font files should explicitly provide the complete font token, including `fontWeight`. Using `fontWeight: 'normal'` is the safe default when names such as `Inter-Regular` and `Inter-Bold` already identify a specific face.

## External mode and localization

Theme-only usage remains valid:

```tsx
<UIProvider theme={appTheme}>
  <App />
</UIProvider>
```

The application owns state, persistence, localization, and navigation integration. `UIProvider` only exposes the resolved theme and optional application callbacks.

MobX applications can adapt observable state without adding MobX to the UI kit:

```tsx
const AppUIProvider = observer(({ children }: PropsWithChildren) => {
  const theme = settings.mode === 'dark' ? darkTheme : lightTheme;

  return (
    <UIProvider
      theme={theme}
      onModeChange={settings.setMode}
      localization={{
        locale: localization.locale,
        t: localization.t,
        changeLocale: localization.setLocale,
      }}
    >
      {children}
    </UIProvider>
  );
});
```

Plain React state works the same way:

```tsx
const App = () => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <UIProvider theme={theme} onModeChange={setMode}>
      <Content />
    </UIProvider>
  );
};
```

A localization engine is adapted through a small optional contract:

```tsx
<UIProvider
  theme={appTheme}
  localization={{
    locale: i18n.language,
    t: (key, params) => String(i18n.t(key, params)),
    changeLocale: locale => i18n.changeLanguage(locale),
    direction: i18n.dir() === 'rtl' ? 'rtl' : 'ltr',
  }}
>
  <App />
</UIProvider>
```

Applications without localization omit the prop. Calling `useUILocalization()` without an adapter throws a developer-facing configuration error. `useUIMode()` returns the resolved `theme.mode` and the optional `changeMode` callback.

## Typography

Package import: `import { Typography } from '@oneplatformdev/react-native-uikit'`.

```tsx
<Typography text="Hello" variant="body" />
<Typography variant="body">Hello</Typography>
```

Prefer `text` (`string | number`) for simple content. Use `children` for composed or custom content; TypeScript disallows supplying both, and neither is also valid. Typography retains React Native `TextProps`, styles, and ref forwarding. Its main visual props are `variant`, `weight`, `color`, `size`, and `lineHeight`. A variant may define an optional `color` token; an explicit `color` prop overrides it, otherwise Typography uses the theme's `text` color. Caller `style` is applied last and can override either color. Customize typography/font/color tokens through `createTheme` and the extension interfaces described above. Owned/local source installation: **available** with `npx @oneplatformdev/react-native-uikit add typography`.

## Button

Package import: `import { Button } from '@oneplatformdev/react-native-uikit'`. Prefer `text` for ordinary labels:

```tsx
<Button text="Continue" onPress={onContinue} />
<Button text="Delete" variant="outline" labelProps={{ color: 'error' }} onPress={onDelete} />
```

`text` accepts strings and numbers. Primitive `children` remain supported; TypeScript disallows supplying both. Neither is valid for icon-only Buttons, which should provide an explicit `accessibilityLabel`. The `primary` (default), `secondary`, `outline`, and `ghost` variants and `sm`, `md` (default), and `lg` sizes use the theme. `disabled` blocks interaction; `leftIcon` and `rightIcon` are inline with the label.

`labelProps` overrides automatic-label typography (`color`, `variant`, `weight`, `size`, `lineHeight`, and `style`) and safe React Native Text behavior such as truncation. It cannot attach label-level press handlers or conflicting accessibility role/state. For example:

```tsx
<Button
  text="A long label that may be truncated"
  labelProps={{
    numberOfLines: 1,
    ellipsizeMode: 'tail',
  }}
/>
```

Labels wrap by default and retain React Native accessibility font scaling. Theme defaults apply first; explicit `labelProps` win, with `labelProps.style` last for label-only styles. Caller root `style` remains last for the Button container.

`loading` blocks interaction and shows a loader while preserving the active variant appearance by default. Use `loadingAppearance="disabled"` to opt into disabled styling during loading; an explicit `disabled` prop always uses disabled styling.

`loadingIndicatorColor` overrides only the loader color; otherwise the loader follows the active or disabled foreground color.

`text` and primitive string/number children provide a default `accessibilityLabel` that remains available while loading. An explicit `accessibilityLabel` wins. Button does not generate an `accessibilityHint`.

Button works with the package theme without configuration. Applications can partially override variant colors and size/label defaults through `createTheme`:

```ts
const theme = createTheme({
  button: {
    variants: {
      primary: { background: 'primary', border: 'primary', foreground: 'onPrimary' },
    },
    sizes: {
      md: { minHeight: 48, labelVariant: 'title', labelWeight: 'bold' },
    },
    numberOfLines: 1,
  },
});
```

Variant colors reference typed theme color keys. Size values are unscaled design units, scaled once by Button. Unspecified variants and size fields keep their package defaults; `labelProps.numberOfLines` overrides the theme default, and omitting both keeps labels wrappable.

Custom ReactNode children are rendered unchanged and bypass `labelProps`. Give custom content an explicit accessible name when needed:

```tsx
<Button accessibilityLabel="Upload status" onPress={onUpload}>
  <View>
    <Typography text="Upload" />
    <Typography text="3 files" />
  </View>
</Button>
```

Owned/local source installation for Button: **available** with `npx @oneplatformdev/react-native-uikit add button`. Use package props/theme for ordinary visual changes and owned source when structure or behavior must diverge substantially.

## Input

Package import: `import { Input } from '@oneplatformdev/react-native-uikit'`.

```tsx
<Input label="Email" value={email} onChangeText={onChangeEmail} placeholder="name@example.com" />
<Input label="Email" value={email} errorText="Invalid email" onChangeText={onChangeEmail} />
```

Input forwards native React Native `TextInputProps` and the native TextInput ref. Native `style` styles the TextInput; `containerStyle` styles the outer field wrapper; `inputContainerStyle` styles the bordered row. Explicit styles apply after theme and visual-state styles. `labelProps`, `helperTextProps`, and `errorTextProps` customize their corresponding Typography without changing the native input.

`helperText` appears below the field until `errorText` is nonempty or `invalid` is true. A nonempty `errorText` implies invalid and is announced as an alert; `invalid` alone changes the border without a message. Visual priority is disabled, invalid, focused, then normal. `disabled` forces native `editable={false}` and disabled styling; native `editable={false}` or `readOnly={true}` without `disabled` keeps normal styling. Multiline remains native, and callers can override its height with `inputContainerStyle`.

Use logical `startAccessory` and `endAccessory` for caller-owned icons or other content. Password visibility is opt-in: `secureTextEntry` stays native, and `passwordToggle` supplies ready localized action labels and icons without requiring an icon or localization dependency in the package:

```tsx
<Input
  label="Password"
  secureTextEntry
  value={password}
  onChangeText={onChangePassword}
  passwordToggle={{
    show: { label: showPasswordText, icon: <EyeIcon /> },
    hide: { label: hidePasswordText, icon: <EyeOffIcon /> },
  }}
/>
```

Input derives its native accessibility label from `label` only when the caller omits `accessibilityLabel`; placeholders are not accessible-name substitutes. Explicit accessibility props win. Supply a meaningful `accessibilityLabel` for unlabeled fields. Input does not translate strings or validate values. Configure its colors, geometry, and typography through partial `createTheme({ input: { ... } })` overrides; color/font/variant references remain typed theme tokens and numeric dimensions remain unscaled design values.

Owned/local source installation for Input: **available** with `npx @oneplatformdev/react-native-uikit add input`.

## Switch and Checkbox

Both are controlled: pass `value`/`onValueChange` to `Switch` or `checked`/`onValueChange` to `Checkbox`. They use theme colors by default, accept accessibility labels and hints, and keep a usable press target even with small visual dimensions.

`Switch` defaults to a 40×24 track with a 20-unit thumb. Override `width`, `height`, `thumbSize`, track/thumb colors, or provide a custom `thumb` node. The consumer owns the custom node's appearance. The thumb animates when `value` changes.

`Checkbox` defaults to a 22-unit slightly rounded square with a built-in checkmark. Override `size`, state colors, `borderWidth`, and `iconSize`/`iconColor`. Use `shape="circle"` for a radius derived from its size, or `shape="square"` with `borderRadius` (including `0`) for custom corners. Supply an `icon` node to replace the built-in indicator; the consumer owns that node's size and color.

Use `interactive={false}` when Checkbox is only a visual indicator inside another pressable row. It renders a non-interactive View, does not handle touches, and leaves checked-state accessibility to the parent row. The default remains interactive.

Owned source is available through `npx @oneplatformdev/react-native-uikit add switch` and `npx @oneplatformdev/react-native-uikit add checkbox`. Both are standalone components; Switch uses the existing `react-native-reanimated` peer.

## PhotoPreview and EmptyListView

`PhotoPreview` uses `@d11/react-native-fast-image` for both the thumbnail and optional fullscreen viewer. Install that native peer in the app. It accepts a FastImage source (`{ uri }` or a local `require(...)`) and passes it unchanged to both images, preserving headers, priority, and any explicit cache policy. Without `source.cache`, FastImage uses its own default `immutable` policy (URI-keyed caching); choose `source={{ uri, cache: FastImage.cacheControl.web }}` when HTTP-header-aware caching is needed. The default thumbnail is a 120-unit square with the theme's medium radius. `width`/`height` are design values; `aspectRatio` derives the missing dimension (width wins if both dimensions and a ratio are supplied). `style` applies after container geometry; `imageStyle` applies after the fill-image style. Source, resize-mode, and image-style types follow FastImage rather than React Native `Image`.

```tsx
<PhotoPreview source={{ uri }} />
<PhotoPreview source={{ uri }} fullscreen closeAccessibilityLabel={closePhotoLabel} />
<PhotoPreview source={{ uri }} fullscreen closeIcon={<MyCloseIcon />} loadingIndicator={<MyLoader />} />
<PhotoPreview source={{ uri }} onRemovePress={onRemove} removeIcon={<MyRemoveIcon />} />
```

`fullscreen` is opt-in. Pressing opens one built-in Modal with a cached FastImage (`contain` by default), a centered package Loader until load or error, and a close button positioned at the unscaled top safe-area inset plus scaled design spacing. Apps using fullscreen should configure their usual `SafeAreaProvider`. Override the fullscreen background, resize mode, image style, close icon/labels, or loading indicator as needed. With `fullscreen`, `onPress` observes the same thumbnail press after opening; `onFullscreenOpen`/`onFullscreenClose` observe viewer transitions. Without `fullscreen`, `onPress` keeps its prior behavior. The independent remove action never opens fullscreen; `overlay` remains thumbnail-only. A built-in × is used if `removeIcon` or `closeIcon` is omitted. Supply localized accessibility labels for actions.

`EmptyListView` centers optional `visual`, `title`, and `description` in available list space. Strings and numbers use themed Typography (`title` and `body` by default); custom React nodes render as supplied. `titleStyle` and `descriptionStyle` apply to built-in text, while custom nodes own their styling. A supplied `action` replaces the built-in Button; otherwise the Button appears only when both `actionLabel` and `onActionPress` are given. The optional `accessibilityLabel` labels the visual without grouping the readable text or action.

Owned source is available with `npx @oneplatformdev/react-native-uikit add photo-preview` and `npx @oneplatformdev/react-native-uikit add empty-list-view`. The latter also copies local Typography and Button dependencies.

## Avatar

`Avatar` accepts a React Native image `source` and defaults to a 40-unit circle. Override `size`, use `shape="square"` with `borderRadius` (including `0`), or customize `backgroundColor` and `textColor`. Fallback order is image → custom `fallback` → `fallbackText` → up to two initials from `name` → a dependency-free silhouette. If an image fails, the fallback appears; changing `source` allows the new image to load. `badge` is positioned at the edge without being clipped. Pass `onPress` for a labeled button; otherwise the avatar exposes image semantics. For a button, `accessibilityLabel` names the action and `imageAccessibilityLabel` is ignored; without `onPress`, `imageAccessibilityLabel` overrides the image label. `size` and `shape` remain authoritative over geometry in `style`/`imageStyle`. Provide localized accessibility text where needed. Owned source: `npx @oneplatformdev/react-native-uikit add avatar` (also installs local Typography).

## ScreenContainer, CustomAlert, and BottomModal

`ScreenContainer` provides a theme-backed safe-area layout, optional scrolling, and optional keyboard-aware scrolling or avoidance. Pass `gradient={{ colors, locations, start, end }}` to render a caller-configured background across the entire screen, behind the safe-area content; omit it for the solid theme background. Gradient coordinates are normalized and are not scaled. Pass ordinary ScrollView props when scrolling is enabled; use `containerStyle` and `contentContainerStyle` for layout overrides.

Pass `background={<DecorativeBackground />}` for an application-owned, full-screen layer behind the safe-area content. It replaces `gradient` when both are supplied, does not affect layout, and cannot intercept touches. Pass `overlay={<FloatingAction />}` for a full-screen layer above the content; empty parts of that layer pass touches through, while its interactive children remain usable. The consumer owns each overlay child's position, safe-area offsets, visibility, and interactions.

For non-scrolling keyboard avoidance, omitting `keyboardAvoidingBehavior` keeps the default `behavior="padding"`; `keyboardAvoidingBehavior={null}` omits the behavior prop; an explicit behavior is forwarded. Keyboard-aware scrolling is unchanged.

```tsx
<ScreenContainer background={<DecorativeBackground />} overlay={<FloatingAction />}>
  <Content />
</ScreenContainer>

<ScreenContainer isKeyboardAvoiding keyboardAvoidingBehavior={null}>
  <Form />
</ScreenContainer>
```

`CustomAlert` animates a centered modal with a dismissible backdrop. Supply `header`, children, and optional `footer` content; compose your own actions with `Button`. Optional `closeAction` accepts an icon and an application-supplied accessibility label. No strings are translated by the kit.

`BottomModal` provides the reference-style slide/drag dismissal and keyboard-height-aware positioning. Supply `children`, `onClose`, and optionally `title`, `customHeader`, and a labeled `closeAction` icon. `Keyboard.dismiss()` and the close animation start together; `closeRef` can trigger the same close path externally. The kit does not render app-specific toasts.

Both modes require consumers to install the declared native peers used by these components: `@d11/react-native-fast-image`, `react-native-keyboard-controller`, `react-native-linear-gradient`, `react-native-reanimated`, and `react-native-safe-area-context`. Applications using keyboard-aware or safe-area behavior should configure the providers and native setup required by those libraries. The kit does not bundle those peers or install them through `add`.

## ConnectionContainer

`ConnectionContainer` displays a dismissible safe-area banner above optional children. The application supplies `isConnected` (`true`, `false`, or `null` while unknown), localized `disconnectedText`/`reconnectedText`, and optional icons. The kit does not subscribe to a network library. Like the reference behavior, sustained disconnection appears after three seconds; a reconnection banner appears only after an offline banner was shown and hides after three seconds. Supply `dismissAccessibilityHint` if the dismiss action needs additional spoken context.

## HeaderWithBackButton and Loader

`HeaderWithBackButton` uses caller-owned navigation, icon, and accessibility text. It defaults to a left-aligned title; center mode keeps the title centered across the whole header even when side controls have different widths. The parent (for example `ScreenContainer`) owns safe-area insets.

```tsx
import { HeaderWithBackButton, Loader } from '@oneplatformdev/react-native-uikit';

<HeaderWithBackButton
  title="Details"
  backIcon={<BackIcon />}
  backAccessibilityLabel="Back"
  onBackPress={goBack}
/>
<HeaderWithBackButton
  title="Account"
  titleAlign="center"
  titleVariant="title"
  titleSize={19}
  backIcon={<BackIcon />}
  backAccessibilityLabel="Back"
  onBackPress={goBack}
  rightAccessory={<SettingsAction />}
/>

<Loader accessibilityLabel="Loading" />
<Loader indicator={<MyAnimatedLoader />} transparent accessibilityLabel="Loading" />
```

`Loader` is an absolute, container-filling overlay by default; `inline` keeps it in layout. The caller controls whether it is rendered. A custom `indicator` completely replaces the default `ActivityIndicator` without requiring extra dependencies.

## Logger

Logger displays application-owned entries; it does not collect, store, or sanitize logs. Pass newest-first entries and control visibility outside the component:

```tsx
import { Logger, type LoggerEntry } from '@oneplatformdev/react-native-uikit';

const logs: LoggerEntry[] = [
  { id: 'response-1', type: 'response', name: 'POST /messages', message: '{"ok":true}',
    http: { correlationId: 'call-1', phase: 'response', status: 201, durationMs: 842 } },
  { id: 'request-1', type: 'request', name: 'POST /messages', message: '',
    requestData: { params: 'page: 1', body: '{"text":"hello"}' },
    http: { correlationId: 'call-1', phase: 'request' } },
  { id: 'event-1', type: 'info', name: 'Sync', message: 'Finished' },
];

<Logger
  logs={logs}
  visible={visible}
  onOpen={() => setVisible(true)}
  onClose={() => setVisible(false)}
  onClear={() => setLogs([])}
  onCopyEntry={(_entry, text) => copyLogText(text)}
  labels={{ title: 'Logs', clear: 'Clear', close: 'Close', empty: 'No logs',
    request: 'Request', response: 'Response', params: 'Params', body: 'Body',
    payload: 'Payload', status: 'Status', copy: 'Copy' }}
/>
```

Entries with the same unique `http.correlationId` form one block, with request above response even when storage is newest-first. Each entry keeps its own collapsed-by-default expansion state; pending requests and orphan responses remain visible. Long payload text is selectable, with no clipboard dependency or combined exchange-copy action. Omit `onClear` to hide the clear action; omit `onOpen` if the application supplies its own launcher. The application owns HTTP correlation IDs and any development-only mount policy. Owned source is available with `npx @oneplatformdev/react-native-uikit add logger` (which also installs local Typography).

HTTP sections use `request` and `response` labels for accessibility, not visible headings. Response status and duration come from structured `http` metadata. Blank messages have no expand action; applications should pass an empty message for absent payloads.

Applications can supply sanitized, display-ready `requestData.params` and `requestData.body` separately from the response `message`. A request section appears only when it has params, body, or a legacy request message. Params are visible without expanding; bodies and response payloads expand independently. `onCopyEntry` receives the individual entry and its copyable text, even while collapsed; `copyIcon` is optional. The application performs the clipboard write and handles any feedback or failure.

Params-only requests show params with a top-aligned copy action and no expand control. A collapsed request body is identified by the caller-provided `payload` label; `body` still labels the combined params/body copy text. The caller-provided `status` label precedes structured response metadata, while only the numeric status receives a semantic theme color: 2xx `success`, 3xx `icon`, 4xx `warning`, 5xx `error`, and other values `text`.
