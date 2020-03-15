import React, { useState, useEffect, Profiler } from 'react'

const fetchPeople = (id: number) => fetch("https://swapi.co/api/people/" + id).then(res => res.json())
const fetchPosts = (payload: {
      title: string
      body: string
      userId: number
    }) => fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
  .then(response => response.json())
type AnyFuntion = (...args: any[]) => any

const useAsync = (cb: AnyFuntion) => {
  const [asyncState, setAsyncState] = useState({
    loading: false,
    error: null,
    result: null,
    fetch: typeof cb === 'function' ? cb : () => null,
  })

  return {
    asyncState,
    setAsyncState,
  }
}

const useAsyncCallback = (fetchFn: AnyFuntion) => {
  const { asyncState, setAsyncState } = useAsync(fetchFn)

  const resume = (...args: any[]) => {
    setAsyncState({ ...asyncState, loading: true })
    return fetchFn(...args)
      .then((response: any) => {
        setAsyncState({
          ...asyncState,
          loading: false,
          result: response,
        })
      })
      .catch((error: any) => {
        setAsyncState({
          ...asyncState,
          error,
        })
      })
  }

  return {
    resume,
    loading: asyncState.loading,
    error: asyncState.error,
    result: asyncState.result,
  }
}

export const AppUseAsync = () => {

  const api = useAsyncCallback(fetchPeople)
  return (
    <Profiler id="use-async" onRender={console.log}>
      <div>
        <button onClick={() => api.resume(1)}>1</button>
        <button onClick={() => api.resume(2)}>2</button>
        {api.loading ? "loading" : <pre>{JSON.stringify(api.result)}</pre>}
      </div>
    </Profiler>
  )
}

export const AppUseRawEffect = () => {
  const [id, setId] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState({})

  useEffect(() => {
    Promise.resolve().then(() => {
      console.log('update loading')
      setLoading(true)
      console.log('update error')
      setError(null)
    }).then(() => {
      return fetchPeople(id)
    }).then((response: any) => {
      console.log('update loading')
      setLoading(false)
      console.log('update result')
      setResult(response)
    })
  }, [id])

  return (
    <Profiler id="raw-effect" onRender={console.log}>
      <div>
        {/* 缺点，如果 id 没有变化，再次点击的话，就无法再次触发请求 */}
        <button onClick={() => setId(1)}>1</button>
        <button onClick={() => setId(2)}>2</button>
        <pre>
          {loading ? "loading" : JSON.stringify(result)}
        </pre>
      </div>
    </Profiler>
  )
}

const AppUseAsyncWithForm = () => {
  const [form, setForm] = useState({
      title: 'foo',
      body: 'bar',
      userId: 1,
    })

  const api = useAsyncCallback(fetchPosts)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    api.resume(form)
  }
  return (
    <Profiler id="use-async-form" onRender={console.log}>
      <form onSubmit={onSubmit}>
        <input type="text" name="title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input type="text" name="body" value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} />
        <input type="number" name="useId" value={form.userId} onChange={e => setForm({ ...form, userId: Number(e.target.value) })} />
        <input type="submit"/>
      </form>
      <pre>
        {
          api.loading ? 'loading' : JSON.stringify(api.result)
        }
      </pre>
    </Profiler>
  )
}


const components = [AppUseRawEffect, AppUseAsync, AppUseAsyncWithForm]

export const App = () => {
  const [id, setId] = useState(0)

  const CurrentApp = components[id]

  return (
    <div>
      <div>
        <button onClick={() => setId(0)}>raw useEffect</button>
        <button onClick={() => setId(1)}>use-async</button>
        <button onClick={() => setId(2)}>use-async with form</button>
      </div>
      <div>
      <CurrentApp />
      </div>
    </div>
  )
}