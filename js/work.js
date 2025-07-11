document.addEventListener("DOMContentLoaded", function () {
	const carousel = document.querySelector(".carousel");
	const progress = document.querySelector(".progress");
	const dots = document.querySelectorAll(".dot");
	const cardMargin = 32;
	const originalCards = Array.from(document.querySelectorAll(".card"));
	const originalCardCount = originalCards.length;
	carousel.innerHTML = "";
	const tripledCards = [...originalCards, ...originalCards, ...originalCards];
	tripledCards.forEach(card => {
		const cloned = card.cloneNode(true);
		cloned.style.opacity = 0;
		cloned.style.transform = "translateY(30px)";
		carousel.appendChild(cloned);
	});
	const cards = carousel.querySelectorAll(".card");
	const cardWidth = cards[0].offsetWidth + cardMargin;
	let currentX = -originalCardCount * cardWidth;
	const scrollSpeed = 0.5;
	const minX = -cardWidth * originalCardCount * 2;
	const maxX = -cardWidth * originalCardCount;
	carousel.style.transition = "none";
	carousel.style.transform = `translateX(${currentX}px)`;
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const card = entry.target;
				card.style.opacity = 1;
				card.style.transform = "translateY(0)";
				observer.unobserve(card);
				const img = card.querySelector("img");
				if (img && img.dataset.src) {
					img.src = img.dataset.src;
					delete img.dataset.src;
				}
			}
		});
	}, { threshold: 0.1 });
	cards.forEach((card) => observer.observe(card));
	let isPaused = false;
	let pauseTimeout;
	let isDragging = false;
	let dragStartX = 0;
	let dragStartTranslate = 0;

	function pauseScrollTemporarily() {
		isPaused = true;
		clearTimeout(pauseTimeout);
		pauseTimeout = setTimeout(() => {
			isPaused = false;
		}, 10000); 
	}
	function animateScroll() {
		if (!isPaused && !isDragging) {
			currentX += scrollSpeed;
			if (currentX >= maxX) {
				currentX = minX;
			}
			carousel.style.transform = `translateX(${currentX}px)`;
			updateProgressAndDots();
		}
		requestAnimationFrame(animateScroll);
	}
	function updateProgressAndDots() {
		const relativeIndex = Math.abs(Math.round(currentX / cardWidth)) % originalCardCount;
		const progressWidth = ((relativeIndex + 1) / originalCardCount) * 100;
		progress.style.width = `${progressWidth}%`;

		dots.forEach((dot, index) => {
			dot.classList.toggle("active", index === relativeIndex);
		});
	}
	carousel.addEventListener("pointerdown", (e) => {
		isDragging = true;
		pauseScrollTemporarily();
		dragStartX = e.clientX;
		dragStartTranslate = currentX;
		carousel.setPointerCapture(e.pointerId);
	});

	carousel.addEventListener("pointermove", (e) => {
		if (!isDragging) return;
		const deltaX = e.clientX - dragStartX;
		currentX = dragStartTranslate + deltaX;
		if (currentX > maxX) {
			currentX = minX + (currentX - maxX);
		} else if (currentX < minX) {
			currentX = maxX - (minX - currentX);
		}
		carousel.style.transition = "none";
		carousel.style.transform = `translateX(${currentX}px)`;
	});
	carousel.addEventListener("pointerup", (e) => {
		isDragging = false;
		carousel.releasePointerCapture(e.pointerId);
	});
	carousel.addEventListener("touchstart", (e) => {
		isDragging = true;
		pauseScrollTemporarily();
		dragStartX = e.touches[0].clientX;
		dragStartTranslate = currentX;
	});

	carousel.addEventListener("touchmove", (e) => {
		if (!isDragging) return;
		const deltaX = e.touches[0].clientX - dragStartX;
		currentX = dragStartTranslate + deltaX;
		if (currentX > maxX) {
			currentX = minX + (currentX - maxX);
		} else if (currentX < minX) {
			currentX = maxX - (minX - currentX);
		}

		carousel.style.transition = "none";
		carousel.style.transform = `translateX(${currentX}px)`;
	});

	carousel.addEventListener("touchend", () => {
		isDragging = false;
	});
	["mouseenter", "mouseleave", "pointerdown", "touchstart", "touchend"].forEach(evt => {
		carousel.addEventListener(evt, pauseScrollTemporarily);
	});
	document.addEventListener("pointerdown", (e) => {
		const isInsideCard = e.target.closest('.card');
		if (!isInsideCard) {
			isPaused = false;
			clearTimeout(pauseTimeout);
		}
	});
	setTimeout(() => {
		cards.forEach((card, index) => {
			setTimeout(() => {
				card.style.opacity = 1;
				card.style.transform = "translateY(0)";
			}, index * 50);
		});
	}, 300);
	animateScroll();
});
