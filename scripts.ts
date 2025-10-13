/*

   d888888o.       ,o888888o.    8 888888888o.    8 8888 8 888888888o 8888888 8888888888 d888888o.
 .`8888:' `88.    8888     `88.  8 8888    `88.   8 8888 8 8888    `88.     8 8888     .`8888:' `88.
 8.`8888.   Y8 ,8 8888       `8. 8 8888     `88   8 8888 8 8888     `88     8 8888     8.`8888.   Y8
 `8.`8888.     88 8888           8 8888     ,88   8 8888 8 8888     ,88     8 8888     `8.`8888.
  `8.`8888.    88 8888           8 8888.   ,88'   8 8888 8 8888.   ,88'     8 8888      `8.`8888.
   `8.`8888.   88 8888           8 888888888P'    8 8888 8 888888888P'      8 8888       `8.`8888.
    `8.`8888.  88 8888           8 8888`8b        8 8888 8 8888             8 8888        `8.`8888.
8b   `8.`8888. `8 8888       .8' 8 8888 `8b.      8 8888 8 8888             8 8888    8b   `8.`8888.
`8b.  ;8.`8888    8888     ,88'  8 8888   `8b.    8 8888 8 8888             8 8888    `8b.  ;8.`8888
 `Y8888P ,88P'     `8888888P'    8 8888     `88.  8 8888 8 8888             8 8888     `Y8888P ,88P'

  How to use:

  - Add a typescript file to /scripts folder and export it as an async function (no need to import the file)

  - Type "yarn scripts" on terminal

  - Confirm database and username you're using

  - Choose your script from the list

  IMPORTANT NOTES:

  - This will run the *.ts files not the build ones, beware of your CTRL+S

  - Database connection will use your localVars.ts (or remote environment settings if run remotely)

  - Script files will be imported automatically

  - Commit your file afterwards

  DO NOT CHANGE ANY OF THE CODE BELOW TO RUN YOUR CODE

*/
import enquirer from 'enquirer'
import { load } from 'https://deno.land/std@0.201.0/dotenv/mod.ts'

const { Confirm, Select } = enquirer as any

await load({
  envPath: `.env.${name}`,
  examplePath: '.env.example',
  defaultsPath: '.env.defaults',
  allowEmptyValues: false,
  export: true,
})

import { join, toFileUrl } from 'https://deno.land/std@0.200.0/path/mod.ts'

const _funnyAnswersArray = [
  'Huh, that was close.',
  'Do not be in a hurry while running scripts, please!',
  "Maybe there's another, maybe easier, way",
]

const _funnyAnswer = _funnyAnswersArray[Math.floor(Math.random() * _funnyAnswersArray.length)]

const SCRIPTS_FOLDER = 'scripts'
const SCRIPTS: Record<string, { default: () => Promise<void> }> = {}

const files = []

const activeDir = join(Deno.cwd(), SCRIPTS_FOLDER)

for await (const dirEntry of Deno.readDir(activeDir)) {
  files.push(dirEntry.name)
}

await Promise.all(files.map(async (file) => {
  const filePath = join(activeDir, file)
  const fileUrl = toFileUrl(filePath).href

  SCRIPTS[file] = await import(fileUrl)
}))

const scriptFiles = files

async function runScripts() {
  const entryPointConfirmation = new Confirm({
    message: 'Would you like to start a SCRIPTS (procedures) execution?',
  })

  const entryPointAnswer = await entryPointConfirmation.run()

  if (!entryPointAnswer) {
    return console.warn('No scripts will run then!')
  }

  const executionConfirmation = new Confirm({
    message: 'Are you sure you want to execute your script in the above environment?',
  })

  const executionAnswer = await executionConfirmation.run()

  if (!executionAnswer) return console.warn(_funnyAnswer)

  if (executionAnswer === true) {
    const scriptSelect = new Select({
      name: 'select-script',
      choices: scriptFiles,
      message: 'Select the Script you want to run:',
    })

    const selectedFile = await scriptSelect.run()

    if (!selectedFile) {
      return console.warn(
        `\nScripts were ${console.error('canceled')}. No scripts will Run.\n`,
      )
    }

    if (selectedFile) {
      const selectedScript = selectedFile.split('.ts')[0]

      const selectionConfirmation = new Confirm({
        message: `Do you confirm the execution of all contents of the file ${selectedScript}?`,
      })

      const selectionAnswer = await selectionConfirmation.run()

      if (!selectionAnswer) return console.warn(_funnyAnswer)

      if (selectionAnswer === true) {
        console.warn(`Started running ${selectedScript}`)

        console.time(selectedScript)

        await SCRIPTS[selectedFile].default()

        console.timeEnd(selectedScript)
      }
    }

    console.warn(`Scripts finished running successfully\n`)
  }

  Deno.exit(0)
}

runScripts()
