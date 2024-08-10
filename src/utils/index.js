import moment from "moment/moment";

export function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
}


export function generateID() {
   return crypto.randomBytes(2).toString('hex');
}



export function timeSince(timestamp){
    const now = moment();
    const time = moment(timestamp);

    const minutes = now.diff(time, 'minutes');

    if (minutes > 0) {
        return  `há ${minutes} minutos atrás`;
    } else {
        return "agora";
    }
}