fetch('comments.csv')
    .then(response => response.text())
    .then(data => {
        Papa.parse(data, {
            header: true,
            complete: function(results) {
                const comments = results.data;
                const container = document.getElementById('comments-container');
                comments.forEach(comment => {
                    // Mostrar slide si tiene al menos fecha, nombre y puntuación
                    if (comment['fecha del comentario'] && comment['Nombre del cliente'] && comment['puntuación del comentario']) {
                        const slide = document.createElement('div');
                        slide.className = 'swiper-slide';
                        // Usar Título del comentario si existe, sino Comentario positivo
                        const title = comment['Título del comentario'] || comment['Comentario positivo'] || 'Sin título';
                        slide.innerHTML = `
                            <div class="title">${title}</div>
                            <div class="author">${comment['Nombre del cliente']}</div>
                            <div class="date">${comment['fecha del comentario']}</div>
                            <div class="rating">${'★'.repeat(parseInt(comment['puntuación del comentario']))}</div>
                        `;
                        container.appendChild(slide);
                    }
                });
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
                    spaceBetween: 10,
                });
            }
        });
    })
    .catch(error => console.error('Error al cargar el CSV:', error));