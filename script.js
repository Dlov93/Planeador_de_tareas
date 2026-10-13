const selector = document.querySelector('#Barra_selectora');


selector.addEventListener('change', function(){
    const valor = selector.value;
    if(valor === '1'){
        selector.style.backgroundColor = 'var(--ColorSeleccion--Verde)'
    }else if (valor === '2'){
        selector.style.backgroundColor = 'var(--ColorSeleccion--Amarillo)'
    }
    else if(valor ==='3'){
        selector.style.backgroundColor = 'var(--ColorSeleccion--Rojo)'
    }else{
        selector.style.backgroundColor= '#ffffff'
    }
        
})