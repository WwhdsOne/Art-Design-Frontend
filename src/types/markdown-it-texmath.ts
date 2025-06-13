declare module 'markdown-it-texmath' {
  import { PluginSimple } from 'markdown-it'
  const texmath: PluginSimple & {
    use: (...args: any[]) => void
  }
  export default texmath
}
