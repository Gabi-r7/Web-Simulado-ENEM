function updateLink(categoria) {
    // Seleciona todos os checkboxes com a classe 'checkbox-custom'
    const checkboxes = document.querySelectorAll('.checkbox-custom');

    // Filtra apenas os checkboxes que estão marcados
    const selecionados = Array.from(checkboxes).filter(checkbox => checkbox.checked);

    // Extrai o valor 'onclick' de cada checkbox marcado
    const categorias = selecionados.map(checkbox => checkbox.getAttribute('onclick').match(/\('(.*)'\)/)[1]);

    // Aqui você pode fazer algo com as categorias selecionadas, como atualizar um link
    // Por exemplo, vamos apenas imprimir as categorias selecionadas no console
    console.log(categorias);

    // Supondo que você queira atualizar um link com base nas categorias selecionadas
    // Você pode fazer algo assim:
    let urlConc = categorias.join(',');

    // Atualiza o href de um link específico (você precisa ter um elemento de link com um id específico no seu HTML)
    

    // Para demonstração, vamos imprimir a URL atualizada no console
    console.log(urlConc);
}

function confirm(){
    let urlConc = categorias.join(',');
    console.log(urlConc);
    window.location.href = "modalidade.html?tipo=" + urlConc;
}