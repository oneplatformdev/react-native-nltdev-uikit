const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ts = require('typescript');
const { jsx } = require('react/jsx-runtime');

const componentDir = path.resolve(__dirname, '../src/components/HeaderWithBackButton');
const scaling = {
    scaleHorizontal: value => value,
    scaleVertical: value => value,
};
const colors = { text: '#fff', textMuted: '#aaa' };
const spacing = { xs: 4, sm: 8, md: 12, lg: 16 };

const loadSource = (file, mocks) => {
    const source = fs.readFileSync(path.join(componentDir, file), 'utf8');
    const code = ts.transpileModule(source, {
        compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS },
    }).outputText;
    const module = { exports: {} };
    const mockedRequire = name => mocks[name] ?? require(name);
    new Function('require', 'module', 'exports', code)(mockedRequire, module, module.exports);
    return module.exports;
};

const { getStyles } = loadSource('ui/styles.ts', {
    'react-native': { StyleSheet: { create: styles => styles } },
});
const { useHeaderWithBackButton } = loadSource('presenters/useHeaderWithBackButton.ts', {
    react: { useState: () => [undefined, () => {}] },
});
const loadHeader = presenter => loadSource('ui/HeaderWithBackButton.tsx', {
    react: { useMemo: calculate => calculate() },
    'react-native': { TouchableOpacity: 'TouchableOpacity', View: 'View' },
    '../../../theme': { useUITheme: () => ({ colors, spacing }) },
    '../../../utils': { useScaling: () => scaling },
    '../../Typography': { Typography: 'Typography' },
    '../presenters/useHeaderWithBackButton': { useHeaderWithBackButton: presenter },
    './styles': { getStyles },
});
const { HeaderWithBackButton } = loadHeader(useHeaderWithBackButton);

const backIcon = jsx('BackIcon', {});
const onBackPress = () => {};
const headerProps = props => ({
    title: 'Details',
    backIcon,
    backAccessibilityLabel: 'Back',
    onBackPress,
    ...props,
});
const render = props => HeaderWithBackButton(headerProps(props));
const renderWithWidths = (left, right, props) => {
    let side = 0;
    const measured = loadSource('presenters/useHeaderWithBackButton.ts', {
        react: { useState: () => [[left, right][side++], () => {}] },
    }).useHeaderWithBackButton;
    return loadHeader(measured).HeaderWithBackButton(headerProps(props));
};
const nodes = (root, type) => {
    const result = [];
    const visit = node => {
        if (!node || typeof node !== 'object') return;
        if (node.type === type) result.push(node);
        const children = node.props?.children;
        for (const child of Array.isArray(children) ? children : [children]) visit(child);
    };
    visit(root);
    return result;
};
const mergedStyle = style => Object.assign({}, ...(Array.isArray(style) ? style : [style]).filter(Boolean));

test('keeps the default title and back control contract', () => {
    const header = render();
    const title = nodes(header, 'Typography')[0];
    const back = nodes(header, 'TouchableOpacity')[0];
    assert.equal(title.props.text, 'Details');
    assert.equal(title.props.variant, 'h3');
    assert.equal(title.props.numberOfLines, 1);
    assert.deepEqual(mergedStyle(back.props.style), getStyles(colors, spacing, scaling).backButton);
    assert.deepEqual(back.props.hitSlop, { top: 8, bottom: 8, left: 8, right: 8 });
    assert.equal(back.props.onPress, onBackPress);
    assert.equal(back.props.accessibilityLabel, 'Back');
    assert.equal(back.props.accessibilityRole, 'button');
    assert.equal(back.props.disabled, false);
    assert.deepEqual(back.props.accessibilityState, { disabled: false });
});

test('supports omitted, custom, and multiline titles without duplicate title text', () => {
    assert.equal(nodes(render({ title: undefined }), 'Typography').length, 0);
    const customTitle = jsx('CustomTitle', {});
    const custom = render({ title: 'Ignored', titleComponent: customTitle });
    assert.equal(nodes(custom, 'Typography').length, 0);
    assert.equal(nodes(custom, 'CustomTitle').length, 1);
    assert.equal(mergedStyle(custom.props.children[1].props.style).overflow, 'hidden');
    const centeredCustom = render({ titleComponent: customTitle, titleAlign: 'center' });
    assert.equal(mergedStyle(centeredCustom.props.children[1].props.style).alignItems, 'center');
    assert.equal(nodes(render({ titleComponent: 'Custom text' }), 'Typography')[0].props.text, 'Custom text');
    assert.equal(nodes(render({ titleNumberOfLines: 2 }), 'Typography')[0].props.numberOfLines, 2);
    assert.equal(nodes(render({ titleComponent: null }), 'Typography')[0].props.text, 'Details');
});

