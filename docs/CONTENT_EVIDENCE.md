# Evidencia del contenido — actualizado el 12 de octubre de 2026

## Fuentes y criterio

El nuevo caso de estudio se redactó después de inspeccionar el checkout local `facturador-saas-api`. No se dedujo la arquitectura del nombre del proyecto. Se consultaron su código, dependencias, documentación y capturas. Las afirmaciones sobre la suite del SaaS corresponden a lo documentado allí; no se volvió a ejecutar esa suite durante la reconstrucción del portfolio.

La marca de presentación **LedgerCore** corresponde al proyecto denominado **Fracxion** en su interfaz. No se modificó el repositorio de la aplicación. Las imágenes son copias intactas de capturas de un entorno de prueba con datos sintéticos; no son mockups generados por IA. El encuadre del portfolio utiliza HTML/CSS sobre esas capturas.

## Correspondencia entre afirmaciones y código

Rutas relativas al repositorio de Facturador:

| Afirmación | Evidencia inspeccionada |
| --- | --- |
| Frontend Next.js, React y TypeScript; Tailwind | `frontend/package.json`, `frontend/src/app/`, `frontend/src/components/` |
| Backend Django REST Framework y PostgreSQL | `backend/requirements.txt`, `backend/config/settings.py` |
| Empresas y membresías con cinco roles | `backend/tenancy/models.py` |
| Verificación de usuario, empresa activa, membresía y política por operación | `backend/tenancy/permissions.py` |
| Filtrado y asignación del tenant desde contexto validado | `backend/tenancy/mixins.py` |
| Registro atómico de cuenta, empresa, owner y auditoría | `backend/accounts/registration.py` |
| Snapshots de cliente y producto al crear el borrador | `backend/billing/services.py`, `create_invoice_draft` |
| Numeración por empresa bajo bloqueo, verificación de actor y membresía | `backend/billing/services.py`, `issue_invoice` |
| Importes Decimal y redondeo explícito | `backend/billing/services.py`, `round_money` |
| Pago con bloqueo y comprobación del saldo | `backend/billing/services.py`, `record_payment` |
| Reversión separada, con motivo y auditoría | `backend/billing/services.py`, `reverse_payment` |
| Sesiones HttpOnly y CSRF | `backend/config/settings.py`, `frontend/src/lib/api.ts` |
| Proxy Caddy, Gunicorn, Redis y PostgreSQL | `compose.yaml`, `README.md` |
| Pruebas históricas y límites de validación local | `docs/AUDIT.md`, tests de backend y carpeta `frontend/e2e/` |

El aislamiento es de aplicación sobre una base compartida. No se afirma que existan esquemas dedicados, RLS o una base por empresa. No se presenta facturación interna como facturación fiscal. No se afirman suscripciones cobradas, clientes comerciales, métricas de uso ni despliegue público.

## Origen de los recursos visuales

| Archivo del portfolio | Original de Facturador |
| --- | --- |
| `public/img/ledgercore-overview.png` | `docs/screenshots/company-dashboard-desktop.png` |
| `public/img/ledgercore-mobile.png` | `docs/screenshots/company-dashboard-mobile.png` |
| `public/img/ledgercore-invoice.png` | `docs/screenshots/invoice.png` |

Las tres capturas se inspeccionaron visualmente. Muestran la marca Fracxion, la empresa E2E y datos ficticios. Los importes visibles son valores del escenario de prueba, no métricas de rendimiento o negocio. Los SHA-256 de las copias se verifican contra sus originales en la validación de entrega.

Ragnar y RoadLedger conservan los PNG originales y utilizan derivados WebP comprimidos para la presentación. El cerebro de portada usa contornos derivados de la malla cortical fsaverage5 de Nilearn; `src/visual/brain.ts` implementa su interpretación mediante líneas luminosas. `brain.webp` es un render de la misma escena para la alternativa estática. No es una captura de una aplicación ni una medición de actividad cerebral. Procedencia y licencia: `public/models/README.txt` y `LICENSE-nilearn.txt`.

## IA, habilidades y otras afirmaciones

- El uso de Codex en el SaaS se apoya en el contexto documentado de trabajo previo. No se adjudica cada módulo a un modelo específico ni se inventa un porcentaje de código generado.
- El usuario confirmó en esta conversación que utiliza Claude Code para analizar, implementar y revisar código. Esa confirmación respalda su descripción general, no la autoría de módulos concretos del SaaS.
- “AI Automation” distingue scripts, integración de APIs y validaciones de los agentes y la orquestación, identificados como exploración. No se atribuye dominio de n8n, Make u otros productos no verificados.
- Usar IA para desarrollar no implica que LedgerCore incorpore IA como funcionalidad de usuario.
- Formación, trayectoria y redes provienen de las fuentes del portfolio. No se verificaron certificados ni el estado actual de los despliegues externos. Los nuevos casos de Ragnar y RoadLedger se contrastaron con sus repositorios locales, como se detalla abajo.
- El usuario autorizó actualizar también el CV: se reemplazó Formosa Empleos por LedgerCore, se incorporó el trabajo con Codex y Claude Code y se preservaron sus datos de contacto, formación e idiomas. Los cursos se presentan con su estado declarado, sin reproducir las fechas contradictorias del PDF anterior. La URL del portfolio procede de ese PDF y no acredita un nuevo despliegue. Fuente editable: `docs/cv/nelson-sivisstum.html`.
- No se encontró un remoto Git del Facturador en el checkout inspeccionado. Por eso no se inventó un enlace GitHub ni una demo.

