import React, { useEffect } from 'react'

export default function useKeypress(key, action) {
    useEffect(() => {
        function onKeyup(e) {
            if (e.key === key) action(e)
        }

        window.addEventListener('keyup', onKeyup)
        return () => window.removeEventListener('keyup', onKeyup)
    }, [])
}