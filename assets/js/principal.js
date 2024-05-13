document.getElementById('check').addEventListener('change', function() {
    let links = document.querySelectorAll('#botoesModalidades a');
    for (let link of links) {
        let url = new URL(link.href);
        if (this.checked) {
            // Se o checkbox está marcado, adicione "aleatorio" à URL
            url.searchParams.set('aleatorio', 'true');
        } else {
            // Se o checkbox não está marcado, remova "aleatorio" da URL
            url.searchParams.delete('aleatorio');
        }
        link.href = url.toString();
    }
});