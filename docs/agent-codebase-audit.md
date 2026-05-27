# Agente de auditoría de codebase

Instrucciones para agentes que revisan este repositorio en busca de oportunidades de refactor, organización, código sin usar e inconsistencias entre capas.

## Objetivo

Producir un informe accionable sobre la salud del código **sin implementar cambios** salvo que el usuario lo pida explícitamente. Priorizar hallazgos por impacto y riesgo.

## Cuándo ejecutar

- Tras añadir una feature nueva (p. ej. votación, sesión legislativa).
- Antes de abrir un PR grande.
- Cuando el usuario pida: refactor, limpieza, dead code, organización o revisión de arquitectura.
- Periódicamente si el monorepo crece en `client/`, `server/` o `packages/shared/`.

## Alcance del repositorio

```
secret-hitler-online/
├── client/          # Next.js + Zustand + Socket.IO client
├── server/          # Express + Socket.IO + XState
└── packages/shared/ # Tipos y contratos de eventos socket
```

No auditar `.next/`, `dist/`, `node_modules/` ni artefactos de build.

---

## Proceso de auditoría

Seguir estos pasos en orden. Usar búsquedas (`grep`, exploración semántica) y lectura de archivos; no confiar solo en memoria.

### 1. Mapa rápido

- Listar archivos fuente (`*.ts`, `*.tsx`) en `client/src`, `server/src`, `packages/shared/src`.
- Revisar `git log --oneline -15` para entender cambios recientes.
- Identificar qué features están cableadas de punta a punta (socket → handler → store → UI).

### 2. Código muerto y tipos huérfanos

Buscar símbolos definidos pero no referenciados:

| Qué buscar                       | Cómo                                                                         |
| -------------------------------- | ---------------------------------------------------------------------------- |
| Tipos exportados sin uso         | `grep` del nombre en todo el repo                                            |
| Fases de juego sin handler/UI    | Comparar `GamePhase` en shared vs estados en `gameMachine.ts` vs componentes |
| Funciones exportadas sin imports | `grep` del nombre de la función                                              |
| Estados XState passthrough       | Estados que se abandonan en el mismo handler sin UI intermedia               |
| Payloads duplicados              | Tipos en `socketEvents.ts` vs shapes inline en handlers                      |

**Señales de alerta en este proyecto:**

- Tipos en `packages/shared/src/game.ts` que no aparecen en `packages/shared/src/index.ts` ni en el resto del código.
- Fases como `executiveAction` en tipos pero ausentes en la máquina de estados.
- Estados como `roleAssignment` que existen solo como transición instantánea.

### 3. Contrato de tipos (shared ↔ server ↔ client)

Verificar que las tres capas usan los mismos tipos para el mismo dato.

#### Salas y jugadores

- **Servidor interno:** `Room` + `Player` (puede incluir `role`).
- **Cliente / wire:** `PublicRoom` + `PublicPlayer` (sin roles secretos).

Comprobar:

- [ ] El cliente no tipa el store ni props con `Room` si solo recibe datos públicos.
- [ ] `PublicPlayer` incluye todos los campos que el servidor envía (p. ej. `isHost`).
- [ ] `PublicPlayer` no incluye campos que nunca deben ser públicos (p. ej. `role`).
- [ ] Todo `room-updated` usa `toPublicRoom()` de forma consistente, no el `Room` interno.

#### Eventos socket

- [ ] `ClientToServerEvents` y `ServerToClientEvents` coinciden con `registerSocketHandlers` y los listeners en `client/src/sockets/`.
- [ ] Payloads compartidos (`JoinRoomPayload`, `SelectChancellorPayload`, etc.) se usan en handlers y services, no se redefinen inline.
- [ ] Handlers usan los genéricos tipados de Socket.IO (`Server<...>`, `Socket<...>`), no `Server`/`Socket` sin tipo.

#### Estado del juego

- [ ] `emitGameState` mapea `snapshot.value` a `GamePhase` de forma coherente.
- [ ] Validaciones de fase en servidor (`snapshot.value !== "..."`) usan los mismos nombres que el cliente (`game.phase`).

### 4. Organización de archivos y responsabilidades

Evaluar si un archivo mezcla demasiadas responsabilidades.

**Patrones esperados en este proyecto:**

