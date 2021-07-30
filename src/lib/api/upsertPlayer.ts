import { TransactionResult } from '@components/teams/players/usePlayerForm'

export const upsertPlayer = (ref, player): Promise<TransactionResult> => {
    return new Promise((resolve) => {
        // Existing Player!
        if (player.id && player.id !== '') {
            const playerWithId = { ...player }
            if (player.uplay === '' && player.email === '') {
                ref.collection('players')
                    .doc(playerWithId.id)
                    .delete()
                    .then(() => {
                        resolve({
                            player: playerWithId,
                            status: 'REMOVED',
                        })
                    })
            } else {
                delete player.id
                ref.collection('players')
                    .doc(playerWithId.id)
                    .update({
                        ...player,
                    })
                    .then(() => {
                        resolve({
                            player: playerWithId,
                            status: 'UPDATED',
                        })
                    })
            }
        } else {
            delete player.id
            ref.collection('players')
                .add({
                    ...player,
                })
                .then((result) => {
                    result.get().then((data) => {
                        resolve({
                            player: {
                                ...data.data(),
                                id: data.id,
                            },
                            status: 'CREATED',
                        })
                    })
                })
        }
    })
}