test('enlarges only the back touch container and suppresses excess hit slop', () => {
    const header = render({ backButtonSize: 50, backAccessibilityHint: 'Returns to list' });
    const back = nodes(header, 'TouchableOpacity')[0];
    assert.deepEqual(mergedStyle(back.props.style), { width: 50, height: 50, alignItems: 'center', justifyContent: 'center' });
    assert.deepEqual(back.props.hitSlop, { top: 0, bottom: 0, left: 0, right: 0 });
    assert.equal(back.props.children, backIcon);
    assert.equal(back.props.accessibilityHint, 'Returns to list');
    const disabled = nodes(render({ backDisabled: true, backButtonSize: 50 }), 'TouchableOpacity')[0];
    assert.equal(disabled.props.disabled, true);
    assert.deepEqual(disabled.props.accessibilityState, { disabled: true });
    assert.equal(disabled.props.accessibilityLabel, 'Back');
    assert.equal(disabled.props.children, backIcon);
    assert.equal(mergedStyle(disabled.props.style).width, 50);
    assert.deepEqual(disabled.props.hitSlop, back.props.hitSlop);
});

test('removes the back control and its layout space when hidden', () => {
    for (const backDisabled of [false, true]) {
        const header = render({ backVisible: false, backDisabled, backButtonSize: 50 });
        assert.equal(nodes(header, 'TouchableOpacity').length, 0);
        assert.equal(nodes(header, 'BackIcon').length, 0);
        assert.equal(header.props.children[0], null);
    }
});

test('preserves screen-center and adds measured-free available-space alignment', () => {
    assert.equal(useHeaderWithBackButton('center', true).centered, true);
    assert.equal(useHeaderWithBackButton('available-center', true).availableCentered, true);
    let measuredSide = 0;
    const measuredPresenter = loadSource('presenters/useHeaderWithBackButton.ts', {
        react: { useState: () => [[24, 72][measuredSide++], () => {}] },
    }).useHeaderWithBackButton('center', false);
    assert.equal(measuredPresenter.leftWidth, 0);
    assert.equal(measuredPresenter.sideWidth, 72);
    assert.equal(measuredPresenter.leftGuard, 72);
    assert.equal(measuredPresenter.rightGuard, 0);
    const centered = render({ titleAlign: 'center' });
    const available = render({ titleAlign: 'available-center', rightAccessory: jsx('RightAction', {}) });
    assert.equal(mergedStyle(nodes(centered, 'Typography')[0].props.style).textAlign, 'center');
    assert.equal(mergedStyle(nodes(available, 'Typography')[0].props.style).alignSelf, 'stretch');
    assert.equal(mergedStyle(available.props.children[1].props.style).overflow, 'hidden');
    assert.equal(mergedStyle(available.props.children[1].props.style).minWidth, 0);
    assert.equal(nodes(available, 'RightAction').length, 1);
    assert.equal(mergedStyle(available.props.children[2].props.style).width, undefined);
    const hiddenCenter = render({ titleAlign: 'center', backVisible: false, rightAccessory: jsx('RightAction', {}) });
    assert.equal(nodes(hiddenCenter, 'TouchableOpacity').length, 0);
    assert.equal(hiddenCenter.props.children[0], null);
    assert.equal(mergedStyle(hiddenCenter.props.children[1].props.style).opacity, 0);
});

