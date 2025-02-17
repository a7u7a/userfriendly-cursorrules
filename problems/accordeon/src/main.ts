import { bookReviews } from './data';
import './styles.css';

function createAccordion() {
  const accordion = document.createElement('div');
  accordion.className = 'accordion';

  bookReviews.forEach(review => {
    const item = document.createElement('div');
    item.className = 'accordion-item';

    const title = document.createElement('div');
    title.className = 'accordion-title';
    title.textContent = review.title;

    const content = document.createElement('div');
    content.className = 'accordion-content';
    content.textContent = review.review;

    item.appendChild(title);
    item.appendChild(content);
    accordion.appendChild(item);

    title.addEventListener('click', () => {
      // Close all other open items
      document.querySelectorAll('.accordion-content.active').forEach(el => {
        if (el !== content) {
          el.classList.remove('active');
          el.previousElementSibling?.classList.remove('active');
        }
      });

      // Toggle current item
      content.classList.toggle('active');
      title.classList.toggle('active');
    });
  });

  return accordion;
}

// Mount the accordion to the DOM
document.getElementById('app')?.appendChild(createAccordion());