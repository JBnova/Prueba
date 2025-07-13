let mySwiper;
const slideConfigs = {};

// --- FUNCIONES DE ACTUALIZACIÓN DE TEXTO (Adaptadas para Swiper) ---
function actualizarTextoEnSlideActivo(idBase, inputId, contadorId) {
    const inputElement = document.getElementById(inputId);
    const contadorElement = document.getElementById(contadorId);
    const valor = inputElement.value.trim();

    if (mySwiper && mySwiper.slides) {
        const currentSlideIndex = mySwiper.activeIndex;
        const activeSlideElement = mySwiper.slides[currentSlideIndex];
        const textoElement = activeSlideElement.querySelector(`#${idBase}_slide${currentSlideIndex}`);

        if (textoElement) {
            textoElement.textContent = valor || (idBase === "nombreUno" ? "NOMBRE" : "TEXTO"); // Default según el ID
            // Guardar el estado en slideConfigs
            if (!slideConfigs[currentSlideIndex]) {
                slideConfigs[currentSlideIndex] = { nombreUno: {}, nombreDos: {} };
            }
            if (idBase === "nombreUno") {
                slideConfigs[currentSlideIndex].nombreUno.texto = valor;
            } else {
                slideConfigs[currentSlideIndex].nombreDos.texto = valor;
            }
        }
    }
    if (contadorElement) {
        contadorElement.textContent = `${valor.length} /25`;
    }
}

function actualizarNombreUno() {
    actualizarTextoEnSlideActivo("nombreUno", "inputNombreUno", "contadorLetrasUno");
}

function actualizarNombreDos() {
    actualizarTextoEnSlideActivo("nombreDos", "inputNombreDos", "contadorLetrasDos");
}

function cambiarFuente(idBase, fuente) {
    if (mySwiper && mySwiper.slides) {
        const currentSlideIndex = mySwiper.activeIndex;
        const activeSlideElement = mySwiper.slides[currentSlideIndex];
        const textoElement = activeSlideElement.querySelector(`#${idBase}_slide${currentSlideIndex}`);

        if (textoElement) {
            textoElement.style.fontFamily = fuente;
            // Guardar el estado
            if (!slideConfigs[currentSlideIndex]) {
                slideConfigs[currentSlideIndex] = { nombreUno: {}, nombreDos: {} };
            }
            if (idBase === "nombreUno") {
                slideConfigs[currentSlideIndex].nombreUno.font = fuente;
            } else {
                slideConfigs[currentSlideIndex].nombreDos.font = fuente;
            }
        }
    }
}

function cambiarTamano(idBase, tamano) {
    if (mySwiper && mySwiper.slides) {
        const currentSlideIndex = mySwiper.activeIndex;
        const activeSlideElement = mySwiper.slides[currentSlideIndex];
        const textoElement = activeSlideElement.querySelector(`#${idBase}_slide${currentSlideIndex}`);

        if (textoElement) {
            textoElement.style.fontSize = `${tamano}px`;
            // Guardar el estado
            if (!slideConfigs[currentSlideIndex]) {
                slideConfigs[currentSlideIndex] = { nombreUno: {}, nombreDos: {} };
            }
            if (idBase === "nombreUno") {
                slideConfigs[currentSlideIndex].nombreUno.size = tamano;
            } else {
                slideConfigs[currentSlideIndex].nombreDos.size = tamano;
            }
        }
    }
}

// --- FUNCIONES DE ARRASTRE (con el nuevo enfoque de guardar posición) ---

// Función para centrar el texto dentro de su zona arrastrable
function centrarTextoEnZona(id) {
    const texto = document.getElementById(id);
    const zona = texto.parentElement;

    if (!texto || !zona) return;

    const textoRect = texto.getBoundingClientRect();
    const zonaRect = zona.getBoundingClientRect();

    const textoWidth = textoRect.width;
    const textoHeight = textoRect.height;
    const zonaWidth = zonaRect.width;
    const zonaHeight = zonaRect.height;

    const x = (zonaWidth - textoWidth) / 2;
    const y = (zonaHeight - textoHeight) / 2;

    texto.style.left = `${x}px`;
    texto.style.top = `${y}px`;

    // GUARDAR POSICIÓN INICIAL CENTRADA
    if (mySwiper && mySwiper.slides) {
        const currentSlideIndex = mySwiper.activeIndex;
        if (!slideConfigs[currentSlideIndex]) {
            slideConfigs[currentSlideIndex] = { nombreUno: {}, nombreDos: {} };
        }
        if (id.startsWith("nombreUno")) {
            slideConfigs[currentSlideIndex].nombreUno.left = x;
            slideConfigs[currentSlideIndex].nombreUno.top = y;
        } else if (id.startsWith("nombreDos")) {
            slideConfigs[currentSlideIndex].nombreDos.left = x;
            slideConfigs[currentSlideIndex].nombreDos.top = y;
        }
    }
}


