import dayjs from 'dayjs'

export const formatDate = (val: string | Date) => {
  if (!val) return ''
  return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
}
