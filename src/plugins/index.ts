import { hashtags } from './hashtags'
import { references } from './references'

// import { mermaid } from './mermaid'
// import { urls } from './urls'

export interface Config {
  docs: Doc[],
  tags: string[],
}

export interface Doc {
  id: string,
  title: string,
}

// export { mermaid }

export const plugins = (config: Config) => {
  return [
    ...hashtags(config),
    // ...mermaid(config),
    ...references(config),
    // ...urls(config),
  ]
}
