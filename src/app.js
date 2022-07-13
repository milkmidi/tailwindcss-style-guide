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

class MyPreview extends HTMLElement {
  constructor() {
    super();
    let tabIndex = 0;
    const findDataPreviewContainer = this.querySelector('[data-preview]');
    findDataPreviewContainer.classList.add('hidden', 'data-active:flex');
    findDataPreviewContainer.setAttribute('data-active', 'true');
    findDataPreviewContainer.setAttribute('data-bind', '0');
    const nodeStr = Array.from(findDataPreviewContainer.childNodes)
      .map((child) => child.outerHTML)
      .filter(Boolean);

    const tab = document.createElement('div');
    tab.innerHTML = `
      <button class="preview__tab preview__tab--p" data-bind="0" data-active="true">Preview</button>
      <button class="preview__tab preview__tab--h" data-bind="1" data-active="false">HTML</button>
    `;

    const updateRender = () => {
      this.querySelectorAll('[data-bind]').forEach((child) => {
        const childDataBind = child.getAttribute('data-bind') / 1;
        child.setAttribute('data-active', childDataBind === tabIndex ? 'true' : 'false');
      });
    };

    requestAnimationFrame(() => {
      this.querySelectorAll('.preview__tab').forEach((tabButton, idx) => {
        tabButton.addEventListener('click', () => {
          tabIndex = idx;
          updateRender();
          // this.children[1].setAttribute('data-active', 'false');
          // this.children[2].setAttribute('data-active', 'false');
          // this.children[idx + 1].setAttribute('data-active', 'true');
        });
      });
    });
    const codeChild = document.createElement('div');
    codeChild.classList.add('code-child', 'hidden', 'data-active:block');
    codeChild.setAttribute('data-bind', '1');
    codeChild.innerHTML = `<pre class="my-code">${escapeHTML(nodeStr.join('\n'))}</pre>`;
    this.prepend(tab);
    this.appendChild(codeChild);
  }
}
window.customElements.define('my-preview', MyPreview);
