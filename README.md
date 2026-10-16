# Secret Hitler Online

Partida de [Secret Hitler](https://www.secrethitler.com/) en el navegador, para entre 5 y 10 jugadores. Cada persona entra con un apodo, se une a una sala con código y juega en tiempo real: elección de gobierno, votación, sesión legislativa y poderes ejecutivos.

Las salas viven en memoria. Al reiniciar el servidor se pierden las partidas en curso.

## Cómo jugar

1. Una persona crea la sala y comparte el código.
2. El resto se une con ese código. Cada jugador elige un retrato.
3. El anfitrión inicia la partida cuando hay entre 5 y 10 jugadores.
4. Cada uno ve su rol en privado (liberal, fascista o Hitler) y confirma que lo ha leído.
5. La partida sigue el flujo de mesa: el presidente nombra canciller, todos votan *ja* o *nein*, y si el gobierno pasa se juega una política.
6. Según el tamaño de la mesa y las políticas fascistas promulgadas, el presidente puede investigar lealtad, convocar una elección especial, mirar las tres próximas políticas o ejecutar a un jugador. El veto se desbloquea con cinco políticas fascistas.

Condiciones de victoria:

- Los liberales ganan con 5 políticas liberales, o si ejecutan a Hitler.
- Los fascistas ganan con 6 políticas fascistas, o si Hitler es elegido canciller cuando ya hay al menos 3 políticas fascistas.

## Estructura

Monorepo con [pnpm](https://pnpm.io/).

```
secret-hitler-online/
├── client/            # Next.js, Zustand y Socket.IO (http://localhost:3000)
├── server/            # Express, Socket.IO y XState (http://localhost:3001)
└── packages/shared/   # Tipos y eventos de socket compartidos
```

El cliente solo recibe estado público de la sala y de la partida. El rol, las cartas en mano y el resultado de una investigación llegan en una vista privada por jugador.

## Requisitos

- Node.js 20 o superior
- pnpm 9 o superior

## Puesta en marcha

Desde la raíz del repositorio:

```bash
pnpm install
cp client/.env.example client/.env.local
cp server/.env.example server/.env
pnpm dev
```

- Cliente: [http://localhost:3000](http://localhost:3000)
- Servidor: [http://localhost:3001](http://localhost:3001)
- Salud del servidor: [http://localhost:3001/health](http://localhost:3001/health)

Para probar en local, abre varias pestañas o ventanas del navegador (o varios perfiles) y únete a la misma sala.

## Variables de entorno

En desarrollo, si no existen los archivos `.env`, el cliente y el servidor usan los valores de los ejemplos.

**Cliente** (`client/.env.local`):

| Variable | Descripción | Desarrollo |
| --- | --- | --- |
| `NEXT_PUBLIC_CLIENT_URL` | URL pública del cliente | `http://localhost:3000` |
| `NEXT_PUBLIC_SERVER_URL` | URL del servidor Socket.IO | `http://localhost:3001` |

**Servidor** (`server/.env`):

| Variable | Descripción | Desarrollo |
| --- | --- | --- |
| `SERVER_PORT` | Puerto HTTP | `3001` |
| `CLIENT_URL` | Origen permitido por CORS | `http://localhost:3000` |

En producción hay que definir estas variables: el servidor no aplica valores por defecto cuando `NODE_ENV` es `production`.

## Scripts

Desde la raíz:

| Comando | Qué hace |
| --- | --- |
| `pnpm dev` | Arranca cliente y servidor en paralelo |
| `pnpm build` | Compila ambos paquetes |
| `pnpm start` | Arranca las builds de producción |
| `pnpm lint` | ESLint y comprobación de tipos donde exista el script |
| `pnpm format` | Formatea el repositorio con Prettier |

## Créditos y licencia de los assets

Los tableros, cartas, retratos, fichas y pantallas de victoria proceden de Secret Hitler (Goat, Wolf & Cabbage) y de la adaptación [secret-hitler.online](https://secret-hitler.online/). Están bajo [Creative Commons Attribution-NonCommercial-ShareAlike 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/): hay que atribuir la obra, no se pueden usar con fines comerciales y las obras derivadas de ese material deben publicarse bajo la misma licencia.

El detalle está en [`client/src/assets/CREDITS.md`](client/src/assets/CREDITS.md).
