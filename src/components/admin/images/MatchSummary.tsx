import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Input, Select } from '@chakra-ui/react'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import React, { useEffect, useRef, useState } from 'react'
import { ITeam } from '@lib/models/team'

const schema = yup.object().shape({
    team1: yup.string(),
    team2: yup.string(),
    score1: yup.number().min(0).max(2),
    score2: yup.number().min(0).max(2),
})

interface ImageConfig {
    path: string
    dimensions?: {
        w: number
        h: number
    }
    position: {
        x: number
        y: number
    }
}

const defaultImages = {
    background: {
        path: '/images/generate/bg.png',
        position: {
            x: 0,
            y: 0,
        },
    },
    logo: {
        path: '/images/generate/ccl-logo-leaf-red.png',
        dimensions: {
            w: 90,
            h: 90,
        },
        position: {
            x: 912,
            y: 73,
        },
    },
}

const BLACK = '#000000'
const RED = '#e50a25'

const defaultText = {
    result: {
        color: BLACK,
        fontFamily: 'Bahnschrift-BoldCondensed',
        weight: 'bold',
        align: 'center',
        content: 'TIE!',
        size: 212,
        position: {
            x: 960,
            y: 440,
        },
    },
    divider: {
        color: BLACK,
        fontFamily: 'Bahnschrift-BoldCondensed',
        weight: 'bold',
        align: 'center',
        content: '-',
        size: 212,
        position: {
            x: 965,
            y: 760,
        },
    },
    scoreOne: {
        color: BLACK,
        fontFamily: 'Bahnschrift-BoldCondensed',
        weight: 'bold',
        align: 'center',
        content: '0',
        size: 212,
        position: {
            x: 850,
            y: 775,
        },
    },
    scoreTwo: {
        color: BLACK,
        fontFamily: 'Bahnschrift-BoldCondensed',
        weight: 'bold',
        align: 'center',
        content: '0',
        size: 212,
        position: {
            x: 1080,
            y: 775,
        },
    },
}

function fetchTeamName(team: ITeam) {
    console.log('team: ', team)
    if ('short_name' in team) {
        return team.short_name.toUpperCase()
    }
    return team.name.toUpperCase()
}

function DrawText({
    text,
    context,
    clear,
    idx,
}: {
    text: any
    context?: CanvasRenderingContext2D
    clear: boolean
    idx: number
}): JSX.Element {
    const [textDrawn, setTextDrawn] = useState<boolean>(false)

    function draw() {
        context.font = `bold ${text.size}px ${text.fontFamily}`
        console.log(context.font)
        context.fillStyle = text.color
        context.textAlign = 'center'
        context.fillText(text.content, text.position.x, text.position.y)
        setTextDrawn(true)
    }

    useEffect(() => {
        if ((context && !textDrawn) || (context && clear)) {
            setTimeout(() => {
                console.log('Drawing Text: ', text.content)
                draw()
            }, 300 + idx * 25)
        }
    }, [context, text, clear])

    return <></>
}

function LoadImage(props: { image: any; context: any; clear: boolean; imageLabel }): JSX.Element {
    const { image, context, clear, imageLabel } = props
    const [imageDrawn, setImageDrawn] = useState<boolean>(false)

    function draw() {
        console.log('Drawing: ', imageLabel)
        const img = document.createElement('img')
        img.src = image.path
        if (image.path.startsWith('https')) {
            img.crossOrigin = 'Anonymous'
        }
        img.onload = function () {
            if (image.dimensions) {
                context.drawImage(img, image.position.x, image.position.y, image.dimensions.w, image.dimensions.h)
            } else {
                context.drawImage(img, image.position.x, image.position.y)
            }
            setImageDrawn(true)
        }
    }

    useEffect(() => {
        if ((context && !imageDrawn) || (context && clear)) {
            if (imageLabel === 'background') {
                draw()
            } else {
                setTimeout(() => {
                    console.log('Delayed draw for: ', imageLabel)
                    draw()
                }, 250)
            }
        }
    }, [context, imageDrawn, clear])
    return <></>
}

function usePrevious(values): Record<string, any> | undefined {
    const ref = useRef()
    useEffect(() => {
        ref.current = values
    })
    return ref.current
}

