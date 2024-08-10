import moment from "moment/moment";

export function formartDate(timestamp){
    return new Date(timestamp).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}


export function generateID() {
   return crypto.randomBytes(2).toString('hex');
}



export function timeSince(timestamp){
    const now = moment();
    const time = moment(timestamp);

    const minutes = now.diff(time, 'minutes');

    console.log({
        minutes,
        timestamp
    })

    if (minutes > 0) {
        return  `há ${minutes} minutos atrás`;
    } else {
        return "agora";
    }
}