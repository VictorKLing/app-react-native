import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { Text, useWindowDimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const { width } = useWindowDimensions();
  const sidebarPermanente = width >= 1080;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Drawer
        screenOptions={{
          drawerType: sidebarPermanente ? 'permanent' : 'front',
          headerShown: !sidebarPermanente,
          swipeEnabled: !sidebarPermanente,
          headerTitle: 'Vértice · Gestão',
          headerTitleStyle: { color: '#263343', fontSize: 14, fontWeight: '600' },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#F2F5F7' },
          headerTintColor: '#263343',
          drawerStyle: { backgroundColor: '#FFFFFF', width: sidebarPermanente ? 264 : 300, borderRightWidth: 1, borderRightColor: '#E5EAF0' },
          drawerActiveTintColor: '#176B55',
          drawerActiveBackgroundColor: '#E8F4EF',
          drawerInactiveTintColor: '#687585',
          drawerLabelStyle: { fontSize: 14, fontWeight: '600', marginLeft: -14 },
          drawerItemStyle: { borderRadius: 11, marginHorizontal: 12, marginVertical: 3 },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{ title: 'Produtos', drawerLabel: 'Visão geral', drawerIcon: ({ color, size }) => <Text style={{ color, width: 20, textAlign: 'center', fontSize: size }}>▦</Text> }}
        />
        <Drawer.Screen
          name="create"
          options={{ title: 'Cadastrar produto', drawerLabel: 'Cadastrar produto', drawerIcon: ({ color, size }) => <Text style={{ color, width: 20, textAlign: 'center', fontSize: size }}>＋</Text> }}
        />
        <Drawer.Screen
          name="edit"
          options={{ title: 'Editar produto', drawerLabel: 'Editar produto', drawerIcon: ({ color, size }) => <Text style={{ color, width: 20, textAlign: 'center', fontSize: size }}>✎</Text> }}
        />
        <Drawer.Screen
          name="lookup"
          options={{ title: 'Consultar por ID', drawerLabel: 'Consultar por ID', drawerIcon: ({ color, size }) => <Text style={{ color, width: 20, textAlign: 'center', fontSize: size }}>⌕</Text> }}
        />
        <Drawer.Screen name="[id]" options={{ drawerItemStyle: { display: 'none' } }} />
      </Drawer>
    </SafeAreaProvider>
  );
}
