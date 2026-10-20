import type { DocPageContent, DocPageId } from "../types";

export const es: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Primeros pasos con la guía digital del alojamiento",
    description:
      "Qué es la guía digital del alojamiento, qué incluye, cuánto cuesta y cómo la abren los huéspedes con un toque en una placa dentro del alojamiento.",
    blocks: [
      {
        type: "p",
        text: "La guía digital del alojamiento es una página para el móvil con todo lo que los huéspedes necesitan saber durante la estancia: wifi, check-in y check-out, normas de la casa, electrodomésticos, basura, emergencias y sus recomendaciones. Está en portugués, inglés y dos idiomas más, y se abre con un toque en una placa colocada dentro del alojamiento, o con el código QR impreso en la misma placa.",
      },
      {
        type: "p",
        text: "Es un servicio que hacemos por usted: redactamos, traducimos, publicamos y mantenemos la guía al día. No hay nada que instalar ni ninguna herramienta nueva que aprender.",
      },
      { type: "h2", id: "whats-included", text: "Qué incluye" },
      {
        type: "table",
        head: ["Elemento", "Detalle"],
        rows: [
          ["Redacción de la guía", "Convertimos sus notas, fotos o su guía actual en una página clara, organizada por temas"],
          ["Cuatro idiomas", "Portugués, inglés y dos más a su elección (francés, español, alemán o italiano), revisados por nosotros"],
          ["Placas de un toque", "Placa de pared, expositor o pegatina, con código QR, para colocar dentro del alojamiento"],
          ["Versión imprimible", "Un PDF con el mismo contenido, para dejar una copia en papel en el alojamiento"],
          ["Alojamiento web y cambios", "Alojamiento de la página y cambios hechos por nosotros en un plazo de dos días laborables"],
        ],
      },
      { type: "h2", id: "pricing", text: "Precios" },
      {
        type: "table",
        head: ["Alojamientos", "Placas (una por alojamiento)", "Cuota mensual"],
        rows: [
          ["1 alojamiento", "1 placa de regalo", "30 €/mes por cuenta"],
          ["3 alojamientos", "3 placas de regalo", "30 €/mes por cuenta"],
          ["10 alojamientos", "10 placas de regalo", "30 €/mes por cuenta"],
        ],
      },
      {
        type: "p",
        text: "La guía cuesta 30 € al mes por cuenta, + IVA, sea cual sea el número de alojamientos, con la redacción de las guías, la traducción a cuatro idiomas, el alojamiento web y los cambios incluidos. La placa es de regalo, una por alojamiento. Por ejemplo, 3 alojamientos: 30 €/mes + IVA, con 3 placas de regalo. Los idiomas adicionales tienen un coste pequeño, indicado en su presupuesto. Precios + IVA, orientativos y confirmados después de la demostración.",
      },
      { type: "h2", id: "how-it-works", text: "Cómo funciona para los huéspedes" },
      {
        type: "ol",
        items: [
          "El huésped entra y acerca el móvil a la placa (o lee el código QR).",
          "La guía se abre en el idioma del móvil, con un botón para cambiar de idioma.",
          "Encuentra el wifi (con un botón para copiar la contraseña), las normas de la casa y sus recomendaciones sin tener que escribirle.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Lo que la guía nunca contiene",
        text: "Códigos de la puerta, de la caja de llaves o de la alarma. Esos se siguen enviando en su mensaje de check-in.",
      },
      { type: "h2", id: "next-steps", text: "Próximos pasos" },
      {
        type: "ul",
        items: [
          "[Instalación](/es/docs/digital-guest-guide/setup): qué información enviarnos y dónde colocar la placa.",
          "[Configuración](/es/docs/digital-guest-guide/configuration): idiomas, secciones y cómo pedir cambios.",
          "[Uso](/es/docs/digital-guest-guide/usage): buenas prácticas para que los huéspedes lean de verdad la guía.",
        ],
      },
    ],
  },
  setup: {
    title: "Instalación de la guía digital del alojamiento",
    description: "La información que necesitamos para redactar la guía, cómo aprueba el borrador y dónde colocar la placa dentro del alojamiento.",
    blocks: [
      { type: "h2", id: "send-information", text: "1. Envíenos la información" },
      {
        type: "p",
        text: "Envíela como le resulte más cómodo: un documento, fotos, la guía en papel que ya tiene o un audio de WhatsApp. Nosotros la organizamos.",
      },
      {
        type: "table",
        head: ["Tema", "Qué contarnos"],
        rows: [
          ["Check-in y check-out", "Horarios, cómo dejar las llaves, qué hacer con la basura y la ropa de cama"],
          ["Wifi", "Nombre de la red y contraseña"],
          ["El alojamiento", "Cómo funcionan la placa de cocina, el horno, la lavadora, la calefacción, el aire acondicionado y el agua caliente"],
          ["Normas", "Normas de la casa y del edificio, horas de silencio, tabaco, mascotas, fiestas"],
          ["Basura y reciclaje", "Dónde están los contenedores y cómo separar los residuos"],
          ["Cómo llegar y aparcar", "Desde el aeropuerto y la estación, aparcamiento y transporte público"],
          ["Emergencias", "Su contacto, la farmacia, el hospital y el centro de salud más cercanos"],
          ["Recomendaciones", "Restaurantes, playas, paseos y tiendas que recomienda"],
          ["Datos legales", "Número de registro (RNAL)"],
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "No nos envíe códigos de acceso",
        text: "Los códigos de la puerta, de la caja de llaves y de la alarma nunca van en la guía. Si nos llega alguno por error, no lo publicamos.",
      },
      { type: "h2", id: "approve", text: "2. Apruebe el borrador" },
      {
        type: "p",
        text: "En unos tres días laborables le enviamos un enlace al borrador en portugués y en los demás idiomas. Pida todas las correcciones que quiera. Solo publicamos cuando usted lo aprueba.",
      },
      { type: "h2", id: "place-plate", text: "3. Coloque la placa" },
      {
        type: "p",
        text: "La placa llega grabada y probada en un plazo de dos a cuatro días laborables. Colóquela dentro del alojamiento, en un lugar que los huéspedes vean al entrar.",
      },
      {
        type: "table",
        head: ["Formato", "Dónde funciona mejor"],
        rows: [
          ["Placa de pared", "Junto a la puerta de entrada, por dentro"],
          ["Expositor", "En la mesa del salón, en la encimera de la cocina o en la recepción"],
          ["Pegatina", "En la nevera o en el espejo de la entrada"],
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Evite la puerta exterior: la guía contiene la contraseña del wifi y solo debe estar al alcance de quien se aloja allí.",
      },
    ],
  },
  configuration: {
    title: "Configuración de la guía digital del alojamiento",
    description: "Idiomas, secciones de la guía, la sección «Valore su estancia», el enlace a su web y cómo pedir cambios.",
    blocks: [
      { type: "h2", id: "languages", text: "Idiomas" },
      {
        type: "p",
        text: "La guía incluye portugués, inglés y dos idiomas más a su elección entre francés, español, alemán e italiano. Se abre automáticamente en el idioma del móvil del huésped y tiene un selector. Si necesita más idiomas, incluimos el coste en su presupuesto.",
      },
      { type: "h2", id: "sections", text: "Secciones" },
      {
        type: "ul",
        items: [
          "Bienvenida",
          "Check-in y check-out",
          "Wifi, con un botón para copiar la contraseña",
          "Cómo funciona el alojamiento: electrodomésticos, calefacción, aire acondicionado y agua caliente",
          "Normas de la casa y del edificio",
          "Basura y reciclaje",
          "Ruido y vecinos",
          "Emergencias: 112, su contacto, farmacia, hospital y centro de salud",
          "Cómo llegar y aparcar",
          "Recomendaciones del anfitrión",
          "Tasa turística: qué es y por qué se cobra",
          "Valore su estancia",
          "Libro de reclamaciones y número de registro",
        ],
      },
      {
        type: "p",
        text: "En conjunto, estas secciones incluyen el contenido que la ley portuguesa exige en el libro de información de un alojamiento turístico (alojamento local): funcionamiento del alojamiento, normas, residuos, electrodomésticos, ruido, normas del edificio y el contacto del responsable, en portugués, inglés y dos idiomas más.",
      },
      { type: "h2", id: "review-your-stay", text: "La sección «Valore su estancia»" },
      {
        type: "p",
        text: "Es igual para todos los huéspedes: explica que Booking.com envía su solicitud de valoración por correo electrónico y Airbnb en la app (en Viajes), después del check-out, y que su opinión ayuda a otros viajeros. No ofrece descuentos ni regalos ni pide una puntuación concreta, porque las plataformas lo prohíben. Si su alojamiento tiene perfil de Google, podemos añadir el enlace de Google.",
      },
      { type: "h2", id: "website", text: "Enlace a su web" },
      {
        type: "p",
        text: "Si tiene web propia, podemos mostrar un enlace discreto «Web oficial». Está desactivado por defecto: Airbnb prohíbe animar a los huéspedes a reservar fuera de la plataforma, así que nunca usamos frases como «reserve directamente y ahorre».",
      },
      { type: "h2", id: "changes", text: "Pedir cambios" },
      {
        type: "p",
        text: "Envíenos lo que ha cambiado por WhatsApp o correo electrónico. Actualizamos la guía y el PDF en un plazo de dos días laborables, en todos los idiomas. La placa nunca hay que cambiarla.",
      },
    ],
  },
  usage: {
    title: "Uso de la guía digital del alojamiento",
    description: "Buenas prácticas para que los huéspedes encuentren y usen la guía, y cómo funciona junto con el asistente de WhatsApp.",
    blocks: [
      { type: "h2", id: "let-guests-know", text: "Dé a conocer la guía a los huéspedes" },
      {
        type: "ul",
        items: [
          "Menciónela en su mensaje de check-in: «Al llegar, toque la placa junto a la puerta para ver el wifi y todo sobre la casa».",
          "Coloque la placa donde se vea enseguida.",
          "Deje la versión impresa en un cajón o en la mesa del salón para los huéspedes que prefieren el papel.",
        ],
      },
      { type: "h2", id: "recommendations", text: "Recomendaciones que marcan la diferencia" },
      {
        type: "p",
        text: "Los huéspedes valoran lo que solo sabe alguien de la zona: la panadería del barrio, la playa más tranquila, el restaurante sin turistas. Cinco a diez recomendaciones bien elegidas valen más que una lista larga.",
      },
      { type: "h2", id: "assistant", text: "Con el asistente de WhatsApp" },
      {
        type: "p",
        text: "Si también tiene el asistente con IA, el contenido de la guía es su base de conocimiento. Cuando un huésped pregunta por WhatsApp, recibe la misma respuesta que está en la guía, en su idioma. El asistente tampoco comparte nunca códigos de acceso.",
      },
      { type: "h2", id: "several-properties", text: "Varios alojamientos" },
      {
        type: "p",
        text: "Cada alojamiento tiene su propia guía y su propia placa. Para gestores, mantenemos el mismo aspecto en todos y aplicamos de una vez los cambios comunes, como nuevas normas del edificio o un contacto de emergencia distinto.",
      },
    ],
  },
  troubleshooting: {
    title: "Solución de problemas de la guía digital del alojamiento",
    description: "Qué hacer cuando un huésped no consigue abrir la guía con un toque o cuando hay información desactualizada.",
    blocks: [
      { type: "h2", id: "tap-does-not-open", text: "El toque no abre la guía" },
      {
        type: "ul",
        items: [
          "En el iPhone XS y posteriores, basta con acercar la parte superior del móvil a la placa con la pantalla encendida.",
          "En Android, la lectura por contacto (un toque) tiene que estar activada en los ajustes. Muchos móviles ya la tienen activada.",
          "Las fundas gruesas o metálicas pueden bloquear la lectura. En ese caso, el huésped usa el código QR.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Todas las placas tienen un código QR impreso. Quien no pueda abrirla con un toque apunta la cámara y llega a la misma guía.",
      },
      { type: "h2", id: "outdated-information", text: "Hay información desactualizada" },
      {
        type: "p",
        text: "Envíenos la corrección por WhatsApp o correo electrónico. La actualizamos en un plazo de dos días laborables. En casos urgentes, como una contraseña del wifi equivocada, avísenos y le damos prioridad.",
      },
      { type: "h2", id: "damaged-plate", text: "La placa se ha roto o ha desaparecido" },
      {
        type: "p",
        text: "Le enviamos una nueva con la misma dirección, así que la guía sigue siendo la misma. Una placa adicional para el mismo alojamiento tiene un coste pequeño, indicado en su presupuesto.",
      },
      { type: "h2", id: "shared-link", text: "El enlace se ha compartido fuera del alojamiento" },
      {
        type: "p",
        text: "La dirección de la guía es privada e imposible de adivinar, pero un huésped podría guardarla. Si cambia la contraseña del wifi o quiere una dirección nueva, díganoslo: creamos una y volvemos a grabar la placa.",
      },
    ],
  },
  faq: {
    title: "Preguntas frecuentes sobre la guía digital del alojamiento",
    description: "Respuestas rápidas sobre precios, idiomas, seguridad, valoraciones y la placa obligatoria de los alojamientos turísticos.",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "¿Cuánto cuesta al mes?",
            a: "30 € al mes por cuenta, + IVA, sea cual sea el número de alojamientos, con el alojamiento web y los cambios incluidos. La placa es de regalo, una por alojamiento. Por ejemplo, 3 alojamientos: 30 €/mes + IVA, con 3 placas de regalo. Con el pack para alojamientos turísticos, la guía está incluida mientras el pack esté activo.",
          },
          {
            q: "¿La guía cuenta como el libro de información que exige la ley?",
            a: "La guía incluye el contenido que la ley pide en el libro de información, en portugués, inglés y dos idiomas más, y le entregamos una versión imprimible que recomendamos tener en el alojamiento.",
          },
          {
            q: "¿La guía sustituye a la placa obligatoria de los alojamientos turísticos?",
            a: "No. La placa identificativa con su número de registro sigue un modelo oficial fijado por ley. La guía muestra su número de registro, pero no sustituye esa placa.",
          },
          {
            q: "¿La guía recoge datos de los huéspedes?",
            a: "No. La guía no tiene formularios ni pide datos personales. Solo se guardan los registros técnicos habituales del servidor.",
          },
          {
            q: "¿Puedo pedir valoraciones a través de la guía?",
            a: "La guía tiene una sección neutral que explica dónde dejar una valoración, igual para todos y sin ofrecer nada a cambio, como exigen Booking.com y Airbnb.",
          },
          {
            q: "¿Envían ustedes los registros de huéspedes al SIBA?",
            a: "No. Si quiere recordatorios de los plazos, la automatización «Limpiezas y plazos» se encarga de eso. Para el envío automático, recomendamos herramientas especializadas como Chekin o Hostkit.",
          },
        ],
      },
    ],
  },
};
