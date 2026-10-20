import type { DocPageContent, DocPageId } from "../types";

export const es: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Primeros pasos con el llavero digital",
    description: "Qué es el llavero digital, qué puede abrir, cuánto cuesta y cómo lo usa el cliente con un toque del móvil.",
    blocks: [
      {
        type: "p",
        text: "El llavero digital es un pequeño llavero para las llaves. Con un toque del móvil, abre el WhatsApp, el Instagram o la web de su negocio. Funciona en iPhone y Android, sin app.",
      },
      {
        type: "p",
        text: "Nosotros nos encargamos de todo: configuramos el destino de cada llavero y lo probamos en iPhone y Android antes de la entrega.",
      },
      { type: "h2", id: "que-abre", text: "Qué puede abrir" },
      {
        type: "table",
        head: ["Destino", "Lo que ve el cliente"],
        rows: [
          ["WhatsApp", "Una conversación con su negocio"],
          ["Instagram", "El perfil de su negocio"],
          ["Web", "Su sitio web"],
        ],
      },
      { type: "h2", id: "precios", text: "Precios" },
      {
        type: "table",
        head: ["Cantidad", "Precio por llavero", "Total"],
        rows: [
          ["1 llavero", "5 €", "5 €"],
          ["Pack de 10", "4,50 €", "45 €"],
          ["Pack de 25", "4 €", "100 €"],
        ],
      },
      { type: "p", text: "Todos los precios + IVA. Son orientativos y se confirman en la demostración." },
      { type: "h2", id: "como-funciona", text: "Cómo funciona para el cliente" },
      {
        type: "ol",
        items: [
          "El cliente acerca el móvil al llavero.",
          "Se abre al momento el destino que usted eligió.",
          "No tiene que instalar ninguna app ni buscar su nombre.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Solo con un toque",
        text: "El llavero no tiene código QR. Los móviles muy antiguos o sin lectura por proximidad no pueden abrirlo. Para esos casos, la Tarjeta de visita digital y las placas tienen código QR.",
      },
      { type: "h2", id: "proximos-pasos", text: "Próximos pasos" },
      {
        type: "ul",
        items: [
          "[Pedido y entrega](/es/docs/digital-keychain/setup): qué enviarnos y qué ocurre hasta que recibe los llaveros.",
          "[Configuración](/es/docs/digital-keychain/configuration): cómo elegir entre WhatsApp, Instagram y web.",
          "[Uso](/es/docs/digital-keychain/usage): a quién regalarlos y cómo explicárselos al cliente.",
        ],
      },
    ],
  },
  setup: {
    title: "Pedido y entrega del llavero digital",
    description: "Qué enviarnos para cada destino, cómo elegir la cantidad y qué hacemos antes de la entrega.",
    blocks: [
      { type: "h2", id: "elegir-destino", text: "1. Elija el destino" },
      {
        type: "p",
        text: "Cada llavero abre un destino, que se elige al hacer el pedido. Díganos cuál y envíenos lo que necesitamos:",
      },
      {
        type: "table",
        head: ["Destino", "Qué enviarnos"],
        rows: [
          ["WhatsApp", "El número de WhatsApp con el que atiende a sus clientes"],
          ["Instagram", "El nombre del perfil de su negocio (la @)"],
          ["Web", "La dirección del sitio o de la página que quiere abrir"],
        ],
      },
      { type: "h2", id: "cantidad", text: "2. Díganos cuántos" },
      {
        type: "p",
        text: "Puede pedir llaveros sueltos o packs de 10 y de 25. Si quiere hablar de personalización, como su logotipo, lo vemos con usted en la demostración.",
      },
      { type: "h2", id: "configurar-probar", text: "3. Los configuramos y probamos" },
      {
        type: "p",
        text: "Configuramos cada llavero con su destino y lo probamos en iPhone y Android antes de la entrega. Está listo en pocos días laborables; le indicamos el plazo exacto en la demostración.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Cuando reciba los llaveros, pruebe uno con su propio móvil antes de regalarlos.",
      },
    ],
  },
  configuration: {
    title: "Configuración del llavero digital",
    description: "Cómo elegir entre WhatsApp, Instagram y web, con consejos para cada destino.",
    blocks: [
      { type: "h2", id: "un-destino", text: "Un destino por llavero" },
      {
        type: "p",
        text: "Cada llavero abre siempre el destino elegido en el pedido. Elija el que sus clientes más usan para contactarle.",
      },
      { type: "h2", id: "whatsapp", text: "WhatsApp" },
      {
        type: "p",
        text: "Abre una conversación con su negocio. Es la opción natural si gestiona citas, reservas o pedidos por mensaje. Use un número que alguien atienda durante el día.",
      },
      { type: "h2", id: "instagram", text: "Instagram" },
      {
        type: "p",
        text: "Abre el perfil de su negocio. Tiene sentido si publica novedades, trabajos o platos del día y quiere que sus clientes le sigan.",
      },
      { type: "h2", id: "web", text: "Web" },
      {
        type: "p",
        text: "Abre su sitio o una página que usted elija. Mejor una página que funcione bien en el móvil.",
      },
      {
        type: "callout",
        tone: "info",
        text: "La personalización del llavero, como su logotipo, es algo que vemos con usted en la demostración.",
      },
    ],
  },
  usage: {
    title: "Uso del llavero digital",
    description: "A quién regalar el llavero y cómo explicarle al cliente, en una frase, lo que hace.",
    blocks: [
      { type: "h2", id: "a-quien-regalar", text: "A quién regalarlo" },
      {
        type: "table",
        head: ["Negocio", "Cómo usarlo"],
        rows: [
          ["Cafeterías, restaurantes, peluquerías y tiendas", "Regálelo a sus clientes habituales: su WhatsApp o Instagram va siempre en sus llaves"],
          ["Alojamientos turísticos", "El llavero de la llave de la vivienda abre el WhatsApp del anfitrión"],
          ["Inmobiliarias", "Entregue el llavero junto con las llaves de la nueva vivienda"],
          ["Equipos, eventos y ferias", "Un regalo útil que se queda en las llaves en lugar de acabar en la papelera"],
        ],
      },
      { type: "h2", id: "explicar", text: "Explíquelo en una frase" },
      {
        type: "p",
        text: "Al entregarlo, diga por ejemplo: «Acerque el móvil a este llavero y nos escribe directamente por WhatsApp.» Enseñarlo una vez con su propio móvil ayuda.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Si el cliente tiene Android y no se abre a la primera, dígale que active la lectura por proximidad en los ajustes de conexión.",
      },
    ],
  },
  troubleshooting: {
    title: "Solución de problemas del llavero digital",
    description: "Qué hacer cuando el toque no abre nada o cuando un llavero abre un destino equivocado.",
    blocks: [
      { type: "h2", id: "toque-no-abre", text: "El toque no abre nada" },
      {
        type: "ul",
        items: [
          "En los iPhone XS y posteriores, acerque la parte superior del móvil al llavero, con la pantalla encendida.",
          "En Android, active la lectura por proximidad en los ajustes de conexión.",
          "Si la funda del móvil es gruesa, pruebe sin ella.",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "No hay código QR",
        text: "El llavero funciona solo con un toque. Los móviles muy antiguos o sin lectura por proximidad no pueden abrirlo. Para esos clientes, la Tarjeta de visita digital y las placas tienen código QR.",
      },
      { type: "h2", id: "destino-equivocado", text: "Abre un destino equivocado" },
      {
        type: "p",
        text: "Probamos cada llavero antes de la entrega. Si algo no está bien, escríbanos por WhatsApp o email, díganos qué debería abrir y buscamos la solución con usted.",
      },
      { type: "h2", id: "mas-llaveros", text: "Necesita más llaveros" },
      {
        type: "p",
        text: "Puede pedir más cuando quiera, sueltos o en packs. Escríbanos por WhatsApp o email.",
      },
    ],
  },
  faq: {
    title: "Preguntas frecuentes sobre el llavero digital",
    description: "Respuestas rápidas sobre móviles compatibles, código QR, destinos, precios y plazos.",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "¿Funciona en iPhone y en Android?",
            a: "Sí, sin app. En los iPhone XS y posteriores basta con acercar la parte superior del móvil. La mayoría de los Android lo leen siempre que la lectura por proximidad esté activada en los ajustes de conexión.",
          },
          {
            q: "¿Tiene código QR?",
            a: "No, funciona solo con un toque. Los móviles muy antiguos o sin lectura por proximidad no pueden abrirlo. Si necesita un código QR, la Tarjeta de visita digital y las placas tienen uno.",
          },
          {
            q: "¿Qué abre?",
            a: "Un destino por llavero, elegido al hacer el pedido: una conversación de WhatsApp con su negocio, su Instagram o su web.",
          },
          {
            q: "¿Cuánto cuesta?",
            a: "5 € + IVA por llavero. En packs, 10 por 45 € y 25 por 100 €, + IVA. Son precios orientativos, que se confirman en la demostración.",
          },
          {
            q: "¿Cuánto tarda?",
            a: "Pocos días laborables. Le indicamos el plazo exacto en la demostración.",
          },
          {
            q: "¿Qué diferencia hay con la Tarjeta de visita digital?",
            a: "La tarjeta abre una página de contacto completa y tiene código QR. El llavero es más pequeño y más sencillo: abre directamente un único destino.",
          },
        ],
      },
    ],
  },
};