| Capa            | Ubicación                           | Responsabilidad                         |
| --------------- | ----------------------------------- | --------------------------------------- |
| Contratos       | `packages/shared/`                  | Tipos, fases, eventos                   |
| Lógica de juego | `server/src/game/`                  | XState, roles, vistas privadas, emit    |
| Salas           | `server/src/rooms/`                 | CRUD de sala, handlers socket           |
| Cliente UI      | `client/src/components/`            | Por dominio: `lobby/`, `room/`, `game/` |
| Cliente estado  | `client/src/store/`                 | Zustand                                 |
| Cliente wire    | `client/src/sockets/` + `services/` | Listen vs emit                          |

**Refactors a proponer si aplican:**

- Separar handlers de sala vs handlers de juego en archivos distintos.
- Extraer helpers de broadcast (`emitPrivateGameViews`, `broadcastRoomUpdate`).
- Componente contenedor por fase de juego en lugar de renderizar todo en `Room.tsx`.

### 5. Duplicación y patrones inconsistentes

| Área                  | Qué comparar                                                                          |
| --------------------- | ------------------------------------------------------------------------------------- |
| Identidad del jugador | `useCurrentPlayer()` vs `socket.id` directo en componentes                            |
| Botones               | Uso de `Button` compartido vs `<button>` nativo                                       |
| Registro socket       | `SocketProvider` vs registro duplicado en páginas                                     |
| Utilidades            | `parseUrl` y similares duplicados en client/server                                    |
| Nombres               | Nombre de archivo vs nombre del export (p. ej. `CreateJoinRoomForm` → `JoinRoomForm`) |

### 6. Ciclo de vida y recursos

- [ ] Los registradores de socket (`registerRoomSocketEvents`, `registerGameSocketEvents`) devuelven cleanup y `SocketProvider` lo usa en el `return` del `useEffect`.
- [ ] No hay doble registro de listeners entre `layout.tsx` y `page.tsx`.
- [ ] Desconexiones de jugadores: ¿hay handler o es deuda técnica? (documentar como gap si falta).

### 7. UI vs estado del juego

- [ ] Componentes de fase se ocultan cuando `game.phase` no corresponde.
- [ ] Controles de lobby (`StartGameButton`) se ocultan cuando el juego ya empezó (`game !== null` o `phase !== "lobby"`).
- [ ] No se filtra información secreta en la UI pública de sala.

### 8. Máquina de estados (XState)

Revisar `server/src/game/gameMachine.ts`:

- [ ] Cada estado tiene al menos un camino de entrada y salida documentado o implementado.
- [ ] Eventos (`VOTE_PASSED`, `ACTION_COMPLETED`, etc.) tienen handlers en servidor y UI en cliente, o se marcan como **pendientes**.
- [ ] El contexto (`GameContext`) no acumula campos que ningún handler lee.
- [ ] Transiciones actualizan presidente/canciller/ronda de forma coherente con las reglas del juego.

---

## Comandos y búsquedas útiles

```bash
# Historial reciente
git log --oneline -15

# Símbolo sin referencias (sustituir SYMBOL)
rg "SYMBOL" --glob '*.{ts,tsx}'

# Fases de juego
rg "GamePhase|game\.phase|snapshot\.value" --glob '*.{ts,tsx}'

# Emisiones de sala
rg "room-updated|toPublicRoom" --glob '*.{ts,tsx}'

# Registro de sockets
rg "registerRoomSocketEvents|registerGameSocketEvents|SocketProvider" --glob '*.{ts,tsx}'

# Tipos públicos vs internos
rg "PublicRoom|PublicPlayer|\bRoom\b" --glob '*.{ts,tsx}'
```

---

## Formato del informe de salida

Entregar la respuesta al usuario en **español**, estructurada así:

### Resumen

2–4 frases: estado general y el problema más importante.

### Hallazgos por categoría

Agrupar en:

1. **Código muerto / tipos huérfanos**
2. **Inconsistencias de tipos**
3. **Organización y refactor**
4. **Duplicación / patrones inconsistentes**
5. **Ciclo de vida / sockets**
6. **UI vs fases del juego**
7. **Deuda planificada** (features en tipos/máquina pero sin implementar)

Cada hallazgo debe incluir:

