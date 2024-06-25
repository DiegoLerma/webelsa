document.addEventListener("DOMContentLoaded", function() {
    const contactForm = document.getElementById('contact-form');

    // Variables para contar los clics
    let clicksOnCards = {};
    let clicksOnProjects = {};

    // Capturar clics en tarjetas de formación académica
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            if (!clicksOnCards[id]) {
                clicksOnCards[id] = 0;
            }
            clicksOnCards[id]++;
        });
    });

    // Capturar clics en proyectos
    document.querySelectorAll('.project-slide').forEach(project => {
        project.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            if (!clicksOnProjects[id]) {
                clicksOnProjects[id] = 0;
            }
            clicksOnProjects[id]++;
        });
    });

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const message = formData.get('message');

        const whatsappMessage = `Hola, mi nombre es: ${name}. Vengo de tu página web y me gustaría contactarte para decirte lo siguiente:%0A${message}`;
        const whatsappURL = `https://wa.me/524737390870?text=${whatsappMessage}`;

        // Convertir los clics a una cadena de texto
        const clicksOnCardsText = JSON.stringify(clicksOnCards, null, 2);
        const clicksOnProjectsText = JSON.stringify(clicksOnProjects, null, 2);

        // Enviar correo electrónico con EmailJS
        const serviceID = 'service_cxzi14y';
        const templateID = 'template_j15b4n7'; // Reemplaza con tu Template ID de EmailJS

        emailjs.send(serviceID, templateID, {
            from_name: name,
            contact_mail: email,
            contact_phone: phone,
            message: message,
            clicksOnCards: clicksOnCardsText,
            clicksOnProjects: clicksOnProjectsText
        })
        .then(() => {
            alert('¡Gracias por enviarme mensaje. Te contactaré a la brevedad posible!');
            contactForm.reset();

            // Redirigir a WhatsApp
            // window.open(whatsappURL, '_blank');
        }, (err) => {
            alert('Error al enviar el mensaje. Inténtalo de nuevo.');
            console.error('Error:', err);
        });
    });

    // Slider for projects
    const projectSlides = document.querySelectorAll('#project-slider .project-slide');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    let currentIndex = 0;
    let currentProjectIndex = 0;

    function showSlide(index) {
        projectSlides.forEach((slide, i) => {
            slide.style.display = 'none';
            dots[i].classList.remove('active');
        });
        projectSlides[index].style.display = 'flex';
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % projectSlides.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + projectSlides.length) % projectSlides.length;
        showSlide(currentIndex);
    }

    document.querySelector('.project-next').addEventListener('click', nextSlide);
    document.querySelector('.project-prev').addEventListener('click', prevSlide);
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            currentIndex = index;
        });
    });

    showSlide(currentIndex);

    // Add swipe functionality
    let startX;
    const slider = document.querySelector('.project-slider');

    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    slider.addEventListener('touchmove', (e) => {
        if (!startX) return;
        let diffX = startX - e.touches[0].clientX;

        if (diffX > 50) {
            nextSlide();
            startX = null;
        } else if (diffX < -50) {
            prevSlide();
            startX = null;
        }
    });

    // Scroll animations
    const sections = document.querySelectorAll('section');
    const options = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Initialize slider position
    showSlide(currentProjectIndex);

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const lightThemeClass = 'light-theme';
    const icon = themeToggle.querySelector('i');

    function setTheme(isLight) {
        if (isLight) {
            body.classList.add(lightThemeClass);
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            body.classList.remove(lightThemeClass);
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
        localStorage.setItem('isLightTheme', isLight);
    }

    themeToggle.addEventListener('click', () => {
        const isLight = !body.classList.contains(lightThemeClass);
        setTheme(isLight);
    });

    // Load the saved theme from localStorage
    const savedTheme = localStorage.getItem('isLightTheme') === 'true';
    setTheme(savedTheme);
});

function showModal(id) {
    const descriptions = {
        'Médico Cirujano (General)': `Soy estudiante de la Licenciatura en Médico Cirujano por la Universidad de Guanajuato - Campus León, con un promedio de 9.2. Actualmente, estoy cursando el primer semestre del internado médico.`,
        'Gestamor': `Gestamor es un proyecto ganador del 18° Concurso de Creatividad e Innovación que tiene como objetivo dar seguimiento y empoderar a la paciente embarazada durante su etapa estudiantil. Este proyecto demostró el impacto positivo de la tecnología en la salud maternal y me permitió combinar mis habilidades médicas y tecnológicas para crear una solución integral y efectiva.`
    };

    const modal = document.getElementById('modal');
    const modalText = document.getElementById('modal-text');
    modalText.innerHTML = `<h3>${id.replace(/-/g, ' ')}</h3><p>${descriptions[id]}</p>`;
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
}

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
}
