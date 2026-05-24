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

export default function RegisterScreen({ navigation }) {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()

    const handleSubmit = async () => {
        if (!form.name || !form.email || !form.password) {
            return Alert.alert('Error', 'Semua field wajib diisi!')
        }
        if (form.password !== form.confirm) {
            return Alert.alert('Error', 'Password tidak cocok!')
        }
        if (form.password.length < 6) {
            return Alert.alert('Error', 'Password minimal 6 karakter!')
        }
        setLoading(true)
        try {
            const res = await api.post('/auth/register', {
                name: form.name,
                email: form.email,
                password: form.password,
            })
            await login(res.data.user, res.data.token)
        } catch (err) {
            Alert.alert('Registrasi Gagal', err.response?.data?.message || 'Terjadi kesalahan.')
        } finally {
            setLoading(false)
        }
    }

    const fields = [
        { key: 'name', label: 'Nama Lengkap', placeholder: 'Nama Anda', type: 'default' },
        { key: 'email', label: 'Email', placeholder: 'contoh@email.com', type: 'email-address' },
        { key: 'password', label: 'Password', placeholder: 'Minimal 6 karakter', secure: true },
        { key: 'confirm', label: 'Konfirmasi Password', placeholder: 'Ulangi password', secure: true },
    ]

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

                <View style={styles.header}>
                    <Text style={styles.logo}>Dapur<Text style={styles.logoAccent}>Mama</Text></Text>
                    <Text style={styles.tagline}>Bergabung dan mulai memasak! 🍳</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.title}>Buat Akun Baru 🎉</Text>
                    <Text style={styles.subtitle}>Gratis selamanya, mulai memasak hari ini!</Text>

                    {fields.map(field => (
                        <View key={field.key} style={styles.field}>
                            <Text style={styles.label}>{field.label}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={field.placeholder}
                                value={form[field.key]}
                                onChangeText={v => setForm({ ...form, [field.key]: v })}
                                keyboardType={field.type || 'default'}
                                autoCapitalize={field.key === 'name' ? 'words' : 'none'}
                                secureTextEntry={field.secure || false}
                                placeholderTextColor="#aaa"
                            />
                        </View>
                    ))}

                    <TouchableOpacity
                        style={[styles.btn, loading && styles.btnDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.btnText}>{loading ? 'Membuat akun...' : 'Daftar Sekarang'}</Text>
                    </TouchableOpacity>

                    <View style={styles.switchRow}>
                        <Text style={styles.switchText}>Sudah punya akun? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.switchLink}>Masuk di sini</Text>
                        </TouchableOpacity>
                    </View>
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
        marginBottom: 28 
    },

    logo: { 
        fontSize: 34, 
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
        marginBottom: 16 
    },

    title: { 
        fontSize: 22, 
        fontWeight: '700', 
        color: '#1a1a1a', 
        marginBottom: 4 
    },

    subtitle: { 
        fontSize: 13, 
        color: '#888', 
        marginBottom: 20 
    },

    field: { 
        marginBottom: 14 
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
        padding: 12, 
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
        marginTop: 18 
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
})