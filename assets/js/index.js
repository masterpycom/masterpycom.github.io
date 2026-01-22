document.addEventListener('DOMContentLoaded', function () {
    // Elementos del DOM
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabIndicator = document.querySelector('.tab-indicator');

    // Función para cambiar de pestaña con animaciones
    function cambiarPestana(pestanaId) {
        // 1. Remover clase active de todos los botones y contenidos
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // 2. Encontrar el botón activo y su posición
        const btnActivo = document.querySelector(`.tab-btn[data-tab="${pestanaId}"]`);
        const contenidoActivo = document.getElementById(pestanaId);

        // 3. Agregar clase active al botón y contenido seleccionados
        btnActivo.classList.add('active');
        contenidoActivo.classList.add('active');

        // 4. Calcular posición y tamaño del indicador
        const btnRect = btnActivo.getBoundingClientRect();
        const navRect = document.querySelector('.tabs-nav').getBoundingClientRect();

        // Posición relativa al contenedor de pestañas
        const leftPosition = btnRect.left - navRect.left;
        const width = btnRect.width;

        // 5. Animar el indicador
        tabIndicator.style.left = `${leftPosition}px`;
        tabIndicator.style.width = `${width}px`;

        // 6. Efecto de brillo en el botón
        btnActivo.classList.add('glow');
        setTimeout(() => {
            btnActivo.classList.remove('glow');
        }, 1000);
    }

    // Agregar eventos a los botones de pestaña
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const pestanaId = this.getAttribute('data-tab');
            cambiarPestana(pestanaId);

            // Efecto de click
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });

    // Agregar eventos a los botones de acción
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            // Efecto de onda
            const x = e.clientX - this.getBoundingClientRect().left;
            const y = e.clientY - this.getBoundingClientRect().top;

            const onda = document.createElement('span');
            onda.style.position = 'absolute';
            onda.style.left = `${x}px`;
            onda.style.top = `${y}px`;
            onda.style.width = '0';
            onda.style.height = '0';
            onda.style.borderRadius = '50%';
            onda.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            onda.style.transform = 'translate(-50%, -50%)';
            onda.style.animation = 'ondaAnim 0.6s linear';

            this.appendChild(onda);

            setTimeout(() => {
                onda.remove();
            }, 600);

            // Mostrar mensaje según el botón
            const texto = this.textContent.trim();
            // alert(`Acción: ${texto}\nEsta función está en desarrollo.`); // Eliminado alert para experiencia más fluida
        });
    });

    // Inicializar con la primera pestaña
    cambiarPestana('matematicas');

    // Animación para el contador
    function animarContador(elemento, valorFinal, duracion = 2000) {
        let valorInicial = 0;
        const incremento = valorFinal / (duracion / 16); // 60fps
        const contador = setInterval(() => {
            valorInicial += incremento;
            if (valorInicial >= valorFinal) {
                elemento.textContent = valorFinal;
                clearInterval(contador);
            } else {
                elemento.textContent = Math.floor(valorInicial);
            }
        }, 16);
    }

    // Aplicar animación a los contadores
    document.querySelectorAll('.counter').forEach(contador => {
        const valor = parseInt(contador.textContent);
        contador.textContent = '0';
        setTimeout(() => {
            animarContador(contador, valor);
        }, 500);
    });

    // Agregar estilo para la animación de onda
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ondaAnim {
            0% {
                width: 0;
                height: 0;
                opacity: 1;
            }
            100% {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// FUNCIÓN VERIFICAR OPTIMIZADA - REDIRECT DIRECTO
function verificar() {
    var hashCorrecto = "d1e83202cdd8b113816079d520b1e897";
    var intento = document.getElementById("pass").value;
    var intentoEncriptado = CryptoJS.MD5(intento).toString();

    if (intentoEncriptado === hashCorrecto) {
        // Animación de éxito antes de redirigir
        const inputPass = document.getElementById("pass");
        const button = inputPass.nextElementSibling;

        // Cambiar el botón a verde de éxito
        button.innerHTML = '<i class="fas fa-check"></i> Acceso concedido...';
        button.classList.remove('btn-rojo');
        button.classList.add('btn-verde');
        button.style.cursor = 'default';

        // Efecto visual
        inputPass.style.borderColor = '#00ff88';
        inputPass.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.5)';

        // Redirigir después de 1 segundo para mostrar la animación
        setTimeout(() => {
            window.location.href = "pdf.html";
        }, 1000);

    } else {
        // Animación de error
        const input = document.getElementById('pass');

        // Efecto shake
        input.style.animation = 'shake 0.5s';
        input.style.borderColor = '#ff416c';
        input.style.boxShadow = '0 0 15px rgba(255, 65, 108, 0.5)';

        // Guardar placeholder original
        const placeholderOriginal = input.placeholder;
        input.value = '';
        input.placeholder = '✗ Clave incorrecta';

        // Restaurar después de 1.5 segundos
        setTimeout(() => {
            input.style.animation = '';
            input.style.borderColor = '';
            input.style.boxShadow = '';
            input.placeholder = placeholderOriginal;
        }, 1500);
    }
}

// Agregar animación shake de forma dinámica si no está en CSS
if (!document.getElementById('shake-anim-style')) {
    const animacionesCSS = document.createElement('style');
    animacionesCSS.id = 'shake-anim-style';
    animacionesCSS.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(animacionesCSS);
}
