document.addEventListener('DOMContentLoaded', function () {
    // Referencias al DOM
    const cartaContainer = document.getElementById('carta-container');
    const contenidoOriginal = document.getElementById('contenido-original');
    const pageTemplate = document.getElementById('page-template');

    // Controles
    const fontFamilySelect = document.getElementById('fontFamily');
    const fontSizeSelect = document.getElementById('fontSize');
    const themeColorSelect = document.getElementById('themeColor');
    const imageColorSelect = document.getElementById('imageColor');
    const lineHeightSelect = document.getElementById('lineHeight');
    const textAlignSelect = document.getElementById('textAlign');

    const updateBtn = document.getElementById('updateBtn');
    const printBtn = document.getElementById('printBtn');

    // Configuración de página A4 (en píxeles aproximados para pantalla)
    // 29.7cm * 37.795px/cm ~= 1122px. Usaremos un valor seguro para el corte.
    // Restando márgenes (0.8cm top + 0.8cm bottom = 1.6cm) y header/footer.
    // Header ~2cm, Footer ~1cm. Total ocupado ~4.6cm.
    // Espacio seguro ~25cm.
    const PAGE_HEIGHT_PX = 1122; // Altura total A4 a 96dpi
    // Margen de seguridad para el contenido (ajustar experimentalmente)
    const CONTENT_MAX_HEIGHT = 980;

    // Función principal: Generar Carta con Paginación Dinámica
    function generarCarta() {
        // 1. Preparar contenido: Aplanar estructura
        const todosLosElementos = [];

        // Extraer elementos, ya sea de .pagina-contenido o directos
        const paginasManuales = contenidoOriginal.querySelectorAll('.pagina-contenido');
        if (paginasManuales.length > 0) {
            paginasManuales.forEach(pagina => {
                Array.from(pagina.children).forEach(child => {
                    todosLosElementos.push(child.cloneNode(true));
                });
            });
        } else {
            Array.from(contenidoOriginal.children).forEach(child => {
                todosLosElementos.push(child.cloneNode(true));
            });
        }

        // 2. Limpiar contenedor
        cartaContainer.innerHTML = '';

        // 3. Crear primera página
        let paginaActual = crearNuevaPagina(1);
        let cuerpoActual = paginaActual.querySelector('.letter-body');
        let alturaActual = 0;
        let numeroPagina = 1;

        cartaContainer.appendChild(paginaActual);

        // 4. Distribuir elementos
        todosLosElementos.forEach(elemento => {
            // Añadir elemento temporalmente para medir
            cuerpoActual.appendChild(elemento);

            // Verificar altura
            // getBoundingClientRect es más preciso
            const rectPage = paginaActual.getBoundingClientRect();
            const rectFooter = paginaActual.querySelector('.page-footer').getBoundingClientRect();
            const rectElement = elemento.getBoundingClientRect();

            // Límite: El elemento no debe superponerse al footer con un margen de seguridad
            // Usamos un offset fijo desde el top de la página si es más estable
            const elementBottomRel = rectElement.bottom - rectPage.top;

            // Si el elemento sobrepasa el límite (ej. 26cm ~ 980px)
            if (elementBottomRel > CONTENT_MAX_HEIGHT) {
                // Mover a siguiente página
                cuerpoActual.removeChild(elemento);

                // Crear nueva página
                numeroPagina++;
                paginaActual = crearNuevaPagina(numeroPagina);
                cuerpoActual = paginaActual.querySelector('.letter-body');
                cartaContainer.appendChild(paginaActual);

                cuerpoActual.appendChild(elemento);
            }
        });

        aplicarEstilos();
        setTimeout(renderizarEcuaciones, 100);
    }

    function crearNuevaPagina(num) {
        const nuevaPagina = document.importNode(pageTemplate.content, true);
        const divPagina = nuevaPagina.querySelector('.carta-page');

        // Actualizar número de página
        divPagina.querySelector('.page-num').textContent = num;

        return divPagina; // Devolvemos el div, no el fragmento
    }

    // Renderizar ecuaciones LaTeX
    function renderizarEcuaciones() {
        if (window.renderMathInElement) {
            renderMathInElement(document.getElementById('carta-container'), {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true }
                ],
                throwOnError: false
            });
        }
    }

    // Aplicar estilos y configuraciones
    function aplicarEstilos() {
        const paginas = document.querySelectorAll('.carta-page');

        const color = themeColorSelect.value;
        const imgColor = imageColorSelect ? imageColorSelect.value : '#e6f3ff'; // Default si no existe
        const font = fontFamilySelect.value;
        const size = fontSizeSelect.value;
        const lineHeight = lineHeightSelect ? lineHeightSelect.value : '1.5';
        const align = textAlignSelect ? textAlignSelect.value : 'justify';

        paginas.forEach(pagina => {
            // Fuentes y Textos
            pagina.style.fontFamily = font;

            const letterBody = pagina.querySelector('.letter-body');
            if (letterBody) {
                letterBody.style.fontSize = size;
                letterBody.style.lineHeight = lineHeight;
                letterBody.style.textAlign = align;

                // Forzar estilos en hijos si es necesario
                const parrafos = letterBody.querySelectorAll('p, li, div, td');
                parrafos.forEach(p => {
                    p.style.textAlign = align;
                    p.style.lineHeight = lineHeight;
                });
            }

            // Colores
            const mainTitle = pagina.querySelector('.main-title');
            const pageHeader = pagina.querySelector('.page-header');

            if (mainTitle) mainTitle.style.background = `linear-gradient(120deg, ${color}, #26d0ce)`;
            if (mainTitle) mainTitle.style.webkitBackgroundClip = 'text';
            if (mainTitle) mainTitle.style.color = 'transparent'; // Mantener gradiente
            // O si el usuario quiere color plano:
            // if (mainTitle) mainTitle.style.color = color;

            if (pageHeader) pageHeader.style.borderBottomColor = color;

            // Imágenes (placeholders)
            const leftImg = pagina.querySelector('.header-left-img');
            const rightImg = pagina.querySelector('.header-right-img');
            if (leftImg) leftImg.style.backgroundColor = imgColor;
            if (rightImg) rightImg.style.backgroundColor = imgColor;

            // Elementos específicos
            const theorems = pagina.querySelectorAll('.theorem');
            theorems.forEach(th => th.style.borderLeftColor = color);

            const tables = pagina.querySelectorAll('th');
            tables.forEach(th => th.style.background = `linear-gradient(120deg, ${color}, #0072ff)`);
        });

        // Botones
        document.querySelectorAll('.controls button').forEach(btn => {
            btn.style.backgroundColor = color;
        });
    }

    // Listeners
    updateBtn.addEventListener('click', () => {
        generarCarta(); // Regenerar para recalcular paginación si cambia fuente/tamaño
    });
    printBtn.addEventListener('click', () => window.print());

    // Inicialización
    generarCarta();
});