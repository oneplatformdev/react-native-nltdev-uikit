# BottomModal Phase 1B fixture

`BottomModalPhase1B.tsx` is development-only and is not exported or packed. Mount it as a screen inside an existing React Native app with `UIProvider`, `SafeAreaProvider`, and `KeyboardProvider` configured.

- Comments: scroll and refresh the normal and inverted FlatList; focus and type into the multiline footer; confirm the header/footer remain fixed and external close is immediate.
- Expandable static content: drag the header up to expand, down to collapse, then down again to dismiss. Reopen after expanding and confirm it starts collapsed. Collapsing must not increment the close-request counter.
- Expandable long list: scroll the normal FlatList at both heights and drag only the header to resize. Height animates after gesture release; list gestures must not resize the modal.
- No drag dismissal: drag the header between heights, then pull down while collapsed; it must stay open. Close and backdrop still dismiss.
- Modals: compare opening B while A stays visible with hiding A and opening B on the next frame. Confirm the actual iOS and Android stacking/handoff behavior before adding package infrastructure.

The UI-kit repository has no runnable example app. Type-check this fixture with `./node_modules/.bin/tsc --noEmit -p dev/tsconfig.json`; interaction results require a native host and real-device testing.
