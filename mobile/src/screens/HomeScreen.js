import { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import api from '../api'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = [
    { name: 'Indonesian', icon: '🍛' },
    { name: 'Western', icon: '🥩' },
    { name: 'Dessert', icon: '🍰' },
    { name: 'Minuman', icon: '🍹' },
    { name: 'Chinese', icon: '🥟' },
]

export default function HomeScreen({ navigation }) {
    const { user } = useAuth()
    const [recipes, setRecipes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const res = await api.get('/recipes')
                setRecipes(res.data.recipes.slice(0, 4))
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchRecipes()
    }, [])

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Halo, {user?.name?.split(' ')[0]}! 👋</Text>
                    <Text style={styles.subGreeting}>Mau masak apa hari ini?</Text>
                </View>
                <TouchableOpacity
                    style={styles.avatarBtn}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Text style={styles.avatarText}>
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.heroBanner}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80' }}
                    style={styles.heroImg}
                />
                <View style={styles.heroOverlay}>
                    <Text style={styles.heroTitle}>Temukan Resep{'\n'}Terbaik Untukmu</Text>
                    <TouchableOpacity
                        style={styles.heroBtn}
                        onPress={() => navigation.navigate('Recipes')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.heroBtnText}>Eksplorasi Resep →</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Kategori Populer</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
                    {CATEGORIES.map((cat, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={styles.catCard}
                            onPress={() => navigation.navigate('Recipes')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.catIcon}>{cat.icon}</Text>
                            <Text style={styles.catName}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={[styles.section, { paddingBottom: 24 }]}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Rekomendasi Untukmu</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Recipes')}>
                        <Text style={styles.seeAll}>Lihat Semua</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator color="#E8390E" style={{ marginTop: 20 }} />
                ) : (
                    recipes.map(recipe => (
                        <TouchableOpacity
                            key={recipe._id}
                            style={styles.recipeCard}
                            onPress={() => navigation.navigate('RecipeDetail', { id: recipe._id })}
                            activeOpacity={0.9}
                        >
                            <Image source={{ uri: recipe.img }} style={styles.recipeImg} />
                            <View style={styles.recipeInfo}>
                                <Text style={styles.recipeCategory}>{recipe.category}</Text>
                                <Text style={styles.recipeTitle} numberOfLines={2}>{recipe.title}</Text>
                                <View style={styles.recipeMeta}>
                                    <Text style={styles.metaText}>⏱️ {recipe.time} menit</Text>
                                    <Text style={styles.metaText}>💰 Rp {recipe.price?.toLocaleString('id-ID')}</Text>
                                </View>
                                <View style={styles.ratingRow}>
                                    <Text style={styles.rating}>⭐ {recipe.rating}</Text>
                                    <View style={styles.viewBtn}>
                                        <Text style={styles.viewBtnText}>Lihat Resep</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
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
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center', 
        padding: 20,
        paddingTop: 56,
        backgroundColor: 'white',
    },

    greeting: { 
        fontSize: 22, 
        fontWeight: '800', 
        color: '#1a1a1a' 
    },

    subGreeting: { 
        fontSize: 14, 
        color: '#888', 
        marginTop: 2 
    },

    avatarBtn: {
        width: 42, 
        height: 42, 
        borderRadius: 21,
        backgroundColor: '#E8390E', 
        alignItems: 'center', 
        justifyContent: 'center',
    },

    avatarText: { 
        color: 'white', 
        fontWeight: '800', 
        fontSize: 16 
    },

    heroBanner: { 
        margin: 16, 
        borderRadius: 20, 
        overflow: 'hidden', 
        height: 180 
    },
    heroImg: { 
        width: '100%', 
        height: '100%', 
        position: 'absolute' 
    },

    heroOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        padding: 20, 
        justifyContent: 'flex-end',
    },

    heroTitle: { 
        color: 'white', 
        fontSize: 22, 
        fontWeight: '800', 
        marginBottom: 12 
    },

    heroBtn: {
        backgroundColor: '#E8390E', 
        paddingHorizontal: 20,
        paddingVertical: 10, 
        borderRadius: 20, 
        alignSelf: 'flex-start',
    },


    heroBtnText: { 
        color: 'white', 
        fontWeight: '700',
        fontSize: 13 
    },

    section: { 
        paddingHorizontal: 16, 
        marginTop: 8
    },

    sectionHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 12 
    },

    sectionTitle: { 
        fontSize: 18, 
        fontWeight: '800',
        color: '#1a1a1a', 
        marginBottom: 12 
    },

    seeAll: { 
        color: '#E8390E', 
        fontWeight: '700', 
        fontSize: 13 
    },

    catScroll: { 
        marginHorizontal: -4 
    },

    catCard: {
        backgroundColor: 'white',
        borderRadius: 16, 
        padding: 14,
        marginHorizontal: 4, 
        alignItems: 'center', 
        minWidth: 80,
        borderWidth: 1, 
        borderColor: '#f0e6e0',
    },

    catIcon: { 
        fontSize: 28, 
        marginBottom: 6 
    },

    catName: { 
        fontSize: 11, 
        fontWeight: '700', 
        color: '#333' 
    },

    recipeCard: {
        backgroundColor: 'white', 
        borderRadius: 16, 
        marginBottom: 12,
        overflow: 'hidden', 
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#f0e6e0' 
    },

    recipeImg: { 
        width: 110, 
        height: 110 
    },

    recipeInfo: { 
        flex: 1,
        padding: 12, 
        justifyContent: 'space-between' 
    },

    recipeCategory: { 
        fontSize: 11, 
        fontWeight: '700', 
        color: '#E8390E', 
        marginBottom: 2 
    },

    recipeTitle: { 
        fontSize: 14, 
        fontWeight: '700', 
        color: '#1a1a1a', 
        lineHeight: 20 
    },

    recipeMeta: { 
        flexDirection: 'row',
        gap: 12, 
        marginTop: 4
    },

    metaText: { 
        fontSize: 11, 
        color: '#888' 
    },

    ratingRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: 4 
    },

    rating: { 
        fontSize: 12, 
        fontWeight: '600', 
        color: '#555' 
    },

    viewBtn: { 
        backgroundColor: '#FFF1EC', 
        paddingHorizontal: 10, 
        paddingVertical: 5, 
        borderRadius: 8 
    },

    viewBtnText: { 
        color: '#E8390E',
        fontSize: 11, 
        fontWeight: '700' 
    },
})