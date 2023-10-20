import axios from 'axios'
import { useEffect, useState } from 'react'

function useBookSearch(query, pageNumber) {
    const [books, setBooks] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        setBooks([])
    }, [query])

    useEffect(() => {
        let cancel;
        setIsLoading(true)
        axios({
            method: 'GET',
            url: 'https://openlibrary.org/search.json',
            params: { q: query, page: pageNumber },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then((res) => {
            // console.log(res.data)
            setBooks(prevBooks => {
                return [...new Set([...prevBooks, ...res.data.docs.map(b => b.title)])]
            })
            // console.log(books)
            setIsLoading(false)
            setIsError(false)

        }).catch((err) => {
            if (axios.isCancel(err)) return
            console.log(err)
            setIsError(true)
        })


        return () => cancel()
    }, [query, pageNumber])

    return { books, isLoading, isError, hasMore }
}

export default useBookSearch