// Aplica el tema guardado antes de pintar la página (evita parpadeos)
try{document.documentElement.dataset.theme=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light')}catch(e){}
