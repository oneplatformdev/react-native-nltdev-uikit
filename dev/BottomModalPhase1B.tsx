// Development-only fixture. Mount inside UIProvider, SafeAreaProvider, and KeyboardProvider.
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomModal } from '../src/components/BottomModal';

const rows = Array.from({ length: 80 }, (_, index) => `Comment ${index + 1}`);
const mediaRows = Array.from({ length: 90 }, (_, index) => `Media ${index + 1}`);

export const BottomModalPhase1B = () => {
    const { top } = useSafeAreaInsets();
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [inverted, setInverted] = useState(false);
    const [comment, setComment] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [mediaVisible, setMediaVisible] = useState(false);
    const [staticVisible, setStaticVisible] = useState(false);
    const [noDismissVisible, setNoDismissVisible] = useState(false);
    const [staticCloseRequests, setStaticCloseRequests] = useState(0);
    const [firstVisible, setFirstVisible] = useState(false);
    const [secondVisible, setSecondVisible] = useState(false);
    const [dismissCount, setDismissCount] = useState(0);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 300);
    }, []);
    const onHandoff = useCallback(() => {
        setFirstVisible(false);
        requestAnimationFrame(() => setSecondVisible(true));
    }, []);
    const renderRow = useCallback(({ item }: { item: string }) => (
        <View style={styles.row}><Text>{item}</Text></View>
    ), []);

    return (
        <View style={styles.root}>
            <Pressable onPress={() => setCommentsVisible(true)}><Text>Open comments</Text></Pressable>
            <Pressable onPress={() => setInverted(value => !value)}><Text>Toggle inverted list</Text></Pressable>
            <Pressable onPress={() => setMediaVisible(true)}><Text>Open 60% media geometry</Text></Pressable>
            <Pressable onPress={() => setStaticVisible(true)}><Text>Open expandable static content</Text></Pressable>
            <Pressable onPress={() => setNoDismissVisible(true)}><Text>Open expandable without drag dismissal</Text></Pressable>
            <Pressable onPress={() => setFirstVisible(true)}><Text>Open modal A</Text></Pressable>
            <Text>Dismissed cycles: {dismissCount}</Text>
            <Text>Static close requests: {staticCloseRequests}</Text>

            <BottomModal visible={commentsVisible} onClose={() => setCommentsVisible(false)}
                sizing={{ mode: 'fullscreen' }} topInset={inverted ? 0 : top}
                showHeader={false} dragToDismiss="none" onDismiss={() => setDismissCount(count => count + 1)}
                contentContainerStyle={styles.modalContent}>
                <View style={[styles.column, inverted && { paddingTop: top }]}>
                    <View style={styles.header}>
                        <Text>Comments {inverted ? '(inverted)' : ''}</Text>
                        <Pressable onPress={() => setCommentsVisible(false)}><Text>Close</Text></Pressable>
                    </View>
                    <FlatList data={rows} inverted={inverted} renderItem={renderRow}
                        keyExtractor={item => item} style={styles.list}
                        onRefresh={onRefresh} refreshing={refreshing} keyboardShouldPersistTaps="handled" />
                    <TextInput multiline value={comment} onChangeText={setComment}
                        placeholder="Multiline comment" style={styles.input} />
                </View>
            </BottomModal>

            <BottomModal visible={staticVisible} onClose={() => setStaticVisible(false)}
                sizing={{ mode: 'expandable', initialFraction: 0.6 }}
                onCloseRequest={() => setStaticCloseRequests(count => count + 1)}
                customHeader={<View style={styles.header}>
                    <Text>Drag: expand / collapse / dismiss</Text>
                    <Pressable onPress={() => setStaticVisible(false)}><Text>Close</Text></Pressable>
                </View>}
                contentContainerStyle={styles.modalContent}>
                <View style={styles.column}><Text>Static content stays in the two-position modal.</Text></View>
            </BottomModal>

            <BottomModal visible={mediaVisible} onClose={() => setMediaVisible(false)}
                sizing={{ mode: 'expandable', initialFraction: 0.6 }}
                customHeader={<View style={styles.header}>
                    <Text>Drag header; scroll list</Text>
                    <Pressable onPress={() => setMediaVisible(false)}><Text>Close</Text></Pressable>
                </View>}
                contentContainerStyle={styles.modalContent}>
                <View style={styles.column}>
                    <FlatList data={mediaRows} renderItem={renderRow} keyExtractor={item => item} style={styles.list} />
                </View>
            </BottomModal>

            <BottomModal visible={noDismissVisible} onClose={() => setNoDismissVisible(false)}
                sizing={{ mode: 'expandable', initialFraction: 0.6 }} dragToDismiss="none"
                customHeader={<View style={styles.header}>
                    <Text>Drag to resize; down cannot dismiss</Text>
                    <Pressable onPress={() => setNoDismissVisible(false)}><Text>Close</Text></Pressable>
                </View>}
                contentContainerStyle={styles.modalContent}>
                <View style={styles.column}><Text>Backdrop and Close still dismiss.</Text></View>
            </BottomModal>

            <BottomModal visible={firstVisible} onClose={() => setFirstVisible(false)} title="Modal A">
                <Pressable onPress={() => setSecondVisible(true)}><Text>Open B while A remains visible</Text></Pressable>
                <Pressable onPress={onHandoff}><Text>Hide A, open B next frame</Text></Pressable>
            </BottomModal>
            <BottomModal visible={secondVisible} onClose={() => setSecondVisible(false)} title="Modal B">
                <Text>Second modal</Text>
            </BottomModal>
        </View>
    );
};

const styles = StyleSheet.create({
    root: { flex: 1, justifyContent: 'center', gap: 16, padding: 16 },
    modalContent: { flex: 1, paddingHorizontal: 0, paddingBottom: 0 },
    column: { flex: 1, minHeight: 0 },
    header: { minHeight: 52, padding: 16, flexDirection: 'row', justifyContent: 'space-between' },
    list: { flex: 1 },
    row: { minHeight: 48, padding: 12, borderBottomWidth: 1, borderColor: '#CCCCCC' },
    input: { minHeight: 56, maxHeight: 120, padding: 12, borderTopWidth: 1, borderColor: '#CCCCCC' },
});
