import { CreateIndexes } from './indexes/CreateIndexes.ts'

export const Procedures = async () => {
  const procedures = [
    CreateIndexes,
  ]

  for (const procedure of procedures) {
    try {
      await procedure()
    } catch (error) {
      console.error(`Error running procedure ${procedure.name}:`, error)
    }
  }
}
