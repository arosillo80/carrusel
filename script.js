fetch('comments.csv')
    .then(response => {
        if (!response.ok) {
            console.error('Error al cargar comments.csv:', response.statusText);
            return '';
        }
        return response.text();
    })
    .then(data => {
        if (!data) {
            console.error('No se recibieron datos del CSV');
            return;
        }
        Papa.parse(data, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                console.log('Filas procesadas:', results.data.length);
                const comments = results.data;
                const container = document.getElementById('comments-container');
                let slideCount = 0;
                comments.forEach(comment => {
                    // Generar slide si tiene al menos un nombre o puntuación
                    const hasData = comment['Nombre del cliente'] || comment['puntuación del comentario'];
                    if (hasData) {
                        console.log('Procesando comentario:', comment['Nombre del cliente'], comment['Título del comentario'], comment['Comentario positivo']);
                        const slide = document.createElement('div');
                        slide.className = 'swiper-slide'; // Asegurar que sea un slide de Swiper
                        const title = comment['Título del comentario'] || comment['Comentario positivo'] || 'Sin título';
                        const rating = parseInt(comment['puntuación del comentario']) || 0; // Fallback a 0
                        slide.innerHTML = `
                            <div class="title">${title}</div>
                            <div class="author">${comment['Nombre del cliente'] || 'Anónimo'}</div>
                            <div class="date">${comment['fecha del comentario'] || 'Sin fecha'}</div>
                            <div class="rating">${'★'.repeat(rating)}</div>
                        `;
                        container.appendChild(slide);
                        slideCount++;
                    } else {
                        console.log('Fila descartada por falta de datos:', comment);
                    }
                });
                // Duplicar slides si hay menos de 3
                if (slideCount < 3) {
                    for (let i = 0; i < 3 - slideCount; i++) {
                        const firstSlide = container.firstChild;
                        if (firstSlide) {
                            const duplicate = firstSlide.cloneNode(true);
                            container.appendChild(duplicate);
                            slideCount++;
                        }
                    }
                }
                console.log('Slides generados:', slideCount);
                if (slideCount > 0) {
                    new Swiper('.swiper-container', {
                        loop: true,
                        autoplay: {
                            delay: 3000,
                            disableOnInteraction: false,
                        },
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        },
                        pagination: {
                            el: '.swiper-pagination',
                            clickable: true,
                        },
                        slidesPerView: 1,
                        spaceBetween: 20,
                    });
                } else {
                    console.error('No se generaron slides');
                }
            },
            error: function(error) {
                console.error('Error al parsear el CSV:', error);
            }
        });
    })
    .catch(error => console.error('Error general:', error));
