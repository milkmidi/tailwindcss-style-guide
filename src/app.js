/* eslint-disable max-classes-per-file */
import './css/app.scss';

class MyCode extends HTMLElement {
  constructor() {
    super();
    const firstChild = this.children[0];
    const className = firstChild.dataset.class || firstChild.getAttribute('class');
    const child = document.createElement('div');
    child.classList.add('my-code-wrap');

    child.innerHTML = `
      <pre class="my-code">${className}</pre>
      <i class="fa-solid fa-clipboard my-code__fa"></i>
    `;
    this.appendChild(child);
    requestAnimationFrame(() => {
      const icon = this.querySelector('.my-code__fa');
      icon.addEventListener('click', () => {
        console.log('clipboard', className);
        navigator.clipboard.writeText(className);
      });
    });
  }
}

window.customElements.define('my-code', MyCode);

const escapeHTML = (html) => {
  return html.trim().replaceAll('<', '&lt;').replaceAll('>', '&gt;');
};

class Preview extends HTMLElement {
  constructor() {
    super();
    const findDataPreviewContainer = this.querySelector('[data-preview]');
    findDataPreviewContainer.classList.add('hidden', 'data-active:block');
    findDataPreviewContainer.setAttribute('data-active', 'true');
    const nodeStr = Array.from(findDataPreviewContainer.childNodes)
      .map((child) => child.outerHTML)
      .filter(Boolean);

    const tab = document.createElement('div');
    tab.innerHTML = `
      <button class="my-tab">Preview</button>
      <button class="my-tab">HTML</button>
    `;
    requestAnimationFrame(() => {
      this.querySelectorAll('.my-tab').forEach((tabButton, idx) => {
        tabButton.addEventListener('click', () => {
          this.children[1].setAttribute('data-active', 'false');
          this.children[2].setAttribute('data-active', 'false');
          this.children[idx + 1].setAttribute('data-active', 'true');
        });
      });
    });
    const codeChild = document.createElement('div');
    codeChild.classList.add('code-child', 'hidden', 'data-active:block');
    codeChild.innerHTML = `<pre class="my-code">${escapeHTML(nodeStr.join('\n'))}</pre>`;
    this.prepend(tab);
    this.appendChild(codeChild);
  }
}
window.customElements.define('my-preview', Preview);
