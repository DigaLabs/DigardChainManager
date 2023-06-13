import moment from 'moment'

export const dateFormatter = {
  momentFormatter: (utcDate: string) => {
    const formattedDate_moment = moment.utc(utcDate).local().format('YYYY-MM-DD HH:mm:ss')

    return formattedDate_moment
  },
}
