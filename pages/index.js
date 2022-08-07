import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  const handleClick = () =>{
    console.log('HELLO')
  }
  return (
    <div className={styles.container}>
      <div 
        className='w-auto h-auto text-normal text-black font-bold bg-white border-1 p-4 rounded-lg cursor-pointer' 
        onClick={handleClick}
      >
        Start Meeting
      </div>
    </div>
  )
}
