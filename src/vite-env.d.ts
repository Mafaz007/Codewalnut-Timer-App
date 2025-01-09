/// <reference types="vite/client" />
/// <reference types="vitest" />

interface ImportMetaEnv {
    readonly VITEST: undefined | boolean
}

interface ImportMeta {
    readonly env: ImportMetaEnv
    readonly vitest: any
}
