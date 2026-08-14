"use client";

import { useSyncExternalStore } from "react";
import { useSiteping } from "@siteping/widget/react";
import { REVIEW_UI_COOKIE_NAME } from "@/lib/review-cookies";
import { SITEPING_PROJECT } from "@/lib/siteping-config";

// Widget de comentarios de revisión. Solo se monta para quien abrió un link
// `/review?token=…`; para el resto del mundo este componente no renderiza nada
// y el bundle de SitePing ni se descarga.

/**
 * El hook se llama incondicionalmente, como manda React, pero vive en un
 * componente que solo se monta cuando hay acceso. Meter el `if` dentro del
 * componente que llama a `useSiteping` sería una violación de las reglas de
 * hooks; separarlo en dos es la forma correcta de tener un hook condicional.
 */
function SitepingMount() {
  useSiteping({
    endpoint: "/api/siteping",
    projectName: SITEPING_PROJECT,
    // El widget se auto-oculta en producción y bajo 768px. Las dos cosas
    // sobran acá: el gate real es la cookie, no el entorno, y el equipo revisa
    // desde el móvil tanto como desde el escritorio. Sin `minViewportWidth: 0`
    // alguien abre el link en el teléfono, no ve nada y reporta que está roto.
    forceShow: true,
    minViewportWidth: 0,
    // Inglés en toda la UI, igual que el admin y que el propio sitio.
    locale: "en",
    enableScreenshot: true,
    // Next navega sin recargar; sin esto el widget se quedaría anclado a la
    // primera URL y los comentarios de la página siguiente no aparecerían.
    watchNavigation: true,
    scopeAnnotationsByUrl: true,
    // Viene desactivado por defecto, y sin él "Abrir en la página" —el botón
    // del inbox— lleva a la URL correcta pero el widget ignora el `?siteping=`
    // que trae, así que no enfoca nada. El nombre del parámetro es el mismo que
    // usa `SitepingInbox` por defecto; si se cambia acá, hay que cambiar
    // `deepLinkParam` allá.
    deepLink: true,
  });

  return null;
}

/**
 * La cookie es una fuente externa que React no controla, así que se lee con
 * `useSyncExternalStore` y no con `useEffect` + `setState`. Además de evitar el
 * render en cascada que provoca ese patrón, el tercer argumento
 * —el snapshot de servidor— resuelve la hidratación de forma explícita: el HTML
 * se genera siempre con `false` y React reconcilia en el cliente sin warning.
 *
 * `subscribe` es un noop porque `document.cookie` no emite eventos: la cookie
 * se pone en `/review`, que es una navegación completa, así que cuando el
 * componente monta el valor ya es definitivo.
 */
const subscribe = () => () => {};

const readCookie = () =>
  document.cookie.split("; ").some((entry) => entry === `${REVIEW_UI_COOKIE_NAME}=1`);

export default function ReviewWidget() {
  const enabled = useSyncExternalStore(subscribe, readCookie, () => false);

  return enabled ? <SitepingMount /> : null;
}
