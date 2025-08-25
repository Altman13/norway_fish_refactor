export const temp = (id, names, type, iter, loopId, typeBtn) => {
    if (type === 'c') {
        return {
            id: id,
            name: names[iter],
            accordionId: `accordion-id-${id}`,
            accordion: 'accordion-collapse collapse',
            acc: 'collapsed',
            cancelName: 'Tilbake',
            sendName: 'Stopp fiskeoperasjon'.toUpperCase(),
            type: typeBtn,
        }
    } else {
        return {
            id: id,
            name: names[id],
            accordionId: `accordion-id-${id}`,
            // accordion: id === 0 ? 'accordion-collapse collapse show' : 'accordion-collapse collapse',
            // acc: id === 0 ? '' : 'collapsed',
            cancelName: 'Tilbake',
            sendName: 'Neste',
            loop: loopId,
            type: typeBtn,
        }
    }
}