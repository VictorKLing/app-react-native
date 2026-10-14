import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Drawer
        screenOptions={{
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#F5F5F7' },
          headerTintColor: '#1D1D1F',
          drawerStyle: { backgroundColor: '#F8F8FA', width: 300 },
          drawerActiveTintColor: '#1769E0',
          drawerActiveBackgroundColor: '#EAF1FF',
          drawerInactiveTintColor: '#60636B',
          drawerLabelStyle: { fontSize: 15, fontWeight: '600' },
          drawerItemStyle: { borderRadius: 13 },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{ title: 'Produtos', drawerLabel: 'Produtos' }}
        />
        <Drawer.Screen
          name="create"
          options={{ title: 'Cadastrar produto', drawerLabel: 'Cadastrar produto' }}
        />
        <Drawer.Screen
          name="edit"
          options={{ title: 'Editar produto', drawerLabel: 'Editar produto' }}
        />
        <Drawer.Screen
          name="lookup"
          options={{ title: 'Consultar por ID', drawerLabel: 'Consultar por ID' }}
        />
        <Drawer.Screen name="[id]" options={{ drawerItemStyle: { display: 'none' } }} />
      </Drawer>
    </SafeAreaProvider>
  );
}
