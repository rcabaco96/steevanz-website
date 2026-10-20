import type { DocPageContent, DocPageId } from "../types";

export const es: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Primeros pasos con la tarjeta de visita digital",
    description:
      "Qué es la tarjeta de visita digital, qué incluye, cuánto cuesta y cómo quien la recibe guarda su contacto con un toque del móvil.",
    blocks: [
      {
        type: "p",
        text: "La tarjeta de visita digital es una tarjeta de PVC, del tamaño de una tarjeta de crédito, con su nombre, cargo, datos de contacto y el logotipo de su empresa. Con un toque del móvil en la tarjeta, o leyendo el código QR impreso en ella, la persona abre su página de contacto digital y guarda su contacto.",
      },
      {
        type: "p",
        text: "Es un servicio hecho por nosotros: diseñamos la tarjeta, creamos la página y la mantenemos actualizada. Funciona en iPhone y Android y nadie necesita instalar una app.",
      },
      { type: "h2", id: "que-incluye", text: "Qué incluye" },
      {
        type: "table",
        head: ["Elemento", "Detalle"],
        rows: [
          ["Tarjeta de PVC", "Tamaño de tarjeta de crédito (85,6 × 54 mm), impresa por las dos caras con la calidad Steevanz"],
          ["Personalización", "Su nombre, cargo, datos de contacto y el logotipo de la empresa, incluidos en el precio"],
          ["Página de contacto digital", "Rápida, pensada para el móvil, con el botón «Guardar contacto»"],
          ["Toque o QR", "Se abre con un toque del móvil o con el código QR impreso en la tarjeta, en iPhone y Android, sin app"],
          ["Cambios incluidos", "Si sus datos cambian, actualizamos la página sin coste adicional y la tarjeta sigue funcionando"],
        ],
      },
      { type: "h2", id: "precios", text: "Precios" },
      {
        type: "table",
        head: ["Cantidad", "Precio por tarjeta", "Total"],
        rows: [
          ["1 tarjeta", "10 €", "10 €"],
          ["Desde 10", "9 €", "90 € (10)"],
          ["Desde 25", "8 €", "200 € (25)"],
          ["Desde 50", "7 €", "350 € (50)"],
        ],
      },
      {
        type: "p",
        text: "En un pack puede combinar tarjetas de varias personas de la misma empresa, cada una con su propia página. Precios + IVA, orientativos y confirmados después de la demostración.",
      },
      { type: "h2", id: "como-funciona", text: "Cómo funciona para quien toca" },
      {
        type: "ol",
        items: [
          "Usted muestra la tarjeta y la persona acerca el móvil (o lee el código QR con la cámara).",
          "Se abre su página de contacto, con su foto, nombre, cargo y empresa.",
          "Con el botón «Guardar contacto», sus datos pasan a los contactos de su móvil, sin escribir nada a mano.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Vea un ejemplo",
        text: "La página de contacto del fundador de Steevanz: www.steevanz.com/c/rogerio-cabaco",
      },
      { type: "h2", id: "proximos-pasos", text: "Próximos pasos" },
      {
        type: "ul",
        items: [
          "[Instalación](/es/docs/digital-business-card/setup): qué datos enviarnos y cómo aprueba la tarjeta.",
          "[Configuración](/es/docs/digital-business-card/configuration): qué muestra la página, el botón «Guardar contacto» y cómo pedir cambios.",
          "[Uso](/es/docs/digital-business-card/usage): cómo presentar la tarjeta en reuniones, ferias y en el mostrador.",
        ],
      },
    ],
  },
  setup: {
    title: "Instalación de la tarjeta de visita digital",
    description: "Los datos que necesitamos para la tarjeta y la página, cómo aprueba el diseño y cómo recibe las tarjetas probadas.",
    blocks: [
      { type: "h2", id: "enviar-datos", text: "1. Envíenos sus datos" },
      {
        type: "p",
        text: "Puede enviarlos por WhatsApp o por email, como le resulte más cómodo. Si las tarjetas son para varias personas de la empresa, envíe los datos de cada una.",
      },
      {
        type: "table",
        head: ["Dato", "Para qué sirve"],
        rows: [
          ["Nombre", "Cómo quiere que aparezca en la tarjeta y en la página"],
          ["Cargo", "Aparece debajo del nombre"],
          ["Teléfono", "Para los botones «Llamar» y «WhatsApp»"],
          ["Email", "Para el botón «Email»"],
          ["Sitio web", "Para el botón «Sitio web»"],
          ["Redes sociales", "Instagram, LinkedIn u otras que quiera mostrar"],
          ["Dirección (opcional)", "Se muestra con un enlace al mapa, si la quiere en la página"],
          ["Foto", "Aparece en la página y en el contacto guardado"],
          ["Logotipo de la empresa", "Va en la cara delantera de la tarjeta"],
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "En un pack puede combinar tarjetas de varias personas de la misma empresa. Cada una tiene su propia página.",
      },
      { type: "h2", id: "aprobar", text: "2. Apruebe la tarjeta y la página" },
      {
        type: "p",
        text: "Diseñamos la tarjeta: en la cara delantera, el logotipo; en el reverso, el nombre, los datos de contacto, el código QR y el pequeño símbolo de toque. También creamos su página de contacto. Antes de imprimir, le enviamos la prueba de la tarjeta y el enlace de la página. Solo imprimimos después de su aprobación.",
      },
      { type: "h2", id: "recibir", text: "3. Reciba las tarjetas" },
      {
        type: "p",
        text: "Las tarjetas se prueban en iPhone y Android antes de la entrega y llegan en pocos días laborables. Le indicamos el plazo exacto en la demostración.",
      },
    ],
  },
  configuration: {
    title: "Configuración de la tarjeta de visita digital",
    description: "Qué muestra la página de contacto, qué incluye el contacto guardado, el idioma de la página y cómo pedir cambios.",
    blocks: [
      { type: "h2", id: "pagina", text: "Qué muestra la página de contacto" },
      {
        type: "ol",
        items: [
          "Su foto, nombre, cargo y empresa.",
          "El botón «Guardar contacto».",
          "Los botones «Llamar», «WhatsApp», «Email» y «Sitio web».",
          "Sus redes sociales, como Instagram o LinkedIn.",
          "Su dirección, con enlace al mapa, si la quiere mostrar.",
        ],
      },
      {
        type: "p",
        text: "La página es rápida, está pensada para el móvil y no aparece en Google: solo se abre desde la tarjeta o su enlace.",
      },
      { type: "h2", id: "guardar-contacto", text: "El botón «Guardar contacto»" },
      {
        type: "p",
        text: "Descarga un archivo de contacto que el móvil añade a los contactos. El contacto guardado incluye:",
      },
      {
        type: "ul",
        items: ["Nombre", "Teléfono", "Email", "Sitio web", "Empresa y cargo", "Foto"],
      },
      { type: "h2", id: "idioma", text: "Idioma de la página" },
      {
        type: "p",
        text: "La página está en su idioma: portugués, inglés, español, francés, alemán o italiano. Díganos cuál prefiere cuando nos envíe sus datos.",
      },
      { type: "h2", id: "cambios", text: "Pedir cambios" },
      {
        type: "p",
        text: "No necesita editar la página: nosotros la configuramos y la actualizamos. Si cambia de número, de cargo o de email, envíenos el cambio por WhatsApp o por email. Está incluido, sin coste adicional: actualizamos la página y la tarjeta sigue funcionando, la misma tarjeta, nada que reimprimir.",
      },
    ],
  },
  usage: {
    title: "Uso de la tarjeta de visita digital",
    description: "Cómo presentar la tarjeta para que guarden su contacto, y buenas prácticas en reuniones, ferias y en el mostrador.",
    blocks: [
      { type: "h2", id: "presentar", text: "Cómo presentar la tarjeta" },
      {
        type: "ol",
        items: [
          "Muestre la tarjeta a la persona, sujetándola usted.",
          "En un iPhone, acerca la parte superior del móvil a la tarjeta. En Android, basta con tener activada la lectura por contacto.",
          "Si el móvil no reacciona, apunta la cámara al código QR impreso en la tarjeta.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Basta con decir: «Acerque el móvil y guarde mi contacto.» La persona se queda con sus datos correctos, sin escribir nada.",
      },
      { type: "h2", id: "reuniones", text: "En reuniones" },
      {
        type: "p",
        text: "Al final de la reunión, muestre la tarjeta y pida que guarden su contacto en ese momento. Se quedan con su nombre, teléfono, email y foto, sin errores al escribir. La tarjeta vuelve a su cartera.",
      },
      { type: "h2", id: "ferias", text: "En ferias y eventos" },
      {
        type: "p",
        text: "Las tarjetas de papel se acaban en el peor momento. Con la tarjeta de visita digital, cada visitante guarda su contacto desde la misma tarjeta. Si lo desea, puede seguir entregando tarjetas.",
      },
      { type: "h2", id: "mostrador", text: "En el mostrador" },
      {
        type: "p",
        text: "En la tienda, el restaurante o la inmobiliaria, tenga la tarjeta a mano e invite al cliente a guardar su contacto antes de irse. Cuando le necesite, le encontrará enseguida en sus contactos.",
      },
    ],
  },
  troubleshooting: {
    title: "Resolución de problemas de la tarjeta de visita digital",
    description: "Qué hacer cuando un móvil no reacciona al toque, cuando el contacto se guarda sin foto o cuando la tarjeta se estropea.",
    blocks: [
      { type: "h2", id: "toque-no-reacciona", text: "El móvil no reacciona al toque" },
      {
        type: "ul",
        items: [
          "En los iPhone XS y posteriores, basta con acercar la parte superior del móvil a la tarjeta, sin app.",
          "En la mayoría de los Android, la lectura por contacto (un toque) tiene que estar activada en los ajustes de conexiones.",
          "En los demás móviles, use el código QR impreso en la tarjeta: basta con apuntar la cámara.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "El código QR abre exactamente la misma página que el toque.",
      },
      { type: "h2", id: "sin-foto", text: "El contacto se guardó sin foto" },
      {
        type: "p",
        text: "En algunos móviles, la foto puede no quedarse en el contacto guardado. Los demás datos se guardan igualmente y la foto sigue visible en su página.",
      },
      { type: "h2", id: "datos-desactualizados", text: "Los datos están desactualizados" },
      {
        type: "p",
        text: "Envíenos el cambio por WhatsApp o por email. Actualizamos la página sin coste adicional y la tarjeta sigue funcionando, sin reimprimir nada.",
      },
      { type: "h2", id: "tarjeta-danada", text: "La tarjeta se ha estropeado o perdido" },
      {
        type: "p",
        text: "Pídanos una tarjeta nueva. Queda vinculada a la misma página, así que sus datos y su enlace siguen igual.",
      },
    ],
  },
  faq: {
    title: "Preguntas frecuentes sobre la tarjeta de visita digital",
    description: "Respuestas rápidas sobre iPhone y Android, cambios, el logotipo, packs para equipos, Google y plazos.",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "¿Funciona en iPhone y Android?",
            a: "Sí, sin app. En los iPhone XS y posteriores basta con acercar la parte superior del móvil. En la mayoría de los Android, la lectura por contacto tiene que estar activada. Para los demás, está el código QR impreso en la tarjeta.",
          },
          {
            q: "¿Puedo cambiar mis datos más adelante?",
            a: "Sí, y está incluido, sin coste adicional. Envíenos el cambio por WhatsApp o por email y actualizamos la página. La tarjeta sigue funcionando: la misma tarjeta, nada que reimprimir.",
          },
          {
            q: "¿Puedo editar la página yo mismo?",
            a: "Hoy no. Nosotros configuramos y actualizamos la página, así que basta con pedírnoslo.",
          },
          {
            q: "¿El logotipo de la empresa tiene coste adicional?",
            a: "No. La personalización con su nombre, cargo, datos de contacto y el logotipo de la empresa está incluida en el precio.",
          },
          {
            q: "En un pack, ¿las tarjetas pueden ser para personas distintas?",
            a: "Sí. En un pack puede combinar tarjetas de varias personas de la misma empresa, cada una con su propia página.",
          },
          {
            q: "¿Mi página aparece en Google?",
            a: "No. La página no está indexada por Google: solo se abre desde la tarjeta o su enlace.",
          },
          {
            q: "¿Puedo seguir entregando tarjetas?",
            a: "Puede, si lo desea. Pero una sola tarjeta puede servirle durante años, porque no hay que reimprimir cuando cambia un número o un cargo.",
          },
          {
            q: "¿Cuánto se tarda en recibir las tarjetas?",
            a: "Pocos días laborables después de aprobar el diseño y la página. Le indicamos el plazo exacto en la demostración.",
          },
        ],
      },
    ],
  },
};
