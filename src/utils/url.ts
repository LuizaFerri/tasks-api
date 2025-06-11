export function extractQueryParams(query: string) {
  return query.substr(1).split('&').reduce((queryParams, param) => {
    const [key, value] = param.split('=')
    queryParams[key] = value
    return queryParams
  }, {} as Record<string, string>)
}

export function buildRoutePath(path: string) {
  const routeParametersRegex = /:([a-zA-Z]+)/g
  const pathWithParams = path.replace(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)')

  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)

  return pathRegex
} 