function hacerDraggable(id) {
    const el = document.getElementById(id);
    const zona = el.parentElement;

    if (!el || !zona) return;

    let isDragging = false;
    let initialMouseX;
    let initialMouseY;
    let initialElX;
    let initialElY;

    el.style.cursor = 'grab';

    // Limpiar listeners existentes para evitar duplicados si se llama varias veces
    // Esto es crucial para un entorno como Swiper donde los elementos pueden reaparecer
    const clone = el.cloneNode(true);
    el.parentNode.replaceChild(clone, el); // Reemplaza el elemento por un clon para limpiar listeners
    const elClean = document.getElementById(id); // Obtiene el elemento limpio (el clon)

    elClean.addEventListener("mousedown", (e) => {
        isDragging = true;
        initialMouseX = e.clientX;
        initialMouseY = e.clientY;
        initialElX = parseFloat(elClean.style.left) || 0;
        initialElY = parseFloat(elClean.style.top) || 0;

        elClean.style.cursor = 'grabbing';
        e.preventDefault();
        e.stopPropagation(); // Evita que el clic en el texto active el arrastre del Swiper
    });

    // Eventos globales del documento para arrastre suave
    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        if (!elClean.isConnected) { // Verifica si el elemento sigue en el DOM
            isDragging = false;
            return;
        }

        const zonaRect = zona.getBoundingClientRect();
        let newX = initialElX + (e.clientX - initialMouseX);
        let newY = initialElY + (e.clientY - initialMouseY);

        const elRect = elClean.getBoundingClientRect();
        const maxX = zona.clientWidth - elRect.width;
        const maxY = zona.clientHeight - elRect.height;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        elClean.style.left = `${newX}px`;
        elClean.style.top = `${newY}px`;

        // GUARDAR POSICIÓN AL ARRASTRAR
        if (mySwiper && mySwiper.slides) {
            const currentSlideIndex = mySwiper.activeIndex;
            if (!slideConfigs[currentSlideIndex]) {
                slideConfigs[currentSlideIndex] = { nombreUno: {}, nombreDos: {} };
            }
            if (id.startsWith("nombreUno")) {
                slideConfigs[currentSlideIndex].nombreUno.left = newX;
                slideConfigs[currentSlideIndex].nombreUno.top = newY;
            } else if (id.startsWith("nombreDos")) {
                slideConfigs[currentSlideIndex].nombreDos.left = newX;
                slideConfigs[currentSlideIndex].nombreDos.top = newY;
            }
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        if (elClean.isConnected) {
            elClean.style.cursor = 'grab';
        }
    });

    // Soporte Táctil
    elClean.addEventListener('touchstart', (e) => {
        isDragging = true;
        initialMouseX = e.touches[0].clientX;
        initialMouseY = e.touches[0].clientY;
        initialElX = parseFloat(elClean.style.left) || 0;
        initialElY = parseFloat(elClean.style.top) || 0;
        elClean.style.cursor = 'grabbing';
        e.preventDefault();
        e.stopPropagation(); // Evita que el toque en el texto active el arrastre del Swiper
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        if (!elClean.isConnected) {
            isDragging = false;
            return;
        }

        const zonaRect = zona.getBoundingClientRect();
        let newX = initialElX + (e.touches[0].clientX - initialMouseX);
        let newY = initialElY + (e.touches[0].clientY - initialMouseY);

        const elRect = elClean.getBoundingClientRect();
        const maxX = zona.clientWidth - elRect.width;
        const maxY = zona.clientHeight - elRect.height;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        elClean.style.left = `${newX}px`;
        elClean.style.top = `${newY}px`;

        // GUARDAR POSICIÓN AL ARRASTRAR (TÁCTIL)
        if (mySwiper && mySwiper.slides) {
            const currentSlideIndex = mySwiper.activeIndex;
            if (!slideConfigs[currentSlideIndex]) {
                slideConfigs[currentSlideIndex] = { nombreUno: {}, nombreDos: {} };
            }
            if (id.startsWith("nombreUno")) {
                slideConfigs[currentSlideIndex].nombreUno.left = newX;
                slideConfigs[currentSlideIndex].nombreUno.top = newY;
            } else if (id.startsWith("nombreDos")) {
                slideConfigs[currentSlideIndex].nombreDos.left = newX;
                slideConfigs[currentSlideIndex].nombreDos.top = newY;
            }
        }
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
        if (elClean.isConnected) {
            elClean.style.cursor = 'grab';
        }
    });
}

