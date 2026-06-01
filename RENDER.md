# Desplegar UCO Parking en Render

Render da **HTTPS** al front. La API en la VM (`http://34.132.122.87:8000`) es **HTTP** — el navegador la bloquea (mixed content). Por eso usamos **dos servicios**:

| Servicio | Qué hace |
|----------|----------|
| **uco-parking-api-proxy** | HTTPS en Render → reenvía a la VM `:8000` |
| **uco-parking-front** | Static Site Vue (dist) |

El backend, SQL Server y Redis **siguen en la VM GCP** (no cambia el CD).

---

## Paso 1 — Subir archivos al repo front

```powershell
cd "C:\Users\clary\OneDrive\Trabajos\2026-01\Software 2\UCO parking\UcoParkingFront"
git add render.yaml render-proxy public/_redirects RENDER.md
git commit -m "feat: despliegue Render (front + proxy API VM)"
git push origin feature/notification-gateway
```

---

## Paso 2 — Crear cuenta y conectar repo

1. https://render.com → Sign up (GitHub).
2. **New** → **Blueprint**.
3. Repo: **crmgg/ucoParking-front**, rama **feature/notification-gateway**.
4. Render detecta `render.yaml` → **Apply**.

---

## Paso 3 — Variables del front (build)

En el servicio **uco-parking-front** → **Environment**:

| Variable | Valor |
|----------|--------|
| `VITE_AUTH0_CLIENT_ID` | `7dpH5nefIhszZpvxKmLvta` (tu SPA) |
| `VITE_API_BASE_URL` | URL del proxy, ej. `https://uco-parking-api-proxy.onrender.com` |

**Sin** `/uco-parking` al final.

Después de guardar → **Manual Deploy** → **Clear build cache & deploy**.

Prueba proxy: `https://TU-PROXY.onrender.com/uco-parking/actuator/health`

---

## Paso 4 — Auth0 (SPA)

En https://manage.auth0.com → Application **Uco Parking** (SPA):

Sustituye `TU-FRONT` por la URL real (ej. `https://uco-parking-front.onrender.com`):

- **Allowed Callback URLs:** `https://TU-FRONT.onrender.com`
- **Allowed Logout URLs:** `https://TU-FRONT.onrender.com`
- **Allowed Web Origins:** `https://TU-FRONT.onrender.com`

---

## Paso 5 — CORS en la VM

En la VM, edita `/opt/uco-parking/deploy/.env`:

```bash
RENDER_FRONTEND_URL=https://uco-parking-front.onrender.com
```

Luego:

```bash
cd /opt/uco-parking/deploy
sudo bash deploy.sh
```

(O espera al siguiente CD verde desde GitHub.)

---

## Paso 6 — Probar

1. Abre la URL del front en Render.
2. Login Auth0 (HTTPS → Auth0 real, no modo demo HTTP).
3. Dashboard carga parqueaderos.

---

## Problemas frecuentes

| Síntoma | Causa |
|---------|--------|
| Pantalla en blanco / 404 al refrescar | Falta `_redirects` o redeploy del front |
| CORS en consola | Falta `RENDER_FRONTEND_URL` en VM + redeploy |
| 502 en el proxy | VM apagada, firewall GCP sin puerto 8000, o stack caído |
| Auth0 redirect error | URLs del paso 4 incompletas |

---

## Nota

Render **free** duerme servicios tras inactividad (~50 s al despertar el proxy). Para demo en vivo, abre el proxy un minuto antes.
