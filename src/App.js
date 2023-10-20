import 'bootstrap/dist/css/bootstrap.css'
import React, { useState, useRef, useCallback } from 'react'
import useBookSearch from './components/useBookSearch'
function App() {
  const [query, setQuery] = useState("")
  const [pageNumber, setPageNumber] = useState(1)

  const { books, isLoading, isError, hasMore } = useBookSearch(query, pageNumber)
  
  const observer = useRef()

  const lastBookElementRef = useCallback(node => {
    if (isLoading) return
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })

    if (node) observer.current.observer(node)
  }, [isLoading, hasMore])

  function handleQueryChange(event) {
    setPageNumber(1)
    setQuery(event.target.value)
  }

  return (
    <div className="App">
      <div className="form-group mt-5 col-2 m-5">
        <label htmlFor="exampleInputEmail1">Search Something..</label>
        <input type="text" className="form-control" value={query} onChange={handleQueryChange} />
      </div>
      <div className="form-group mt-5 col-2 m-5">
        <ul className='form-group'>
          {isLoading && <li>loading ...</li>}
          {isError && <li>Error ...</li>}
          {!isLoading && books.map((book, index) => {
            if(book.length === index + 1){
              return (<li className='form-group-item' ref={lastBookElementRef} key={book}>{book}</li>)
            }else{
              return (<li className='form-group-item' key={book}>{book}</li>)
            }
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
