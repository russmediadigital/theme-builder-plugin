import path from 'path'
import { ThemeResolver } from '@russmedia/theme-resolver'
import { createUnplugin } from 'unplugin'
import { Options } from './types'

export default createUnplugin<Options>((options) => {
  if (!options) {
    options = {
      options: [ThemeResolver.defaultOptions],
    }
  }

  const resolver = new ThemeResolver(options.options)
  return {
    name: 'theme-builder-plugin',

    resolveId(id) {
      if (!id)
        return

      const chosenResolver = resolver.getResolver(id)

      if (!chosenResolver)
        return id

      const file = resolver.getFileName(id, chosenResolver)

      const extension = path.extname(file)
      const tryFiles = []

      if (extension === '')
        ['ts'].map(ext => tryFiles.push(`${file}.${ext}`))

      tryFiles.push(file)

      let resolvedPath
      tryFiles.some((filePath) => {
        const result = resolver.resolveComponentPath(filePath, chosenResolver.directories)

        if (result) {
          resolvedPath = result
          return true
        }
        return false
      })

      if (!resolvedPath)
        return id

      return resolvedPath
    },
  }
})
