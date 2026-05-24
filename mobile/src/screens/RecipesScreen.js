import { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native'
import api from '../api'

const CATEGORIES = ['Semua', 'Indonesian', 'Western', 'Chinese', 'Dessert', 'Minuman']

const diffColor = {
    'Mudah': { bg: '#dcfce7', text: '#15803d' },
    'Sedang': { bg: '#fef9c3', text: '#854d0e' },
    'Susah': { bg: '#fee2e2', text: '#991b1b' },
}

export default function RecipesScreen({ navigation }) {
    const [recipes, setRecipes] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState('Semua')

    const { width } = useWindowDimensions()
    const isMobile = width < 768

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const res = await api.get('/recipes')
                setRecipes(res.data.recipes)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchRecipes()
    }, [])

    const filtered = recipes
        .filter(r => activeCategory === 'Semua' || r.category === activeCategory)
        .filter(r => search === '' || r.title.toLowerCase().includes(search.toLowerCase()))

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF8F5' }}>
            <ScrollView 
                style={{ flex: 1 }} 
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Eksplorasi Resep</Text>
                    <Text style={styles.headerSub}>Temukan inspirasi masakan favoritmu</Text>
                    <View style={styles.searchBox}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Cari resep..."
                            value={search}
                            onChangeText={setSearch}
                            placeholderTextColor="#aaa"
                        />
                    </View>
                </View>

                <View style={styles.catContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.catScrollContent}
                    >
                        {CATEGORIES.map(cat => (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setActiveCategory(cat)}
                                style={[styles.catBtn, activeCategory === cat && styles.catBtnActive]}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.catBtnText, activeCategory === cat && styles.catBtnTextActive]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <Text style={styles.count}>
                    <Text style={{ fontWeight: '700', color: '#1a1a1a' }}>{filtered.length}</Text> resep ditemukan
                </Text>

                {loading ? (
                    <ActivityIndicator color="#E8390E" style={{ marginTop: 40 }} />
                ) : (
                    <View style={styles.gridWrapper}>
                        {filtered.length > 0 ? (
                            filtered.map(item => (
                                <TouchableOpacity
                                    key={item._id}
                                    style={[styles.card, { width: isMobile ? '100%' : '48%' }]}
                                    onPress={() => navigation.navigate('RecipeDetail', { id: item._id })}
                                    activeOpacity={0.9}
                                >
                                    <View style={styles.imgWrap}>
                                        <Image source={{ uri: item.img }} style={styles.cardImg} />
                                        <View style={styles.ratingBadge}>
                                            <Text style={styles.ratingText}>⭐ {item.rating}</Text>
                                        </View>
                                        {item.difficulty && (
                                            <View style={[styles.diffBadge, { backgroundColor: diffColor[item.difficulty]?.bg || '#f3f4f6' }]}>
                                                <Text style={[styles.diffText, { color: diffColor[item.difficulty]?.text || '#555' }]}>
                                                    {item.difficulty}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={styles.cardBody}>
                                        <Text style={styles.cardCat}>{item.category}</Text>
                                        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                                        <View style={styles.cardMeta}>
                                            <Text style={styles.cardMetaText}>⏱️ {item.time}m</Text>
                                            <Text style={styles.cardMetaText}>Rp {Number(item.price).toLocaleString('id-ID')}</Text>
                                        </View>
                                        <View style={styles.cardBtn}>
                                            <Text style={styles.cardBtnText}>Lihat Resep →</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={styles.empty}>
                                <Text style={{ fontSize: 48 }}>🍽️</Text>
                                <Text style={styles.emptyText}>Resep tidak ditemukan</Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    header: { 
        backgroundColor: 'white', 
        padding: 20, 
        paddingTop: 56, 
        borderBottomWidth: 1,
        borderBottomColor: '#f0e6e0' 
    },
   
    headerTitle: { 
        fontSize: 26, 
        fontWeight: '800', 
        color: '#1a1a1a' 
    },
   
    headerSub: { 
        fontSize: 13, 
        color: '#888', 
        marginTop: 2, 
        marginBottom: 12
    },
  
    searchBox: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#f5f5f5',
        borderRadius: 12, 
        paddingHorizontal: 12 
    },
   
    searchIcon: { 
        fontSize: 16, 
        marginRight: 8 
    },
  
    searchInput: { 
        flex: 1, 
        paddingVertical: 11, 
        fontSize: 14,
        color: '#1a1a1a', 
        outlineStyle: 'none' 
    },
   
    catContainer: { 
        flexGrow: 0, 
        backgroundColor: 'white', 
        borderBottomWidth: 1, 
        borderBottomColor: '#f0e6e0' 
    },
   
    catScrollContent: { 
        paddingHorizontal: 16, 
        paddingVertical: 12, 
        gap: 8, 
        flexDirection: 'row' 
    },
   
    catBtn: { 
        paddingHorizontal: 16, 
        height: 38, 
        borderRadius: 20,
        borderWidth: 1, 
        borderColor: '#e0e0e0', 
        backgroundColor: 'white', 
        alignItems: 'center', 
        justifyContent: 'center' },
   
    catBtnActive: { 
        backgroundColor: '#E8390E', 
        borderColor: '#E8390E' 
    },

    catBtnText: { 
        fontSize: 13, 
        fontWeight: '600', 
        color: '#666' 
    },

    catBtnTextActive: { 
        color: 'white' 
    },

    count: { 
        paddingHorizontal: 16,
         paddingTop: 16, 
        paddingBottom: 4, 
        fontSize: 13, 
        color: '#888' 
    },

    gridWrapper: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        padding: 16, 
        justifyContent: 'space-between'

     },

    card: { 
        backgroundColor: 'white', 
        borderRadius: 16, 
        overflow: 'hidden', 
        borderWidth: 1, 
        borderColor: '#f0e6e0', 
        marginBottom: 16 
    },
    
    imgWrap: { 
        position: 'relative' 
    },
    
    cardImg: { 
        width: '100%', 
        height: 140 
    },
    
    ratingBadge: { 
        position: 'absolute', 
        top: 8, left: 8, 
        backgroundColor: 'rgba(255,255,255,0.9)', 
        borderRadius: 20, 
        paddingHorizontal: 8,
        paddingVertical: 3 
    },
    
    ratingText: { 
        fontSize: 11,
        fontWeight: '700', 
        color: '#1a1a1a' 
    },
    
    diffBadge: { 
        position: 'absolute', 
        top: 8, right: 8, 
        borderRadius: 20, 
        paddingHorizontal: 8, 
        paddingVertical: 3 
    },
    
    diffText: { 
        fontSize: 10, 
        fontWeight: '700' 
    },
    
    cardBody: { 
        padding: 12 
    },
    
    cardCat: { 
        fontSize: 10, 
        fontWeight: '700', 
        color: '#E8390E', 
        marginBottom: 2 
    },
    
    cardTitle: { 
        fontSize: 14, 
        fontWeight: '700', 
        color: '#1a1a1a', 
        lineHeight: 20, 
        marginBottom: 8 
    },
    
    cardMeta: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 12 
    },
    
    cardMetaText: { 
        fontSize: 12, 
        color: '#888' 
    },
    
    cardBtn: { 
        backgroundColor: '#FFF1EC', 
        borderRadius: 8, 
        paddingVertical: 8, 
        alignItems: 'center' 
    },
    
    cardBtnText: { 
        color: '#E8390E', 
        fontSize: 12, 
        fontWeight: '700' 
    },
    
    empty: { 
        width: '100%', 
        alignItems: 'center', 
        paddingTop: 40, gap: 8 
    },
    
    emptyText: { 
        fontSize: 15, 
        fontWeight: '600', 
        color: '#888'       
    },
})