export default function MatchSummary({ teams }: { teams: Record<string, ITeam> }) {
    const [clear, setClear] = useState<boolean>(false)
    const [images, setImages] = useState<Record<string, ImageConfig>>({
        ...defaultImages,
    })

    const [text, setText] = useState<Record<string, any>>({
        ...defaultText,
    })

    const {
        register,
        handleSubmit,
        watch,
        getValues,
        formState: { dirtyFields },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            team1: Object.keys(teams)[0],
            team2: Object.keys(teams)[1],
            score1: 0,
            score2: 0,
        },
    })

    const allValues = watch()

    const previous = usePrevious(allValues)

    useEffect(() => {
        console.log('checking re-draw?')
        const reDraw = ['team1', 'team2', 'score1', 'score2'].some((elem) => {
            if (previous !== undefined) {
                if (elem in allValues && elem in previous) {
                    return previous[elem] !== allValues[elem]
                }
            }
            return false
        })
        if (reDraw) {
            console.log('Clearing Canvas')
            clearCanvas()
        }
    }, [allValues, previous])

    const teamOne = watch('team1')
    const teamTwo = watch('team2')
    const scoreOne = watch('score1')
    const scoreTwo = watch('score2')

    useEffect(() => {
        const newImages = {
            ...images,
        }
        if (teamOne) {
            Object.assign(newImages, {
                teamOne: {
                    path: teams[teamOne].logo,
                    position: {
                        x: 363,
                        y: 513,
                    },
                    dimensions: {
                        w: 375,
                        h: 375,
                    },
                },
            })
        }

        if (teamTwo) {
            Object.assign(newImages, {
                teamTwo: {
                    path: teams[teamTwo].logo,
                    position: {
                        x: 1182,
                        y: 513,
                    },
                    dimensions: {
                        w: 375,
                        h: 375,
                    },
                },
            })
        }
        setImages({ ...newImages })
    }, [teamOne, teamTwo])

    useEffect(() => {
        const score1 = typeof scoreOne !== 'number' ? parseInt(scoreOne, 10) : scoreOne
        const score2 = typeof scoreTwo !== 'number' ? parseInt(scoreTwo, 10) : scoreTwo

        const newText = {
            ...text,
        }
        console.log('pre: ', newText)
        if (scoreOne) {
            Object.assign(newText, {
                scoreOne: {
                    ...newText.scoreOne,
                    content: score1,
                    color: score1 > 1 ? RED : BLACK,
                },
            })
        }

        if (scoreTwo) {
            Object.assign(newText, {
                scoreTwo: {
                    ...newText.scoreTwo,
                    content: score2,
                    color: score2 > 1 ? RED : BLACK,
                },
            })
        }

        if (score1 !== undefined && score2 !== undefined) {
            if (score1 == 2) {
                console.log('score one')
                Object.assign(newText, {
                    result: {
                        ...newText.result,
                        content: `${fetchTeamName(teams[teamOne])} WINS!`,
                    },
                })
            } else if (score2 == 2) {
                console.log('score two')
                Object.assign(newText, {
                    result: {
                        ...newText.result,
                        content: `${fetchTeamName(teams[teamTwo])} WINS!`,
                    },
                })
            } else if (score1 == score2) {
                Object.assign(newText, {
                    result: {
                        ...newText.result,
                        content: `TIE!`,
                    },
                })
            }
        }
        setText({ ...newText })
    }, [scoreOne, scoreTwo])

    const canvasRef = useRef(null)
    const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | undefined>()

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d') as CanvasRenderingContext2D
        context.imageSmoothingEnabled = true
        context.imageSmoothingQuality = 'high'
        setCanvasContext(context)
    }, [])

    function downloadCanvas() {
        const link = document.createElement('a')
        link.download = 'file.png'
        const url = canvasRef.current.toDataURL('image/png')
        console.log('URL: ', url)
        link.href = url
        link.click()
    }

    const onSubmit = (values) => {
        console.log(values)
        downloadCanvas()
    }

    function clearCanvas() {
        canvasContext!.clearRect(0, 0, 1920, 1080)
        setImages({
            ...images,
        })
        setClear(true)
        setTimeout(() => {
            setClear(false)
        }, 500)
    }

    return (
        <div>
            <Button type="button" onClick={clearCanvas}>
                Refresh
            </Button>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl>
                    <FormLabel>Team 1</FormLabel>
                    <Select {...register('team1')}>
                        {Object.keys(teams).map((teamId) => {
                            return (
                                <option key={`1-${teamId}`} value={teamId}>
                                    {teams[teamId].name}
                                </option>
                            )
                        })}
                    </Select>
                </FormControl>
                <FormControl>
                    <FormLabel>Score 1</FormLabel>
                    <Input {...register('score1')} />
                </FormControl>
                <FormControl>
                    <FormLabel>Score 2</FormLabel>
                    <Input {...register('score2')} />
                </FormControl>
                <FormControl>
                    <FormLabel>Team 2</FormLabel>
                    <Select {...register('team2')}>
                        {Object.keys(teams).map((teamId) => {
                            return (
                                <option key={`2-${teamId}`} value={teamId}>
                                    {teams[teamId].name}
                                </option>
                            )
                        })}
                    </Select>
                </FormControl>
                <Button type="submit">Download</Button>
            </form>
            <div style={{ fontFamily: 'Bahnschrift-BoldCondensed' }}>
                <canvas id="canvas" width="1920" height="1080" ref={canvasRef} />
            </div>
            {Object.keys(images).map((elem) => {
                const img = images[elem]
                return (
                    <LoadImage
                        key={`img-${elem}`}
                        image={img}
                        context={canvasContext}
                        clear={clear}
                        imageLabel={elem}
                    />
                )
            })}
            {Object.keys(text).map((t, idx) => {
                const txt = text[t]
                return <DrawText key={`text-${t}`} idx={idx} text={txt} context={canvasContext} clear={clear} />
            })}
        </div>
    )
}
