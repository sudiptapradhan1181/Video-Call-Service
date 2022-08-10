import dynamic from 'next/dynamic'

const VideoCall = dynamic(() => import('./VideoCall'), { ssr: false });

export default function Home() {
  

  return (
   <VideoCall />
  )
}
