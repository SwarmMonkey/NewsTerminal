/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as ApiTestImport } from './routes/api-test'
import { Route as IndexImport } from './routes/index'
import { Route as CColumnImport } from './routes/c.$column'

// Create/Update Routes

const ApiTestRoute = ApiTestImport.update({
  id: '/api-test',
  path: '/api-test',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const CColumnRoute = CColumnImport.update({
  id: '/c/$column',
  path: '/c/$column',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/api-test': {
      id: '/api-test'
      path: '/api-test'
      fullPath: '/api-test'
      preLoaderRoute: typeof ApiTestImport
      parentRoute: typeof rootRoute
    }
    '/c/$column': {
      id: '/c/$column'
      path: '/c/$column'
      fullPath: '/c/$column'
      preLoaderRoute: typeof CColumnImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/api-test': typeof ApiTestRoute
  '/c/$column': typeof CColumnRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/api-test': typeof ApiTestRoute
  '/c/$column': typeof CColumnRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/api-test': typeof ApiTestRoute
  '/c/$column': typeof CColumnRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/api-test' | '/c/$column'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/api-test' | '/c/$column'
  id: '__root__' | '/' | '/api-test' | '/c/$column'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  ApiTestRoute: typeof ApiTestRoute
  CColumnRoute: typeof CColumnRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  ApiTestRoute: ApiTestRoute,
  CColumnRoute: CColumnRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/api-test",
        "/c/$column"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/api-test": {
      "filePath": "api-test.tsx"
    },
    "/c/$column": {
      "filePath": "c.$column.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
