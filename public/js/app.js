
class MyCode extends HTMLElement {
  constructor(){
    super();
    const firstChild = this.children[0];
    const className = firstChild.getAttribute('class');
    const child = document.createElement('div');
    child.classList.add('my-code-wrap')
    
    child.innerHTML = `
      <pre class="my-code">${className}</pre>
      <i class="fa-solid fa-clipboard my-code__fa"></i>
    `
    this.appendChild(child);
    requestAnimationFrame(()=> {
      const icon = this.querySelector('.my-code__fa');
      icon.addEventListener('click', ()=> {
        console.log('click');
        navigator.clipboard.writeText(className);
      })
    });
  }
}

window.customElements.define('my-code', MyCode);