class Rut {
    static calcularDigito(rut) {
        let s = 1;
        for (let m = 0; rut !== 0; rut = Math.floor(rut / 10)) {
            s = (s + rut % 10 * (9 - m++ % 6)) % 11;
        }
        return s ? String.fromCharCode(s + 47) : 'K';
    }

    static esValido(rut, digito) {
        return this.calcularDigito(rut) === digito.toUpperCase();
    }

    static crearAleatorio(inicio = 1000000, fin = 25000000) {
        const rut = Math.floor(Math.random() * (fin - inicio)) + inicio;
        const digito = this.calcularDigito(rut);
        return `${rut}-${digito}`;
    }
}