## Ragnar — revisión de código del 11 de octubre

Repositorio inspeccionado: `/home/nelson/Documentos/ragnar-v2`. Lectura de código y dependencias; sin modificar la aplicación ni ejecutar compras o pagos.

| Afirmación del caso | Fuente local |
| --- | --- |
| Next.js, React, TypeScript, Zustand; Django REST Framework | `package.json`, `lib/api.ts`, `store/cart-store.ts`, `store/auth-store.ts`, `backend/requirements.txt` |
| Django como fuente de verdad para catálogo y pedidos | `backend/store/models.py`, `backend/store/views.py` |
| Checkout invitado y cuentas opcionales con JWT | `crear_preferencia`, serializers, `store/auth-store.ts` |
| Reintento con UUID y hash; conflicto si cambian los datos | `crear_preferencia`, `respuesta_checkout_existente`, `components/CarritoDrawer.tsx` |
| Cotización de envío firmada, ligada a dirección/origen y válida 900 segundos | `cotizar_envio`, `crear_preferencia`, `backend/store/shipping.py` |
| Bloqueos en orden, cantidades agregadas de combos y snapshot | `backend/store/views.py`, `ItemPedido.componentes_combo` |
| Reservas, vencimiento, cancelación y devolución | `backend/store/orders.py`, comando `expirar_reservas` |
| Webhook con firma y consulta de referencia, moneda e importe al proveedor | `firma_webhook_valida`, `procesar_notificacion_pago` |
| Revisión de pagos/stock y medios manuales | `backend/store/orders.py`, `backend/store/admin.py` |

Se corrigieron descripciones heredadas: la cuenta no es obligatoria, el registro no exige confirmación de correo y la sesión usa JWT en el navegador. No se atribuyen sesiones HttpOnly de LedgerCore a Ragnar. No se da por instalado un cron ni por configurado Mercado Pago. La captura muestra la portada en desarrollo, no un checkout completado. La línea correspondiente del CV también se actualizó para mantener consistencia.

## RoadLedger / ELD — revisión de código del 11 de octubre

Repositorio inspeccionado: `/home/nelson/Proyectos/eld-trip-planner`. La aplicación está en esa raíz, no en un subdirectorio `backend/`.

| Afirmación del caso | Fuente local |
| --- | --- |
| Django sirve HTML; React/Babel vía CDN; MapLibre | templates, `trips/static/trips/app.jsx`, `requirements.txt` |
| `POST /api/plan/`; tres ubicaciones, ciclo 0–70, fecha y zona IANA | `trips/views.py`, `_validate_trip_inputs` |
| Photon con caché limitada y pausa por proceso | `_geocode`, `_photon_request` |
| Dos tramos OSRM, GeoJSON e indicaciones, proveedor alternativo | `_route_trip` |
| Modelo de 55 mph, retiro/entrega de una hora y eventos | `_make_plan` |
| Corte a medianoche y totales diarios de 1440 minutos | `_calendar_logs` |
| Resumen y hojas disponibles aunque falle el mapa | `App.submit`, `DailyLog`, `pointOnRoute` en `app.jsx` |
| Suite de 12 pruebas presente, no ejecutada en esta tarea | `trips/tests.py` |

El proyecto no persiste viajes ni recibe telemetría. Es un prototipo educativo: usa perfil de automóvil, hipótesis de descanso previo y balance de ciclo, no un historial completo de ocho días. No se lo presenta como ELD certificado ni se garantiza cumplimiento legal, ruta apta para camiones o exactitud operativa. La captura corresponde al estado inicial, sin ruta calculada. El enlace público proviene del portfolio y su disponibilidad no se verificó.

## Cambio visual solicitado

La indicación posterior del usuario prioriza un recorrido de galaxias sobre el objeto metálico del brief original. Los prompts se conservan intactos. “Data Engineering” nombra un área de habilidades respaldada por SQL, PostgreSQL, modelado y transacciones; no agrega un puesto laboral, tecnologías ni métricas de dominio.

### Actualización visual del 12 de octubre

La última indicación reemplaza el planeta por un cerebro compuesto solo de líneas luminosas, con rotación automática lenta y arrastre. Se conserva la descripción de las habilidades. Los tres escenarios de Selected Projects incluyen escritorio y móvil, con capturas reales dentro de marcos 3D. Los casos de estudio y el CV conservan su contenido técnico de la revisión anterior.

| Nueva captura móvil | Procedencia y alcance |
| --- | --- |
| `public/img/ragnar-mobile.webp` | Derivado WebP de `/home/nelson/Documentos/ragnar-v2/docs/screenshots/seleccion/02-mobile.png`: catálogo real en un entorno local de demostración. El manifiesto original registra captura del 11 de octubre, viewport 390 × 844 y DPR 2. |
| `public/img/roadledger-mobile.webp` | Captura del estado inicial real de RoadLedger a 390 × 844 y DPR 2. Se sirvió una copia temporal de su código mediante Django en localhost:4182; no se completó el formulario ni se calculó una ruta. No se modificó el repositorio original. |

Ambos archivos tienen 780 × 1688 píxeles. Los precios visibles de Ragnar pertenecen a su catálogo de demostración; no son resultados comerciales. RoadLedger muestra el formulario antes de planificar, sin atribuir una ruta o resultado inexistente. Las pantallas de teléfono no son interfaces reconstruidas ni generadas por IA.
