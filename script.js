document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const cartaContainer = document.getElementById('carta-container');
    const contenidoOriginal = document.getElementById('contenido-original');
    const pageTemplate = document.getElementById('page-template');
    const fontFamilySelect = document.getElementById('fontFamily');
    const fontSizeSelect = document.getElementById('fontSize');
    const themeColorSelect = document.getElementById('themeColor');
    const imageColorSelect = document.getElementById('imageColor');
    const updateBtn = document.getElementById('updateBtn');
    const printBtn = document.getElementById('printBtn');
    
    // Generar carta automáticamente
    function generarCarta() {
        cartaContainer.innerHTML = '';
        
        // Obtener todas las páginas de contenido
        const paginasContenido = contenidoOriginal.querySelectorAll('.pagina-contenido');
        
        paginasContenido.forEach((pagina, index) => {
            const pageNum = pagina.getAttribute('data-page') || (index + 1);
            
            // Clonar la plantilla
            const nuevaPagina = document.importNode(pageTemplate.content, true);
            
            // Configurar número de página en el footer
            nuevaPagina.querySelector('.page-num').textContent = pageNum;
            
            // Insertar contenido
            const contenidoClonado = pagina.cloneNode(true);
            
            // Remover atributos que causan problemas
            contenidoClonado.removeAttribute('data-page');
            contenidoClonado.removeAttribute('class');
            
            // Insertar el contenido HTML directamente
            const letterBody = nuevaPagina.querySelector('.letter-body');
            if (letterBody) {
                letterBody.innerHTML = contenidoClonado.innerHTML;
            }
            
            // Agregar al contenedor
            cartaContainer.appendChild(nuevaPagina);
        });
        
        aplicarEstilos();
        // Intentar renderizar ecuaciones LaTeX
        setTimeout(renderizarEcuaciones, 100);
    }
    
    // Función para renderizar ecuaciones LaTeX
    function renderizarEcuaciones() {
        if (window.renderMathInElement) {
            renderMathInElement(document.getElementById('carta-container'), {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\]', display: true}
                ],
                throwOnError: false
            });
        }
    }
    
    // Aplicar estilos
    function aplicarEstilos() {
        const paginas = document.querySelectorAll('.carta-page');
        const color = themeColorSelect.value;
        const imgColor = imageColorSelect.value;
        
        paginas.forEach(pagina => {
            // Aplicar fuente a toda la página
            pagina.style.fontFamily = fontFamilySelect.value;
            
            // Aplicar tamaño de fuente al contenido principal
            const letterBody = pagina.querySelector('.letter-body');
            if (letterBody) {
                letterBody.style.fontSize = fontSizeSelect.value;
                
                // Aplicar también a elementos dentro del body
                const elementos = letterBody.querySelectorAll('*');
                elementos.forEach(elemento => {
                    elemento.style.fontSize = fontSizeSelect.value;
                });
            }
            
            // Aplicar color a los títulos y encabezados
            const mainTitle = pagina.querySelector('.main-title');
            const pageHeader = pagina.querySelector('.page-header');
            
            if (mainTitle) mainTitle.style.color = color;
            if (pageHeader) pageHeader.style.borderBottomColor = color;
            
            // Aplicar color a las imágenes
            const leftImg = pagina.querySelector('.header-left-img');
            const rightImg = pagina.querySelector('.header-right-img');
            
            if (leftImg) leftImg.style.backgroundColor = imgColor;
            if (rightImg) rightImg.style.backgroundColor = imgColor;
            
            // Aplicar color a teoremas y demostraciones
            const theorems = pagina.querySelectorAll('.theorem');
            theorems.forEach(theorem => {
                theorem.style.borderLeftColor = color;
                theorem.style.backgroundColor = lightenColor(color, 0.9);
            });
            
            const proofs = pagina.querySelectorAll('.proof');
            proofs.forEach(proof => {
                proof.style.borderLeftColor = darkenColor(color, 0.2);
                proof.style.backgroundColor = lightenColor(color, 0.95);
            });
            
            // Aplicar color a ecuaciones
            const equationContainers = pagina.querySelectorAll('.equation-container');
            equationContainers.forEach(container => {
                container.style.borderLeftColor = color;
            });
        });
        
        // Aplicar color a los botones del panel de control
        document.querySelectorAll('.controls button').forEach(btn => {
            btn.style.backgroundColor = color;
        });
    }
    
    // Funciones auxiliares para manipular colores
    function lightenColor(color, factor) {
        // Simplificación para colores hex
        if (color.startsWith('#')) {
            return color + '20'; // Agregar transparencia
        }
        return color;
    }
    
    function darkenColor(color, factor) {
        // Simplificación para colores hex
        if (color.startsWith('#') && color.length === 7) {
            const r = parseInt(color.substr(1, 2), 16);
            const g = parseInt(color.substr(3, 2), 16);
            const b = parseInt(color.substr(5, 2), 16);
            
            const newR = Math.max(0, Math.floor(r * (1 - factor))).toString(16).padStart(2, '0');
            const newG = Math.max(0, Math.floor(g * (1 - factor))).toString(16).padStart(2, '0');
            const newB = Math.max(0, Math.floor(b * (1 - factor))).toString(16).padStart(2, '0');
            
            return `#${newR}${newG}${newB}`;
        }
        return color;
    }
    
    // Hacer contenido editable
    function hacerContenidoEditable() {
        document.querySelectorAll('.pagina-contenido .paragraph').forEach(parrafo => {
            parrafo.contentEditable = true;
            parrafo.addEventListener('blur', function() {
                // Regenerar carta cuando se edita contenido
                generarCarta();
            });
        });
    }
    
    // Event Listeners
    updateBtn.addEventListener('click', function() {
        aplicarEstilos();
        renderizarEcuaciones();
    });
    
    printBtn.addEventListener('click', () => window.print());
    
    // Inicializar
    generarCarta();
    hacerContenidoEditable();
    
    // Aplicar color inicial
    const colorInicial = themeColorSelect.value;
    document.querySelectorAll('.controls button').forEach(btn => {
        btn.style.backgroundColor = colorInicial;
    });
});