// --- FUNCIÓN PARA CARGAR LA CONFIGURACIÓN DEL SLIDE ---
function cargarConfiguracionSlide(slideIndex) {
    const config = slideConfigs[slideIndex];
    if (config) {
        // Cargar NombreUno
        const nombreUnoEl = document.getElementById(`nombreUno_slide${slideIndex}`);
        const inputNombreUnoEl = document.getElementById("inputNombreUno");
        const selectFuenteUnoEl = document.getElementById("selectFuenteUno");
        const inputTamanoUnoEl = document.getElementById("inputTamanoUno");

        if (nombreUnoEl && inputNombreUnoEl && selectFuenteUnoEl && inputTamanoUnoEl) {
            inputNombreUnoEl.value = config.nombreUno.texto || "NOMBRE";
            nombreUnoEl.textContent = config.nombreUno.texto || "NOMBRE";
            
            nombreUnoEl.style.fontFamily = config.nombreUno.font || "Arial";
            selectFuenteUnoEl.value = config.nombreUno.font || "Arial";

            nombreUnoEl.style.fontSize = `${config.nombreUno.size || 25}px`;
            inputTamanoUnoEl.value = config.nombreUno.size || 25;

            // Cargar posición
            if (typeof config.nombreUno.left === 'number' && typeof config.nombreUno.top === 'number') {
                nombreUnoEl.style.left = `${config.nombreUno.left}px`;
                nombreUnoEl.style.top = `${config.nombreUno.top}px`;
            } else {
                centrarTextoEnZona(`nombreUno_slide${slideIndex}`); // Si no hay posición guardada, centrar
            }
        }

        // Cargar NombreDos
        const nombreDosEl = document.getElementById(`nombreDos_slide${slideIndex}`);
        const inputNombreDosEl = document.getElementById("inputNombreDos");
        const selectFuenteDosEl = document.getElementById("selectFuenteDos");
        const inputTamanoDosEl = document.getElementById("inputTamanoDos");

        if (nombreDosEl && inputNombreDosEl && selectFuenteDosEl && inputTamanoDosEl) {
            inputNombreDosEl.value = config.nombreDos.texto || "TEXTO";
            nombreDosEl.textContent = config.nombreDos.texto || "TEXTO";

            nombreDosEl.style.fontFamily = config.nombreDos.font || "Arial";
            selectFuenteDosEl.value = config.nombreDos.font || "Arial";

            nombreDosEl.style.fontSize = `${config.nombreDos.size || 25}px`;
            inputTamanoDosEl.value = config.nombreDos.size || 25;

            // Cargar posición
            if (typeof config.nombreDos.left === 'number' && typeof config.nombreDos.top === 'number') {
                nombreDosEl.style.left = `${config.nombreDos.left}px`;
                nombreDosEl.style.top = `${config.nombreDos.top}px`;
            } else {
                centrarTextoEnZona(`nombreDos_slide${slideIndex}`); // Si no hay posición guardada, centrar
            }
        }
    } else {
        // Si no hay configuración guardada para este slide, restaurar valores por defecto en inputs y centrar
        document.getElementById("inputNombreUno").value = "";
        document.getElementById("selectFuenteUno").value = "Arial";
        document.getElementById("inputTamanoUno").value = 25;

        document.getElementById("inputNombreDos").value = "";
        document.getElementById("selectFuenteDos").value = "Arial";
        document.getElementById("inputTamanoDos").value = 25;
        
        // Actualizar textos en pantalla y centrarlos
        actualizarNombreUno();
        actualizarNombreDos();
        centrarTextoEnZona(`nombreUno_slide${slideIndex}`);
        centrarTextoEnZona(`nombreDos_slide${slideIndex}`);
    }
    // Actualiza los contadores de letras después de cargar el texto
    document.getElementById("contadorLetrasUno").textContent = `${document.getElementById("inputNombreUno").value.length}/25`;
    document.getElementById("contadorLetrasDos").textContent = `${document.getElementById("inputNombreDos").value.length}/25`;
}

