# Victor App

Aplicativo React Native com Expo e TypeScript. O cliente da API está em `src/services/api.ts` e consome a API de pedidos na porta 8081.

## Iniciar

```powershell
npm install
npm start
```

Escaneie o QR code com o Expo Go ou pressione `a` para abrir no emulador Android. Também estão disponíveis `npm run android` e `npm run ios`.

## Endereço da API

- Android Emulator: `http://10.0.2.2:8081` (padrão)
- iOS Simulator: `http://localhost:8081` (padrão)
- Celular físico: copie `.env.example` para `.env` e defina `EXPO_PUBLIC_API_URL` como o IP local do computador, por exemplo `http://192.168.0.10:8081`.

As APIs precisam estar em execução e acessíveis pela rede. O app usa `GET /pedidos`; as funções para criar pedidos, adicionar itens e excluir itens também estão preparadas no cliente.
