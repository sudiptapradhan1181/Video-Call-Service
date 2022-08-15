import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import AgoraRTC from "agora-rtc-sdk-ng"

export default function Home() {
  let rtc = {
    localAudioTrack: null,
    localVideoTrack: null,
    client: null,
};

let options = {
    // Pass your App ID here.
    appId: "fbbd1ecbe74e4f47ab991f6a83653d0c",
    // Set the channel name.
    channel: "test",
    // Pass your temp token here.
    token: "006fbbd1ecbe74e4f47ab991f6a83653d0cIAAQ67BeDJ9f6/Mpu51frE4KAkA6Gi+jxYHU/ABj8gIp0gx+f9gAAAAAEABiLYCEHb/7YgEAAQAav/ti",
    // Set the user ID.
    uid: 123456,
};

  const handleClick = async () =>{
    console.log('HELLO')
    // Join an RTC channel.
    await rtc.client.join(options.appId, options.channel, options.token, options.uid);
    // Create a local audio track from the audio sampled by a microphone.
    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    // Create a local video track from the video captured by a camera.
    rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    // Publish the local audio and video tracks to the RTC channel.
    await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
    // Dynamically create a container in the form of a DIV element for playing the local video track.
    const localPlayerContainer = document.getElementById('video-container');
    // Specify the ID of the DIV container. You can use the uid of the local user.
    localPlayerContainer.id = options.uid;
    rtc.localVideoTrack.play(localPlayerContainer);
    console.log("publish success!");
  }

  const initClient =  () => {
    rtc.client = AgoraRTC.createClient({mode: "rtc", codec: "vp8"});
    agoraListnerEvents()

  }

  const agoraListnerEvents = () => {
    console.log('listener')
    rtc.client.on("user-published", publishUser)
    rtc.client.on("user-unpublished", unpublishUser)
  }

  const publishUser = async (user, mediaType) => {
    await rtc.client.subscribe(user, mediaType);
    console.log("subscribe success");

    // If the remote user publishes a video track.
    if (mediaType === "video") {
      // Get the RemoteVideoTrack object in the AgoraRTCRemoteUser object.
      const remoteVideoTrack = user.videoTrack;
      // Dynamically create a container in the form of a DIV element for playing the remote video track.
      const remotePlayerContainer = document.getElementById('video-container-2');
      // Specify the ID of the DIV container. You can use the uid of the remote user.

      // Play the remote video track.
      // Pass the DIV container and the SDK dynamically creates a player in the container for playing the remote video track.
      remoteVideoTrack.play(remotePlayerContainer);
    }

    // If the remote user publishes an audio track.
    if (mediaType === "audio") {
        // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
        const remoteAudioTrack = user.audioTrack;
        // Play the remote audio track. No need to pass any DOM element.
        remoteAudioTrack.play();
    }
  }

  const unpublishUser = () => {
    const remotePlayerContainer = document.getElementById("video-container-2");
            // Destroy the container.
            remotePlayerContainer.remove();
  }

  useEffect(() => {
    console.log('onload')
    initClient()
  },[])

  return (
    <div className={styles.container}>
      <div 
        className='w-50 h-10 mb-20 flex items-center text-normal text-black font-bold bg-white border-1 p-4 rounded-lg cursor-pointer' 
        onClick={handleClick}
      >
        Start Meeting
      </div>
      <div className='flex flex-row'>
        <div id='video-container' className='h-[360px] w-[360px] bg-black mr-10'/>
        <div id='video-container-2' className='h-[360px] w-[360px] bg-black'/>
      </div>
    </div>
  )
}
