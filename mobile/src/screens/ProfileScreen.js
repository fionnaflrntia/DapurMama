import { useEffect, useState } from 'react'
import {
    ActivityIndicator, Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import api from '../api'
import { useAuth } from '../context/AuthContext'

function formatDate(iso) {
    if (!iso) return '-'
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useAuth()
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('history')

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/profile/history')
                setHistory(res.data.history)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [])

    const handleLogout = () => {
        if (Platform.OS === 'web') {
            if (window.confirm('Yakin ingin keluar dari akun?')) {
                logout()
            }
        } else {
            Alert.alert('Keluar', 'Yakin ingin keluar dari akun?', [
                { text: 'Batal', style: 'cancel' },
                { text: 'Keluar', style: 'destructive', onPress: logout },
            ])
        }
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <View style={styles.avatarWrap}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
                    </View>
                    <View style={styles.onlineDot} />
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.userName}>{user?.name || 'Pengguna'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'email@contoh.com'}</Text>
                    <View style={styles.memberBadge}>
                        <Text style={styles.memberText}>🍳 Member Dapur Mama</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Keluar</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.stats}>
                {[
                    { icon: '📖', value: history.length, label: 'Dimasak' },
                    { icon: '❤️', value: 0, label: 'Favorit' },
                    { icon: '⭐', value: '4.8', label: 'Rating' },
                ].map(s => (
                    <View key={s.label} style={styles.stat}>
                        <Text style={styles.statIcon}>{s.icon}</Text>
                        <Text style={styles.statValue}>{s.value}</Text>
                        <Text style={styles.statLabel}>{s.label}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.tabs}>
                {[
                    { key: 'history', label: '📖 Riwayat' },
                    { key: 'settings', label: '⚙️ Pengaturan' },
                ].map(tab => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                        onPress={() => setActiveTab(tab.key)}
                    >
                        <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={{ padding: 16 }}>
                {activeTab === 'history' && (
                    loading ? (
                        <ActivityIndicator color="#E8390E" style={{ marginTop: 20 }} />
                    ) : history.length === 0 ? (
                        <View style={styles.empty}>
                            <Text style={{ fontSize: 48 }}>🍽️</Text>
                            <Text style={styles.emptyTitle}>Belum ada riwayat</Text>
                            <Text style={styles.emptyDesc}>Tandai resep yang sudah kamu masak!</Text>
                            <TouchableOpacity
                                style={styles.exploreBtn}
                                onPress={() => navigation.navigate('Recipes')}
                            >
                                <Text style={styles.exploreBtnText}>Cari Resep</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ gap: 10 }}>
                            {history.map((item, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={styles.historyCard}
                                    onPress={() => navigation.navigate('RecipeDetail', { id: item.recipe?._id })}
                                    activeOpacity={0.8}
                                >
                                    <Image source={{ uri: item.recipe?.img }} style={styles.historyImg} />
                                    <View style={styles.historyInfo}>
                                        <Text style={styles.historyTitle} numberOfLines={1}>{item.recipe?.title}</Text>
                                        <View style={styles.historyMeta}>
                                            <View style={styles.catBadge}>
                                                <Text style={styles.catBadgeText}>{item.recipe?.category}</Text>
                                            </View>
                                            <Text style={styles.historyTime}>⏱️ {item.recipe?.time} mnt</Text>
                                        </View>
                                        <Text style={styles.historyDate}>Dimasak: {formatDate(item.cookedAt)}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )
                )}

                {activeTab === 'settings' && (
                    <View style={styles.settingsCard}>
                        {[
                            { icon: '👤', label: 'Nama', value: user?.name },
                            { icon: '📧', label: 'Email', value: user?.email },
                            { icon: '🔒', label: 'Password', value: '••••••••' },
                        ].map((item, idx) => (
                            <View key={idx} style={[styles.settingRow, idx < 2 && styles.settingRowBorder]}>
                                <Text style={styles.settingIcon}>{item.icon}</Text>
                                <View style={styles.settingInfo}>
                                    <Text style={styles.settingLabel}>{item.label}</Text>
                                    <Text style={styles.settingValue}>{item.value}</Text>
                                </View>
                            </View>
                        ))}
                        <TouchableOpacity style={styles.logoutFullBtn} onPress={handleLogout}>
                            <Text style={styles.logoutFullText}>🚪 Keluar dari Akun</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#FFF8F5' 
    },

    header: { 
        backgroundColor: 'white', 
        padding: 20, 
        paddingTop: 56, 
        flexDirection: 'row', 
        alignItems: 'flex-start', 
        gap: 12, 
        borderBottomWidth: 1, 
        borderBottomColor: '#f0e6e0' 
    },

    avatarWrap: { 
        position: 'relative' 
    },

    avatar: {
        width: 60, 
        height: 60, 
        borderRadius: 30, 
        backgroundColor: '#E8390E', 
        alignItems: 'center', 
        justifyContent: 'center' 
    },

    avatarText: { 
        color: 'white', 
        fontWeight: '800', 
        fontSize: 24 
    },

    onlineDot: { 
        position: 'absolute', 
        bottom: 0, right: 0, 
        width: 14, height: 14, 
        borderRadius: 7, 
        backgroundColor: '#22c55e', 
        borderWidth: 2, 
        borderColor: 'white' 
    },

    headerInfo: { 
        flex: 1 
    },

    userName: { 
        fontSize: 18, 
        fontWeight: '800', 
        color: '#1a1a1a' 
    },

    userEmail: { 
        fontSize: 13, 
        color: '#888', 
        marginTop: 2 
    },

    memberBadge: { 
        backgroundColor: '#fff1ec', 
        borderRadius: 20, 
        paddingHorizontal: 10,
        paddingVertical: 4, 
        alignSelf: 'flex-start', 
        marginTop: 6 
    },

    memberText: { 
        fontSize: 11, 
        fontWeight: '700',
        color: '#E8390E' 
    },

    logoutBtn: { 
        borderWidth: 1, 
        borderColor: '#fecaca', 
        backgroundColor: '#fef2f2', 
        borderRadius: 10, 
        paddingHorizontal: 12, 
        paddingVertical: 7 
    },

    logoutText: { 
        color: '#dc2626', 
        fontWeight: '700', 
        fontSize: 13 
    },

    stats: { 
        flexDirection: 'row', 
        backgroundColor: 'white', 
        marginHorizontal: 16, 
        marginTop: 16, 
        borderRadius: 16, 
        padding: 16, 
        borderWidth: 1,
        borderColor: '#f0e6e0'
    },

    stat: { 
        flex: 1, 
        alignItems: 'center' 
    },

    statIcon: { 
        fontSize: 22, 
        marginBottom: 4 
    },

    statValue: { 
        fontSize: 20, 
        fontWeight: '800', 
        color: '#E8390E' 
    },

    statLabel: { 
        fontSize: 11, 
        color: '#888', 
        marginTop: 2 
    },

    tabs: { 
        flexDirection: 'row', 
        backgroundColor: 'white', 
        margin: 16,
        marginBottom: 0, 
        borderRadius: 16,
        padding: 4 
    },

    tab: { 
        flex: 1, 
        paddingVertical: 10, 
        alignItems: 'center', 
        borderRadius: 12 
    },

    tabActive: { 
        backgroundColor: '#E8390E' 
    },

    tabText: { 
        fontSize: 13, 
        fontWeight: '600', 
        color: '#888' 
    },

    tabTextActive: { 
        color: 'white' 
    },

    empty: { 
        alignItems: 'center', 
        paddingVertical: 40, 
        gap: 8 
    },

    emptyTitle: { 
        fontSize: 16, 
        fontWeight: '700', 
        color: '#333' 
    },

    emptyDesc: { 
        fontSize: 13, 
        color: '#888' 
    },

    exploreBtn: {
        backgroundColor: '#E8390E', 
        borderRadius: 12,
        paddingHorizontal: 24,
        paddingVertical: 12, 
        marginTop: 8 
    },

    exploreBtnText: { 
        color: 'white', 
        fontWeight: '700' 
    },

    historyCard: { 
        backgroundColor: 'white', 
        borderRadius: 14,
        flexDirection: 'row', 
        overflow: 'hidden', 
        borderWidth: 1, 
        borderColor: '#f0e6e0' 
    },

    historyImg: {
        width: 80, 
        height: 80 
    },

    historyInfo: { 
        flex: 1,
        padding: 10, 
        justifyContent: 'space-between' 
    },

    historyTitle: { 
        fontSize: 13, 
        fontWeight: '700', 
        color: '#1a1a1a' 
    },

    historyMeta: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 8 
    },

    catBadge: { 
        backgroundColor: '#fff1ec',
        borderRadius: 20, 
        paddingHorizontal: 8,
        paddingVertical: 2 
    },

    catBadgeText: { 
        fontSize: 10, 
        fontWeight: '700', 
        color: '#E8390E' 
    },

    historyTime: { 
        fontSize: 11, 
        color: '#888' 
    },

    historyDate: { 
        fontSize: 11, 
        color: '#aaa' 
    },

    settingsCard: { 
        backgroundColor: 'white', 
        borderRadius: 16, 
        overflow: 'hidden', 
        borderWidth: 1,
        borderColor: '#f0e6e0' 
    },

    settingRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 16, 
        gap: 12 
    },

    settingRowBorder: { 
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5' 
    },

    settingIcon: { 
        fontSize: 20 
    },

    settingInfo: { 
        flex: 1 
    },

    settingLabel: { 
        fontSize: 11, 
        color: '#888' 
    },

    settingValue: { 
        fontSize: 14, 
        fontWeight: '600', 
        color: '#1a1a1a', 
        marginTop: 2 
    },

    logoutFullBtn: { 
        margin: 16, 
        borderWidth: 1, 
        borderColor: '#fecaca', 
        backgroundColor: '#fef2f2', 
        borderRadius: 12, 
        padding: 14, 
        alignItems: 'center'
    },

    logoutFullText: { 
        color: '#dc2626', 
        fontWeight: '700', 
        fontSize: 14 
    },
})