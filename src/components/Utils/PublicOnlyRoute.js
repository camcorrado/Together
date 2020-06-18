import React from 'react'
import { Route } from 'react-router-dom'

export default function PublicOnlyRoute({ component, ...props }) {
  const Component = component
  return (
    <Route
      {...props}
      render={componentProps => (
          <Component {...componentProps} />
      )}
    />
  )
}
