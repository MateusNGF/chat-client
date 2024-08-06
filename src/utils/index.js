
export function formartDate(timestamp){
    return new Date(timestamp).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}