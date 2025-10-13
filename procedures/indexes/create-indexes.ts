import { join, toFileUrl } from 'https://deno.land/std@0.200.0/path/mod.ts'

import type { TIndexes } from './db-indexes.ts'

async function collectTSFilesRecursively(dir: string, files: string[]) {
  for await (const entry of Deno.readDir(dir)) {
    const entryPath = join(dir, entry.name)
    if (entry.isDirectory) {
      await collectTSFilesRecursively(entryPath, files)
    } else if (entry.isFile && entry.name.endsWith('.ts')) {
      files.push(entryPath)
    }
  }
}

export const CreateIndexes = async () => {
  try {
    const dbIndexesPath = join(Deno.cwd(), 'procedures', 'indexes', 'banks-db-indexes')
    const files: string[] = []

    await collectTSFilesRecursively(dbIndexesPath, files)
    const allIndexes = []
    for (const filePath of files) {
      const fileUrl = toFileUrl(filePath).href
      const module = await import(fileUrl)
      if (module.Indexes) {
        allIndexes.push(module.Indexes)
      }
    }

    const indexes: TIndexes = allIndexes.flat().filter((index) => index && index.model && index.indexes)

    await Promise.all(
      indexes.map(async ({ model, indexes }) => {
        await model.init()
        const existingIndexes = await model.collection.listIndexes().toArray()

        for (const { keys, options } of indexes) {
          const targetName = options?.name || Object.entries(keys).map(([k, v]) => `${k}_${v}`).join('_')

          const matchingIndex = existingIndexes.find((existingIndex) => existingIndex.name === targetName)

          let shouldCreate = true

          if (matchingIndex) {
            const { name: _name, key: _key, v: _v, ...existingOptions } = matchingIndex

            const cleanTargetOptions = { ...(options ?? {}) }
            delete cleanTargetOptions.name

            if ('background' in existingOptions) {
              delete existingOptions.background
            }

            const normalizedExisting = JSON.stringify(existingOptions ?? {})
            const normalizedTarget = JSON.stringify(cleanTargetOptions)

            const sameOptions = normalizedExisting === normalizedTarget
            const sameKeys = JSON.stringify(matchingIndex.key) === JSON.stringify(keys)

            if (sameKeys && sameOptions) {
              shouldCreate = false
              console.info(`Index already exists on ${model.modelName}`, keys)
            }
          }

          if (shouldCreate) {
            try {
              // @ts-ignore: mismatched types
              await model.collection.createIndex(keys, options)
              console.log(`Index created for ${model.modelName}`, keys)
            } catch (err) {
              console.error(`Failed to create index for ${model.modelName}: ${keys}`, err)
            }
          }
        }
      }),
    )
  } catch (err) {
    console.error('Failed to create indexes', err)
  }
}
