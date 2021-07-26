import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@chakra-ui/react'

// interface CanvasContext {
//     context: any
// }

// export const CanvasContext = createContext({
//     context: undefined,
// })

const Canvas = (props) => {
    const canvasRef = useRef(null)
    const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D>()
    const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement>()

    useEffect(() => {
        const image = document.createElement('img')
        image.src = '/images/generate/bg.png'
        image.onload = function () {
            console.log('LOADED?')
            setBackgroundImage(image)
        }
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        setCanvasContext(context)
    }, [])

    useEffect(() => {
        if (canvasContext && backgroundImage) {
            canvasContext?.drawImage(backgroundImage, 0, 0)
        }
    }, [canvasContext, backgroundImage])

    function downloadCanvas() {
        const link = document.createElement('a')
        link.download = 'file.png'
        const url = canvasRef.current.toDataURL('image/png')
        console.log('URL: ', url)
        link.href = url
        link.click()
    }

    return (
        <div>
            <canvas id="canvas" width="1920" height="1080" ref={canvasRef} {...props} />
            <div>
                <Button onClick={downloadCanvas}>Download</Button>
            </div>
        </div>
    )
}

export default Canvas