// --- FUNCIÓN DE INICIALIZACIÓN GENERAL ---
window.onload = () => {
    // Inicializar Swiper
    mySwiper = new Swiper('.swiper-container', {
      direction: 'horizontal',
      loop: true, // Para un carrusel infinito
      pagination: {
          el: '.swiper-pagination',
          clickable: true,
      },
      navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
      },
      scrollbar: {
          el: '.swiper-scrollbar',
           // <--- AÑADE ESTA LÍNEA
      },
      allowTouchMove: false,
        
        // Cuando el slide cambia (después de la transición)
        on: {
          init: function () {
              // Al inicio, carga la configuración del slide inicial
              const initialSlideIndex = this.realIndex !== undefined ? this.realIndex : this.activeIndex;
              cargarConfiguracionSlide(initialSlideIndex);

              // Inicializa dragables para los elementos del slide inicial
              const initialSlideElement = this.slides[this.activeIndex];
              if (initialSlideElement) {
                  const textsToDrag = initialSlideElement.querySelectorAll('.texto-manga, .texto-bolsillo');
                  textsToDrag.forEach(textEl => {
                      hacerDraggable(textEl.id);
                  });
              }
          },
          slideChangeTransitionEnd: function () {
              const currentSlideIndex = this.realIndex !== undefined ? this.realIndex : this.activeIndex;
              cargarConfiguracionSlide(currentSlideIndex);

              // Re-inicializa los dragables para los elementos del slide recién activo
              const activeSlideElement = this.slides[this.activeIndex];
              if (activeSlideElement) {
                  const textsToDrag = activeSlideElement.querySelectorAll('.texto-manga, .texto-bolsillo');
                  textsToDrag.forEach(textEl => {
                      hacerDraggable(textEl.id);
                  });
              }
              
              // Forzar una actualización de los inputs, ya que su estado pudo haber cambiado al cargar el slide
              document.getElementById("inputNombreUno").dispatchEvent(new Event('input'));
              document.getElementById("inputNombreDos").dispatchEvent(new Event('input'));
          },
          slideChange: function() {
              // ... (mantén lo que tengas aquí si es que lo tenías)
          }
      }
  });
};

// --- FUNCIÓN PARA WHATSAPP (Ligeramente modificada para el carrusel) ---
function enviarWhatsApp() {
    const inputUno = document.getElementById("inputNombreUno");
    const inputDos = document.getElementById("inputNombreDos");
    
    const nombreUnoTexto = inputUno.value.trim() || 'No especificado';
    const nombreDosTexto = inputDos.value.trim() || 'No especificado';

    let nombreCasaca = "Casaca Personalizada";
    if (mySwiper && mySwiper.slides) {
        const activeSlideElement = mySwiper.slides[mySwiper.activeIndex];
        const imgElement = activeSlideElement.querySelector('.imagen-polera');
        if (imgElement && imgElement.alt) {
            nombreCasaca = imgElement.alt;
        } else if (imgElement && imgElement.src) {
            // Si no hay alt, usa el nombre del archivo de imagen
            const pathParts = imgElement.src.split('/');
            nombreCasaca = pathParts[pathParts.length - 1];
        }
    }

    // Obtener las posiciones finales (si están guardadas)
    const currentSlideIndex = mySwiper.activeIndex;
    const config = slideConfigs[currentSlideIndex];
    let posUno = "";
    let posDos = "";

    if (config && config.nombreUno && typeof config.nombreUno.left === 'number') {
        posUno = ` (Pos: L${Math.round(config.nombreUno.left)} T${Math.round(config.nombreUno.top)})`;
    }
    if (config && config.nombreDos && typeof config.nombreDos.left === 'number') {
        posDos = ` (Pos: L${Math.round(config.nombreDos.left)} T${Math.round(config.nombreDos.top)})`;
    }

    const mensaje = `¡Hola! Me gustaría hacer un pedido:\n\n` +
                    `*Modelo de Casaca:* ${nombreCasaca}\n` +
                    `*Texto en Manga:* "${nombreUnoTexto}" ${posUno}\n` +
                    `*Fuente Manga:* ${document.getElementById("selectFuenteUno").value}\n` +
                    `*Tamaño Manga:* ${document.getElementById("inputTamanoUno").value}px\n\n` +
                    `*Texto en Bolsillo:* "${nombreDosTexto}" ${posDos}\n` +
                    `*Fuente Bolsillo:* ${document.getElementById("selectFuenteDos").value}\n` +
                    `*Tamaño Bolsillo:* ${document.getElementById("inputTamanoDos").value}px\n\n` +
                    `¡Gracias!`;
                    
    const numero = "51932015162"; // Reemplaza con tu número de WhatsApp
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
}