- **Qué:** descripción concreta
- **Dónde:** ruta(s) de archivo
- **Riesgo:** bajo | medio | alto
- **Acción sugerida:** una frase clara

### Tabla de prioridad

| Prioridad | Cambio | Esfuerzo        |
| --------- | ------ | --------------- |
| Alta      | …      | bajo/medio/alto |

### Qué está bien

Mencionar brevemente patrones que **no** hay que tocar para evitar refactors innecesarios.

### Siguiente paso

Preguntar si el usuario quiere aplicar algún fix, sugiriendo un paquete de cambios de bajo riesgo primero.

---

## Reglas del agente

1. **No implementar** cambios salvo petición explícita del usuario.
2. **No proponer** over-engineering (abstracciones de una sola línea, paquetes shared prematuros).
3. **Respetar convenciones** existentes del repo (Zustand, estructura de carpetas, español en UI).
4. **Citar código** con el formato del proyecto: ` ```startLine:endLine:path ` `.
5. **Distinguir** bug real vs deuda planificada (feature a medias).
6. **Verificar** con herramientas; no asumir que un hallazgo de una auditoría anterior sigue vigente.

---

## Checklist rápido (copiar al auditar)

```
[ ] Tipos/export sin referencias
[ ] GamePhase vs gameMachine vs UI alineados
[ ] Cliente usa PublicRoom, no Room interno
[ ] PublicPlayer coincide con toPublicRoom
[ ] room-updated siempre sanitizado
[ ] Payloads socket sin duplicar inline
[ ] Handlers socket tipados
[ ] SocketProvider con cleanup
[ ] Sin doble registro de listeners
[ ] UI condicional por fase
[ ] StartGameButton oculto tras iniciar partida
[ ] Patrón único para jugador actual (hook vs socket.id)
[ ] roomHandlers no mezcla demasiadas responsabilidades
[ ] Helpers de broadcast extraíbles
[ ] Nombres archivo/export coherentes
[ ] Estados XState huérfanos o passthrough
[ ] Eventos de máquina sin handler = deuda documentada
```

---

## Hallazgos conocidos (última auditoría)

Usar como línea base; **revalidar** antes de reportar.

| Hallazgo                                              | Ubicación                                        | Estado    |
| ----------------------------------------------------- | ------------------------------------------------ | --------- |
| `KnownPlayer` sin uso                                 | `packages/shared/src/game.ts`                    | Pendiente |
| `executiveAction` en tipos, no en máquina             | `packages/shared/src/game.ts`                    | Pendiente |
| `roleAssignment` es passthrough                       | `server/src/game/gameMachine.ts`                 | Pendiente |
| `PublicPlayer` sin `isHost` en tipo                   | `packages/shared/src/player.ts`                  | Pendiente |
| Cliente tipa store con `Room`                         | `client/src/types/store.ts`                      | Pendiente |
| `room-updated` inconsistente (Room vs `toPublicRoom`) | `server/src/rooms/roomHandlers.ts`               | Pendiente |
| `SelectChancellorPayload` duplicado inline            | `server/src/rooms/roomHandlers.ts`               | Pendiente |
| Handlers sin genéricos Socket.IO                      | `handleStartGame`, `handleSelectChancellor`      | Pendiente |
| `SocketProvider` sin cleanup                          | `client/src/providers/SocketProvider.tsx`        | Pendiente |
| `Room.tsx` renderiza lobby + juego a la vez           | `client/src/components/room/Room.tsx`            | Pendiente |
| `StartGameButton` visible tras iniciar                | `client/src/components/room/StartGameButton.tsx` | Pendiente |
| `socket.id` vs `useCurrentPlayer`                     | `ChancellorSelection.tsx`                        | Pendiente |
| Archivo `CreateJoinRoomForm` exporta `JoinRoomForm`   | `client/src/components/lobby/`                   | Pendiente |

Actualizar esta tabla al final de cada auditoría con fecha y commits relevantes.

---

## Ejemplo de invocación

Prompt sugerido para el usuario:

> Audita el codebase siguiendo `docs/agent-codebase-audit.md`. Busca código sin usar, inconsistencias de tipos entre shared/client/server, y oportunidades de organización. No implementes cambios; dame un informe priorizado.
