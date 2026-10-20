import type { DocPageContent, DocPageId } from "../types";

export const es: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Primeros pasos con el menú digital",
    description:
      "Cómo funciona el menú en vídeo de Steevanz: un vídeo por plato, con su precio, que se abre con un toque o con el código QR de la placa de la mesa, y pedidos en la mesa si los quiere.",
    blocks: [
      {
        type: "p",
        text: "El menú digital es la carta de su negocio en vídeo. Cada plato tiene su propio vídeo vertical, con nombre, precio y descripción, en una página propia de su negocio. Sus clientes lo abren con un toque o con el código QR de la placa redonda que hay en cada mesa, sin instalar nada.",
      },
      {
        type: "p",
        text: "Como todos los productos Steevanz, es un servicio gestionado: montamos el menú, alojamos los vídeos y grabamos y probamos las placas. Esta documentación le ayuda a preparar los vídeos y a sacar el máximo partido al menú.",
      },
      { type: "h2", id: "whats-included", text: "Qué incluye" },
      {
        type: "table",
        head: ["Elemento", "Detalle"],
        rows: [
          ["Menú en vídeo", "La página de su negocio con su logotipo, colecciones y un vídeo vertical por plato, con nombre, precio y descripción"],
          ["Pedidos en la mesa (opcional)", "La mesa pide desde el móvil y su equipo confirma el pedido leyendo un código QR"],
          ["Seis idiomas", "Portugués, inglés, español, francés, alemán e italiano: cada cliente elige el suyo con el botón de la bandera"],
          ["Placa redonda", "Adhesivo redondo de mesa o base redonda de mesa, una por mesa"],
          ["Código QR impreso", "Para los móviles que no leen con un toque o tienen esa opción desactivada"],
          ["Montaje y alojamiento", "Montamos el menú y alojamos el menú y los vídeos"],
          ["Guía de grabación", "Una guía para grabar los vídeos de los platos con el móvil"],
        ],
      },
      { type: "h2", id: "pricing", text: "Precios" },
      {
        type: "table",
        head: ["Cantidad", "Precio", "Por placa"],
        rows: [
          ["De 1 a 9 placas", "20 € cada una", "20 €"],
          ["10 placas o más", "15 € cada una (10 placas: 150 €)", "15 €"],
        ],
      },
      {
        type: "p",
        text: "El logotipo y los colores de su marca se pagan una vez por pedido (el diseño se hace una sola vez para todas las placas), no por placa. El montaje del menú y el alojamiento del menú y de los vídeos cuestan 30 € al mes + IVA.",
      },
      { type: "h2", id: "how-it-works", text: "Cómo funciona" },
      {
        type: "ol",
        items: [
          "El cliente se sienta y toca la placa con el móvil (o lee el código QR).",
          "El menú se abre con una animación de su logotipo, al principio de la página.",
          "Los platos se reproducen en una cuadrícula. Un toque los abre a pantalla completa, como en los Reels, y se desliza hacia arriba y hacia abajo para ver los demás.",
          "Con los pedidos en la mesa activados, el cliente toca «Añadir» en los platos y hace el pedido desde ahí mismo.",
        ],
      },
      { type: "h2", id: "next-steps", text: "Próximos pasos" },
      {
        type: "ul",
        items: [
          "[Instalación](/es/docs/digital-menu/setup): grabar los vídeos, enviarnos el menú y colocar las placas.",
          "[Configuración](/es/docs/digital-menu/configuration): cambiar platos y precios y activar los pedidos en la mesa.",
          "[Uso](/es/docs/digital-menu/usage): vídeos que funcionan y los pedidos en la mesa en el día a día.",
        ],
      },
    ],
  },
  setup: {
    title: "Instalación del menú digital",
    description: "Grabe los vídeos de sus platos, envíenos el menú y coloque las placas en las mesas.",
    blocks: [
      { type: "h2", id: "film-videos", text: "1. Grabar los vídeos" },
      {
        type: "p",
        text: "Cada plato tiene su propio vídeo. Grábelos con el móvil, en vertical: le damos una guía para grabar los vídeos.",
      },
      {
        type: "steps",
        items: [
          { title: "Un vídeo por plato", body: "En vertical, con el plato tal como llega a la mesa." },
          { title: "Sin texto encima", body: "No hace falta escribir el nombre ni el precio en el vídeo: el menú los muestra encima." },
          { title: "Corto", body: "Unos segundos bastan para mostrar el plato. Los vídeos cortos captan mejor la atención." },
        ],
      },
      { type: "h2", id: "send-menu", text: "2. Enviarnos el menú" },
      {
        type: "p",
        text: "Envíenos los vídeos y, de cada plato, el nombre, el precio y una descripción breve, ordenados en las colecciones que quiera (por ejemplo, Brunch y Bebidas). Envíenos también su logotipo. Montamos el menú y se lo enseñamos antes de ponerlo en las mesas.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Pedidos en la mesa",
        text: "Si quiere que las mesas pidan desde el móvil, díganos cuántas mesas tiene. Cada mesa recibe su propia placa, con su propio enlace y su propio código QR.",
      },
      { type: "h2", id: "place-plates", text: "3. Colocar las placas" },
      {
        type: "ul",
        items: [
          "Una placa por mesa, en un lugar visible y al alcance del móvil (en el centro de la mesa o junto al servilletero).",
          "Con los pedidos en la mesa, cada placa corresponde a una mesa: coloque cada una en su mesa.",
          "Limpie la superficie antes de pegar el adhesivo y presione durante unos segundos.",
          "Evite las superficies metálicas: el metal bloquea la señal de la placa. En ese caso, use la base redonda de mesa.",
        ],
      },
    ],
  },
  configuration: {
    title: "Configuración del menú digital",
    description: "Cambie platos, precios y colecciones, y active o desactive los pedidos en la mesa.",
    blocks: [
      { type: "h2", id: "dishes-prices", text: "Cambiar platos y precios" },
      {
        type: "p",
        text: "Steevanz gestiona el menú. Para cambiar un precio, añadir o quitar un plato, cambiar un vídeo o reorganizar las colecciones, envíenos un mensaje: actualizamos el menú y las placas siguen siendo las mismas.",
      },
      { type: "h2", id: "collections", text: "Colecciones" },
      {
        type: "p",
        text: "Los platos se agrupan en colecciones, por ejemplo Brunch y Bebidas. Todas están en la misma página, una sección detrás de otra, y el botón ☰ lleva al cliente directamente a cada una.",
      },
      { type: "h2", id: "languages", text: "Idiomas" },
      {
        type: "p",
        text: "El menú se puede leer en seis idiomas: portugués, inglés, español, francés, alemán e italiano. Se abre en el idioma del móvil del cliente (o en el que eligió la última vez), y el botón de la bandera, junto a ☰, cambia de idioma sin recargar la página, con los vídeos reproduciéndose. Los botones del menú y los pedidos en la mesa ya están traducidos; los nombres y las descripciones de los platos y los nombres de las secciones se traducen plato a plato, y lo que no tenga traducción aparece en portugués. Los precios aparecen en el formato de cada idioma.",
      },
      { type: "h2", id: "table-ordering", text: "Pedidos en la mesa" },
      {
        type: "p",
        text: "Los pedidos en la mesa se activan o desactivan menú por menú. Sin ellos, la placa abre el menú solo para consultarlo. Cada mesa tiene su propia placa, con su propio enlace y su propio código QR; si necesita más mesas, pídanoslas.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Si se cambia el código de una mesa, el enlace antiguo deja de funcionar y hay que sustituir la placa de esa mesa.",
      },
      { type: "h2", id: "customisation", text: "Personalización" },
      {
        type: "p",
        text: "El menú lleva su logotipo. Las placas pueden llevar su logotipo, los colores de su marca y un texto breve, por ejemplo «Toque para ver el menú». El diseño de las placas se hace una vez por pedido.",
      },
    ],
  },
  usage: {
    title: "Uso del menú digital",
    description: "Buenas prácticas para que el menú digital ayude a sus clientes a elegir, y los pedidos en la mesa en el día a día.",
    blocks: [
      { type: "h2", id: "videos-that-work", text: "Vídeos que funcionan" },
      {
        type: "ul",
        items: [
          "Muestre el plato tal como llega a la mesa, con buena luz.",
          "Grabe siempre en vertical: así es como el menú muestra los vídeos.",
          "Los vídeos cortos captan mejor la atención que los largos.",
          "Ponga primero los platos más pedidos o los que más quiera vender.",
        ],
      },
      { type: "h2", id: "ordering-day-to-day", text: "Los pedidos en la mesa en el día a día" },
      {
        type: "ol",
        items: [
          "Todos los móviles de la mesa ven el mismo pedido en tiempo real. Cada persona toca «Añadir» en los platos y puede añadir una nota, como «sin cebolla».",
          "Con «Hacer pedido», el móvil muestra un código QR y el número del pedido.",
          "Su personal lee el código QR con la cámara del móvil, sin app ni inicio de sesión, y ve la mesa, la hora, los platos con sus notas y el total. Esta página está siempre en portugués e indica el idioma en el que pidió el cliente.",
          "Toca «Confirmar pedido» y la mesa ve enseguida «Pedido confirmado ✓».",
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "Los números de pedido vuelven a empezar cada día.",
      },
      { type: "h2", id: "team", text: "Su equipo" },
      {
        type: "p",
        text: "Diga a sus clientes, cuando se sientan, que pueden ver los platos en el móvil. Una invitación del equipo aumenta mucho el número de toques.",
      },
      { type: "h2", id: "pair-with-reviews", text: "Combínelo con las reseñas de Google" },
      {
        type: "p",
        text: "En la misma mesa, la placa de reseñas de Google pide una valoración al final de la comida. El menú ayuda a elegir al principio; las reseñas ayudan a que nuevos clientes le encuentren.",
      },
    ],
  },
  troubleshooting: {
    title: "Solución de problemas del menú digital",
    description: "Qué hacer cuando una placa no abre el menú o un pedido no llega.",
    blocks: [
      {
        type: "table",
        head: ["Problema", "Qué hacer"],
        rows: [
          ["El móvil no reacciona al toque", "Compruebe que la lectura por contacto (un toque) está activada en los ajustes de conexiones (Android) y acerque la parte superior del móvil al centro de la placa. O lea el código QR."],
          ["La placa abre una página que no existe", "Puede que se haya cambiado el código de la mesa o que el menú esté desactivado. Contacte con nosotros."],
          ["Los vídeos tardan en empezar", "Compruebe la conexión a internet del móvil (wifi o datos móviles). Si pasa siempre, avísenos."],
          ["El personal no consigue leer el QR del pedido", "Pida al cliente que suba el brillo de la pantalla y acerque la cámara al código."],
          ["La placa no funciona sobre metal", "Cambie el adhesivo por la base redonda de mesa."],
          ["Los precios no están actualizados", "Envíenos los precios nuevos: actualizamos el menú y las placas siguen siendo las mismas."],
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "Si una placa se estropea, contacte con nosotros: la sustituimos.",
      },
    ],
  },
  faq: {
    title: "Preguntas frecuentes sobre el menú digital",
    description: "Respuestas rápidas sobre el menú en vídeo, los pedidos en la mesa y las placas.",
    blocks: [
      {
        type: "faq",
        items: [
          { q: "¿El cliente tiene que instalar alguna aplicación?", a: "No. El menú se abre en el navegador del móvil. Ni sus clientes ni su equipo necesitan una app." },
          { q: "¿Necesito Instagram o YouTube?", a: "No. El menú tiene su propia página en Steevanz y nosotros alojamos los vídeos." },
          { q: "¿Funciona en iPhone y en Android?", a: "Sí. Los iPhone recientes leen la placa sin activar nada; en Android, la opción de lectura por contacto (un toque) tiene que estar activada. Siempre queda el código QR impreso." },
          { q: "¿Sustituye a la carta en papel?", a: "La complementa. Ver los platos en vídeo ayuda a elegir, pero la carta en papel sigue siendo útil para quien la prefiere." },
          { q: "¿Cuánto cuesta?", a: "20 € por placa, o 15 € por placa a partir de 10 placas. El logotipo se paga una vez por pedido. El montaje y el alojamiento del menú cuestan 30 € al mes + IVA." },
          { q: "¿Quién graba los vídeos?", a: "Normalmente el propio negocio, con el móvil: le damos una guía para grabar los vídeos. Nosotros montamos el menú y alojamos los vídeos." },
          { q: "¿En qué idiomas está el menú?", a: "En seis: portugués, inglés, español, francés, alemán e italiano. El menú se abre en el idioma del móvil y el cliente lo cambia con el botón de la bandera. Lo que aún no tenga traducción aparece en portugués." },
          { q: "¿Los pedidos en la mesa son obligatorios?", a: "No. Se activan o desactivan menú por menú. Sin ellos, la placa abre el menú solo para consultarlo." },
          { q: "¿Puedo cambiar el menú más adelante?", a: "Sí, sin cambiar las placas. Envíenos los platos, los precios o los vídeos nuevos y actualizamos el menú." },
        ],
      },
    ],
  },
};
