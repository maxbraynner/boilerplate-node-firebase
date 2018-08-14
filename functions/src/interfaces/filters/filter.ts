interface Filter {
    // identificador
    uid: string

    // especificar outros campos possíveis para o filtro

    /**
     * quantidade de elementos retornados
     */
    limit: string

    /**
     * número do primeiro registro (paginação firestore)
     */
    init: string
}

export default Filter;