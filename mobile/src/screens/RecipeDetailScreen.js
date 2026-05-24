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

const TABS = [
  { key: 'detail', label: '📋 Detail' },
  { key: 'ingredients', label: '🛒 Bahan' },
  { key: 'steps', label: '👩‍🍳 Cara Masak' },
]

export default function RecipeDetailScreen({ route, navigation }) {
  const { id } = route.params
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('detail')
  const [checked, setChecked] = useState([])
  const [cooked, setCooked] = useState(false)
  const [cookedLoading, setCookedLoading] = useState(false)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await api.get(`/recipes/${id}`)
        setRecipe(res.data.recipe)
      } catch {
        setRecipe(null)
      } finally {
        setLoading(false)
      }
    }
    fetchRecipe()
  }, [id])

  const toggleCheck = (idx) => {
    setChecked(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx])
  }

  const handleMarkCooked = async () => {
    if (cooked || cookedLoading) return
    setCookedLoading(true)
    try {
      await api.post('/profile/history', { recipeId: id })
      setCooked(true)
      if (Platform.OS === 'web') {
        alert('Resep ditandai sudah dimasak!')
      } else {
        Alert.alert('Berhasil!', 'Resep disimpan ke riwayatmu!')
      }
    } catch (err) {
      if (err.response?.data?.message?.includes('sudah ada')) setCooked(true)
    } finally {
      setCookedLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E8390E" />
        <Text style={styles.loadingText}>Memuat resep...</Text>
      </View>
    )
  }

  if (!recipe) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontSize: 48 }}>😅</Text>
        <Text style={styles.notFoundText}>Resep tidak ditemukan</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const allIngredients = [...(recipe.ingredients || []), ...(recipe.spices || [])]

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        <View style={styles.heroWrap}>
          <Image source={{ uri: recipe.heroImg || recipe.img }} style={styles.heroImg} />
          <View style={styles.heroOverlay}>
            <TouchableOpacity style={styles.backCircle} onPress={() => navigation.goBack()}>
              <Text style={styles.backCircleText}>←</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <View style={styles.heroBadges}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{recipe.category}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Text style={styles.badgeText}>{recipe.difficulty}</Text>
              </View>
            </View>
            <Text style={styles.heroTitle}>{recipe.title}</Text>
            <View style={styles.heroMeta}>
              <Text style={styles.heroMetaText}>⭐ {recipe.rating}</Text>
              <Text style={styles.heroMetaText}>⏱️ {recipe.time} menit</Text>
              <Text style={styles.heroMetaText}>🍽️ {recipe.servings} porsi</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickInfo}>
          {[
            { icon: '⏱️', label: 'Waktu', value: `${recipe.time} mnt` },
            { icon: '💰', label: 'Harga', value: `Rp ${Number(recipe.price).toLocaleString('id-ID')}` },
            { icon: '🍽️', label: 'Porsi', value: `${recipe.servings} org` },
          ].map(info => (
            <View key={info.label} style={styles.quickItem}>
              <Text style={styles.quickIcon}>{info.icon}</Text>
              <Text style={styles.quickLabel}>{info.label}</Text>
              <Text style={styles.quickValue}>{info.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tabs}>
          {TABS.map(tab => (
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

        <View style={styles.tabContent}>

          {activeTab === 'detail' && (
            <View style={styles.gap}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Tentang Resep</Text>
                <Text style={styles.cardDesc}>{recipe.description}</Text>
              </View>
              {recipe.tips && (
                <View style={styles.tipsCard}>
                  <Text style={styles.tipsTitle}>💡 Tips dari Chef</Text>
                  <Text style={styles.tipsDesc}>{recipe.tips}</Text>
                </View>
              )}
              <TouchableOpacity
                style={[styles.cookBtn, cooked && styles.cookBtnDone]}
                onPress={handleMarkCooked}
                disabled={cooked || cookedLoading}
                activeOpacity={0.8}
              >
                <Text style={[styles.cookBtnText, cooked && { color: '#15803d' }]}>
                  {cookedLoading ? 'Menyimpan...' : cooked ? '✅ Sudah Dimasak!' : '👩‍🍳 Tandai Sudah Dimasak'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'ingredients' && (
            <View style={styles.gap}>
              <View style={styles.card}>
                <View style={styles.progressHeader}>
                  <Text style={styles.cardTitle}>Daftar Belanja</Text>
                  <Text style={styles.progressCount}>{checked.length}/{allIngredients.length}</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, {
                    width: allIngredients.length > 0
                      ? `${Math.round(checked.length / allIngredients.length * 100)}%`
                      : '0%'
                  }]} />
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Bahan Utama</Text>
                {recipe.ingredients?.map((ing, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.ingRow, checked.includes(i) && styles.ingRowChecked]}
                    onPress={() => toggleCheck(i)}
                  >
                    <View style={[styles.checkbox, checked.includes(i) && styles.checkboxChecked]}>
                      {checked.includes(i) && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={[styles.ingText, checked.includes(i) && styles.ingTextChecked]}>
                      <Text style={{ fontWeight: '700' }}>{ing.amount}</Text> {ing.item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {recipe.spices && recipe.spices.length > 0 && (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Bumbu Halus</Text>
                  {recipe.spices.map((spice, i) => {
                    const idx = (recipe.ingredients?.length || 0) + i
                    return (
                      <TouchableOpacity
                        key={i}
                        style={[styles.ingRow, checked.includes(idx) && styles.ingRowChecked]}
                        onPress={() => toggleCheck(idx)}
                      >
                        <View style={[styles.checkbox, checked.includes(idx) && styles.checkboxChecked]}>
                          {checked.includes(idx) && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={[styles.ingText, checked.includes(idx) && styles.ingTextChecked]}>
                          <Text style={{ fontWeight: '700' }}>{spice.amount}</Text> {spice.item}
                        </Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              )}
            </View>
          )}

          {activeTab === 'steps' && (
            <View style={styles.gap}>
              <View style={styles.tipsCard}>
                <Text style={styles.tipsDesc}>
                  💡 Estimasi: <Text style={{ fontWeight: '700' }}>{recipe.time} menit</Text> untuk {recipe.servings} porsi
                </Text>
              </View>
              {recipe.steps?.map(step => (
                <View key={step.step} style={styles.stepCard}>
                  <View style={styles.stepNum}>
                    <Text style={styles.stepNumText}>{step.step}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepDesc}>{step.desc}</Text>
                  </View>
                </View>
              ))}
              <TouchableOpacity
                style={[styles.cookBtn, cooked && styles.cookBtnDone]}
                onPress={handleMarkCooked}
                disabled={cooked || cookedLoading}
                activeOpacity={0.8}
              >
                <Text style={[styles.cookBtnText, cooked && { color: '#15803d' }]}>
                  {cookedLoading ? 'Menyimpan...' : cooked ? '✅ Sudah Dimasak!' : '🎉 Tandai Sudah Dimasak'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#FFF8F5',
    ...(Platform.OS === 'web' && {
      height: '100vh',
      maxHeight: '100vh',
      overflow: 'hidden',
    }),
  },

  scroll: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      height: '100vh',
      overflowY: 'auto',
    }),
  },

  scrollContent: {
    paddingBottom: 180,
    flexGrow: 1,
  },

  loadingText: { 
    color: '#888', 
    marginTop: 8 
  },

  notFoundText: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#333' 
  },

  backBtn: { backgroundColor: '#E8390E', 
    paddingHorizontal: 24, 
    paddingVertical: 12, 
    borderRadius: 12 
  },

  backBtnText: { 
    color: 'white', 
    fontWeight: '700' 
  },

  heroWrap: { 
    height: 280 
  },

  heroImg: { 
    width: '100%',
    height: '100%', 
    position: 'absolute' 
  },

  heroOverlay: {
    position: 'absolute', 
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', 
    padding: 20, 
    paddingTop: 52,
    flexDirection: 'column',
  },

  backCircle: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', 
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },

  backCircleText: {
    color: 'white', 
    fontSize: 18, 
    fontWeight: '700' 
  },

  heroBadges: { 
    flexDirection: 'row', 
    gap: 8,
    marginBottom: 8 
  },

  badge: { 
    backgroundColor: '#E8390E', 
    borderRadius: 20, 
    paddingHorizontal: 10, 
    paddingVertical: 4 
  },

  badgeText: { 
    color: 'white', 
    fontSize: 11, 
    fontWeight: '700' 
  },

  heroTitle: { 
    color: 'white', 
    fontSize: 22, 
    fontWeight: '800', 
    marginBottom: 8 
  },

  heroMeta: { 
    flexDirection: 'row',
    gap: 16 
  },

  heroMetaText: {
    color: 'rgba(255,255,255,0.85)', 
    fontSize: 13 
  },

  quickInfo: {
    flexDirection: 'row', 
    backgroundColor: 'white',
    marginHorizontal: 16, marginTop: -20,
    borderRadius: 16, 
    padding: 12,
    shadowColor: '#000', 
    shadowOpacity: 0.1,
    shadowRadius: 8, elevation: 4,
  },

  quickItem: { 
    flex: 1, 
    alignItems: 'center'
  },

  quickIcon: { 
    fontSize: 20, 
    marginBottom: 2 
  },

  quickLabel: { 
    fontSize: 11, 
    color: '#888' 
  },

  quickValue: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#1a1a1a' 
  },

  tabs: {
    flexDirection: 'row', 
    backgroundColor: 'white',
    margin: 16, 
    borderRadius: 16, padding: 4,
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
    fontSize: 12, 
    fontWeight: '600', 
    color: '#888' 
  },

  tabTextActive: { 
    color: 'white' 
  },

  tabContent: { 
    paddingHorizontal: 16, 
    paddingBottom: 20, 
    flexGrow: 1 
  },

  gap: { 
    gap: 12 
  },

  card: {
    backgroundColor: 'white', 
    borderRadius: 16,
    padding: 16, borderWidth: 1, 
    borderColor: '#f0e6e0',
  },

  cardTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#1a1a1a',
    marginBottom: 10 
  },

  cardDesc: { 
    fontSize: 14, 
    color: '#555', 
    lineHeight: 22 
  },

  tipsCard: {
    backgroundColor: '#fff8f0', 
    borderRadius: 16,
    padding: 14, borderWidth: 1, 
    borderColor: '#fde68a',
  },

  tipsTitle: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#92400e', 
    marginBottom: 6 
  },

  tipsDesc: { 
    fontSize: 13, 
    color: '#92400e', 
    lineHeight: 20 
  },

  cookBtn: {
    backgroundColor: '#E8390E', 
    borderRadius: 16,
    padding: 16, 
    alignItems: 'center',
  },

  cookBtnDone: { 
    backgroundColor: '#dcfce7' 
  },

  cookBtnText: { 
    color: 'white', 
    fontWeight: '700', 
    fontSize: 15 
  },

  progressHeader: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center', 
    marginBottom: 10,
  },

  progressCount: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#E8390E' 
  
  },
  progressBar: { 
    height: 6,
    backgroundColor: '#f0f0f0', 
    borderRadius: 3 
  },

  progressFill: { 
    height: 6, 
    backgroundColor: '#E8390E',
    borderRadius: 3 
  },

  ingRow: {
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 10, 
    paddingVertical: 8, paddingHorizontal: 8, 
    borderRadius: 10,
  },

  ingRowChecked: { 
    backgroundColor: '#f0fdf4' 
  },

  checkbox: {
    width: 22, height: 22, 
    borderRadius: 11,
    borderWidth: 2, 
    borderColor: '#d1d5db',
    alignItems: 'center', 
    justifyContent: 'center',
  },

  checkboxChecked: { 
    backgroundColor: '#22c55e', 
    borderColor: '#22c55e' 
  },

  checkmark: { 
    color: 'white', 
    fontSize: 12, fontWeight: '700' 
  },

  ingText: { 
    flex: 1, 
    fontSize: 13, 
    color: '#555' 
  },

  ingTextChecked: { 
    textDecorationLine: 'line-through', 
    color: '#aaa' 
  },

  stepCard: {
    flexDirection: 'row', gap: 14, 
    backgroundColor: 'white',
    borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: '#f0e6e0',
  },

  stepNum: {
    width: 36, height: 36, 
    borderRadius: 18,
    backgroundColor: '#E8390E',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },

  stepNumText: { 
    color: 'white', 
    fontWeight: '800', 
    fontSize: 14 
  },

  stepTitle: { 
    fontSize: 14, 
    fontWeight: '700',
    color: '#1a1a1a', 
    marginBottom: 4 
  },

  stepDesc: { 
    fontSize: 13,
    color: '#555', 
    lineHeight: 20 
  },
})