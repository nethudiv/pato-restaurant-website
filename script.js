document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".navbar");
    const navLinks = [...document.querySelectorAll(".navbar-nav .nav-link")];
    const sections = [...document.querySelectorAll("main section, body > section")].filter(s => s.id);

    const heroSwiper = new Swiper(".hero-swiper", {
        loop: true,
        speed: 900,
        autoplay: { delay: 4500, disableOnInteraction: false },
        effect: "fade",
        fadeEffect: { crossFade: true },
        pagination: { el: ".hero-swiper .swiper-pagination", clickable: true },
        navigation: {
            nextEl: ".hero-swiper .swiper-button-next",
            prevEl: ".hero-swiper .swiper-button-prev"
        }
    });

    const testimonialSwiper = new Swiper(".testimonial-swiper", {
        loop: true,
        speed: 700,
        autoplay: { delay: 5000, disableOnInteraction: false },
        spaceBetween: 24,
        grabCursor: true,
        slidesPerView: 1,
        pagination: { el: ".testimonial-swiper .swiper-pagination", clickable: true },
        breakpoints: { 992: { slidesPerView: 1 } }
    });

    const setScrolled = () => navbar?.classList.toggle("scrolled", window.scrollY > 30);
    setScrolled();
    window.addEventListener("scroll", setScrolled, { passive: true });

    // Keep navigation links and the visible section in sync.
    const updateActiveNav = () => {
        const y = window.scrollY + 130;
        let current = "home";
        sections.forEach(section => {
            if (section.offsetTop <= y) current = section.id;
        });
        navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${current}`));
    };
    updateActiveNav();
    window.addEventListener("scroll", updateActiveNav, { passive: true });

    // Close the mobile Bootstrap menu after navigation.
    navLinks.forEach(link => link.addEventListener("click", () => {
        const collapse = document.querySelector("#navbarSupportedContent");
        if (collapse?.classList.contains("show") && window.bootstrap) {
            bootstrap.Collapse.getOrCreateInstance(collapse).hide();
        }
    }));

    // Modal for menu and blog interactions.
    const modal = document.querySelector("#siteModal");
    const modalTitle = document.querySelector("#modalTitle");
    const modalText = document.querySelector("#modalText");
    const openModal = (title, text) => {
        modalTitle.textContent = title;
        modalText.textContent = text;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    };
    const closeModal = () => {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    };

    document.querySelectorAll(".menu-card").forEach(card => {
        card.setAttribute("tabindex", "0");
        const title = card.querySelector("h3")?.textContent.trim() || "PATO Menu";
        card.addEventListener("click", () => openModal(title, `Explore our ${title.toLowerCase()} selection at PATO. Ask our team about today's specials and seasonal dishes.`));
        card.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); card.click(); }
        });
    });

    const blogMessages = [
        "Discover our ideas for pairing food, atmosphere and wine for a relaxed dining experience.",
        "Take a look at the ingredients and techniques that inspire our kitchen throughout the season.",
        "Explore simple ways to turn a dinner out into a memorable occasion with the people you enjoy."
    ];
    document.querySelectorAll(".blog-read-more").forEach((link, index) => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const title = link.closest(".blog-card")?.querySelector("h3")?.textContent.trim() || "PATO Journal";
            openModal(title, blogMessages[index] || blogMessages[0]);
        });
    });

    document.querySelectorAll(".policy-link").forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            openModal(link.dataset.policy, "This is a demonstration policy page for the PATO website. Replace this text with your final legal policy before publishing.");
        });
    });

    document.querySelectorAll("[data-modal-close]").forEach(el => el.addEventListener("click", closeModal));
    document.addEventListener("keydown", e => { if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal(); });

    // Friendly front-end reservation confirmation.
    const form = document.querySelector(".reservation-form");
    const message = document.querySelector(".form-message");
    if (form) {
        const dateInput = form.querySelector("#date");
        if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];

        form.addEventListener("submit", e => {
            e.preventDefault();
            if (!form.checkValidity()) {
                form.classList.add("was-validated");
                message.textContent = "Please complete all required fields.";
                message.className = "form-message error";
                form.querySelector(":invalid")?.focus();
                return;
            }
            const name = form.querySelector("#name").value.trim();
            const date = form.querySelector("#date").value;
            const time = form.querySelector("#time").value;
            message.textContent = `Thanks, ${name}! Your request for ${date} at ${time} has been received. We’ll confirm your table shortly.`;
            message.className = "form-message success";
            form.reset();
        });
    }
});
