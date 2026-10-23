# Candidatura junior y próximos pasos

La presentación principal está orientada a un puesto junior en un equipo. Se mantienen solamente dos CV, uno en español y otro en inglés, ambos de una página. Las cartas tienen fuentes editables y una opción de adaptación a una vacante real; no se enviaron postulaciones automáticamente.

## Proyectos y alcance

- Fracxion: proyecto propio. La demo interactiva sigue pendiente; se muestran código, capturas y decisiones técnicas. No se anuncia un despliegue inexistente.
- Ragnar: encargo para un comercio local. El cliente todavía no lanzó la tienda al público. La demostración actual depende del servidor local; la próxima fase es alojar frontend y backend fuera de la PC.
- RoadLedger: prototipo educativo para una evaluación técnica, con hipótesis de planificación explícitas. No se presenta como sistema ELD certificado.

No se incorporaron videos antiguos. Nelson grabará una explicación técnica nueva antes de añadir video al portfolio.

## Guía para el video técnico nuevo

Una estructura posible para Fracxion, usando la versión que esté funcionando al grabar:

1. Mostrar qué problema resuelve y explicar tu aporte, sin recorrer todas las pantallas.
2. Recorrer una operación con datos ficticios: cliente, borrador, emisión y cobro parcial.
3. Abrir una parte concreta del código y explicar cómo se comprueban empresa y permisos.
4. Explicar la numeración por empresa, la transacción y el bloqueo de filas: qué protegen y qué no garantizan.
5. Mostrar una prueba relevante y qué regresión intenta detectar.
6. Cerrar con una limitación actual y la próxima mejora que tenga sentido.

El video debería mostrar el código y el resultado real. Evitar reproducir credenciales, información de clientes o resultados que no se hayan comprobado. Este documento es una guía de preparación, no un video terminado ni una validación de las operaciones.

## Preparación de entrevistas

Practicar con el código propio: aislamiento entre empresas, permisos, transacciones, stock compartido entre productos y combos, confirmación de pagos, validación de formularios, errores de API, consultas SQL, regresiones cubiertas por tests y revisión de cambios propuestos por asistentes.

En cada explicación: problema, decisión, alternativa considerada, comprobación y limitación. Mantener el nivel B1 declarado y practicar una explicación corta del proyecto en inglés.

## Alojamiento: fase posterior a estas correcciones

Ragnar ya tiene una receta local en `Documentos/ragnar-v2/docs/DESPLIEGUE-GRATIS.md` y un `render.yaml`: dos servicios web Free de Render para Next.js y Django, y PostgreSQL de Neon. Debe verificarse el estado de la rama y la configuración real antes de usarla.

La consulta de documentación oficial del 22/10/2026 confirma que Render Free duerme tras 15 minutos sin tráfico, comparte 750 horas mensuales entre los servicios del workspace y usa disco efímero. La base Postgres gratuita de Render vence a los 30 días, por eso se propone una base externa persistente. Neon anuncia un plan Free sin límite temporal, sujeto a cuotas de uso. No equivale a alojamiento de producción siempre activo.

La publicación requiere acceso a las cuentas, configuración secreta de la base, revisión de correo y almacenamiento, y pruebas externas de catálogo, administración y pedidos de demostración. Estas correcciones del portfolio no crean servicios ni habilitan cobros reales.

Fuentes: [Render Free](https://render.com/docs/free), [Neon](https://neon.com/pricing).
