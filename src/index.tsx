import { render } from 'react-dom'
import './index.scss'
import React, { Children, isValidElement, cloneElement, ReactElement } from 'react'

function cleanChildren(children: any) {
  return Children.toArray(children).filter(child => isValidElement(child))
}

const App: React.FC<{
  title?: string
  name?: string
}> = (props) => {
  const { children, title, name } = props
  // children 的类型是未知的，可能是函数、可能是合法的 ReactElement
  console.log('app props', props)
  
  console.log(children)
  console.log(isValidElement((children as any[])[0]))
  console.log(Children.toArray(children))
  
  return (
    <div>
      <span>{title}</span>
      <span>{name}</span>
      {children}
    </div>
  )
}

const Comp: React.FC<{
  title?: string
  name?: string
}> = (props) => {
  console.log('props.children', props.children)
  
  return (
    <App {...props}>
      {props.children}
    {/* {() => 1} */}
    <div>
      <h1>1</h1>
    </div>
    <h2>2</h2>
    <h3>1</h3>
    <h4>1</h4>
    <h1>1</h1>
    <h1>1</h1>
    <h1>1</h1>
    <h1>1</h1>
  </App>
)
}

const T = () => <div>{'children'}</div>
const Clone: React.FC = ({ children }) => {
  console.log(children)
  
  const clones = React.Children.map(children, (child, index) => {
    if (isValidElement(child)) {
      console.log(child)
  
      return cloneElement(child as ReactElement, { title: 'clone', key: index }, <T />)
    }
    
    return child
  })
  console.log(clones)

  return <>{clones}</>
}
render((
  <Clone>
    string
    <Comp />
  </Clone>
), document.getElementById('app'))
