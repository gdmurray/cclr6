import { useEffect, useState } from 'react'

export function useRoleCheck() {
    const [hasCheckedAdmin, setHasCheckedAdmin] = useState<boolean>(false)
    const [isAdmin, setIsAdmin] = useState<boolean>(false)

    useEffect(() => {
        if (!hasCheckedAdmin) {
            fetch('/api/admin/verify', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((result) => {
                    if (result.ok) {
                        setIsAdmin(true)
                    }
                })
                .finally(() => {
                    setHasCheckedAdmin(true)
                })
        }
    }, [hasCheckedAdmin])

    const [hasCheckedAnalyst, setHasCheckedAnalyst] = useState<boolean>(false)
    const [isAnalyst, setIsAnalyst] = useState<boolean>(false)

    useEffect(() => {
        if (!hasCheckedAnalyst) {
            fetch('/api/analyst/verify', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((result) => {
                    if (result.ok) {
                        setIsAnalyst(true)
                    }
                })
                .finally(() => {
                    setHasCheckedAnalyst(true)
                })
        }
    }, [hasCheckedAnalyst])

    return {
        isAdmin,
        isAnalyst,
    }
}
