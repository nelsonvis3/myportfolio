export interface CaseStep { name: string; title: string; text: string; output: string }
export interface CaseChallenge { title: string; problem: string; solution: string; source: string }
export interface ProjectStudy {
  title: string; focus: string; status: string; discipline: string; caption: string;
  overview: { heading: string; paragraphs: string[]; features: string[]; scope: string };
  architecture: { heading: string; text: string; frontend: string; frontendDetail: string; backend: string; backendDetail: string; connection: string; services: { name: string; detail: string }[]; caption: string; paragraphs: string[] };
  flow: { id: string; label: string; heading: string; text: string; steps: CaseStep[]; note: string };
  challenges: CaseChallenge[];
  decisions: { title: string; text: string }[];
  results: { text: string; implemented: string; evidence: string; next: string; learning: string; source: string };
}

export const caseStudies: Record<string, ProjectStudy> = {
  "ragnar-suplementos": {
    title: "Ragnar Suplementos", focus: "Commerce · Inventario · Pagos", discipline: "Full Stack E-commerce", status: "Proyecto para una marca real",
    caption: "Captura real de la portada de Ragnar. Muestra la tienda en un entorno de desarrollo; los diagramas siguientes explican el código, no son capturas del checkout.",
    overview: {
      heading: "Una compra simple.<br>Una operación consistente.",
      paragraphs: [
        "Una marca de suplementos necesita vender productos y combos sin perder el control del inventario. El desafío no termina en mostrar un catálogo: una compra puede repetirse, un pago puede llegar tarde y varios artículos pueden consumir el mismo stock.",
        "Ragnar conecta una tienda en Next.js con una API Django que concentra catálogo, precios, pedidos y administración. La experiencia permite comprar como invitado o con una cuenta, elegir retiro o envío y utilizar los medios de pago habilitados.",
        "El trabajo une interfaz y operación comercial: un carrito persistente del lado del usuario, y reglas de validación, reserva y conciliación del lado del servidor."
      ],
      features: ["Catálogo por categorías, sabores y combos de productos", "Carrito persistente y checkout invitado con cuentas opcionales", "Cotización de envío firmada y opción de retiro", "Reservas de inventario, vencimiento y restitución de unidades", "Mercado Pago y medios manuales configurables", "Gestión de pedidos y revisiones desde Django Admin"],
      scope: "Los medios de pago dependen de la configuración del entorno. La revisión de este caso comprobó su implementación en código; no incluyó compras reales ni una verificación del despliegue público."
    },
    architecture: {
      heading: "La tienda presenta.<br>El servidor decide.",
      text: "Next.js, React y TypeScript construyen la experiencia de compra. Una capa de API tipada conecta la interfaz con Django REST Framework. PostgreSQL sostiene el dominio comercial en producción; SQLite es una alternativa de desarrollo local.",
      frontend: "Next.js + React", frontendDetail: "TypeScript · Tailwind CSS\nZustand / carrito y sesión",
      backend: "Django + DRF", backendDetail: "Catálogo · Pedidos · Inventario\nAdministración y pagos", connection: "REST API",
      services: [{name:"PostgreSQL",detail:"Catálogo, pedidos e inventario"},{name:"Mercado Pago",detail:"Integración configurable"},{name:"Nominatim / OSRM",detail:"Geocodificación y ruta de envío"}],
      caption: "Esquema del código actual. Django Admin opera sobre los mismos modelos y servicios. Las integraciones externas requieren configuración y disponibilidad de sus proveedores.",
      paragraphs: [
        "Django es la fuente de verdad para precios y disponibilidad. El navegador envía identificadores y cantidades; la API vuelve a consultar el catálogo antes de crear un pedido. Los datos de productos heredados de la versión anterior no gobiernan este flujo.",
        "Zustand persiste carrito y sesión en el navegador. Las cuentas opcionales utilizan JWT; el checkout también acepta invitados. El registro actual entrega la sesión directamente y no exige una confirmación de correo.",
        "Cada ItemPedido conserva nombre, sabor, precio unitario y, para un combo, sus componentes. Ese contexto permite interpretar la compra aunque el catálogo cambie después."
      ]
    },
    flow: {
      id: "checkout", label: "Checkout & Inventory", heading: "Del carrito al pedido.<br>Sin perder el contexto.",
      text: "Una compra atraviesa validaciones y estados. Este recorrido interactivo explica el flujo implementado; no crea pedidos ni conecta con un proveedor de pagos.",
      steps: [
        {name:"Seleccionar",title:"Productos, variantes y entrega.",text:"El carrito reúne artículos individuales o combos y sus cantidades. La cuenta es opcional. El cliente elige cómo recibir el pedido y conserva una clave para reintentar el mismo checkout.",output:"Artículos + cantidades + datos de entrega"},
        {name:"Cotizar",title:"Un envío con precio verificable.",text:"Para envío a domicilio, el backend geocodifica la dirección y consulta una ruta. Devuelve una cotización firmada que vincula destino, distancia, costo y origen. Su validez es de 15 minutos.",output:"Cotización firmada o retiro en local"},
        {name:"Validar",title:"Volver a comprobar antes de vender.",text:"Django relee precios, sabores y disponibilidad. Verifica la firma de envío cuando corresponde. Una clave de checkout repetida con los mismos datos recupera el pedido; con otros datos, devuelve un conflicto.",output:"Importes recalculados y solicitud consistente"},
        {name:"Reservar",title:"Varios artículos. Un mismo inventario.",text:"Dentro de una transacción, la API bloquea los productos y reúne las cantidades que consumen artículos y combos. Registra el pedido, sus ítems y la reserva de stock.",output:"Pedido pendiente + inventario reservado"},
        {name:"Resolver",title:"El pago es un proceso, no una pantalla.",text:"El resultado puede aprobarse, cancelarse, vencer o requerir revisión. La confirmación de pagos externos se contrasta con el proveedor. Los medios manuales tienen acciones administrativas explícitas.",output:"Pedido conciliado o revisión con contexto"}
      ],
      note: "Las reservas pendientes vencidas liberan unidades. El código ejecuta esa revisión en operaciones de catálogo y checkout, y ofrece un comando de mantenimiento; no se presupone un cron activo."
    },
    challenges: [
      {title:"Reintentar sin duplicar.",problem:"Un doble clic, una red lenta o una respuesta perdida pueden repetir la misma intención de compra.",solution:"Una clave UUID, una restricción única y el hash de los datos distinguen un reintento de una compra diferente. El navegador conserva la clave mientras la solicitud no cambia.",source:"CarritoDrawer.tsx · crear_preferencia · respuesta_checkout_existente"},
      {title:"Compartir stock entre productos y combos.",problem:"El mismo producto puede aparecer por separado y como componente de varios combos en una sola compra.",solution:"La API acumula cantidades por producto y bloquea las filas en un orden consistente. Los componentes reservados quedan guardados en el ítem, de modo que una edición posterior del combo no cambie qué unidades devolver.",source:"backend/store/views.py · ItemPedido.componentes_combo"},
      {title:"Conciliar pagos que llegan después.",problem:"Una notificación puede repetirse, informar un importe distinto o llegar cuando la reserva ya venció.",solution:"El webhook valida su firma y consulta al proveedor. Se comprueban referencia, moneda e importe; los casos ambiguos pasan a estados como revision_pago o revisar_stock, con resolución administrativa.",source:"firma_webhook_valida · procesar_notificacion_pago · backend/store/orders.py"},
      {title:"Cotizar con dependencias externas.",problem:"La geocodificación y el ruteo pueden fallar, y un precio calculado antes de confirmar puede quedar desactualizado.",solution:"Timeouts, caché y pausas acotan el uso de proveedores. La firma y el vencimiento impiden aceptar una cotización alterada o antigua. Los errores se comunican como situaciones reintentables.",source:"backend/store/shipping.py · cotizar_envio · crear_preferencia"}
    ],
    decisions: [
      {title:"Autoridad en el backend.",text:"Precios, variantes y disponibilidad se revalidan al confirmar. El estado del carrito orienta la compra; la API decide si puede convertirse en un pedido."},
      {title:"Reservar antes de aprobar.",text:"La reserva reduce disponibilidad mientras el pago está pendiente. Cancelación y vencimiento restituyen unidades; reservar no equivale a una venta aprobada."},
      {title:"Compra sin cuenta obligatoria.",text:"El checkout admite invitados. Si hay una sesión, asocia el pedido al usuario sin convertir el registro en un paso forzoso de compra."},
      {title:"Contexto histórico en cada ítem.",text:"Los snapshots conservan lo comprado y sus componentes. Conciliar o revertir un pedido no depende de reconstruir un catálogo que pudo cambiar."},
      {title:"Revisión humana como parte del flujo.",text:"Django Admin permite aprobar medios manuales, cancelar pedidos y atender excepciones de pago o stock. Las situaciones ambiguas tienen un estado visible y una acción definida."}
    ],
    results: {
      text:"Una tienda que conecta la experiencia de compra con las reglas de su operación: el catálogo, los pedidos, las reservas y los pagos comparten una misma base de datos y de decisiones.",
      implemented:"Catálogo → carrito → cotización → validación → reserva → pago o revisión → administración.",
      evidence:"Caso contrastado con el código local de ragnar-v2. La captura documenta la portada; los diagramas explican los flujos inspeccionados. Esta revisión no ejecutó compras ni la aplicación completa.",
      next:"Verificar en el entorno de destino los medios de pago habilitados, webhooks, expiración de reservas y entrega de correo; comprobar compras reales antes de afirmar operación en producción.",
      learning:"El checkout continúa después de redirigir al proveedor. Diseñar reintentos, expiración y revisión es tan importante como el formulario. Los combos obligan a pensar en inventario compartido y los snapshots evitan perder el contexto de una compra.",
      source:"Código revisado en ragnar-v2 durante esta iteración. Fuentes principales: lib/api.ts, backend/store/models.py, views.py, orders.py y shipping.py. Sin métricas comerciales ni disponibilidad pública inferidas."
    }
  },
  roadledger: {
    title:"RoadLedger", focus:"Routing · Tiempo · Visualización", discipline:"Full Stack / API Integration", status:"Prototipo técnico de planificación",
    caption:"Captura real de la pantalla inicial de RoadLedger: formulario y mapa antes de calcular un viaje. No representa una ruta resuelta ni registros diarios generados.",
    overview: {
      heading:"Trazar una ruta.<br>Entender todo el viaje.",
      paragraphs:[
        "Una ruta sobre un mapa cuenta solo una parte del viaje. Para construir un plan hay que relacionar distancias, retiro, entrega, horas disponibles y descansos, y convertir el cálculo en algo que se pueda leer.",
        "RoadLedger recibe tres ubicaciones, horas de ciclo utilizadas, salida y zona horaria de la terminal. El backend combina geocodificación, ruteo y un modelo de planificación; la interfaz representa la ruta, los eventos y las hojas diarias.",
        "El proyecto explora el recorrido completo entre una API y varias vistas del mismo resultado. Es un prototipo educativo: sus hipótesis se explicitan y no se presenta como un registro ELD certificado."
      ],
      features:["Tres ubicaciones y horas de ciclo como entradas del plan", "Geometría GeoJSON, millas e indicaciones de ruta", "Eventos de retiro, entrega, conducción, combustible y descanso", "Cronología y llegada estimada según las hipótesis del modelo", "Registros diarios con segmentos, totales y gráfico de estados", "Impresión de las hojas y zona horaria de la terminal"],
      scope:"No recibe telemetría del vehículo ni acredita cumplimiento normativo. El ruteo utiliza un perfil de automóvil y no modela restricciones para camiones, tráfico, estacionamiento o un historial completo de ocho días."
    },
    architecture: {
      heading:"Una API de planificación.<br>Varias formas de verla.",
      text:"Django sirve la página y los recursos de la aplicación. React construye el formulario, el resumen y los registros; MapLibre representa el mapa. Una única solicitud a POST /api/plan/ conecta las entradas con el resultado.",
      frontend:"React + MapLibre",frontendDetail:"Formulario · Mapa\nCronología · Hojas diarias",backend:"Django + DRF",backendDetail:"Validación · Proveedores\nPlanificación · Segmentación",connection:"POST /api/plan/",
      services:[{name:"Photon",detail:"Texto → coordenadas"},{name:"OSRM",detail:"Coordenadas → carretera"},{name:"Planificador",detail:"Ruta → eventos → días"}],
      caption:"Diagrama explicativo del código. El frontend se sirve desde Django y carga React, MapLibre y Babel por CDN. No hay persistencia de viajes; SQLite queda para funciones del framework.",
      paragraphs:[
        "El endpoint valida entradas antes de llamar a terceros. El geocodificador transforma ubicaciones en coordenadas; el proveedor de rutas devuelve geometría e indicaciones. El cálculo del plan trabaja con esa distancia y sus propias hipótesis temporales.",
        "El mismo JSON alimenta mapa, cronología y hojas diarias. GeoJSON es el contrato geométrico entre backend y MapLibre; los eventos conservan fechas con offset para mantener una referencia temporal común.",
        "Servir la interfaz desde Django simplifica la distribución del prototipo. Como contrapartida, el frontend depende de recursos CDN y de Babel en el navegador. WhiteNoise y Gunicorn forman parte de la preparación del servicio."
      ]
    },
    flow:{
      id:"planning",label:"Planning Pipeline",heading:"De tres ubicaciones<br>a un plan que se puede leer.",text:"Cinco etapas transforman una solicitud en distintas representaciones del viaje. El esquema describe la implementación y no consulta rutas ni ejecuta un cálculo real.",
      steps:[
        {name:"Validar",title:"Entradas explícitas, errores comprensibles.",text:"La API comprueba las tres ubicaciones, un ciclo utilizado finito entre 0 y 70, la fecha de salida y una zona IANA válida. Rechaza datos incompletos antes de consultar servicios externos.",output:"Solicitud normalizada"},
        {name:"Geocodificar",title:"Del nombre de un lugar a sus coordenadas.",text:"Photon resuelve cada ubicación. Una caché en memoria limitada, un bloqueo y una pausa entre solicitudes reducen consultas repetidas dentro de cada proceso.",output:"Origen, retiro y entrega geolocalizados"},
        {name:"Rutear",title:"La carretera como geometría y distancia.",text:"Se solicitan dos tramos a un proveedor compatible con OSRM. Ante un error de solicitud, se intenta el proveedor de respaldo. El resultado incluye GeoJSON, millas e indicaciones.",output:"Ruta y distancia hasta el retiro"},
        {name:"Planificar",title:"Convertir millas en eventos.",text:"El modelo estima conducción a 55 mph y agrega retiro, entrega, combustible y descansos. El tiempo de la ruta para automóviles no se reutiliza como duración de conducción del plan.",output:"Secuencia temporal según las hipótesis del prototipo"},
        {name:"Representar",title:"Un resultado, varias lecturas.",text:"Los eventos se dividen al cruzar medianoche. La interfaz muestra cronología, totales, mapa y registros diarios; cada hoja representa cuatro estados en un gráfico SVG y puede imprimirse.",output:"Mapa + eventos + hojas diarias"}
      ],
      note:"Las paradas se ubican de forma aproximada sobre la polilínea. El modelo supone descanso previo y utiliza las horas de ciclo aportadas, sin reconstruir un historial diario completo."
    },
    challenges:[
      {title:"Distancia y duración son problemas distintos.",problem:"Un proveedor de rutas para automóviles puede devolver un tiempo que no coincide con la hipótesis de conducción del prototipo.",solution:"La carretera aporta millas y geometría. El plan calcula sus tiempos con una velocidad media fija de 55 mph, manteniendo esa diferencia explícita en lugar de mezclar ambos criterios.",source:"trips/views.py · _route_trip · _make_plan"},
      {title:"Dividir el viaje sin perder minutos.",problem:"Un evento puede comenzar un día y terminar al siguiente, mientras cada hoja necesita representar una jornada completa.",solution:"La segmentación corta eventos en medianoche y organiza los estados por día. La suite del proyecto contiene escenarios que comprueban totales diarios de 1.440 minutos.",source:"trips/views.py · _calendar_logs · trips/tests.py"},
      {title:"Mantener una referencia temporal.",problem:"El viaje puede cruzar regiones o coincidir con una transición de horario estacional, provocando diferencias entre las vistas.",solution:"El modelo fija el offset estándar de la terminal durante el plan. Los eventos incluyen ese offset y la interfaz conserva su hora al mostrarlos. Es una decisión explícita del prototipo, no una implementación de todas las políticas posibles.",source:"_make_plan · _calendar_logs · trips/static/trips/app.jsx"},
      {title:"Seguir explicando el resultado si falla el mapa.",problem:"Geocodificación, ruteo y renderizado dependen de servicios o recursos externos que pueden fallar.",solution:"Hay timeouts, validación de respuestas y respaldo de ruteo. El frontend guarda el resultado antes de dibujar el mapa: si el render falla, conserva el resumen y los registros e informa la situación.",source:"_get_json · _geocode · _route_trip · App.submit"}
    ],
    decisions:[
      {title:"Un contrato para todas las vistas.",text:"Mapa, cronología y hojas diarias consumen el mismo resultado. Así se evita recalcular el viaje con criterios distintos en cada componente."},
      {title:"Geometría estándar entre capas.",text:"GeoJSON conecta el cálculo del backend con MapLibre. Las posiciones aproximadas de las paradas se obtienen interpolando millas sobre la ruta."},
      {title:"Una API sin historial de viajes.",text:"La solicitud produce un resultado directamente. No se agregaron cuentas, persistencia ni una base de viajes fuera del alcance del prototipo."},
      {title:"Tiempo y supuestos visibles.",text:"Velocidad media, horas de ciclo y offset de terminal forman parte del modelo. Declararlos permite interpretar el resultado y entender qué queda sin modelar."},
      {title:"Popups como contenido, no HTML arbitrario.",text:"Las etiquetas del mapa se construyen con nodos y textContent. Los nombres de lugares se tratan como texto al incorporarlos a la interfaz."}
    ],
    results:{
      text:"Un prototipo que conecta entradas, proveedores y cálculo con una representación visual del viaje. Su foco está en que ruta, eventos y registros cuenten la misma historia.",
      implemented:"Entradas → geocodificación → ruta → planificación → segmentación diaria → mapa, cronología e impresión.",
      evidence:"Código revisado en eld-trip-planner. La suite contiene 12 pruebas sobre validación, contrato API y límites temporales; no se ejecutó de nuevo en esta revisión del portfolio. La captura disponible documenta el estado inicial.",
      next:"Verificar una ruta completa contra proveedores activos, revisar el comportamiento en dispositivos reales y ampliar los supuestos del modelo antes de cualquier uso operativo. La disponibilidad del enlace público no se comprobó en esta tarea.",
      learning:"Separar cálculo y proveedores externos hace que las reglas puedan probarse con entradas controladas. Los límites temporales merecen escenarios específicos, y una interfaz clara también debe comunicar las hipótesis y límites de su resultado.",
      source:"Código revisado en eld-trip-planner durante esta iteración. Fuentes principales: trips/views.py, trips/static/trips/app.jsx, trips/tests.py, templates y configuración de Django. La documentación describe un prototipo; no valida cumplimiento legal."
    }
  }
};
