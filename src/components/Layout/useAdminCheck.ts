import { useEffect, useState } from 'react'

export function useAdminCheck() {
    const [hasChecked, setHasChecked] = useState<boolean>(false)
    const [isAdmin, setIsAdmin] = useState<boolean>(false)

    useEffect(() => {
        if (!hasChecked) {
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
                    setHasChecked(true)
                })
        }
    }, [hasChecked])

    return {
        isAdmin,
    }
}