test('center keeps wide text and icon accessories at natural width while guarding the title', () => {
    const wide = renderWithWidths(62, 96, {
        titleAlign: 'center',
        titleNumberOfLines: 2,
        rightAccessory: jsx('RightTextAction', { children: 'A wide translated action' }),
    });
    assert.deepEqual(mergedStyle(wide.props.children[2].props.style), { flexShrink: 0 });
    assert.equal(wide.props.children[2].props.onLayout instanceof Function, true);
    assert.equal(mergedStyle(wide.props.children[1].props.style).minWidth, 0);
    assert.equal(mergedStyle(wide.props.children[1].props.style).marginLeft, 34);
    assert.equal(mergedStyle(wide.props.children[1].props.style).marginRight, 0);
    assert.equal(nodes(wide, 'Typography')[0].props.numberOfLines, 2);
    assert.equal(nodes(wide, 'RightTextAction').length, 1);

    const icon = renderWithWidths(62, 46, { titleAlign: 'center', rightAccessory: jsx('RightIcon', {}) });
    assert.equal(mergedStyle(icon.props.children[1].props.style).marginLeft, 0);
    assert.equal(mergedStyle(icon.props.children[1].props.style).marginRight, 16);
    const noRight = renderWithWidths(62, 0, { titleAlign: 'center' });
    assert.equal(mergedStyle(noRight.props.children[1].props.style).marginRight, 62);
});

test('hidden and disabled back controls preserve center without squeezing the accessory', () => {
    const action = jsx('RightTextAction', { children: 'Save' });
    const hidden = renderWithWidths(undefined, 96, { titleAlign: 'center', backVisible: false, rightAccessory: action });
    assert.equal(hidden.props.children[0], null);
    assert.equal(mergedStyle(hidden.props.children[1].props.style).marginLeft, 96);
    assert.equal(mergedStyle(hidden.props.children[2].props.style).width, undefined);
    const disabled = renderWithWidths(62, 96, { titleAlign: 'center', backDisabled: true, rightAccessory: action });
    assert.equal(nodes(disabled, 'TouchableOpacity')[0].props.disabled, true);
    assert.equal(mergedStyle(disabled.props.children[1].props.style).marginLeft, 34);
    assert.equal(mergedStyle(disabled.props.children[2].props.style).width, undefined);
    const custom = renderWithWidths(62, 96, { titleAlign: 'center', titleComponent: jsx('CustomTitle', {}), rightAccessory: action });
    assert.equal(nodes(custom, 'CustomTitle').length, 1);
    assert.equal(mergedStyle(custom.props.children[1].props.style).marginLeft, 34);
});

test('available-space layout uses the disabled back control but omits a hidden back control', () => {
    const rightAccessory = jsx('RightAction', {});
    const header = render({ style: { height: 56 }, subtitle: 'Subtitle', titleAlign: 'available-center', backDisabled: true, rightAccessory });
    assert.equal(mergedStyle(header.props.style).height, 56);
    assert.equal(nodes(header, 'Typography')[1].props.text, 'Subtitle');
    assert.equal(mergedStyle(header.props.children[0].props.children.props.style).minWidth, 30);
    assert.equal(nodes(header, 'RightAction').length, 1);
    const hidden = render({ titleAlign: 'available-center', backVisible: false, rightAccessory });
    assert.equal(hidden.props.children[0], null);
    assert.equal(nodes(hidden, 'RightAction').length, 1);
    assert.equal(mergedStyle(hidden.props.children[1].props.style).minWidth, 0);
    for (const right of [undefined, rightAccessory]) {
        for (const state of [{ backVisible: true }, { backVisible: true, backDisabled: true }, { backVisible: false }]) {
            const result = render({ titleAlign: 'available-center', rightAccessory: right, ...state });
            assert.equal(nodes(result, 'TouchableOpacity').length, state.backVisible ? 1 : 0);
            assert.equal(result.props.children[0] === null, !state.backVisible);
            assert.equal(nodes(result, 'RightAction').length, right ? 1 : 0);
        }
    }
});

test('supports custom and multiline titles without a back control', () => {
    for (const titleAlign of ['center', 'available-center']) {
        const custom = render({ backVisible: false, titleAlign, titleComponent: jsx('CustomTitle', {}), rightAccessory: jsx('RightAction', {}) });
        assert.equal(nodes(custom, 'CustomTitle').length, 1);
        assert.equal(nodes(custom, 'Typography').length, 0);
    }
    const multiline = render({ backVisible: false, titleAlign: 'available-center', titleNumberOfLines: 2 });
    assert.equal(nodes(multiline, 'Typography')[0].props.numberOfLines, 2);
});
