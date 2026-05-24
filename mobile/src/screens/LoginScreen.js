import { useState } from 'react'
import {
    Alert,
    KeyboardAvoidingView, Platform,
    ScrollView,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View
} from 'react-native'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function LoginScreen({ navigation }) {
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()

    const handleSubmit = async () => {
        if (!form.email || !form.password) {
            return Alert.alert('Error', 'Email dan password wajib diisi!')
        }
        setLoading(true)
        try {
            const res = await api.post('/auth/login', {
                email: form.email,
                password: form.password,
            })
            await login(res.data.user, res.data.token)
        } catch (err) {
            Alert.alert('Login Gagal', err.response?.data?.message || 'Terjadi kesalahan.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

                <View style={styles.header}>
                    <Text style={styles.logo}>Dapur<Text style={styles.logoAccent}>Mama</Text></Text>
                    <Text style={styles.tagline}>🍳 Platform Resep Masakan Indonesia</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.title}>Selamat Datang! 👋</Text>
                    <Text style={styles.subtitle}>Masuk untuk mulai memasak</Text>

                    <View style={styles.field}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="contoh@email.com"
                            value={form.email}
                            onChangeText={v => setForm({ ...form, email: v })}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor="#aaa"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Masukkan password"
                            value={form.password}
                            onChangeText={v => setForm({ ...form, password: v })}
                            secureTextEntry
                            placeholderTextColor="#aaa"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.btn, loading && styles.btnDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.btnText}>{loading ? 'Memproses...' : 'Masuk'}</Text>
                    </TouchableOpacity>

                    <View style={styles.switchRow}>
                        <Text style={styles.switchText}>Belum punya akun? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.switchLink}>Daftar sekarang</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.stats}>
                    {[['500+', 'Resep'], ['50K+', 'Pengguna'], ['4.9★', 'Rating']].map(([val, label]) => (
                        <View key={label} style={styles.stat}>
                            <Text style={styles.statVal}>{val}</Text>
                            <Text style={styles.statLabel}>{label}</Text>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: { 
        flexGrow: 1, 
        backgroundColor: '#E8390E', 
        padding: 24, 
        justifyContent: 'center' 
    },
   
    header: { 
        alignItems: 'center', 
        marginBottom: 32 
    },
   
    logo: { 
        fontSize: 36, 
        fontWeight: '800', 
        color: 'white' 
    },
   
    logoAccent: {
        color: '#FFD4C4' 
    },
  
    tagline: { 
        color: 'rgba(255,255,255,0.8)', 
        fontSize: 14, 
        marginTop: 6 
    },
  
    card: { 
        backgroundColor: 'white', 
        borderRadius: 24, 
        padding: 24, 
        marginBottom: 24 
    },
  
    title: { 
        fontSize: 24,
        fontWeight: '700', 
        color: '#1a1a1a', 
        marginBottom: 4 
    },
 
    subtitle: { 
        fontSize: 14, 
        color: '#888', 
        marginBottom: 24 
    },
 
    field: { 
        marginBottom: 16 
    },
  
    label: { 
        fontSize: 13, 
        fontWeight: '600', 
        color: '#333', 
        marginBottom: 6 
    },
   
    input: { 
        borderWidth: 1.5, 
        borderColor: '#e0e0e0',
         borderRadius: 12, 
        padding: 13, 
        fontSize: 14, 
        color: '#1a1a1a',
        backgroundColor: '#fafafa' 
    },
  
    btn: { 
        backgroundColor: '#E8390E', 
        borderRadius: 12, 
        padding: 15, 
        alignItems: 'center', 
        marginTop: 8 
    },
   
    btnDisabled: { 
        opacity: 0.7 
    },
   
    btnText: { 
        color: 'white', 
        fontWeight: '700', 
        fontSize: 16 
    },
   
    switchRow: { 
        flexDirection: 'row', 
        justifyContent: 'center', 
        marginTop: 20 
    },
   
    switchText: { 
        color: '#888', 
        fontSize: 14 
    },
   
    switchLink: { 
        color: '#E8390E', 
        fontWeight: '700', 
        fontSize: 14 
    },
  
    stats: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        backgroundColor: 'rgba(255,255,255,0.15)', 
        borderRadius: 16, 
        padding: 16 },
   
    stat: { 
        alignItems: 'center'
    },
    
    statVal: { 
        color: 'white',
        fontWeight: '800',
        fontSize: 18 
    },
    
    statLabel: { 
        color: 'rgba(255,255,255,0.8)', 
        fontSize: 12, 
        marginTop: 2
    },
})