const Ascending = () => {
    return (
        <svg className="w-4 h-4 text-gray-500 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l4 4a1 1 0 11-1.414 1.414L11 6.414V14a1 1 0 11-2 0V6.414L5.707 8.707a1 1 0 11-1.414-1.414l4-4A1 1 0 0110 3z" clipRule="evenodd" />
        </svg>
    )
}

const Descending = () => {
    return (
        <svg className="w-4 h-4 text-gray-500 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 17a1 1 0 01-.707-.293l-4-4a1 1 0 011.414-1.414L9 13.586V6a1 1 0 112 0v7.586l2.707-2.707a1 1 0 011.414 1.414l-4 4A1 1 0 0110 17z" clipRule="evenodd" />
        </svg>
    )
}

export { Ascending, Descending }
